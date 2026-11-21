#!/usr/bin/env node
// Minimal gwhyyy admin MCP server. Stdio JSON-RPC, no dependencies.
import { readFileSync } from "node:fs";
const outreachTools = JSON.parse(readFileSync(new URL("./outreach-tools.json", import.meta.url), "utf8"));
const BASE = (process.env.GWHYYY_BASE_URL ?? "https://gwhyyy.com").replace(/\/$/, "");
const TOKEN = process.env.GWHYYY_ADMIN_TOKEN ?? "";

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

function tool(name, description, properties) {
  const required = Object.entries(properties).filter(([, v]) => v.required).map(([k]) => k);
  return {
    name,
    description,
    inputSchema: {
      type: "object",
      properties: Object.fromEntries(Object.entries(properties).map(([k, v]) => [k, { ...v, required: undefined }])),
      required,
      additionalProperties: false,
    },
  };
}
function str(required = false) { return { type: "string", required }; }
function num(required = false) { return { type: "integer", required }; }
function bool(required = false) { return { type: "boolean", required }; }
function obj(required = false) { return { type: "object", additionalProperties: true, required }; }
function arr(required = false) { return { type: "array", items: { type: "object", additionalProperties: true }, required }; }

async function api(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: { Authorization: `Bearer ${TOKEN}`, ...(options.body ? { "Content-Type": "application/json" } : {}), ...(options.headers ?? {}) },
    signal: AbortSignal.timeout(30000),
  });
  const type = res.headers.get("content-type") ?? "";
  const body = type.includes("application/json") ? await res.json() : await res.text();
  if (!res.ok) throw new Error(typeof body === "string" ? body.slice(0, 300) : JSON.stringify(body).slice(0, 300));
  return body;
}

async function call(name, args) {
  const outreach = outreachTools.find(t => t.name === name);
  if (outreach) {
    if (outreach.method === "GET") return api(`/api/outreach?${new URLSearchParams({ ...args, action: outreach.action })}`);
    return api("/api/outreach", { method: "POST", body: JSON.stringify({ ...args, action: outreach.action }) });
  }
  const qs = (o) => {
    const p = new URLSearchParams();
    for (const [k, v] of Object.entries(o)) if (v !== undefined && v !== null && v !== "") p.set(k, String(v));
    return p.toString();
  };
  switch (name) {
    case "gwhyyy_status": return api("/api/health");
    case "gwhyyy_list_prospects": return api(`/api/prospects?${qs({ stage: args.stage ?? "all", q: args.q, due: args.due ? 1 : undefined, page: args.page, perPage: args.perPage })}`);
    case "gwhyyy_upsert_prospect": return api("/api/prospects", { method: "POST", body: JSON.stringify(args.prospect) });
    case "gwhyyy_update_prospect": return api("/api/prospects", { method: "PATCH", body: JSON.stringify({ id: args.id, ...args.fields }) });
    case "gwhyyy_delete_prospect": return api(`/api/prospects?id=${args.id}`, { method: "DELETE" });
    case "gwhyyy_list_activities": return api(`/api/prospects/${args.id}/activities`);
    case "gwhyyy_add_activity": return api(`/api/prospects/${args.id}/activities`, { method: "POST", body: JSON.stringify({ kind: args.kind ?? "note", body: args.body ?? "" }) });
    case "gwhyyy_import_prospects": return api("/api/prospects/import", { method: "POST", body: JSON.stringify({ rows: args.rows }) });
    case "gwhyyy_export_prospects": return api(`/api/prospects/export?${qs({ stage: args.stage ?? "all", q: args.q, due: args.due ? 1 : undefined })}`);
    case "gwhyyy_list_leads": return api(`/api/messages?${qs({ status: args.status ?? "all", stage: args.stage ?? "all", q: args.q, page: args.page })}`);
    case "gwhyyy_update_lead": return api("/api/messages", { method: "PATCH", body: JSON.stringify({ id: args.id, ...args.fields }) });
    case "gwhyyy_delete_lead": return api(`/api/messages?id=${args.id}`, { method: "DELETE" });
    case "gwhyyy_analytics": return api("/api/analytics");
    case "gwhyyy_get_content": return api("/api/content");
    case "gwhyyy_update_content": return api("/api/content", { method: "PUT", body: JSON.stringify({ content: args.content, version: args.version }) });
    default: throw new Error(`Unknown tool: ${name}`);
  }
}

function send(message) {
  process.stdout.write(JSON.stringify(message) + "\n");
}

let buffer = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", async (chunk) => {
  buffer += chunk;
  let index;
  while ((index = buffer.indexOf("\n")) >= 0) {
    const line = buffer.slice(0, index).trim();
    buffer = buffer.slice(index + 1);
    if (!line) continue;
    let message;
    try { message = JSON.parse(line); } catch { continue; }
    if (message.id === undefined) continue;
    try {
      if (message.method === "initialize") {
        send({ jsonrpc: "2.0", id: message.id, result: { protocolVersion: message.params?.protocolVersion ?? "2024-11-05", capabilities: { tools: {} }, serverInfo: { name: "gwhyyy-admin", version: "1.0.0" } } });
      } else if (message.method === "tools/list") {
        send({ jsonrpc: "2.0", id: message.id, result: { tools: TOOLS } });
      } else if (message.method === "tools/call") {
        const result = await call(message.params?.name, message.params?.arguments ?? {});
        const text = typeof result === "string" ? result : JSON.stringify(result);
        send({ jsonrpc: "2.0", id: message.id, result: { content: [{ type: "text", text }] } });
      } else if (message.method === "ping") {
        send({ jsonrpc: "2.0", id: message.id, result: {} });
      } else {
        send({ jsonrpc: "2.0", id: message.id, error: { code: -32601, message: "Method not found" } });
      }
    } catch (error) {
      send({ jsonrpc: "2.0", id: message.id, result: { content: [{ type: "text", text: error instanceof Error ? error.message : "Tool failed" }], isError: true } });
    }
  }
});
