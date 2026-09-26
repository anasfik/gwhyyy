import { NextResponse } from "next/server";
import fs from "fs";
import { getDb } from "@/lib/db";
import { getSiteContentRecord } from "@/lib/site-content";

export async function GET() {
  const checks: Record<string, string> = {};
  let healthy = true;

  try {
    getDb().prepare("SELECT 1").get();
    fs.accessSync(process.cwd() + "/data", fs.constants.W_OK);
    checks.database = "readable";
    checks.dataDir = "writable";
  } catch (error) {
    healthy = false;
    checks.database = "unavailable";
    checks.error = error instanceof Error ? error.message : "unknown";
  }

  try {
    checks.contentVersion = `v${getSiteContentRecord().version}`;
  } catch {
    healthy = false;
    checks.contentVersion = "unavailable";
  }

  checks.adminPassword = process.env.ADMIN_PASSWORD ? "set" : "missing";

  return NextResponse.json(
    { status: healthy ? "ok" : "degraded", timestamp: new Date().toISOString(), checks },
    { status: healthy ? 200 : 503 },
  );
}
