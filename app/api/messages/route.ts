import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/db";

type CountRow = { count: number };

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") ?? "all";
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const perPage = 20;
  const offset = (page - 1) * perPage;

  const db = getDb();

  const whereClause =
    status === "all" ? "" :
    status === "unread" ? "WHERE status = 'unread'" :
    status === "archived" ? "WHERE status = 'archived'" :
    "WHERE status = 'read'";

  const total = (db.prepare(`SELECT COUNT(*) as count FROM contacts ${whereClause}`).get() as CountRow).count;
  const rows = db.prepare(
    `SELECT id, name, email, subject, budget, message, status, created_at
     FROM contacts ${whereClause}
     ORDER BY created_at DESC LIMIT ? OFFSET ?`
  ).all(perPage, offset);

  return NextResponse.json({ rows, total, page, perPage });
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, status } = await req.json();
  if (!id || !["read", "unread", "archived"].includes(status)) {
    return NextResponse.json({ error: "Invalid params" }, { status: 400 });
  }

  const db = getDb();
  db.prepare("UPDATE contacts SET status = ? WHERE id = ?").run(status, id);
  return NextResponse.json({ ok: true });
}
