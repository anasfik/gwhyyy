import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isAdminAuthorized } from "@/lib/admin-auth";
import { getDb } from "@/lib/db";
import { OutreachService, type MailSettings } from "@/lib/outreach/service";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
const json = (value: unknown, status = 200) => NextResponse.json(value, { status, headers: { "Cache-Control": "no-store" } });

export async function GET(req: NextRequest) {
  if (!(await isAdminAuthorized(req))) return json({ error: "Unauthorized" }, 401);
  const service = new OutreachService(getDb());
  try {
    const action = req.nextUrl.searchParams.get("action") ?? "state";
    if (action === "state") return json(service.list());
    if (action === "balance") return json(await service.balance());
    if (action === "preview") return json(service.preview(Number(req.nextUrl.searchParams.get("id"))));
    return json({ error: "Unknown action" }, 400);
  } catch (error) { return json({ error: error instanceof Error ? error.message : "Outreach request failed" }, 409); }
}

async function readBody(req: NextRequest): Promise<Record<string, unknown>> {
  if (!req.headers.get("content-type")?.startsWith("application/json")) throw new Error("JSON required");
  const reader = req.body?.getReader();
  if (!reader) throw new Error("Empty request");
  const chunks: Uint8Array[] = []; let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.length;
    if (size > 40000) { await reader.cancel(); throw new Error("Request too large"); }
    chunks.push(value);
  }
  const body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
  if (!body || typeof body !== "object" || Array.isArray(body)) throw new Error("Invalid JSON object");
  return body;
}

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthorized(req))) return json({ error: "Unauthorized" }, 401);
  const origin = req.headers.get("origin");
  if (origin && origin !== new URL(process.env.NEXTAUTH_URL ?? req.url).origin) return json({ error: "Invalid origin" }, 403);
  let body: Record<string, unknown>;
  try { body = await readBody(req); } catch { return json({ error: "Invalid JSON or request exceeds 40 KB" }, 400); }
  const service = new OutreachService(getDb());
  try {
    const action = body.action;
    if (action === "draft") return json(service.saveDraft(body as Parameters<OutreachService["saveDraft"]>[0]));
    if (action === "send") {
      if (body.confirm !== true || typeof body.expectedHash !== "string" || !/^[a-f0-9]{64}$/.test(body.expectedHash)) return json({ error: "Explicit send confirmation and preview hash required" }, 400);
      const result = await service.send(body.id as number, body.expectedHash);
      if (["uncertain", "rejected"].includes(result.status)) return json({ id: result.id, status: result.status, error: result.error }, 409);
      return json(result);
    }
    if (action === "sync") return json(await service.sync());
    if (action === "pause") return json(service.configure({ paused: body.paused as boolean }));
    if (action === "suppress") { service.suppress(body.email as string, body.reason as string); return json({ ok: true }); }
    if (action === "approve") {
      if (!service.message(body.id as number).is_test && !(await getServerSession(authOptions))) return json({ error: "Prospect approval requires a human dashboard session" }, 403);
      if (body.confirm !== true || typeof body.expectedHash !== "string") return json({ error: "Review and confirm the exact preview first" }, 400);
      return json(service.approve(body.id as number, body.expectedHash));
    }
    if (action === "settings" || action === "review_inbox" || action === "reconcile") {
      if (!(await getServerSession(authOptions))) return json({ error: "Sender configuration requires a human dashboard session" }, 403);
      if (action === "review_inbox") return json(service.configure({ repliesReviewedAt: new Date().toISOString() }));
      if (action === "reconcile") return json(service.reconcile(body.id as number, body.providerId as string));
      if (body.settings && typeof body.settings === "object" && "paused" in body.settings) return json({ error: "Use the separate pause action; saving sender settings cannot resume dispatch" }, 400);
      return json(service.configure(body.settings as Partial<MailSettings>));
    }
    return json({ error: "Unknown action" }, 400);
  } catch (error) { return json({ error: error instanceof Error ? error.message : "Outreach request failed" }, 409); }
}
