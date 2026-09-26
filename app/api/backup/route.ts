import fs from "fs";
import os from "os";
import path from "path";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/db";

// ponytail: VACUUM INTO gives a consistent single-file snapshot; switch to an object-store
// uploader when backups need to leave the host automatically.
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const target = path.join(os.tmpdir(), `gwhyyy-backup-${stamp}.db`);
  try {
    getDb().prepare(`VACUUM INTO '${target.replace(/'/g, "''")}'`).run();
    const file = fs.readFileSync(target);
    fs.unlinkSync(target);
    return new Response(new Uint8Array(file), {
      headers: {
        "Content-Type": "application/vnd.sqlite3",
        "Content-Disposition": `attachment; filename="portfolio-backup-${stamp}.db"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Backup failed:", error);
    return NextResponse.json({ error: "Backup failed" }, { status: 500 });
  }
}
