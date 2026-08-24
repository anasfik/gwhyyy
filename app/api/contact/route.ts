import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getIp, isRateLimited } from "@/lib/rate-limit";
import crypto from "crypto";

// Honeypot + time-trap: bots fill hidden fields and submit instantly.
function looksLikeBot(body: Record<string, string>, elapsedMs: number): boolean {
  return Boolean(body.website) || elapsedMs < 2000;
}

async function notifyByEmail(lead: { name: string; email: string; subject: string; budget: string; message: string }) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return; // optional — set RESEND_API_KEY to get email alerts

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL ?? "onboarding@resend.dev",
      to: [process.env.CONTACT_TO_EMAIL ?? "work@gwhyyy.com"],
      subject: `New lead: ${lead.subject || lead.name}`,
      text: `From: ${lead.name} <${lead.email}>\nBudget: ${lead.budget || "—"}\n\n${lead.message}`,
    }),
  }).catch(() => {});
}

export async function POST(req: NextRequest) {
  const db = getDb();
  const ip = getIp(req);
  if (isRateLimited(db, `contact:${ip}`)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let body: Record<string, string>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Bot check before any DB writes. Same 200 as success so bots learn nothing.
  const submittedAt = Number(body.submittedAt ?? 0);
  if (looksLikeBot(body, Date.now() - submittedAt)) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const { name, email, subject, budget, message } = body;

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const ipHash = crypto.createHash("sha256").update(ip).digest("hex").slice(0, 16);

  try {
    const stmt = db.prepare(
      `INSERT INTO contacts (name, email, subject, budget, message, ip_hash)
       VALUES (?, ?, ?, ?, ?, ?)`
    );
    const lead = {
      name: name.trim().slice(0, 200),
      email: email.trim().slice(0, 200),
      subject: (subject ?? "").trim().slice(0, 300),
      budget: (budget ?? "").trim().slice(0, 100),
      message: message.trim().slice(0, 5000),
    };
    const result = stmt.run(
      lead.name,
      lead.email,
      lead.subject,
      lead.budget,
      lead.message,
      ipHash
    );
    db.prepare(
      "INSERT INTO events (name, path, referrer) VALUES ('contact_submit', '/#contact', '')"
    ).run();
    notifyByEmail(lead); // fire-and-forget, never blocks the response
    return NextResponse.json({ ok: true, id: result.lastInsertRowid }, { status: 201 });
  } catch (err) {
    console.error("DB error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
