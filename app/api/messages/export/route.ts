import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthorized } from "@/lib/admin-auth";
import { getDb } from "@/lib/db";
import { toCsv } from "@/lib/csv";

export async function GET(req: NextRequest) {
  if (!(await isAdminAuthorized(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") ?? "all";
  const stage = searchParams.get("stage") ?? "all";
  const q = (searchParams.get("q") ?? "").trim().slice(0, 100);

  const clauses: string[] = [];
  const params: unknown[] = [];
  if (["read", "unread", "archived"].includes(status)) { clauses.push("status = ?"); params.push(status); }
  if (["new", "qualified", "contacted", "won", "lost", "archived"].includes(stage)) { clauses.push("lead_stage = ?"); params.push(stage); }
  if (q) { clauses.push("(name LIKE ? OR email LIKE ? OR subject LIKE ? OR message LIKE ? OR company LIKE ? OR service LIKE ?)"); const like = `%${q}%`; params.push(like, like, like, like, like, like); }
  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";

  const rows = getDb().prepare(
    `SELECT id, name, email, subject, budget, message, status, lead_stage, notes, follow_up_at, created_at, service, stage, company, company_website, timeframe, contact_method, source
     FROM contacts ${where} ORDER BY created_at DESC LIMIT 5000`
  ).all(...params) as Record<string, unknown>[];

  const headers = ["ID", "Name", "Email", "Subject", "LegacyBudget", "Message", "Status", "LeadStage", "Notes", "FollowUp", "Date", "Service", "ProjectStage", "Company", "CompanyWebsite", "Timeframe", "ContactMethod", "Source"];
  const csv = toCsv(headers, rows.map((row) => [
    row.id, row.name, row.email, row.subject, row.budget, row.message, row.status, row.lead_stage,
    row.notes, row.follow_up_at, row.created_at, row.service, row.stage, row.company,
    row.company_website, row.timeframe, row.contact_method, row.source,
  ]));

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="leads-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
