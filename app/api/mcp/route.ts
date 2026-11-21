import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import outreachTools from "@/mcp/outreach-tools.json";

export const dynamic = "force-dynamic";

const BASE = process.env.MCP_INTERNAL_BASE ?? "http://127.0.0.1:3000";
const ADMIN = process.env.DASHBOARD_API_TOKEN ?? "";

type Json = Record<string, unknown>;
const str = (required = false) => ({ type: "string", required });
const num = (required = false) => ({ type: "integer", required });
const bool = (required = false) => ({ type: "boolean", required });
const obj = (required = false) => ({ type: "object", additionalProperties: true, required });
const arr = (required = false) => ({ type: "array", items: { type: "object", additionalProperties: true }, required });

function tool(name: string, description: string, props: Record<string, ReturnType<typeof str>>) {
  const required = Object.entries(props).filter(([, value]) => value.required).map(([key]) => key);
  return {
    name,
    description,
    inputSchema: {
      type: "object",
      properties: Object.fromEntries(Object.entries(props).map(([key, value]) => [key, { ...value, required: undefined }])),
      required,
      additionalProperties: false,
    },
  };
}

const TOOLS = [
  ...outreachTools.map(({ name, description, properties, required }) => ({ name, description, inputSchema: { type: "object", properties, required: required ?? [], additionalProperties: false } })),
  tool("gwhyyy_status", "Health, database and content status.", {}),
  tool("gwhyyy_list_prospects", "List outreach prospects.", { stage: str(), q: str(), due: bool(), page: num(), perPage: num() }),
  tool("gwhyyy_upsert_prospect", "Create or update a prospect by externalId/email.", { prospect: obj() }),
  tool("gwhyyy_update_prospect", "Update fields on a prospect by id.", { id: num(true), fields: obj(true) }),
  tool("gwhyyy_delete_prospect", "Delete a prospect and its activity log.", { id: num(true) }),
  tool("gwhyyy_list_activities", "List activities for a prospect.", { id: num(true) }),
  tool("gwhyyy_add_activity", "Log an activity against a prospect.", { id: num(true), kind: str(), body: str() }),
  tool("gwhyyy_import_prospects", "Import up to 500 prospects as JSON rows.", { rows: arr(true) }),
  tool("gwhyyy_export_prospects", "Export filtered prospects as CSV.", { stage: str(), q: str(), due: bool() }),
  tool("gwhyyy_list_leads", "List inbound inquiry leads.", { status: str(), stage: str(), q: str(), page: num() }),
  tool("gwhyyy_update_lead", "Update an inbound lead.", { id: num(true), fields: obj(true) }),
  tool("gwhyyy_delete_lead", "Delete an inbound lead.", { id: num(true) }),
  tool("gwhyyy_analytics", "Traffic, inquiry starts, contacts and qualified leads.", {}),
  tool("gwhyyy_get_content", "Read live site content and revision metadata.", {}),
  tool("gwhyyy_update_content", "Save site content. Requires the current version.", { content: obj(true), version: num(true) }),
];

async function api(path: string, options: RequestInit = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: { Authorization: `Bearer ${ADMIN}`, ...(options.body ? { "Content-Type": "application/json" } : {}), ...(options.headers ?? {}) },
    signal: AbortSignal.timeout(30000),
  });
  const type = res.headers.get("content-type") ?? "";
  const body = type.includes("application/json") ? await res.json() : await res.text();
  if (!res.ok) throw new Error(typeof body === "string" ? body.slice(0, 300) : JSON.stringify(body).slice(0, 300));
  return body;
}

async function callTool(name: string, args: Json) {
  const outreach = outreachTools.find(t => t.name === name);
  if (outreach) {
    if (outreach.method === "GET") return api(`/api/outreach?${new URLSearchParams({ ...Object.fromEntries(Object.entries(args).map(([k,v]) => [k, String(v)])), action: outreach.action })}`);
    return api("/api/outreach", { method: "POST", body: JSON.stringify({ ...args, action: outreach.action }) });
  }
  const qs = (input: Record<string, unknown>) => {
    const p = new URLSearchParams();
    for (const [key, value] of Object.entries(input)) if (value !== undefined && value !== null && value !== "") p.set(key, String(value));
    return p.toString();
  };
  switch (name) {
    case "gwhyyy_status": return api("/api/health");
    case "gwhyyy_list_prospects": return api(`/api/prospects?${qs({ stage: args.stage ?? "all", q: args.q, due: args.due ? 1 : undefined, page: args.page, perPage: args.perPage })}`);
    case "gwhyyy_upsert_prospect": return api("/api/prospects", { method: "POST", body: JSON.stringify(args.prospect) });
    case "gwhyyy_update_prospect": return api("/api/prospects", { method: "PATCH", body: JSON.stringify({ id: args.id, ...(args.fields as Json) }) });
    case "gwhyyy_delete_prospect": return api(`/api/prospects?id=${args.id}`, { method: "DELETE" });
    case "gwhyyy_list_activities": return api(`/api/prospects/${args.id}/activities`);
    case "gwhyyy_add_activity": return api(`/api/prospects/${args.id}/activities`, { method: "POST", body: JSON.stringify({ kind: args.kind ?? "note", body: args.body ?? "" }) });
    case "gwhyyy_import_prospects": return api("/api/prospects/import", { method: "POST", body: JSON.stringify({ rows: args.rows }) });
    case "gwhyyy_export_prospects": return api(`/api/prospects/export?${qs({ stage: args.stage ?? "all", q: args.q, due: args.due ? 1 : undefined })}`);
    case "gwhyyy_list_leads": return api(`/api/messages?${qs({ status: args.status ?? "all", stage: args.stage ?? "all", q: args.q, page: args.page })}`);
    case "gwhyyy_update_lead": return api("/api/messages", { method: "PATCH", body: JSON.stringify({ id: args.id, ...(args.fields as Json) }) });
    case "gwhyyy_delete_lead": return api(`/api/messages?id=${args.id}`, { method: "DELETE" });
    case "gwhyyy_analytics": return api("/api/analytics");
    case "gwhyyy_get_content": return api("/api/content");
    case "gwhyyy_update_content": return api("/api/content", { method: "PUT", body: JSON.stringify({ content: args.content, version: args.version }) });
    default: throw new Error(`Unknown tool: ${name}`);
  }
}

function tokenOk(req: NextRequest): boolean {
  const header = req.headers.get("authorization") ?? "";
  if (!header.startsWith("Bearer ")) return false;
  const token = header.slice(7).trim();
  if (!token) return false;
  const hash = crypto.createHash("sha256").update(token).digest("hex");
  const db = getDb();
  const row = db.prepare("SELECT id FROM mcp_tokens WHERE token_hash = ? AND expires_at > datetime('now')").get(hash) as { id: number } | undefined;
  if (!row) return false;
  db.prepare("UPDATE mcp_tokens SET last_used_at = datetime('now') WHERE id = ?").run(row.id);
  return true;
}

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Authorization, Content-Type, Mcp-Session-Id",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: cors });
}

export async function GET() {
  return NextResponse.json({ error: "POST JSON-RPC with a bearer token" }, { status: 405, headers: cors });
}

export async function POST(req: NextRequest) {
  if (!tokenOk(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: cors });
  if (Number(req.headers.get("content-length") ?? 0) > 1_000_000) {
    return NextResponse.json({ error: "Request too large" }, { status: 413, headers: cors });
  }
  let message: Json;
  try { message = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400, headers: cors }); }
  const id = message.id;
  if (id === undefined) return new NextResponse(null, { status: 202, headers: cors });

  const reply = (result: unknown) => NextResponse.json({ jsonrpc: "2.0", id, result }, { headers: cors });
  const fail = (code: number, error: string) => NextResponse.json({ jsonrpc: "2.0", id, error: { code, message: error } }, { headers: cors });

  try {
    if (message.method === "initialize") {
      const params = (message.params ?? {}) as Json;
      return reply({
        protocolVersion: params.protocolVersion ?? "2024-11-05",
        capabilities: { tools: {} },
        serverInfo: { name: "gwhyyy-admin-remote", version: "1.0.0" },
      });
    }
    if (message.method === "tools/list") return reply({ tools: TOOLS });
    if (message.method === "ping") return reply({});
    if (message.method === "tools/call") {
      const params = (message.params ?? {}) as { name?: string; arguments?: Json };
      if (!params.name) return fail(-32602, "Tool name required");
      const result = await callTool(params.name, params.arguments ?? {});
      const text = typeof result === "string" ? result : JSON.stringify(result);
      return reply({ content: [{ type: "text", text }] });
    }
    return fail(-32601, "Method not found");
  } catch (error) {
    return reply({ content: [{ type: "text", text: error instanceof Error ? error.message : "Tool failed" }], isError: true });
  }
}
