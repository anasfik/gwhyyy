import crypto from "crypto";
import Database from "better-sqlite3";

export const PROSPECT_STAGES = ["new", "qualified", "contacted", "won", "lost", "archived"] as const;
export type ProspectStage = (typeof PROSPECT_STAGES)[number];

export type ProspectInput = {
  externalId: string | null;
  name: string;
  email: string;
  company: string;
  role: string;
  website: string;
  source: string;
  sourceUrl: string;
  stage: ProspectStage;
  notes: string;
  followUpAt: string | null;
  emailStatus: "unknown" | "verified" | "invalid" | "risky";
  unsubscribeToken: string | null;
  lawfulBasis: string;
  sourceDetail: string;
  domain: string;
};

const COLUMNS: Record<keyof ProspectInput, string> = {
  externalId: "external_id",
  name: "name",
  email: "email",
  company: "company",
  role: "role",
  website: "website",
  source: "source",
  sourceUrl: "source_url",
  stage: "stage",
  notes: "notes",
  followUpAt: "follow_up_at",
  emailStatus: "email_status",
  unsubscribeToken: "unsubscribe_token",
  lawfulBasis: "lawful_basis",
  sourceDetail: "source_detail",
  domain: "domain",
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;

function text(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  return value.trim().slice(0, max);
}

function url(value: string): boolean {
  if (!value) return true;
  if (!URL.canParse(value)) return false;
  return value.startsWith("http://") || value.startsWith("https://");
}

export function normalizeProspect(
  input: unknown,
  { partial }: { partial: boolean }
): { ok: true; value: Partial<ProspectInput> } | { ok: false; error: string } {
  if (!input || typeof input !== "object" || Array.isArray(input)) return { ok: false, error: "Invalid prospect" };

  const raw = input as Record<string, unknown>;
  const value: Partial<ProspectInput> = {};
  const has = (key: string) => Object.prototype.hasOwnProperty.call(raw, key);

  if (has("name")) {
    const name = text(raw.name, 200);
    if (name === null) return { ok: false, error: "Invalid name" };
    value.name = name;
  }
  if (has("company")) {
    const company = text(raw.company, 200);
    if (company === null) return { ok: false, error: "Invalid company" };
    value.company = company;
  }
  if (!partial && !value.name && !value.company) return { ok: false, error: "Name or company is required" };
  if (partial && has("name") && has("company") && !value.name && !value.company) {
    return { ok: false, error: "Name or company is required" };
  }

  if (has("email")) {
    const email = text(raw.email, 200);
    if (email === null) return { ok: false, error: "Invalid email" };
    const lowered = email.toLowerCase();
    if (lowered && !EMAIL.test(lowered)) return { ok: false, error: "Invalid email" };
    value.email = lowered;
  }
  if (has("role")) {
    const role = text(raw.role, 200);
    if (role === null) return { ok: false, error: "Invalid role" };
    value.role = role;
  }
  for (const key of ["website", "sourceUrl"] as const) {
    if (!has(key)) continue;
    const candidate = text(raw[key], 500);
    if (candidate === null) return { ok: false, error: `Invalid ${key}` };
    if (!url(candidate)) return { ok: false, error: `Invalid ${key}` };
    value[key] = candidate;
  }
  if (has("source")) {
    const source = text(raw.source, 100);
    if (source === null) return { ok: false, error: "Invalid source" };
    value.source = source || "manual";
  }
  if (has("stage")) {
    if (typeof raw.stage !== "string" || !PROSPECT_STAGES.includes(raw.stage as ProspectStage)) {
      return { ok: false, error: "Invalid stage" };
    }
    value.stage = raw.stage as ProspectStage;
  }
  if (has("notes")) {
    const notes = text(raw.notes, 5000);
    if (notes === null) return { ok: false, error: "Invalid notes" };
    value.notes = notes;
  }
  if (has("externalId")) {
    const externalId = text(raw.externalId, 200);
    if (externalId === null) return { ok: false, error: "Invalid externalId" };
    value.externalId = externalId || null;
  }
  if (has("emailStatus")) {
    if (typeof raw.emailStatus !== "string" || !["unknown", "verified", "invalid", "risky"].includes(raw.emailStatus)) {
      return { ok: false, error: "Invalid emailStatus" };
    }
    value.emailStatus = raw.emailStatus as ProspectInput["emailStatus"];
  }
  if (has("lawfulBasis")) {
    const basis = text(raw.lawfulBasis, 200);
    if (basis === null) return { ok: false, error: "Invalid lawfulBasis" };
    value.lawfulBasis = basis;
  }
  if (has("sourceDetail")) {
    const detail = text(raw.sourceDetail, 500);
    if (detail === null) return { ok: false, error: "Invalid sourceDetail" };
    value.sourceDetail = detail;
  }
  if (has("unsubscribeToken")) {
    const token = text(raw.unsubscribeToken, 100);
    if (token === null) return { ok: false, error: "Invalid unsubscribeToken" };
    value.unsubscribeToken = token || null;
  }
  if (has("followUpAt")) {
    if (raw.followUpAt === null || raw.followUpAt === "") {
      value.followUpAt = null;
    } else if (typeof raw.followUpAt !== "string" || !DATE.test(raw.followUpAt)) {
      return { ok: false, error: "Invalid follow-up date" };
    } else {
      value.followUpAt = raw.followUpAt;
    }
  }

  if (partial && Object.keys(value).length === 0) return { ok: false, error: "Nothing to update" };
  return { ok: true, value };
}

export function updateProspect(db: Database.Database, id: number, value: Partial<ProspectInput>): number {
  const entries = Object.entries(value).filter(([key]) => key in COLUMNS);
  if (entries.length === 0) return 0;
  const assignments = entries.map(([key]) => `${COLUMNS[key as keyof ProspectInput]} = ?`);
  const result = db.prepare(`UPDATE prospects SET ${assignments.join(", ")}, updated_at = datetime('now') WHERE id = ?`)
    .run(...entries.map(([, item]) => item), id);
  return result.changes;
}

export function upsertProspect(db: Database.Database, value: Partial<ProspectInput>): { id: number; created: boolean; suppressed?: boolean } {
  let existing: { id: number } | undefined;
  if (value.unsubscribeToken === undefined) value.unsubscribeToken = crypto.randomBytes(24).toString("hex");
  if (value.email && !value.domain) value.domain = value.email.split("@")[1] ?? "";
  if (value.website && !value.domain) {
    try { value.domain = new URL(value.website).hostname.replace(/^www\./, ""); } catch {}
  }
  if (value.email) {
    const suppressed = db.prepare("SELECT email FROM suppressions WHERE email = ?").get(value.email);
    if (suppressed) return { id: 0, created: false, suppressed: true };
  }
  if (value.externalId) {
    existing = db.prepare("SELECT id FROM prospects WHERE external_id = ?").get(value.externalId) as { id: number } | undefined;
  }
  if (!existing && value.email) {
    existing = db.prepare("SELECT id FROM prospects WHERE email = ?").get(value.email) as { id: number } | undefined;
  }

  if (existing) {
    const entries = Object.entries(value).filter(([key]) => key in COLUMNS);
    if (entries.length > 0) {
      const assignments = entries.map(([key]) => `${COLUMNS[key as keyof ProspectInput]} = ?`);
      db.prepare(`UPDATE prospects SET ${assignments.join(", ")}, updated_at = datetime('now') WHERE id = ?`)
        .run(...entries.map(([, item]) => item), existing.id);
    }
    return { id: existing.id, created: false };
  }

  if (!value.unsubscribeToken) value.unsubscribeToken = crypto.randomBytes(24).toString("hex");
  const fields: string[] = [];
  const params: unknown[] = [];
  for (const [key, column] of Object.entries(COLUMNS)) {
    const item = value[key as keyof ProspectInput];
    if (item !== undefined) {
      fields.push(column);
      params.push(item);
    }
  }
  if (!fields.includes("stage")) {
    fields.push("stage");
    params.push("new");
  }
  if (!fields.includes("source")) {
    fields.push("source");
    params.push("manual");
  }
  const result = db.prepare(`INSERT INTO prospects (${fields.join(", ")}) VALUES (${fields.map(() => "?").join(", ")})`).run(...params);
  return { id: Number(result.lastInsertRowid), created: true };
}
