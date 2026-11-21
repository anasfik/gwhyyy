# Outreach pipeline and MCP contract

## Current implementation, 30 October 2026

The provider-swappable email service and `/dashboard/mail` are documented in [EMAIL-OPERATIONS.md](./EMAIL-OPERATIONS.md). The prospect API contract below remains valid; earlier readiness/provider sections are historical, not deployment instructions. Resend is retained for transactional inquiry notifications only, **not cold outreach**. Bulko Campaign API and standard SMTP are the new outbound adapters. Their local implementation still requires explicit production deployment and controlled seed verification.

Production read-only check today: 402 prospects, all `new`; zero rows in the unused legacy `outreach_messages` table. A sourced prospect is not a qualified buyer or verified mailbox. Existing `remote-temp` MCP credential is expired; do not silently renew it.

The admin dashboard separates two pipelines:

| Pipeline | Table | Route | Purpose |
| --- | --- | --- | --- |
| Inbound | `contacts` | `/dashboard/messages` | People who submitted the site inquiry form |
| Outbound | `prospects` | `/dashboard/prospects` | Companies and people you or an agent choose to contact |

Both use the same stage names so reporting stays comparable: `new`, `qualified`, `contacted`, `won`, `lost`, `archived`. In the outreach UI, `new` is labelled "Sourced".

## What the dashboard does

- Stage counts double as filters. Follow-ups due is a filter too: `follow_up_at <= today` and stage not `won`, `lost`, or `archived`.
- Manual add, CSV import, CSV export.
- Detail panel: contact fields, notes, stage, follow-up date, activity log.
- Logging an `email` activity sets `last_contacted_at` automatically.
- Search covers company, name, email, role, source, and notes.

There is no "discover leads" button. Discovery needs an external source or MCP tool; when one is supplied, it writes through the API below. The prospects view links to the separate email-operations workflow; listing or editing a prospect never sends email.

## CSV import

Maximum 500 data rows and 1 MB. Header required. Column names are case-insensitive; `source_url` / `sourceUrl` and `external_id` / `externalId` are accepted.

```csv
name,email,company,role,website,source,source_url,stage,follow_up_at,notes
"Grace Hopper",grace@example.com,"US Navy, Inc.","Rear Admiral",https://example.com/grace,apollo,https://example.com/profile,qualified,2026-11-04,"Compiler, COBOL"
```

- Quoted fields, escaped quotes, commas inside quotes, and newlines inside quotes are supported.
- `email` must be valid if present. Duplicate emails update the existing prospect.
- Row errors are skipped, not fatal. The response reports `inserted`, `updated`, `skipped`, and the first five errors.

## API

Auth is either an authenticated NextAuth admin session or:

```bash
Authorization: Bearer $OUTREACH_API_TOKEN
```

Set `OUTREACH_API_TOKEN` on the server. With no token, bearer access is disabled; the dashboard still works through the session. Do not commit a value. Rotate by replacing the env value and recreating the container.

### List

```bash
curl -s "https://gwhyyy.com/api/prospects?stage=qualified&due=1&q=flutter" \
  -H "Authorization: Bearer $OUTREACH_API_TOKEN"
```

Returns `rows`, `total`, `page`, `perPage`, `summary`, `due`, `mcpEnabled`.
Filters: `stage`, `q`, `due=1`, `page`, `perPage` (max 100).

### Create or upsert

```bash
curl -s -X POST "https://gwhyyy.com/api/prospects" \
  -H "Authorization: Bearer $OUTREACH_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "externalId": "apollo:12345",
    "name": "Ada Lovelace",
    "email": "ada@example.com",
    "company": "Analytical Engines",
    "role": "CTO",
    "website": "https://example.com",
    "source": "apollo",
    "sourceUrl": "https://example.com/profile",
    "stage": "qualified",
    "followUpAt": "2026-11-04",
    "notes": "Ships a Dart backend; no dedicated integrations engineer."
  }'
```

`201` when inserted, `200` when updated. Matching order: `externalId`, then `email`. Use a stable `externalId` from the source system so re-runs update instead of duplicate. Without either identifier, every POST inserts a new row.

### Update

```bash
curl -s -X PATCH "https://gwhyyy.com/api/prospects" \
  -H "Authorization: Bearer $OUTREACH_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"id":42,"stage":"contacted","followUpAt":"2026-11-11","notes":"Sent intro."}'
```

Only supplied fields change. `followUpAt: null` clears the date.

### Activity log

```bash
curl -s -X POST "https://gwhyyy.com/api/prospects/42/activities" \
  -H "Authorization: Bearer $OUTREACH_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"kind":"email","body":"Sent intro + Reqistry case study."}'

curl -s "https://gwhyyy.com/api/prospects/42/activities" \
  -H "Authorization: Bearer $OUTREACH_API_TOKEN"
```

Kinds: `note`, `email`, `call`, `linkedin`, `meeting`, `other`. `email` updates `last_contacted_at`.

### Import and export

```bash
curl -s -X POST "https://gwhyyy.com/api/prospects/import" \
  -H "Authorization: Bearer $OUTREACH_API_TOKEN" \
  -H "Content-Type: text/csv" \
  --data-binary @prospects.csv
```

JSON alternative: `{"rows":[{...}]}` with the same field names, max 500.

```bash
curl -s "https://gwhyyy.com/api/prospects/export?stage=contacted" \
  -H "Authorization: Bearer $OUTREACH_API_TOKEN" \
  -o prospects.csv
```

CSV cells starting with `=`, `+`, `-`, or `@` are prefixed with `'` to prevent formula execution in spreadsheets.

## Field limits

| Field | Rule |
| --- | --- |
| `name`, `company` | At least one required on create. Max 200 each. |
| `email` | Optional. Lowercased. Must be valid. Unique when present. |
| `role` | Max 200. |
| `website`, `sourceUrl` | Optional. `http://` or `https://`. Max 500. |
| `source` | Defaults to `manual`. Max 100. |
| `stage` | One of the six stages. Defaults to `new`. |
| `notes` | Max 5,000. |
| `externalId` | Max 200. Unique when present. |
| `followUpAt` | `YYYY-MM-DD` or null. |

## When MCP tools arrive

The intended loop:

1. MCP tool returns candidate accounts. Agent normalizes them to the fields above and POSTs to `/api/prospects/import` with a stable `externalId` per account.
2. Agent reads `/api/prospects?stage=qualified` before outreach to avoid duplicates.
3. After sending, agent logs an `email` activity and PATCHes `stage` and `followUpAt`.
4. Replies and calls are logged as activities; the dashboard stays the single source of truth.

No MCP server or connector is implemented in this repo. The API is the boundary. Write access is one token; treat it like a password, keep it out of logs, and rotate it if exposed.

## Compliance

- Cold outreach needs a lawful basis, accurate sender identity, and an easy opt-out. Check the rules for the recipient's country before sending at volume.
- Do not import data obtained by scraping a site whose terms forbid it, or personal data you have no basis to process.
- The site does not publish a postal address or company registration; add those before commercial cold email in jurisdictions that require them.

## Operations

- Schema is created idempotently by `lib/db.ts` on first request.
- Back up `data/portfolio.db` before bulk imports. Production volume: `gwhyyy_sqlite_data`.
- Deleting a prospect cascades its activities.
- Limits: 500 rows/1 MB per import, 100 activities returned per request, 5,000 prospects per export.

## Cold-outreach readiness (29 October 2026)

- `outreach.gwhyyy.com` is verified in Resend. DKIM, SPF, and MX are live in Cloudflare; DMARC is `p=none` with reports to `work@gwhyyy.com`.
- Sender: `hello@outreach.gwhyyy.com`; reply-to: `work@gwhyyy.com`. Keep transactional inquiry mail on its existing sender.
- Prospects now carry `email_status`, `unsubscribe_token`, `unsubscribed_at`, `suppressed_at`, `lawful_basis`, `source_detail`, and `domain`.
- `suppressions` blocks unsubscribed addresses. `/api/unsubscribe?token=...` supports GET links and POST one-click (RFC 8058 pattern), and marks the prospect suppressed.
- `outreach_campaigns` and `outreach_messages` exist for draft → approved → sent workflow. **No sending worker is enabled.**
- Still required before sending: human approval UI, per-domain caps, Resend bounce/complaint webhooks, reply detection, sender identity/postal address, and a documented lawful basis per segment.

### Production status

Deployed 29 October 2026. Verified:

- `outreach.gwhyyy.com` = `verified` in Resend.
- Container has `OUTREACH_FROM_EMAIL=hello@outreach.gwhyyy.com`, `OUTREACH_REPLY_TO=work@gwhyyy.com`.
- `suppressions`, `outreach_campaigns`, `outreach_messages` created; prospect columns migrated.
- `/api/unsubscribe?token=...` returns 400 for invalid tokens; local test returned 200 and a later POST for the same address returned 409 suppressed.
- Production API: 401 unauthenticated, 200 with bearer; 0 prospects.
- Pre-deploy backup: `/home/gw/backups/gwhyyy/portfolio-pre-outreach-dns-20261029-164646.db.gz`.

### Sender identity and sourcing status

- Legal sender: Mohamed Anas FIKHI, Casablanca, Morocco. Use this in every outreach footer with the unsubscribe link.
- Segments approved: Flutter startups, agencies subcontracting mobile/Flutter, SaaS teams needing API/AI integration.
- Quickmail is **not used** in this application. No code, config, data, or sending path depends on it.
- `exa` is listed as connected in OpenCode, but direct authenticated MCP calls returned HTTP 403. No mass list was imported and no send was attempted. Use Exa from a fresh OpenCode session, or supply a CSV from another source.
