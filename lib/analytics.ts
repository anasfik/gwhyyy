import type Database from "better-sqlite3";

// An archived inquiry was dismissed, not converted. Counting it as a lead inflates the contact rate.
const LIVE = "lead_stage <> 'archived' AND status <> 'archived'";

export function countLiveContacts(db: Database.Database, sinceDays?: number): number {
  const where = sinceDays === undefined ? LIVE : `${LIVE} AND created_at >= datetime('now', ?)`;
  const stmt = db.prepare(`SELECT COUNT(*) AS c FROM contacts WHERE ${where}`);
  const row = (sinceDays === undefined ? stmt.get() : stmt.get(`-${sinceDays} days`)) as { c: number };
  return row.c;
}

export function contactRatePer100(leads: number, views: number): number {
  return views > 0 ? Math.round((leads / views) * 1000) / 10 : 0;
}
