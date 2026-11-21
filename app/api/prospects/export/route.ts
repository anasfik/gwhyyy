import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { isOutreachAuthorized } from "@/lib/outreach-auth";
import { toCsv } from "@/lib/csv";
import { PROSPECT_STAGES, type ProspectStage } from "@/lib/prospects";

export async function GET(req: NextRequest) {
  if (!(await isOutreachAuthorized(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const stage = searchParams.get("stage") ?? "all";
  const q = (searchParams.get("q") ?? "").trim().slice(0, 100);
  const due = searchParams.get("due") === "1";

  const clauses: string[] = [];
  const params: unknown[] = [];
  if (PROSPECT_STAGES.includes(stage as ProspectStage)) {
    clauses.push("stage = ?");
    params.push(stage);
  }
  if (due) clauses.push("follow_up_at IS NOT NULL AND follow_up_at <= date('now') AND stage NOT IN ('won', 'lost', 'archived')");
  if (q) {
    clauses.push("(name LIKE ? OR email LIKE ? OR company LIKE ? OR role LIKE ? OR source LIKE ? OR notes LIKE ?)");
    const like = `%${q}%`;
    params.push(like, like, like, like, like, like);
  }
  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";

  const rows = getDb().prepare(
    `SELECT id, external_id, name, email, company, role, website, source, source_url, stage, notes,
            last_contacted_at, follow_up_at, created_at, updated_at
     FROM prospects ${where} ORDER BY created_at DESC LIMIT 5000`
  ).all(...params) as Record<string, unknown>[];

  const headers = ["ID", "ExternalID", "Name", "Email", "Company", "Role", "Website", "Source", "SourceURL", "Stage", "Notes", "LastContacted", "FollowUp", "Created", "Updated"];
  const csv = toCsv(headers, rows.map((row) => [
    row.id, row.external_id, row.name, row.email, row.company, row.role, row.website,
    row.source, row.source_url, row.stage, row.notes, row.last_contacted_at, row.follow_up_at, row.created_at, row.updated_at,
  ]));

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="prospects-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
