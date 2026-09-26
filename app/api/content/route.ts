import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { getSiteContentRecord, listSiteContentRevisions, restoreSiteContentRevision, saveSiteContent } from "@/lib/site-content";
import type { SiteConfig } from "@/config/site";

async function authorized() {
  return Boolean(await getServerSession(authOptions));
}

const WEAK_PASSWORDS = ["changeme123", "change-me-to-a-strong-password", "build-time-placeholder", "your-secure-password-here", "change-this-to-a-long-random-secret-string"];

export async function GET() {
  if (!(await authorized())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const password = process.env.ADMIN_PASSWORD ?? "";
  return NextResponse.json({
    ...getSiteContentRecord(),
    revisions: listSiteContentRevisions(),
    warnings: { weakAdminPassword: !password || password.length < 12 || WEAK_PASSWORDS.includes(password) },
  });
}

export async function PUT(req: NextRequest) {
  if (!(await authorized())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!req.headers.get("content-type")?.startsWith("application/json")) return NextResponse.json({ error: "JSON required" }, { status: 415 });
  let body: { content?: SiteConfig; version?: number };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
  if (!body.content || !Number.isInteger(body.version)) return NextResponse.json({ error: "Content and version required" }, { status: 400 });
  const result = saveSiteContent(body.content, body.version!);
  return result.ok ? NextResponse.json(result.record) : NextResponse.json({ error: result.errors.join(" "), errors: result.errors }, { status: result.status });
}

export async function POST(req: NextRequest) {
  if (!(await authorized())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  let body: { revisionId?: number; version?: number };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
  if (!Number.isInteger(body.revisionId) || !Number.isInteger(body.version)) return NextResponse.json({ error: "Revision and version required" }, { status: 400 });
  const result = restoreSiteContentRevision(body.revisionId!, body.version!);
  return result.ok ? NextResponse.json(result.record) : NextResponse.json({ error: result.errors.join(" ") }, { status: result.status });
}
