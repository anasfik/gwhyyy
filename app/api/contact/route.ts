import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getIp, isRateLimited } from "@/lib/rate-limit";
import { getSiteContent } from "@/lib/site-content";

function stringField(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

async function notifyByEmail(lead: { name: string; email: string; subject: string; budget: string; message: string }, fallbackEmail: string) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return;
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL ?? "onboarding@resend.dev",
      to: [process.env.CONTACT_TO_EMAIL ?? fallbackEmail],
      subject: `New lead: ${lead.subject || lead.name}`,
      text: `From: ${lead.name} <${lead.email}>\nBudget: ${lead.budget || "Not specified"}\n\n${lead.message}`,
    }),
    signal: AbortSignal.timeout(5000),
  });
  if (!response.ok) throw new Error(`Resend returned ${response.status}`);
}

export async function POST(req: NextRequest) {
  if (!req.headers.get("content-type")?.startsWith("application/json")) return NextResponse.json({ error: "JSON required" }, { status: 415 });
  const siteConfig = getSiteContent();
  const budgets = new Set<string>(siteConfig.budgetOptions);
  const ip = getIp(req);
  const db = getDb();
  if (isRateLimited(db, `contact:${crypto.createHash("sha256").update(ip).digest("hex")}`)) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  let raw: unknown;
  try { raw = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  const body = raw as Record<string, unknown>;
  const submittedAt = Number(body.submittedAt);
  if (stringField(body.website, 200) || !Number.isFinite(submittedAt) || Date.now() - submittedAt < 2000) return NextResponse.json({ ok: true }, { status: 201 });

  const lead = {
    name: stringField(body.name, 200),
    email: stringField(body.email, 200).toLowerCase(),
    subject: stringField(body.subject, 300),
    budget: stringField(body.budget, 100),
    message: stringField(body.message, 5000),
  };
  if (!lead.name || !lead.email || !lead.message) return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  if (lead.budget && !budgets.has(lead.budget)) return NextResponse.json({ error: "Invalid budget" }, { status: 400 });

  try {
    const result = db.prepare("INSERT INTO contacts (name, email, subject, budget, message, ip_hash) VALUES (?, ?, ?, ?, ?, ?)").run(
      lead.name, lead.email, lead.subject, lead.budget, lead.message, crypto.createHash("sha256").update(ip).digest("hex").slice(0, 16),
    );
    db.prepare("INSERT INTO events (name, path, referrer) VALUES ('contact_submit', '/#contact', '')").run();
    await notifyByEmail(lead, siteConfig.personal.email).catch((error) => console.error("Contact notification failed:", error));
    return NextResponse.json({ ok: true, id: result.lastInsertRowid }, { status: 201 });
  } catch (error) {
    console.error("Contact submission failed:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
