import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import crypto from "crypto";

const RATE_LIMIT_MAP = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX = 3;

function getRateKey(req: NextRequest): string {
  return req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? "unknown";
}

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const timestamps = (RATE_LIMIT_MAP.get(key) ?? []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW
  );
  if (timestamps.length >= RATE_LIMIT_MAX) return true;
  timestamps.push(now);
  RATE_LIMIT_MAP.set(key, timestamps);
  return false;
}

export async function POST(req: NextRequest) {
  const ip = getRateKey(req);
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let body: Record<string, string>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
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
    const db = getDb();
    const stmt = db.prepare(
      `INSERT INTO contacts (name, email, subject, budget, message, ip_hash)
       VALUES (?, ?, ?, ?, ?, ?)`
    );
    const result = stmt.run(
      name.trim().slice(0, 200),
      email.trim().slice(0, 200),
      (subject ?? "").trim().slice(0, 300),
      (budget ?? "").trim().slice(0, 100),
      message.trim().slice(0, 5000),
      ipHash
    );
    return NextResponse.json({ ok: true, id: result.lastInsertRowid }, { status: 201 });
  } catch (err) {
    console.error("DB error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
