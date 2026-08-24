import Database from "better-sqlite3";

const RATE_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_MAX = 5;

export function getIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

// SQLite-backed so limits survive server restarts.
export function isRateLimited(db: Database.Database, key: string): boolean {
  const now = Date.now();
  const row = db
    .prepare("SELECT hits, window_start FROM rate_limits WHERE key = ?")
    .get(key) as { hits: number; window_start: number } | undefined;

  if (!row || now - row.window_start > RATE_WINDOW_MS) {
    db.prepare(
      "INSERT INTO rate_limits (key, hits, window_start) VALUES (?, 1, ?) ON CONFLICT(key) DO UPDATE SET hits = 1, window_start = excluded.window_start"
    ).run(key, now);
    return false;
  }

  if (row.hits >= RATE_MAX) return true;
  db.prepare("UPDATE rate_limits SET hits = hits + 1 WHERE key = ?").run(key);
  return false;
}
