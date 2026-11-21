# SEO + Marketing Action Plan — 2026-11-02

Scope: live audit of `https://gwhyyy.com` (GSC, GA4, full URL inspection, 19-page fetch, redirect check) plus read-only review of the current working tree. **No code changes were made.** The site is technically clean; the blockers are discovery latency and demand, not markup.

## Verified state

**Technical — no defects found.**

- 19 sitemap URLs, every one fetched: correct self-canonical, unique title, `index, follow`, one H1, valid JSON-LD.
- `robots.txt` allows all except `/dashboard/`, `/login`, `/api/`; Content-Signal `search=yes, ai-input=yes, ai-train=yes`; sitemap declared.
- 6 legacy redirects all well-formed 308 with correct `Location`: `/projects`→`/work`, `/projects/dart-openai`→`/work/dart-openai`, `/hire`→`/contact`, `/projects/public-apis`→`/work/reqistry`, `/projects/rollee-sdk`→`/work/rollee-connect`, `/projects/nostr-mind`→410.
- Schema graph in `app/layout.tsx`: Person, WebSite, ProfilePage, ProfessionalService + OfferCatalog; per-page Service / CollectionPage / SoftwareSourceCode / FAQPage / BreadcrumbList.
- `llms.txt` (1,152 B) and `llms.md` (7,636 B) both live.

**Search Console, 28 days (2026-10-05 → 11-02).**

| Metric | Value |
|---|---|
| Clicks | 3 |
| Impressions | 73 |
| CTR | 4.11% |
| Avg position | 6.5 |

7 queries, all developer/package intent: `about him?`, `dart vs openai api`, `nostr flutter`, `open ai dart`, `openai api vs dart`, `openai dart`, `openai_dart`. **Zero buyer-intent queries.**

Impressions sit on URLs that now redirect:

| URL | Impressions | Now |
|---|---|---|
| `/projects/dart-openai` | 44 | 308 → `/work/dart-openai` |
| `/projects/dart-nostr` | 21 | 308 → `/work/dart-nostr` |
| `/projects/rollee-sdk` | 15 | 308 → `/work/rollee-connect` |
| `/` | 13 | 200 (last crawled 10-21, pre-rebuild) |
| `/projects` | 11 | 308 → `/work` |
| `/hire` | 9 | 308 → `/contact` |
| `/resume` | 8 | 200 |
| `/projects/gathr` | 7 | 308 → `/work/gathr` |
| `/projects/public-apis` | 7 | 308 → `/work/reqistry` |

**Indexation — the actual blocker.**

Sitemap last downloaded by Google **2026-10-26 09:46**, reporting **11 of 19 URLs indexed**. The rebuild shipped 2026-10-29, after that fetch.

URL inspection, 7 URLs **unknown to Google, never crawled**:

- `/services`
- `/services/product-engineering`
- `/services/integrations-infrastructure`
- `/services/ai-engineering`
- `/services/existing-product-development`
- `/work/dart-openai`
- `/about`

These are the four buyer-intent service pages and the case study that 44 impressions already point at. `/work/reqistry` was crawled 10-31 and its HTML links to all seven, so Google **discovered** them on 10-31. They are queued, not blocked. This is recrawl latency.

Indexed and current: `/work` (10-31), `/work/reqistry` (10-31), `/work/rollee-connect` (10-31), `/work/gathr` (10-30), `/work/dart-nostr` (10-30), `/contact` (10-30), `/resume` (10-30).

**Analytics.** GA4 property `297158523` returns zero rows over 28 days — there is no GA4 tag on the site. Organic search cannot be attributed through GA4. First-party pageview/contact tracking in `app/api/analytics/route.ts` is the only measurement.

## Actions, ranked

**1. Resubmit the sitemap in Search Console** — approval-gated remote write.

This is the one lever that does not require waiting. It prompts Google to re-read all 19 URLs including the 7 unknown ones. Everything else is downstream of indexation.

**2. Re-inspect the 7 URLs in 5–7 days.** Expected transition `NEUTRAL → PASS`. If any is still unknown after 14 days, the cause is no longer latency and needs re-diagnosis.

**3. Do not add more pages until these 7 are indexed.** There is no evidence that page count is the constraint, and adding thin pages on a 19-URL site dilutes rather than helps.

**4. Measurement decision required.** Two options:

- Keep first-party only. Then fix `app/api/analytics/route.ts`, which currently divides contacts by pageviews and labels the result visitor→lead. That number is wrong and will mislead every future marketing decision.
- Install GA4 on `297158523`. Needs a privacy-policy review, since the site already publishes `/privacy` pages.

Do not do both and reconcile later — pick one source of truth.

**5. Content relevance, once indexed.** Service pages link to case studies (`app/services/[slug]/page.tsx` → `/work/{slug}`). Add the reverse contextual links from each `/work` case study to its matching service page with descriptive anchors. Cheap, and it reinforces the service/case-study pairing that buyer queries need.

## Guardrails carried forward

No public pricing. No bulk generated content. No fake testimonials or invented metrics. No paid links. Every claim on a service page must trace to something in `/work` or the public repos.

## Explicitly not done

- No deploy, commit, or push.
- No sitemap resubmit — awaiting approval.
- Core Web Vitals not measured: PageSpeed Insights quota exhausted for the day. Re-run before treating performance as settled.
