# QA report

**Date:** 29 October 2026. **Build:** Next.js 16.3.6. **Branch:** `feat/rebuild-freelance-site`. **Production deployment:** deployed to `https://gwhyyy.com` on 29 October 2026; app container healthy.

## Post-deployment production checks

- **51/51** checks at 1440, 768, and 390 px: all 17 public routes return 200, zero horizontal overflow, zero console errors, self-canonicals present, no noindex, no public pricing strings.
- **51/51** image checks after scrolling: every image decodes with non-zero dimensions and alt text.
- `/projects/nostr-mind` returns **410 Gone** with `X-Robots-Tag: noindex`. The retired slug is not redirected to a generic work page.
- `/projects`, `/projects/public-apis`, `/projects/dart-openai`, `/projects/gathr`, `/projects/dart-nostr`, `/projects/rollee-sdk`, and `/hire` return **308** to their mapped routes; unknown `/projects/*` returns 404.
- The archived content revision containing NostrMind was removed from the production database after a consistent `VACUUM INTO` backup at `/home/gw/backups/gwhyyy/portfolio-db-20261029-025030.db.gz`.
- `www` and HTTP return **301** to `https://gwhyyy.com`; HSTS is present.
- Googlebot returns 200. Sitemap contains 17 URLs. Robots emits valid per-agent groups.
- Search Console is verified by DNS TXT, but API/OAuth access is absent. See `GOOGLE-SEARCH.md`.
- Production Lighthouse: **86–92 performance, 100 accessibility, 100 best practices, 100 SEO** across two valid runs; LCP ~1.1s, CLS 0, TBT 360–550ms. The spread is lab CPU variance, not a layout or SEO regression. One later trace failed with `NO_NAVSTART`; that is a Lighthouse trace error, not a site error.
- Production inquiry endpoint returns `400` for invalid required fields without creating a lead. Browser preselection and case-study source attribution pass.
- SQLite volume backup: `/home/gw/backups/gwhyyy/portfolio-db-20261028-231257.tar.gz`.


## Verdict

The rebuilt site passes its local and production release checks, including interactive desktop and mobile browser QA. No horizontal overflow at the three target widths, all 17 public routes return 200, redirects are permanent, the inquiry flow stores and deduplicates correctly, and the production build compiles cleanly.

Email delivery is now verified end to end in production: the lead was stored, Resend accepted the message, and the Resend API reports it as `delivered` (see Inquiry flow).

One thing remains intentionally unverified:

1. **Reqistry Android client internals.** The client source was not in the workspace. The case study claims only what the Play listing and backend contract prove.

## Automated checks

| Check | Command | Result |
| --- | --- | --- |
| TypeScript | `npx tsc --noEmit` | Pass, no errors |
| ESLint | `npx eslint .` | Pass, no warnings |
| Production build | `npm run build` | Pass, all routes generated |
| Start production server | `npm start` | Ready; standalone warning expected because `output: "standalone"` |
| Browser QA | Playwright/Chromium | 51 route/viewport combinations at 3 widths, all 200; interactive nav/menu/form pass |

## Route and responsive matrix

Tested at **1440×950**, **768×1024**, and **390×844**:

`/`, `/services`, `/services/product-engineering`, `/services/integrations-infrastructure`, `/services/ai-engineering`, `/services/existing-product-development`, `/work`, `/work/reqistry`, `/work/dart-openai`, `/work/gathr`, `/work/rollee-connect`, `/work/dart-nostr`, `/about`, `/contact`, `/resume`, `/privacy`, `/privacy/sandouk`.

- All returned **200**.
- `document.documentElement.scrollWidth` equalled the viewport at **all 51 checks**. The previous homepage overflow (1,216 px at 390 px) is gone.
- No production console errors or page errors.
- No horizontal overflow in the 768 px tablet pass.
- Lazy project images were verified after scrolling; they render correctly.

Screenshots:

Post-deployment screenshots and JSON evidence are in `qa/prod-20261029/` (full-page desktop, tablet, and mobile captures plus `desktop-contact-success.png` and `qa-results.json`).

## Redirects

| Request | Result |
| --- | --- |
| `/projects` | `308` → `/work` |
| `/projects/public-apis` | `308` → `/work/reqistry` |
| `/projects/rollee-sdk` | `308` → `/work/rollee-connect` |
| `/projects/nostr-mind` | `410 Gone`; trailing slash normalizes then 410 |
| `/projects/unknown` | `404` |
| `/hire` | `308` → `/contact` |

All final destinations returned 200.

## Content checks

- Exactly five projects appear on `/work` and in the sitemap.
- `NostrMind` and `nostr-mind` do not appear in any public page, `llms.txt`, `llms.md`, `profile.json`, sitemap, or project data. Remaining “Nostr” strings refer to Dart Nostr, which is required.
- No “starting from”, “per hour”, “budget range”, “most MVPs”, “$5,000”, or “$50,000” strings in the rendered public pages.
- No budget input in the form or request schema.
- Reqistry is first in the work order and has the longest case study.
- Required homepage headline and supporting copy appear verbatim.
- Four service categories render on the homepage, services index, form, sitemap, and structured data.

## Inquiry flow

| Test | Result |
| --- | --- |
| `?service=ai-engineering&from=reqistry` preselects AI Engineering and shows the Reqistry referral note | Pass |
| Empty required fields blocked by native validation | Pass |
| Valid submission (production, 29 Oct 2026) | `201 {ok:true,id:7,notified:false}`; row stored with service, stage, company, website, timeframe, contact method, source, submission id; `email_status='not_configured'` (before Resend was configured) |
| Valid submission with Resend configured (production, 29 Oct 2026) | `201 {ok:true,id:8,notified:true}`; success panel rendered; DB row `email_status='sent'`, `notified_at='2026-10-29 03:43:42'`; Resend email `01a185c1-a1c5-730e-8792-44f70e17ca49` to `work@gwhyyy.com`, `last_event='delivered'` |
| Admin analytics event | `inquiry_submitted`, path `/contact`; no PII |
| Same `submissionId` twice | First `201`, second `200 {duplicate:true}`; exactly one row |
| Invalid required fields with a real `submittedAt` | `400` |
| Rate limit | Sixth request in the hour returns `429` with `Retry-After: 3600` |
| API failure while submitting | Inline error shown; name, description, and service selection preserved |
| Success panel | `role="status"`, “Inquiry received.”, scrolled into view |
| Honeypot or sub-800 ms bot submission | Silently absorbed, not stored or emailed |

**Email delivery is verified.** The production API returned `notified:true`, the database stored `email_status='sent'` with `notified_at`, and Resend reports the message as `delivered`. Sender is `portfolio@flutterguard.dev` because `gwhyyy.com` is not verified in the Resend account; delivery to `work@gwhyyy.com` succeeded. The earlier `not_configured` result was taken before credentials existed. QA row id 8 remains in the production database as evidence and is clearly labelled; delete it when convenient. The five legacy contacts were left untouched.

## Outreach dashboard

Built and verified locally on the production build, then deployed on 29 October 2026.

| Check | Result |
| --- | --- |
| `/dashboard/prospects` without a session | `307` to `/login?callbackUrl=%2Fdashboard%2Fprospects` |
| `/api/prospects` without session or bearer | `401` |
| `/api/prospects` with bearer | `200`; `mcpEnabled:true`; summary shape valid |
| Upsert by `externalId` | Same id, `200`, no duplicate |
| Upsert by email, case-insensitive | Same id, `200`, no duplicate |
| Invalid email / invalid stage | `400` with a specific error |
| CSV import | 5 rows → 3 inserted, 1 updated, 1 skipped (invalid email); quoted comma and embedded newline preserved |
| Import limits | 500 rows, 1 MB; invalid rows skipped with row numbers |
| Activity log | `201`; `email` kind sets `last_contacted_at`; unknown prospect returns `404` |
| PATCH | Stage, follow-up, notes. Clearing the last name/company returns `400` |
| Export | CSV; `=`, `+`, `-`, `@` prefixes escaped with `'` |
| UI add/import/detail/activity | Pass at 1440 px |
| UI mobile | 390 px, `scrollWidth === innerWidth`; card list replaces the table |
| Console errors, production build | Zero |

Screenshots: `qa/prod-20261029/outreach-desktop.png`, `outreach-mobile.png`, `outreach-empty-production.png`. Contract: `OUTREACH.md`.

Deployed to production on 29 October 2026 at 16:07 UTC (`gwhyyy-app` image rebuilt; app container healthy). Pre-deploy SQLite backup: `/home/gw/backups/gwhyyy/portfolio-pre-outreach-20261029-160553.db.gz`.

Production checks after deploy:

| Check | Result |
| --- | --- |
| `/api/health` | `200`; database readable; content v2 |
| `/api/prospects` unauthenticated | `401` |
| `/api/prospects` with bearer | `200`; `mcpEnabled:true`; 0 prospects |
| Create + delete QA prospect | `201` id 1, `200` delete, final total 0 |
| `/dashboard/prospects` unauthenticated | `307` to `/login?callbackUrl=%2Fdashboard%2Fprospects` |
| Public `/`, `/work`, `/contact`, `/sitemap.xml` | `200`; sitemap still 17 URLs |
| `/projects/nostr-mind` | `410` |
| Container logs | no errors |

## Accessibility

- Lighthouse accessibility: **100** after fixing the metric-source contrast (was 96).
- Keyboard order starts with the skip link, then the brand link, Services, Work, About, the primary CTA. Playwright confirmed the skip link receives focus first.
- Visible focus ring is present on every control.
- Desktop navigation clicks resolved to `/services`, `/work`, `/about`, `/contact` with the expected H1s.
- Mobile menu reports `aria-expanded=true`, locks body scroll, closes on Escape, restores scrolling, and navigates to `/work` from its link.
- Form fields use labels above controls, required markers, native validation, and `aria-describedby` for the description hint.
- Status/error regions use `role="status"` and `role="alert"`.
- Reduced-motion media query disables entrance animation and smooth scrolling.
- No colour-only state: selected service changes background, text colour, and the native radio state.

## Performance

Lighthouse, local production server, desktop preset:

| Run | Performance | Accessibility | Best practices | SEO |
| --- | --- | --- | --- | --- |
| First | 97 | 96 | 100 | 100 |
| Final | 91 | 100 | 100 | 100 |

Production runs: FCP 1.0–1.1s, LCP 1.0–1.1s, CLS 0, TBT 360–550ms. Performance scores ranged 86–92; the difference is lab TBT variance. Accessibility, best practices, and SEO stayed at 100. Large screenshots are served through `next/image`; the hero is `priority`; below-fold images are lazy.

## SEO and metadata

- Canonical tags are self-referencing on `/`, `/services`, `/work`, `/work/reqistry`, `/about`, `/contact`, `/resume`, and `/privacy`.
- Sitemap has 17 URLs: home, four services, work, five case studies, about, contact, resume, and both privacy pages.
- Robots.txt disallows `/dashboard/`, `/login`, `/api/`; allows public content; points to the sitemap. The previously bracketed multi-agent `User-agent` line was split into valid per-agent groups.
- Root and per-project OG images return `200 image/png`.
- JSON-LD parses on home, services, service detail, work case study, about, and contact.
- `llms.txt`, `llms.md`, and `profile.json` use `/work/*` URLs and the four services.

## Visual QA and refinements

Issues found in the first browser pass and fixed:

1. Homepage hero had excessive vertical dead space from a `min-height` centering rule. Removed; hero now starts immediately below the nav.
2. Desktop nav was crowded by availability text. Removed from desktop; the status remains on the homepage, mobile menu, and contact page.
3. A black GitHub avatar rendered as a black square. Replaced with a typographic MAF monogram; the source image was deleted.
4. The four-service homepage grid had inconsistent gaps and clipped the first item. Rebuilt as a full-width product-engineering lead plus three equal columns.
5. Project rows had large empty gaps. Added role/period metadata and tightened the image ratio.
6. The success panel could appear above the current scroll position. Added scroll-to-state.
7. Metric source text failed contrast at 11px. Changed from `text-muted/80` to `text-muted`.
8. About header used bottom alignment, leaving the monogram floating. Top-aligned and added location/availability.
9. Mobile project images initially looked blank in a full-page capture. Confirmed to be lazy loading; after a normal scroll they render. No code change needed.

## Remaining issues and manual steps

| Item | Status / action |
| --- | --- |
| Resend production delivery | Verified 29 Oct 2026: `email_status='sent'`, Resend `last_event='delivered'`. Sender is `portfolio@flutterguard.dev`; move to a `gwhyyy.com` sender after verifying that domain in Resend |
| Reqistry Android source | Not available; case study intentionally avoids client-internal claims |
| Docs canonical/robots defect on `docs.reqistry.dev` | Outside this website; recorded in `REQISTRY-AUDIT.md`; not fixed |
| Real-device mobile testing | Not performed; Chromium viewport checks only |
| Admin dashboard visual regression | Not re-reviewed in browser; auth/session not used in QA. Inherited text colour was fixed in code. |
| Lighthouse TBT | 200–390ms across runs; acceptable for this static content site, but revisit if INP degrades under real traffic |
| Unused JS (29 KiB) | Next.js runtime; no custom animation or UI library added |
| Production deployment | Completed 29 October 2026; app healthy |

## Test data cleanup

Local QA rows and rate-limit records were removed after verification so the dashboard does not start with fake leads. The form remains functional; the evidence above records the observed responses and stored field values. The single production delivery test row (id 8) was kept as verifiable evidence of the Resend path.
