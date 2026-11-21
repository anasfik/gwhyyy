import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { OutreachService } from "@/lib/outreach/service";

export const dynamic = "force-dynamic";
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token") ?? "";
  if (!/^[a-f0-9]{48}$/.test(token)) return new Response("Invalid unsubscribe link", { status: 400 });
  const exists = getDb().prepare("SELECT id FROM outreach_mail WHERE unsubscribe_token=?").get(token);
  if (!exists) return new Response("Unsubscribe link not found", { status: 404 });
  return new Response(`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><meta name="robots" content="noindex"><title>Unsubscribe</title></head><body style="font-family:system-ui;max-width:36rem;margin:10vh auto;padding:1rem"><h1>Stop outreach emails</h1><p>Confirm below to stop future outreach to this address.</p><form method="post" action="?token=${token}"><button style="font:inherit;padding:.75rem 1rem">Unsubscribe</button></form></body></html>`, { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store", "Referrer-Policy": "no-referrer" } });
}

export async function POST(req: NextRequest) {
  try {
    new OutreachService(getDb()).unsubscribe(req.nextUrl.searchParams.get("token") ?? "");
    return NextResponse.json({ ok: true, message: "Unsubscribed. No further outreach will be sent." }, { headers: { "Cache-Control": "no-store" } });
  } catch { return NextResponse.json({ error: "Invalid unsubscribe link" }, { status: 400 }); }
}
