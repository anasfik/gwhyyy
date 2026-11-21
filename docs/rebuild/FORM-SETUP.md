# Inquiry form setup and operations

## What the form does

`/contact` is a single-step, service-aware inquiry. It posts JSON to `/api/contact`.

Required fields:

- Full name
- Email address
- Service (one of four categories or Other / not sure)
- Project stage (new idea, existing product, existing system with a problem, not sure)
- Project description (20–5,000 characters)

Optional fields:

- Company or project name
- Company website (validated `http`/`https` URL)
- Desired start timeframe
- Preferred contact method (Email, Video call, Either)
- Additional context

No budget, price, rate, or project-size field exists in the UI or the request schema.

## UX behaviour

- Service buttons are native radios styled as selected panels. `?service=<slug>` preselects one.
- Case-study CTAs add `&from=<project-slug>`; the form shows the referring case study and stores it.
- Native HTML validation catches missing/invalid inputs before the request.
- The submit button enters a disabled “Sending…” state with `aria-busy`.
- Success replaces the form in place with a `role="status"` panel, then scrolls it into view.
- Failure shows an inline `role="alert"`, keeps every entered value, and offers the direct email fallback.
- The optional block is a native `<details>` element; no multistep wizard.
- The form does not reset on error. “Send another inquiry” explicitly resets it and rotates the submission id.

## Server flow

`app/api/contact/route.ts`:

1. Requires `Content-Type: application/json`.
2. Rejects a mismatched `Origin` when present.
3. Rejects request bodies over 30 KB by `Content-Length`.
4. Rate-limits per hashed IP: 5 submissions per hour, SQLite-backed. Returns `429` with `Retry-After: 3600`.
5. Parses the body; invalid JSON and non-objects return `400`.
6. Honeypot (`website`) or a submission completed in under 800 ms is absorbed with `201 {ok:true}` but not stored or emailed.
7. Validates service and stage against the current site allowlists, email format, URL protocol, description length, and contact method.
8. Looks up `submission_id`; a repeat returns the original id with `200` and does not insert or email again.
9. Inserts the lead into SQLite with `email_status = 'pending'`.
10. Sends an optional Resend email. The result is stored as `sent`, `failed`, or `not_configured`; failures are logged without lead content.
11. Records the first-party `inquiry_submitted` event with path `/contact` and the referring case study (if any). No PII is written to analytics.
12. Returns `201 {ok, id, notified}`.

The success message is honest: the inquiry is stored first. Email is a notification layer, not the only delivery. If email is not configured, the lead is still available in the admin dashboard. The API does not claim an email was sent unless Resend accepted it (`notified: true`).

## Database

`contacts` gained nullable columns through idempotent migrations in `lib/db.ts`:

```sql
service TEXT
stage TEXT
company TEXT
company_website TEXT
timeframe TEXT
contact_method TEXT
source TEXT
submission_id TEXT
email_status TEXT
notified_at TEXT
```

A partial unique index prevents duplicate submission ids:

```sql
CREATE UNIQUE INDEX IF NOT EXISTS idx_contacts_submission
ON contacts(submission_id) WHERE submission_id IS NOT NULL;
```

`budget` remains in the table only for historical rows. It is no longer collected, validated against public bands, displayed in the public form, or shown as a current field in the dashboard.

## Environment variables

Set these on the server, never in Git:

```bash
RESEND_API_KEY=re_...
CONTACT_FROM_EMAIL=portfolio@flutterguard.dev
CONTACT_TO_EMAIL=work@gwhyyy.com
```

- `RESEND_API_KEY` optional. Without it, leads are stored and `email_status = 'not_configured'`.
- `CONTACT_FROM_EMAIL` must be on a domain verified in Resend. Production currently uses `portfolio@flutterguard.dev` because `gwhyyy.com` is not verified in that Resend account. The fallback `onboarding@resend.dev` is for development only and may be rejected by Resend for production recipients.
- `CONTACT_TO_EMAIL` falls back to the site's `personal.email` (`work@gwhyyy.com`).

The existing `.env.example` documents admin auth and NextAuth separately. Keep production secrets in `.env.production` or the container environment.

## Local test procedure

With the dev server running:

```bash
NOW=$(( $(date +%s%3N) - 5000 ))
curl -i http://localhost:3210/api/contact \
  -H 'Content-Type: application/json' \
  -d "{\"name\":\"QA Test\",\"email\":\"qa@example.com\",\"service\":\"ai-engineering\",\"stage\":\"new-idea\",\"description\":\"Test inquiry with enough detail to pass validation.\",\"submissionId\":\"qa-$(date +%s)\",\"submittedAt\":$NOW}"
```

Expected: `201`, `{ "ok": true, "id": ..., "notified": false }` when Resend is not configured.

Verify the row and the analytics event:

```bash
node -e "const db=require('better-sqlite3')('data/portfolio.db'); console.log(db.prepare('SELECT id,name,email,service,stage,source,email_status FROM contacts ORDER BY id DESC LIMIT 1').get()); console.log(db.prepare(\"SELECT name,path FROM events WHERE name='inquiry_submitted' ORDER BY id DESC LIMIT 1\").get());"
```

Duplicate check: send the same `submissionId` twice. The second response is `200 { duplicate: true }` and only one row exists.

Validation check: send an invalid email or unknown service *with* a fresh `submittedAt`. Expected `400`. Without `submittedAt`, the bot guard intentionally returns `201` without storing — that is not a validation pass.

Rate limit: the sixth request from the same IP within an hour returns `429`.

## Production setup checklist

1. Create/verify the sending domain in Resend.
2. Set `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, `CONTACT_TO_EMAIL` on the server.
3. Rebuild and restart the container.
4. Submit one real test inquiry from a separate network/IP.
5. Confirm all three: dashboard row, `email_status = 'sent'`, and inbox receipt.
6. Check the Resend dashboard for a delivered event. A `200` from the API only proves Resend accepted the message.
7. If delivery fails, inspect server logs for `Inquiry email notification failed` and the Resend response status. The lead remains in the dashboard.

**Current status (29 October 2026):** production delivery is verified end to end. Steps 1–3 were completed with the supplied Resend key; the key is stored only in `.env.production` (mode `600`) and the container environment. A real submission returned `201 {ok:true,id:8,notified:true}`, the success panel rendered, and the database recorded `email_status='sent'` with `notified_at='2026-10-29 03:43:42'`. Resend email `01a185c1-a1c5-730e-8792-44f70e17ca49` went from `portfolio@flutterguard.dev` to `work@gwhyyy.com` and reports `last_event='delivered'`. The local failure-path test used an invalid Resend key and confirmed the lead is retained with `email_status='failed'` when Resend returns `401`.

**Sender domain:** `gwhyyy.com` is not verified in this Resend account, so notifications use `portfolio@flutterguard.dev` with `reply_to` set to the inquirer. Verifying `gwhyyy.com` in Resend (DNS records) and changing `CONTACT_FROM_EMAIL` is the remaining cosmetic step; delivery already works.

## Privacy and analytics

- The stored inquiry is used to respond to the request and manage the conversation.
- No inquiry fields are sent to analytics.
- Client-side events respect Do Not Track.
- `/privacy` documents the data, retention, email provider, Calendly link, and deletion route.
- The honeypot field is visually hidden, excluded from tab order, and never displayed to users.
