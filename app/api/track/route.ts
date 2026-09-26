import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getIp, isRateLimited } from "@/lib/rate-limit";

const eventPattern = /^[a-z0-9_:-]{1,100}$/;

export async function POST(req: NextRequest) {
  if (!req.headers.get("content-type")?.startsWith("application/json")) return NextResponse.json({ error: "JSON required" }, { status: 415 });
  const origin = req.headers.get("origin");
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  if (origin && (!host || !URL.canParse(origin) || new URL(origin).host !== host)) return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  const db = getDb();
  const key = crypto.createHash("sha256").update(getIp(req)).digest("hex");
  if (isRateLimited(db, `track:${key}`, 120)) return new NextResponse(null, { status: 204 });

  let raw: unknown;
  try { raw = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  const body = raw as Record<string, unknown>;
  const path = typeof body.path === "string" ? body.path.slice(0, 500) : "";
  const referrer = typeof body.referrer === "string" ? body.referrer.slice(0, 500) : "";
  const event = typeof body.event === "string" ? body.event : "";
  if (!path.startsWith("/") || path.startsWith("/dashboard") || path.startsWith("/api") || path.startsWith("/login")) return new NextResponse(null, { status: 204 });

  try {
    if (event && eventPattern.test(event)) db.prepare("INSERT INTO events (name, path, referrer) VALUES (?, ?, ?)").run(event, path, referrer);
    else if (!event) db.prepare("INSERT INTO page_views (path, referrer) VALUES (?, ?)").run(path, referrer);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Analytics write failed:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
