import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function POST(req: NextRequest) {
  let body: { path?: string; referrer?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { path, referrer } = body;
  if (!path) {
    return NextResponse.json({ error: "Missing path" }, { status: 400 });
  }

  // Skip dashboard and API paths
  if (path.startsWith("/dashboard") || path.startsWith("/api") || path.startsWith("/login")) {
    return NextResponse.json({ ok: true });
  }

  try {
    const db = getDb();
    db.prepare(
      `INSERT INTO page_views (path, referrer) VALUES (?, ?)`
    ).run(path.slice(0, 500), (referrer ?? "").slice(0, 500));
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Track error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
