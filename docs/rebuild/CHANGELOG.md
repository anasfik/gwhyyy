# Changelog — rebuilt freelance site

**Branch:** `feat/rebuild-freelance-site` (from `main`; no commits or pushes).

## Deployment

Deployed to the production host on **29 October 2026** with `docker compose build --no-cache app` and `docker compose up -d app`; a follow-up deploy added the 410 route and a later deploy added the outreach dashboard and prospects API. On **3 November 2026** the app was rebuilt with `docker compose build app` and recreated with `docker compose up -d app` to add the FlutterGuard case study as project 02. Production content was updated through `/api/content` from version 2 to version 3, preserving all prior fields; the pre-change document is `/tmp/opencode/prod-content-before-flutterguard.json`. The previous image is tagged `gwhyyy-app:pre-flutterguard-20261103` for rollback. Production QA ran at 1440/390 px on `/work`, `/work/flutterguard`, `/about`, the sitemap and the OG image; no failed asset responses. The SQLite volume `gwhyyy_sqlite_data` was preserved. No DNS, nginx, or remote repository changes were made.

## Routes introduced

| Route | Purpose |
| --- | --- |
| `/services` | Four service categories |
| `/services/product-engineering` | Product engineering detail + inquiry preset |
| `/services/integrations-infrastructure` | Integrations & infrastructure detail |
| `/services/ai-engineering` | AI engineering detail |
| `/services/existing-product-development` | Existing product development detail |
| `/work` | Six-project index |
| `/work/reqistry` | Flagship case study |
| `/work/flutterguard` | Production Android security app case study |
| `/work/dart-openai` | SDK case study |
| `/work/gathr` | Production mobile case study |
| `/work/rollee-connect` | Fintech SDK case study |
| `/work/dart-nostr` | Protocol case study |
| `/about` | Positioning, principles, experience, open source, stack |
| `/contact` | Service-aware inquiry |
| `/privacy` | Website privacy notice |
| `/privacy/sandouk` | Existing app policy, unchanged |

## Redirects

Permanent redirects in `next.config.mjs`:

- `/projects` → `/work`
- `/projects/public-apis` → `/work/reqistry`
- `/projects/rollee-sdk` → `/work/rollee-connect`
- `/projects/dart-openai`, `/projects/gathr`, `/projects/dart-nostr` → matching `/work/*`
- `/projects/nostr-mind` → **410 Gone** (explicit route handler, `X-Robots-Tag: noindex`); archived NostrMind revision removed from production SQLite after backup
- `/projects/*` (any other slug) → `404`
- `/hire` → `/contact`

## Removed

- `/hire` page and `/projects` index/detail pages (replaced by redirects).
- Six old service categories and their copy.
- NostrMind from project data, project index, case studies, related links, sitemap, `llms.txt`, `llms.md`, `profile.json`, resume, and structured data.
- Public budget options, budget field, “most MVPs $5–15k” label, and hire FAQ budget answer.
- Old portfolio components: `Hero`, `ProjectsGrid`, `ProjectCard`, `ProjectVisual`, `ServicesGrid`, `EngineeringDepth`, `ProcessSteps`, `ExperienceSection`, `OpenSourceSection`, `FaqSection`, old `ContactForm`.
- “Reply within 48 hours” and undated metric claims.
- Fixed dark-only homepage visual system.

## Added or changed

### Pages and components

- `app/page.tsx` — new homepage with required positioning, four services, five projects, problem prompts, process, about, FAQ, final CTA.
- `app/services/**`, `app/work/**`, `app/about`, `app/contact`, `app/privacy` — new routes.
- `components/layout/SiteShell.tsx` — shared public chrome.
- `components/site/ContactForm.tsx` — single-step service-aware inquiry with scroll-to-state and preserved input.
- `components/site/ProjectCard.tsx`, `components/site/Monogram.tsx`.
- `components/layout/Nav.tsx` — light sticky nav, three links, one CTA, mobile menu without an effect-driven state update.
- `components/layout/Footer.tsx`, `app/not-found.tsx`, `app/error.tsx` — light theme and new routes.
- `app/resume/page.tsx` — five projects, new routes, print styling.
- `app/opengraph-image.tsx`, `app/work/[slug]/opengraph-image.tsx`, icons, manifest — new identity and light/dark-appropriate colors.

### Content and SEO

- `config/site.ts` — schema 4 content: four services, five projects, required hero copy, metrics with sources and dates, FAQ, privacy, form options. `budgetOptions` removed.
- `lib/site-content.ts` — content schema migration. Stored schema <4 is archived to `site_content_revisions` and replaced with the new default document.
- `lib/public-profile.ts` — `/work` case-study URLs and new service URLs.
- `app/sitemap.ts` — services, work, about, contact, privacy.
- `app/layout.tsx` — light theme, service catalog structured data, global page tracker.
- `app/robots/route.ts` now emits valid per-agent `User-agent` groups instead of one bracketed list; still disallows dashboard/login/API and points at the sitemap.
- SEO titles trimmed to one-line lengths; homepage description shortened to 157 characters; services/work/contact titles now carry search intent.
- `docs/rebuild/SEO-AUDIT.md` and `docs/rebuild/GOOGLE-SEARCH.md` added.

### Outreach dashboard

- `prospects` and `prospect_activities` tables in `lib/db.ts`, idempotent schema, unique `external_id` and email.
- `/api/prospects` (list, create/upsert, patch, delete) and `/api/prospects/[id]/activities`.
- `/api/prospects/import` accepts CSV or JSON; `/api/prospects/export` escapes spreadsheet formulas.
- Bearer auth through `OUTREACH_API_TOKEN`, alongside the existing admin session. Timing-safe compare; disabled when unset.
- `/dashboard/prospects` with stage filters, follow-ups due, CSV import, manual add, detail panel, and activity log. Nav and overview counters added.
- `lib/csv.ts` parser and writer; the leads CSV export now reuses it.
- Contract: `docs/rebuild/OUTREACH.md`.

### Inquiry backend
- `app/api/contact/route.ts` — origin check, size cap, rate limit, honeypot/timing, enum validation, idempotency, structured fields, delivery status, no PII in analytics.
- `lib/db.ts` — new contact columns and unique submission index.
- `components/site/ContactForm.tsx` — service/stage required, optional disclosure, accessibility, error preservation, success scroll.
- `app/api/messages/route.ts`, `app/api/messages/export/route.ts`, dashboard — new fields, service/stage display, budget removed from current UI, CSV columns updated.
- `components/dashboard/ContentManager.tsx` — no budget options card; new service fields; `/work` preview and links.
- `app/dashboard/page.tsx`, `app/dashboard/messages/page.tsx`, `app/dashboard/layout.tsx` — updated links, fields, inherited dark text.

### Assets

- `public/work/reqistry-web.webp`, `reqistry-compare.webp`, `reqistry-api.webp`, `reqistry-app.webp`, `reqistry-mark.svg`
- `public/work/dart-openai.webp`, `dart-nostr.webp`, `gathr.webp`, `rollee.webp`

All are real public-screen captures or official project assets, taken 28 October 2026. No generated product screenshots.

## Behaviour changes

- Public content is read from SQLite on a 300-second revalidation window (case studies and service details are request-rendered).
- Content schema migration runs on the first read after deploy. The previous document is preserved in revisions.
- Inquiry writes no longer accept a budget. A submitted `budget` field is ignored.
- Email notification failure no longer changes the HTTP success into a lie; the lead is stored and `email_status` records the outcome.
- Production Resend delivery verified 29 Oct 2026 (`email_status='sent'`, Resend `delivered`).
- Duplicate submissions with the same `submissionId` return the existing lead.
- Analytics event names change from `contact_submit` to `inquiry_submitted` for confirmed writes. The submit button no longer emits a click event that can be confused with a lead.
- Nav availability text removed from desktop to keep the bar to one line; availability remains in the mobile menu, homepage, and contact page.

## Local test data

Browser/API QA created local SQLite rows (`QA Test`, `QA Duplicate`, `QA Success Two`); they were removed before handoff. Production QA created row id 8 (`Resend Delivery Test`) and one `inquiry_submitted` event as delivery evidence; both remain, clearly labelled, and can be deleted from the dashboard. Production content cleanup removed the archived NostrMind revision after a `VACUUM INTO` backup at `/home/gw/backups/gwhyyy/portfolio-db-20261029-025030.db.gz`.

## Pre-existing changes preserved

The working tree already contained uncommitted edits to `app/globals.css`, `app/page.tsx`, `app/projects/*`, `app/resume`, old contact/components, `config/site.ts`, `tailwind.config.ts`, and `package-lock.json`. The rebuild replaces the affected public surfaces but preserves the intent of the earlier `revalidate` change (now 300 seconds) and does not revert `package-lock.json`. Deployment was local to the production host; no remote repository write was performed.
