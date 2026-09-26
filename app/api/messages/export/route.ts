import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/db";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") ?? "all";
  const stage = searchParams.get("stage") ?? "all";
  const q = (searchParams.get("q") ?? "").trim().slice(0, 100);

  const clauses: string[] = [];
  const params: unknown[] = [];
  if (["read", "unread", "archived"].includes(status)) { clauses.push("status = ?"); params.push(status); }
  if (["new", "qualified", "contacted", "won", "lost", "archived"].includes(stage)) { clauses.push("lead_stage = ?"); params.push(stage); }
  if (q) { clauses.push("(name LIKE ? OR email LIKE ? OR subject LIKE ? OR message LIKE ?)"); const like = `%${q}%`; params.push(like, like, like, like); }
  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";

  const rows = getDb().prepare(
    `SELECT id, name, email, subject, budget, message, status, lead_stage, notes, follow_up_at, created_at
     FROM contacts ${where} ORDER BY created_at DESC LIMIT 5000`
  ).all(...params) as Record<string, unknown>[];

  const cell = (value: unknown) => {
    const text = String(value ?? "");
    const safe = /^[=+@-]/.test(text) ? `'${text}` : text;
    return `"${safe.replace(/"/g, '""')}"`;
  };
  const headers = ["ID", "Name", "Email", "Subject", "Budget", "Message", "Status", "Stage", "Notes", "FollowUp", "Date"];
  const lines = [headers.join(",")];
  for (const r of rows) {
    lines.push([r.id, r.name, r.email, r.subject, r.budget, r.message, r.status, r.lead_stage, r.notes, r.follow_up_at, r.created_at].map(cell).join(","));
  }
  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="leads-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
