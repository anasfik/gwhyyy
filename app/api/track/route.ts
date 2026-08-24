import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

const ALLOWED_EVENT = /^[a-z0-9_:-]{1,100}$/;

export async function POST(req: NextRequest) {
  let body: { path?: string; referrer?: string; event?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { path, referrer, event } = body;
  if (!path) {
    return NextResponse.json({ error: "Missing path" }, { status: 400 });
  }

  // Skip dashboard and API paths
  if (path.startsWith("/dashboard") || path.startsWith("/api") || path.startsWith("/login")) {
    return NextResponse.json({ ok: true });
  }

  try {
    const db = getDb();
    if (event && ALLOWED_EVENT.test(event)) {
      db.prepare(
        `INSERT INTO events (name, path, referrer) VALUES (?, ?, ?)`
      ).run(event, path.slice(0, 500), (referrer ?? "").slice(0, 500));
    } else if (!event) {
      db.prepare(
        `INSERT INTO page_views (path, referrer) VALUES (?, ?)`
      ).run(path.slice(0, 500), (referrer ?? "").slice(0, 500));
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Track error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
