import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { isOutreachAuthorized } from "@/lib/outreach-auth";
import { parseCsv } from "@/lib/csv";
import { normalizeProspect, upsertProspect } from "@/lib/prospects";

const BODY_LIMIT = 1_000_000;
const MAX_ROWS = 500;

const HEADERS: Record<string, string> = {
  externalid: "externalId",
  external_id: "externalId",
  name: "name",
  fullname: "name",
  email: "email",
  company: "company",
  organisation: "company",
  organization: "company",
  role: "role",
  title: "role",
  website: "website",
  source: "source",
  sourceurl: "sourceUrl",
  source_url: "sourceUrl",
  linkedin: "sourceUrl",
  notes: "notes",
  note: "notes",
  stage: "stage",
  followupat: "followUpAt",
  follow_up_at: "followUpAt",
};

function rowToObject(headers: string[], cells: string[]): Record<string, string> {
  const record: Record<string, string> = {};
  headers.forEach((header, index) => {
    const key = HEADERS[header.toLowerCase().replace(/[\s-]/g, "")];
    if (key) record[key] = cells[index] ?? "";
  });
  return record;
}

export async function POST(req: NextRequest) {
  if (!(await isOutreachAuthorized(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (Number(req.headers.get("content-length") ?? 0) > BODY_LIMIT) {
    return NextResponse.json({ error: "Import too large (1 MB max)" }, { status: 413 });
  }

  const contentType = req.headers.get("content-type") ?? "";
  let records: unknown[] = [];

  if (contentType.startsWith("text/csv") || contentType.startsWith("text/plain")) {
    const text = await req.text();
    if (text.length > BODY_LIMIT) return NextResponse.json({ error: "Import too large (1 MB max)" }, { status: 413 });
    const [headerRow, ...dataRows] = parseCsv(text);
    if (!headerRow?.length) return NextResponse.json({ error: "CSV header required" }, { status: 400 });
    const headers = headerRow.map((header) => header.trim());
    records = dataRows.slice(0, MAX_ROWS + 1).map((cells) => rowToObject(headers, cells));
    if (dataRows.length > MAX_ROWS) return NextResponse.json({ error: `Import is limited to ${MAX_ROWS} rows` }, { status: 400 });
  } else if (contentType.startsWith("application/json")) {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }
    const rows = (body as { rows?: unknown })?.rows;
    if (!Array.isArray(rows)) return NextResponse.json({ error: "Expected { rows: [] }" }, { status: 400 });
    if (rows.length > MAX_ROWS) return NextResponse.json({ error: `Import is limited to ${MAX_ROWS} rows` }, { status: 400 });
    records = rows;
  } else {
    return NextResponse.json({ error: "CSV or JSON required" }, { status: 415 });
  }

  const db = getDb();
  let inserted = 0;
  let updated = 0;
  let skipped = 0;
  const errors: { row: number; error: string }[] = [];

  const run = db.transaction(() => {
    records.forEach((record, index) => {
      const parsed = normalizeProspect(record, { partial: false });
      if (!parsed.ok) {
        skipped++;
        if (errors.length < 5) errors.push({ row: index + 2, error: parsed.error });
        return;
      }
      try {
        const result = upsertProspect(db, parsed.value);
        if (result.suppressed) {
          skipped++;
          if (errors.length < 5) errors.push({ row: index + 2, error: "Suppressed address" });
        } else if (result.created) inserted++;
        else updated++;
      } catch {
        skipped++;
        if (errors.length < 5) errors.push({ row: index + 2, error: "Duplicate email or invalid external id" });
      }
    });
  });
  run();

  return NextResponse.json({ ok: true, received: records.length, inserted, updated, skipped, errors });
}
