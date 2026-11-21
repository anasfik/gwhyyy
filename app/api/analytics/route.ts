import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthorized } from "@/lib/admin-auth";
import { countLiveContacts, contactRatePer100 } from "@/lib/analytics";
import { getDb } from "@/lib/db";

type CountRow = { c: number };
type DayRow = { day: string; count: number };
type PageRow = { path: string; count: number };

export async function GET(req: NextRequest) {
  if (!(await isAdminAuthorized(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = getDb();

  const totalViews = (db.prepare("SELECT COUNT(*) as c FROM page_views").get() as CountRow).c;
  const views7d = (db.prepare(
    "SELECT COUNT(*) as c FROM page_views WHERE created_at >= datetime('now', '-7 days')"
  ).get() as CountRow).c;
  const views30d = (db.prepare(
    "SELECT COUNT(*) as c FROM page_views WHERE created_at >= datetime('now', '-30 days')"
  ).get() as CountRow).c;
  const totalContacts = countLiveContacts(db);
  const unreadContacts = (db.prepare("SELECT COUNT(*) as c FROM contacts WHERE status = 'unread'").get() as CountRow).c;
  const leads30d = countLiveContacts(db, 30);
  const pipeline = db.prepare("SELECT lead_stage as stage, COUNT(*) as count FROM contacts GROUP BY lead_stage").all() as { stage: string; count: number }[];
  const inquiryStarts30d = (db.prepare("SELECT COUNT(*) as c FROM events WHERE name = 'inquiry_start' AND created_at >= datetime('now', '-30 days')").get() as CountRow).c;
  const qualifiedLeads30d = (db.prepare("SELECT COUNT(*) as c FROM contacts WHERE lead_stage = 'qualified' AND created_at >= datetime('now', '-30 days')").get() as CountRow).c;

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
    contactRatePer100: contactRatePer100(leads30d, views30d),
    inquiryStarts30d,
    qualifiedLeads30d,
    pipeline,
    dailyViews,
    topPages,
    topEvents,
  });
}
