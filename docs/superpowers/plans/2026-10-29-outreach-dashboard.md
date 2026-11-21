# Outreach Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a prospects pipeline to the existing admin dashboard: import/sync prospects, track stages and follow-ups, log outreach activity, and expose a token-authenticated API for future MCP tools.

**Architecture:** SQLite tables `prospects` and `prospect_activities` in the existing DB. Two API surfaces under `/api/prospects` (session or bearer token). One client dashboard route `/dashboard/prospects` using the existing terminal-style design tokens. Inbound `contacts` stays unchanged; the two pipelines share stage names for unified reporting.

**Tech Stack:** Next.js 16 App Router, React 19, better-sqlite3, Tailwind 3, NextAuth.

**Spec:** Chat brief 2026-10-29 plus the three decisions above. No separate spec file.

## Global Constraints

- No new dependencies.
- No public pricing, rates, or budget fields.
- All write endpoints validate input server-side; CSV import capped at 500 rows / 1 MB.
- MCP bearer token comes from `OUTREACH_API_TOKEN`; never commit a value.
- Dashboard remains `noindex`; all routes require session or bearer token.
- Keep the existing design tokens (`surface`, `outline-variant`, `primary`, `secondary`, mono labels).
- Do not send cold email or add a fake "discover leads" button.
- Every new non-trivial parser or state transition gets one executed check.

## Review Focus

- CSV with quoted commas, quotes, and CRLF must not corrupt rows or split fields.
- Duplicate ingestion by `externalId` or email must update, not duplicate.
- Bearer auth must reject missing, wrong, and absent-token configurations.
- Prospect rows must never leak into the public site, sitemap, or analytics.
- Mobile 390 px: no page-level horizontal overflow; the table may scroll inside its own container.

---

### Task 1: Schema, CSV helper, auth helper

**Files:**
- Modify: `lib/db.ts`
- Create: `lib/csv.ts`
- Create: `lib/outreach-auth.ts`
- Create: `lib/prospects.ts`

**Interfaces:**
- Produces: `parseCsv(text: string): string[][]`, `toCsv(headers: string[], rows: unknown[][]): string`
- Produces: `isOutreachAuthorized(req: NextRequest): Promise<boolean>`, `mcpEnabled(): boolean`
- Produces: `PROSPECT_STAGES`, `normalizeProspect(input: unknown, partial: boolean): { ok: true; value: Partial<ProspectInput> } | { ok: false; error: string }`

- [x] Add tables and indexes in `initSchema`, idempotent.
- [x] Implement CSV parser handling BOM, CRLF, quoted fields, escaped quotes.
- [x] Implement auth: any NextAuth session OR timing-safe bearer compare.
- [x] Implement field validation shared by create, patch, import.
- [x] Check: `npx tsc --noEmit`.

### Task 2: Prospects API

**Files:**
- Create: `app/api/prospects/route.ts`
- Create: `app/api/prospects/[id]/activities/route.ts`

**Interfaces:**
- `GET /api/prospects?stage=&q=&due=1&page=` → `{ rows, total, summary, mcpEnabled }`
- `POST /api/prospects` → upsert by `externalId`, then email; `{ ok, id, created }`
- `PATCH /api/prospects` → partial update `{ id, ...fields }`
- `DELETE /api/prospects?id=`
- `GET|POST /api/prospects/[id]/activities`

- [x] Validate every write; cap string lengths; allow only known stages.
- [x] Log `email` activity also updates `last_contacted_at`.
- [x] Check: curl matrix with and without bearer token.

### Task 3: Import and export

**Files:**
- Create: `app/api/prospects/import/route.ts`
- Create: `app/api/prospects/export/route.ts`
- Modify: `app/api/messages/export/route.ts` (reuse `toCsv`)

**Interfaces:**
- `POST /api/prospects/import` accepts `text/csv` or `{ rows: [] }`; returns `{ inserted, updated, skipped, errors }`.
- `GET /api/prospects/export?...` returns CSV with formula-injection escaping.

- [x] Header aliases: `source_url`/`sourceUrl`, `external_id`/`externalId`.
- [x] Transactional upsert; per-row errors do not abort the batch.
- [x] Check: CSV fixture with quoted comma, embedded newline, duplicate email, invalid email.

### Task 4: Dashboard UI

**Files:**
- Create: `app/dashboard/prospects/page.tsx`
- Create: `components/dashboard/ProspectsManager.tsx`
- Modify: `components/dashboard/Sidebar.tsx`
- Modify: `app/dashboard/page.tsx`

**Interfaces:**
- Consumes the Task 2/3 endpoints only.
- Stage counts and follow-ups-due are clickable filters.

- [x] Summary strip, search, stage filters, follow-ups-due, export.
- [x] Import panel (file or paste CSV) and manual add form with labels.
- [x] Detail panel: company, role, source, website, notes, stage, follow-up, activity log, add activity.
- [x] Empty, loading, error states; `aria-live` import result; visible focus.
- [x] Check: Playwright login + create + import + stage change at 1440 and 390; screenshots.

### Task 5: Docs and final checks

**Files:**
- Create: `docs/rebuild/OUTREACH.md`
- Modify: `docs/rebuild/CHANGELOG.md`
- Modify: `.env.example`

- [x] Document stages, CSV columns, API contract, MCP usage, limits, compliance.
- [x] Run `npx tsc --noEmit`, `npx eslint .`, `npm run build`.
- [x] Clean test rows; local production-build verification passed; deployed to production 29 October 2026.

## Execution

Inline execution. Tasks 1-3 are coupled through the validation shape; subagent round-trips would cost more than the diff. Deploy only after the user approves the production restart.
