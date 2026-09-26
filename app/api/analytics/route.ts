import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/db";

type CountRow = { c: number };
type DayRow = { day: string; count: number };
type PageRow = { path: string; count: number };

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = getDb();

  const totalViews = (db.prepare("SELECT COUNT(*) as c FROM page_views").get() as CountRow).c;
  const views7d = (db.prepare(
    "SELECT COUNT(*) as c FROM page_views WHERE created_at >= datetime('now', '-7 days')"
  ).get() as CountRow).c;
  const views30d = (db.prepare(
    "SELECT COUNT(*) as c FROM page_views WHERE created_at >= datetime('now', '-30 days')"
  ).get() as CountRow).c;
  const totalContacts = (db.prepare("SELECT COUNT(*) as c FROM contacts").get() as CountRow).c;
  const unreadContacts = (db.prepare("SELECT COUNT(*) as c FROM contacts WHERE status = 'unread'").get() as CountRow).c;
  const leads30d = (db.prepare("SELECT COUNT(*) as c FROM contacts WHERE created_at >= datetime('now', '-30 days')").get() as CountRow).c;
  const pipeline = db.prepare("SELECT lead_stage as stage, COUNT(*) as count FROM contacts GROUP BY lead_stage").all() as { stage: string; count: number }[];

  const rawDays = db.prepare(`
    SELECT date(created_at) as day, COUNT(*) as count
    FROM page_views
    WHERE created_at >= datetime('now', '-14 days')
    GROUP BY date(created_at)
  `).all() as DayRow[];
  const byDay = new Map(rawDays.map((d) => [d.day, d.count]));
  const dailyViews: DayRow[] = [];
  for (let i = 13; i >= 0; i--) {
    const day = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10);
    dailyViews.push({ day, count: byDay.get(day) ?? 0 });
  }

  const topPages = db.prepare(`
    SELECT path, COUNT(*) as count
    FROM page_views
    WHERE created_at >= datetime('now', '-30 days')
    GROUP BY path
    ORDER BY count DESC LIMIT 10
  `).all() as PageRow[];

  const topEvents = db.prepare(`
    SELECT name, COUNT(*) as count
    FROM events
    WHERE created_at >= datetime('now', '-30 days')
    GROUP BY name
    ORDER BY count DESC LIMIT 15
  `).all() as { name: string; count: number }[];

  return NextResponse.json({
    totalViews,
    views7d,
    views30d,
    totalContacts,
    unreadContacts,
    leads30d,
    conversion30d: views30d ? Math.round((leads30d / views30d) * 1000) / 10 : 0,
    pipeline,
    dailyViews,
    topPages,
    topEvents,
  });
}
