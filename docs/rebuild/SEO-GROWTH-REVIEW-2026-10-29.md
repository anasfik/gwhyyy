# GWHYYY search-to-lead review

Status: audit in progress. No production changes authorized by this review.

## Work ledger

- [x] Load SEO/Google-data workflows and check current tool availability.
- [x] Launch three read-only specialists: technical search access, buyer intent, Google MCP availability.
- [x] Inspect first-party tracking and query aggregate production data read-only.
- [x] Integrate specialist evidence and recheck recommended targets.
- [x] Save live GSC/GA findings and outreach readiness gates.
- [x] Verify report accuracy; external decisions are listed below.

## Evidence captured by coordinator

Snapshot: 2026-10-29 16:09:21 UTC. Rolling 28-day first-party SQLite data, not GA4.

| Measure | Observed | Limitation |
| --- | --- | --- |
| Recorded pageviews | 407 | Not sessions or unique people; includes internal/QA activity |
| Pageviews dated 29 October | 177 | Launch/QA day; attribution does not identify all QA requests |
| Google-referrer pageviews | 11 | Referrer heuristic, not GSC clicks or GA4 organic sessions |
| Empty-referrer pageviews | 384 | Unknown origin; cannot classify all as direct traffic |
| Contact rows | 4 | Includes known QA row id 8; remaining rows not validated as qualified leads |
| `inquiry_submitted` events | 1 | Known delivery test; no proven post-rebuild organic inquiry in this snapshot |
| `contact_submit` events | 5 | Legacy event, not interchangeable with a confirmed stored lead |
| Outbound prospects | 0 | Tracking system exists; no sourced account pipeline yet |

Access checks:

- `opencode mcp list` in the application directory: no MCP servers configured.
- The SEO Google helper detects application-default credentials, but real GSC API requests fail. Listing sites explicitly returns HTTP 403, `insufficientPermissions`, with "Request had insufficient authentication scopes."
- The helper's search-query response contains placeholder zero totals and `totals_complete: false` alongside an error. These are **not** measured zero impressions/clicks.
- No GA4 property ID configured in the SEO helper. Homepage HTML has no `G-...`/`GTM-...` IDs or external Google tag scripts. This does not prove that no GA4 property exists elsewhere.
- No OAuth flow, account changes, sitemap submission, remote configuration writes, or campaign sending performed.

Measurement defects confirmed in code:

1. `app/api/analytics/route.ts:25-64` divides contact rows by pageviews. `app/dashboard/analytics/page.tsx:50` calls the result "visitor → lead". No unique-visitor/session denominator exists.
2. `components/portfolio/PageTracker.tsx:20` records pathname and `document.referrer`, not campaign parameters. `app/api/contact/route.ts:137` only accepts a project slug in `source`; campaign-to-lead attribution is absent.
3. `components/portfolio/PageTracker.tsx:6-20` has no explicit QA/admin exclusion for visits to public pages. `app/api/track/route.ts:24` excludes dashboard paths, not an admin browsing the public site.
4. The inquiry UI treats any successful HTTP response as success (`components/site/ContactForm.tsx:107-108`), while bot absorption intentionally returns success without a stored id (`app/api/contact/route.ts:118-120`). A future GA4 `generate_lead` event must require a new stored lead, never merely an HTTP 201 or submit click.

## Guardrails

- Goal: qualified inquiries, calls, and won work, not guaranteed rankings or offers.
- Preserve five projects, four services, current routes, no public pricing/budget collection, and truthful project evidence.
- Keep OAuth credentials and raw private reports outside the repository. Publish only aggregated evidence here.
- No bulk content, fake testimonials, paid-link schemes, or unsupported AI-visibility promises.
- Connect and verify analytics before choosing changes based on nonexistent query/session data.

## Live Google data (MCP retest)

MCP servers in global `~/.config/opencode/opencode.jsonc` are connected:

| Server | Tools | Access test |
| --- | --- | --- |
| `gscServer` | 21 | `list_properties` returned owner access to `sc-domain:gwhyyy.com` |
| `google-analytics` | 9 | property `297158523` (`gwhyy-657bc`) visible |

The current OpenCode session's Code Mode catalog does not expose these tools; the retest used the configured local stdio servers directly. A fresh session or `/reload` should expose them. No duplicate server was added.

GSC, 2026-10-01 to 2026-10-29:

- 5 clicks, 58 impressions, 8.6% CTR, average position 5.4.
- Five queries, all Dart/OpenAI developer intent (`dart vs openai api`, `open ai dart`, `openai_dart`). Zero buyer-intent queries.
- Nine pages with impressions: homepage (3 clicks), legacy `/projects/*` pages, `/hire`, `/resume`. The `/projects/*` and `/hire` URLs now redirect; Google still reports the old URLs.
- Sitemap valid, last downloaded 2026-10-26, **11 indexed URLs of 17**.
- This is a package/developer audience, not a client-acquisition audience.

GA4 property `297158523` returns zero rows for sessions, landing pages, and events over 28 days. The site has no GA4 tag; only first-party tracking exists. GA4 MCP access works, but the property is not collecting this site's traffic.

## Outreach scale and AI-sending readiness

Current state: `prospects` exists with 0 rows; import accepts 500 rows per request; there is no sending, suppression list, unsubscribe flow, email verification, campaign table, or approval queue. That is not safe for massive cold outreach.

Required before any bulk send:

1. **Separate sending domain.** Verify `outreach.gwhyyy.com` (or similar) in Resend with DKIM, SPF, MX, and DMARC. Keep Zoho mail and the inquiry sender separate. Warm up; plain text; no open/click tracking by default.
2. **Suppression and unsubscribe.** Store hashed suppression entries; every message needs a working one-click unsubscribe, `List-Unsubscribe` headers, and immediate stop on reply, bounce, or complaint.
3. **Lawful basis and identity.** Record source, date, and basis for every record. Include a real postal identity. No purchased or scraped lists without a documented basis; check GDPR, PECR/UK, and CAN-SPAM per recipient country.
4. **Verification and dedupe.** Email verification status, normalized domain, duplicate detection, role-based and generic-address filtering, and hard-bounce suppression.
5. **Campaign, message, and approval tables.** AI drafts go to a review queue. A human approves each batch. A send worker enforces per-domain caps, daily limits, and stop rules. The MCP token must not be able to send directly.
6. **Reply and deliverability loop.** Resend webhooks for delivered/bounced/complained; reply detection; weekly metrics. Stop sending on complaint rate above 0.1% or bounce rate above 2%.
7. **Scale.** SQLite is adequate for 100k prospects with indexes and batched imports; do not migrate databases before volume proves the need. Back up the volume before bulk loads.

Proposed segments: (a) seed to Series A startups with a live Flutter app, (b) agencies subcontracting mobile/Flutter work, (c) SaaS teams adding an API or AI integration. "Massive" without segment-specific evidence will lower reply quality and damage the domain.

No bulk data was imported and no cold email was sent in this review.
