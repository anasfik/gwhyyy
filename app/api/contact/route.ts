import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getIp, isRateLimited } from "@/lib/rate-limit";
import { getSiteContent } from "@/lib/site-content";

type EmailStatus = "sent" | "failed" | "not_configured" | "pending";

type Lead = {
  name: string;
  email: string;
  service: string;
  serviceLabel: string;
  stage: string;
  description: string;
  company: string;
  companyWebsite: string;
  timeframe: string;
  contactMethod: string;
  extra: string;
  source: string;
  submissionId: string;
};

function stringField(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function sameOrigin(req: NextRequest) {
  const origin = req.headers.get("origin");
  if (!origin) return true;
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  return Boolean(host) && URL.canParse(origin) && new URL(origin).host === host;
}

function isHttpUrl(value: string) {
  if (!value) return true;
  if (!URL.canParse(value)) return false;
  return ["http:", "https:"].includes(new URL(value).protocol);
}

async function notifyByEmail(lead: Lead, fallbackEmail: string): Promise<{ status: EmailStatus; detail?: string }> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { status: "not_configured" };

  const body = [
    `Name: ${lead.name}`,
    `Email: ${lead.email}`,
    `Service: ${lead.serviceLabel}`,
    `Stage: ${lead.stage}`,
    lead.company ? `Company / project: ${lead.company}` : "",
    lead.companyWebsite ? `Website: ${lead.companyWebsite}` : "",
    lead.timeframe ? `Start timeframe: ${lead.timeframe}` : "",
    lead.contactMethod ? `Preferred contact: ${lead.contactMethod}` : "",
    lead.source ? `Referring case study: ${lead.source}` : "",
    "",
    "Project description:",
    lead.description,
    lead.extra ? `\nAdditional context:\n${lead.extra}` : "",
  ].filter(Boolean).join("\n");

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL ?? "onboarding@resend.dev",
        to: [process.env.CONTACT_TO_EMAIL ?? fallbackEmail],
        reply_to: lead.email,
        subject: `Inquiry: ${lead.serviceLabel} — ${lead.company || lead.name}`,
        text: body,
      }),
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) {
      return { status: "failed", detail: `Resend returned ${response.status}` };
    }
    return { status: "sent" };
  } catch (error) {
    return { status: "failed", detail: error instanceof Error ? error.message : "Unknown email error" };
  }
}

export async function POST(req: NextRequest) {
  if (!req.headers.get("content-type")?.startsWith("application/json")) {
    return NextResponse.json({ error: "JSON required" }, { status: 415 });
  }
  if (!sameOrigin(req)) return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  if (Number(req.headers.get("content-length") ?? 0) > 30_000) {
    return NextResponse.json({ error: "Request too large" }, { status: 413 });
  }

  const siteConfig = getSiteContent();
  const services = new Map(siteConfig.serviceOptions.map((option) => [option.slug, option.label]));
  const stages = new Set(siteConfig.projectStages.map((option) => option.slug));
  const contactMethods = new Set(siteConfig.contactMethods);
  const projectSlugs = new Set(siteConfig.projects.map((project) => project.slug));

  const ip = getIp(req);
  const db = getDb();
  if (isRateLimited(db, `contact:${crypto.createHash("sha256").update(ip).digest("hex")}`)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429, headers: { "Retry-After": "3600" } });
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const body = raw as Record<string, unknown>;

  const submittedAt = Number(body.submittedAt);
  const honeypot = stringField(body.website, 200);
  if (honeypot || !Number.isFinite(submittedAt) || Date.now() - submittedAt < 800) {
    // Silently absorb obvious bot submissions without persisting or emailing them.
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  const service = stringField(body.service, 80);
  const stage = stringField(body.stage, 80);
  const lead: Lead = {
    name: stringField(body.name, 200),
    email: stringField(body.email, 200).toLowerCase(),
    service,
    serviceLabel: services.get(service) ?? "",
    stage,
    description: stringField(body.description, 5000),
    company: stringField(body.company, 300),
    companyWebsite: stringField(body.companyWebsite, 500),
    timeframe: stringField(body.timeframe, 200),
    contactMethod: stringField(body.contactMethod, 80),
    extra: stringField(body.extra, 3000),
    source: projectSlugs.has(stringField(body.source, 100)) ? stringField(body.source, 100) : "",
    submissionId: /^[a-zA-Z0-9-]{8,64}$/.test(stringField(body.submissionId, 64)) ? stringField(body.submissionId, 64) : crypto.randomUUID(),
  };

  if (!lead.name || !lead.email || !lead.description || !lead.serviceLabel || !stages.has(stage)) {
    return NextResponse.json({ error: "Missing or invalid required fields" }, { status: 400 });
  }
  if (lead.description.length < 20) {
    return NextResponse.json({ error: "Project description is too short" }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }
  if (!isHttpUrl(lead.companyWebsite)) {
    return NextResponse.json({ error: "Invalid website" }, { status: 400 });
  }
  if (lead.contactMethod && !contactMethods.has(lead.contactMethod)) {
    return NextResponse.json({ error: "Invalid contact method" }, { status: 400 });
  }

  const existing = db.prepare("SELECT id, email_status FROM contacts WHERE submission_id = ?").get(lead.submissionId) as { id: number; email_status: string | null } | undefined;
  if (existing) {
    return NextResponse.json({ ok: true, id: existing.id, duplicate: true, notified: existing.email_status === "sent" }, { status: 200 });
  }

  const message = lead.extra ? `${lead.description}\n\nAdditional context:\n${lead.extra}` : lead.description;
  let insertedId: number;
  try {
    const result = db.prepare(
      "INSERT INTO contacts (name, email, subject, budget, message, ip_hash, service, stage, company, company_website, timeframe, contact_method, source, submission_id, email_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    ).run(
      lead.name,
      lead.email,
      lead.company || lead.serviceLabel,
      "",
      message,
      crypto.createHash("sha256").update(ip).digest("hex").slice(0, 16),
      lead.service,
      lead.stage,
      lead.company,
      lead.companyWebsite,
      lead.timeframe,
      lead.contactMethod,
      lead.source,
      lead.submissionId,
      "pending",
    );
    insertedId = Number(result.lastInsertRowid);
  } catch (error) {
    console.error("Inquiry insert failed:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }

  const delivery = await notifyByEmail(lead, siteConfig.personal.email);
  if (delivery.status === "failed") {
    console.error("Inquiry email notification failed:", delivery.detail);
  }
  try {
    db.prepare("UPDATE contacts SET email_status = ?, notified_at = CASE WHEN ? = 'sent' THEN datetime('now') ELSE notified_at END WHERE id = ?").run(delivery.status, delivery.status, insertedId);
    db.prepare("INSERT INTO events (name, path, referrer) VALUES ('inquiry_submitted', '/contact', ?)").run(lead.source ? `/work/${lead.source}` : "");
  } catch (error) {
    console.error("Inquiry post-write bookkeeping failed:", error);
  }

  return NextResponse.json({ ok: true, id: insertedId, notified: delivery.status === "sent" }, { status: 201 });
}
