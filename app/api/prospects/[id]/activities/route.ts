import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { isOutreachAuthorized } from "@/lib/outreach-auth";

const KINDS = ["note", "email", "call", "linkedin", "meeting", "other"] as const;

type Activity = { id: number; prospect_id: number; kind: string; body: string; created_at: string };

async function prospectId(params: Promise<{ id: string }>): Promise<number | null> {
  const { id } = await params;
  const value = Number(id);
  return Number.isInteger(value) ? value : null;
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isOutreachAuthorized(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = await prospectId(params);
  if (!id) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  const rows = getDb().prepare(
    "SELECT id, prospect_id, kind, body, created_at FROM prospect_activities WHERE prospect_id = ? ORDER BY id DESC LIMIT 100"
  ).all(id) as Activity[];
  return NextResponse.json({ rows });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isOutreachAuthorized(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = await prospectId(params);
  if (!id) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  if (!req.headers.get("content-type")?.startsWith("application/json")) {
    return NextResponse.json({ error: "JSON required" }, { status: 415 });
  }

  let body: { kind?: unknown; body?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const kind = typeof body.kind === "string" && KINDS.includes(body.kind as (typeof KINDS)[number]) ? body.kind : "note";
  if (typeof body.body !== "string" || body.body.length > 5000) {
    return NextResponse.json({ error: "Invalid activity" }, { status: 400 });
  }

  const db = getDb();
  const exists = db.prepare("SELECT id FROM prospects WHERE id = ?").get(id);
  if (!exists) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const result = db.prepare("INSERT INTO prospect_activities (prospect_id, kind, body) VALUES (?, ?, ?)").run(id, kind, body.body.trim());
  if (kind === "email") {
    db.prepare("UPDATE prospects SET last_contacted_at = datetime('now'), updated_at = datetime('now') WHERE id = ?").run(id);
  }
  return NextResponse.json({ ok: true, id: Number(result.lastInsertRowid) }, { status: 201 });
}
