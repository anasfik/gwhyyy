import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

function page(message: string, status = 200) {
  return new Response(
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><meta name="robots" content="noindex"><title>Unsubscribe</title></head><body style="font-family:system-ui;max-width:34rem;margin:12vh auto;padding:0 1.25rem;color:#111"><h1 style="font-size:1.5rem">${message}</h1><p style="color:#555">You will not receive further outreach from GWHYYY at this address.</p></body></html>`,
    { status, headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } }
  );
}

async function unsubscribe(req: NextRequest) {
  const token = (new URL(req.url).searchParams.get("token") ?? "").trim();
  if (!/^[a-f0-9]{32,100}$/.test(token)) return { ok: false, status: 400 };

  const db = getDb();
  const prospect = db.prepare("SELECT id, email FROM prospects WHERE unsubscribe_token = ?").get(token) as { id: number; email: string | null } | undefined;
  if (!prospect) return { ok: false, status: 404 };

  const email = (prospect.email ?? "").toLowerCase();
  if (email) {
    db.prepare("INSERT OR IGNORE INTO suppressions (email, reason, source) VALUES (?, 'unsubscribe', 'public-link')").run(email);
  }
  db.prepare("UPDATE prospects SET unsubscribed_at = datetime('now'), suppressed_at = datetime('now'), updated_at = datetime('now') WHERE id = ?").run(prospect.id);
  return { ok: true, status: 200 };
}

export async function GET(req: NextRequest) {
  const result = await unsubscribe(req);
  if (result.status === 400) return page("Invalid unsubscribe link.", 400);
  if (result.status === 404) return page("This unsubscribe link is no longer valid.", 404);
  return page("Unsubscribed.");
}

export async function POST(req: NextRequest) {
  const result = await unsubscribe(req);
  return NextResponse.json({ ok: result.ok }, { status: result.status });
}
