import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { isOutreachAuthorized, mcpEnabled } from "@/lib/outreach-auth";
import { normalizeProspect, PROSPECT_STAGES, updateProspect, upsertProspect, type ProspectStage } from "@/lib/prospects";

const JSON_LIMIT = 100_000;

type CountRow = { stage: string; count: number };

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

function envelope() {
  return NextResponse.json({ error: "JSON required" }, { status: 415 });
}

export async function GET(req: NextRequest) {
  if (!(await isOutreachAuthorized(req))) return unauthorized();

  const { searchParams } = new URL(req.url);
  const stage = searchParams.get("stage") ?? "all";
  const q = (searchParams.get("q") ?? "").trim().slice(0, 100);
  const due = searchParams.get("due") === "1";
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);
  const perPage = Math.min(100, Math.max(1, parseInt(searchParams.get("perPage") ?? "50", 10) || 50));

  const db = getDb();
  const clauses: string[] = [];
  const params: unknown[] = [];

  if (PROSPECT_STAGES.includes(stage as ProspectStage)) {
    clauses.push("stage = ?");
    params.push(stage);
  }
  if (due) {
    clauses.push("follow_up_at IS NOT NULL AND follow_up_at <= date('now') AND stage NOT IN ('won', 'lost', 'archived')");
  }
  if (q) {
    clauses.push("(name LIKE ? OR email LIKE ? OR company LIKE ? OR role LIKE ? OR source LIKE ? OR notes LIKE ?)");
    const like = `%${q}%`;
    params.push(like, like, like, like, like, like);
  }
  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";

  const total = (db.prepare(`SELECT COUNT(*) as count FROM prospects ${where}`).get(...params) as { count: number }).count;
  const rows = db.prepare(
    `SELECT id, external_id, name, email, company, role, website, source, source_url, stage, notes,
            last_contacted_at, follow_up_at, created_at, updated_at,
            email_status, lawful_basis, source_detail, unsubscribed_at, suppressed_at,
            (SELECT COUNT(*) FROM prospect_activities a WHERE a.prospect_id = prospects.id) AS activity_count
     FROM prospects ${where}
     ORDER BY created_at DESC LIMIT ? OFFSET ?`
  ).all(...params, perPage, (page - 1) * perPage);

  const grouped = db.prepare("SELECT stage, COUNT(*) as count FROM prospects GROUP BY stage").all() as CountRow[];
  const summary = Object.fromEntries(PROSPECT_STAGES.map((item) => [item, 0])) as Record<ProspectStage, number>;
  for (const row of grouped) {
    if (row.stage in summary) summary[row.stage as ProspectStage] = row.count;
  }
  const dueCount = (db.prepare(
    "SELECT COUNT(*) as count FROM prospects WHERE follow_up_at IS NOT NULL AND follow_up_at <= date('now') AND stage NOT IN ('won', 'lost', 'archived')"
  ).get() as { count: number }).count;

  return NextResponse.json({ rows, total, page, perPage, summary, due: dueCount, mcpEnabled: mcpEnabled() });
}

export async function POST(req: NextRequest) {
  if (!(await isOutreachAuthorized(req))) return unauthorized();
  if (!req.headers.get("content-type")?.startsWith("application/json")) return envelope();
  if (Number(req.headers.get("content-length") ?? 0) > JSON_LIMIT) return NextResponse.json({ error: "Request too large" }, { status: 413 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = normalizeProspect(body, { partial: false });
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });

  try {
    const result = upsertProspect(getDb(), parsed.value);
    if (result.suppressed) return NextResponse.json({ error: "Address is suppressed" }, { status: 409 });
    return NextResponse.json({ ok: true, ...result }, { status: result.created ? 201 : 200 });
  } catch {
    return NextResponse.json({ error: "A prospect with that email already exists" }, { status: 409 });
  }
}

export async function PATCH(req: NextRequest) {
  if (!(await isOutreachAuthorized(req))) return unauthorized();
  if (!req.headers.get("content-type")?.startsWith("application/json")) return envelope();
  if (Number(req.headers.get("content-length") ?? 0) > JSON_LIMIT) return NextResponse.json({ error: "Request too large" }, { status: 413 });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!Number.isInteger(body.id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  const parsed = normalizeProspect(body, { partial: true });
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });

  if (parsed.value.name !== undefined || parsed.value.company !== undefined) {
    const current = getDb().prepare("SELECT name, company FROM prospects WHERE id = ?").get(body.id) as { name: string; company: string } | undefined;
    if (current) {
      const name = parsed.value.name ?? current.name;
      const company = parsed.value.company ?? current.company;
      if (!name && !company) return NextResponse.json({ error: "Name or company is required" }, { status: 400 });
    }
  }
  if (parsed.value.email) {
    const clash = getDb().prepare("SELECT id FROM prospects WHERE email = ? AND id <> ?").get(parsed.value.email, body.id) as { id: number } | undefined;
    if (clash) return NextResponse.json({ error: "A prospect with that email already exists" }, { status: 409 });
  }

  try {
    const changes = updateProspect(getDb(), body.id as number, parsed.value);
    if (changes === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Update failed" }, { status: 409 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!(await isOutreachAuthorized(req))) return unauthorized();
  const id = Number(new URL(req.url).searchParams.get("id"));
  if (!Number.isInteger(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  const result = getDb().prepare("DELETE FROM prospects WHERE id = ?").run(id);
  if (result.changes === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
