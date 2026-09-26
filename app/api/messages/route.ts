import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/db";

type CountRow = { count: number };

const STATUSES = ["read", "unread", "archived"] as const;
const STAGES = ["new", "qualified", "contacted", "won", "lost", "archived"] as const;

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") ?? "all";
  const stage = searchParams.get("stage") ?? "all";
  const q = (searchParams.get("q") ?? "").trim().slice(0, 100);
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);
  const perPage = Math.min(100, Math.max(1, parseInt(searchParams.get("perPage") ?? "20", 10) || 20));
  const offset = (page - 1) * perPage;

  const db = getDb();
  const clauses: string[] = [];
  const params: unknown[] = [];

  if (STATUSES.includes(status as (typeof STATUSES)[number])) {
    clauses.push("status = ?");
    params.push(status);
  }
  if (STAGES.includes(stage as (typeof STAGES)[number])) {
    clauses.push("lead_stage = ?");
    params.push(stage);
  }
  if (q) {
    clauses.push("(name LIKE ? OR email LIKE ? OR subject LIKE ? OR message LIKE ?)");
    const like = `%${q}%`;
    params.push(like, like, like, like);
  }

  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  const total = (db.prepare(`SELECT COUNT(*) as count FROM contacts ${where}`).get(...params) as CountRow).count;
  const rows = db.prepare(
    `SELECT id, name, email, subject, budget, message, status, lead_stage, notes, follow_up_at, created_at, updated_at
     FROM contacts ${where}
     ORDER BY created_at DESC LIMIT ? OFFSET ?`
  ).all(...params, perPage, offset);

  return NextResponse.json({ rows, total, page, perPage });
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!req.headers.get("content-type")?.startsWith("application/json")) return NextResponse.json({ error: "JSON required" }, { status: 415 });

  let body: { id?: number; status?: string; lead_stage?: string; notes?: string; follow_up_at?: string | null };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
  if (!Number.isInteger(body.id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  const updates: string[] = ["updated_at = datetime('now')"];
  const params: unknown[] = [];

  if (body.status !== undefined) {
    if (!STATUSES.includes(body.status as (typeof STATUSES)[number])) return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    updates.push("status = ?");
    params.push(body.status);
  }
  if (body.lead_stage !== undefined) {
    if (!STAGES.includes(body.lead_stage as (typeof STAGES)[number])) return NextResponse.json({ error: "Invalid stage" }, { status: 400 });
    updates.push("lead_stage = ?");
    params.push(body.lead_stage);
  }
  if (body.notes !== undefined) {
    if (typeof body.notes !== "string" || body.notes.length > 5000) return NextResponse.json({ error: "Invalid notes" }, { status: 400 });
    updates.push("notes = ?");
    params.push(body.notes.slice(0, 5000));
  }
  if (body.follow_up_at !== undefined) {
    if (body.follow_up_at !== null && (typeof body.follow_up_at !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(body.follow_up_at))) {
      return NextResponse.json({ error: "Invalid follow-up date" }, { status: 400 });
    }
    updates.push("follow_up_at = ?");
    params.push(body.follow_up_at);
  }
  if (updates.length === 1) return NextResponse.json({ error: "Nothing to update" }, { status: 400 });

  const db = getDb();
  params.push(body.id);
  const result = db.prepare(`UPDATE contacts SET ${updates.join(", ")} WHERE id = ?`).run(...params);
  if (result.changes === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const id = Number(searchParams.get("id"));
  if (!Number.isInteger(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  const db = getDb();
  const result = db.prepare("DELETE FROM contacts WHERE id = ?").run(id);
  if (result.changes === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
