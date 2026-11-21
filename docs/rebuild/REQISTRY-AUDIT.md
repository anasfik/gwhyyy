# Reqistry technical audit

**Investigated:** 28 October 2026. **Primary source:** local monorepo `/home/gw/apps/reqistry/reqistry-backend` at `staging` (`f58fa64`). **Public sources:** `reqistry.dev`, `docs.reqistry.dev`, `api.reqistry.dev`, `mcp.reqistry.dev`, Google Play listing. **Limitation:** the Flutter client source was not present in the workspace (`apps/reqistry-app` contains only empty `lib/` and `build/` directories). Android capabilities below are verified through the Play listing and the mobile API contract, not by reading client code.

No repositories, services, databases, or accounts were modified.

## 1. Repository and component inventory

The monorepo declares six workspaces:

| Component | Path | Role |
| --- | --- | --- |
| API | `apps/api` | Fastify 5 REST server: legacy mobile routes + v1 platform + admin v1 |
| Web app / admin | `apps/admin` | Next.js app serving the public catalog, search, compare, changelog, submit, docs index, and operator dashboard |
| Docs | `apps/docs` | Standalone Next.js documentation site |
| MCP server | `apps/mcp` | Streamable-HTTP MCP server plus Express discovery/health endpoints |
| Worker | `apps/worker` | BullMQ workers and cron scheduler |
| Shared packages | `packages/{config,contracts,database,logger,validation}` | Environment config, serializers/trust scoring, Prisma client, logging, Zod schemas |

Repository history: 115 commits, 87 authored by `Anas <work@gwhyyy.com>` and 28 by `GW <gw@api-scout.dev>`, starting 3 August 2026. The majority author and the product owner are the same person per the workspace instructions. We do not claim that every line is sole-authored.

## 2. Actual technology stack

- **API:** TypeScript, Fastify 5, Prisma, PostgreSQL, Redis, BullMQ queues, JWT/cookie sessions, API keys, rate limiting, compression, request logging.
- **Web:** Next.js 15, React, Tailwind CSS, server-rendered catalog pages, same-origin `/backend` proxy.
- **Worker:** BullMQ + Redis, Prisma, safe fetch, ntfy admin alerts, scheduled digests and probes.
- **MCP:** `@modelcontextprotocol/sdk`, Express, streamable HTTP, 16 tools, stateless per-request transport (`apps/mcp/src/index.ts:22`, `:255-283`).
- **Database:** PostgreSQL with **45 Prisma models** (`packages/database/prisma/schema.prisma`), including catalog, health history, trust scores, change events, submissions, notifications, projects/folders, bookmarks, watchlists, agent keys, audit logs, and request logs.
- **Mobile:** Flutter/Dart Android client consuming legacy `/v1` and mobile endpoints. Package id `com.gwhyyy.publicApis`, published by Gwhyyy.

## 3. Feature matrix

Status legend: **Verified** = source + public surface; **Partial** = source exists but end-to-end behavior not exercised; **Unverified** = no source or no safe test; **Unavailable** = not found.

| Capability | Status | Evidence |
| --- | --- | --- |
| Searchable API catalog | Verified | `apps/api/src/routes/legacy/search.ts:6`; live `reqistry.dev` search |
| Category browsing with counts | Verified | `apps/api/src/routes/v1/categories.ts`; live category chips (e.g. Maps 105) |
| API detail with health, auth, pricing, CORS, HTTPS, rate limit | Verified | `apps/api/src/lib/api-detail.ts`; `/apis/airbnb-api` rendered 200 |
| Live catalog counts | Verified | 3,090 APIs / 72 categories rendered on `reqistry.dev` and `/llms.txt`, 28 Oct 2026 |
| Compare 2–8 APIs | Verified | `apps/api/src/routes/v1/growth.ts:24-39`; `/compare` 200 |
| Trust score (8 weighted factors) | Verified | `packages/contracts/src/index.ts:277-344`; factors: uptime 25, response 15, docs 15, auth 10, CORS 10, pricing 10, freshness 10, OpenAPI 5 |
| Uptime and latency probing | Verified | `apps/worker/src/index.ts:30-180`; hourly scheduler at `:522` |
| Non-probative probe protection | Verified | `apps/worker/src/index.ts:45-50`; static specs are recorded unknown, not "up" |
| Change feed / changelog | Verified | `apps/api/src/routes/v1/growth.ts:42`; live `/changelog` 200 |
| Health alerts / dedupe / quiet hours | Verified | `apps/worker/src/notifications.ts`, `apps/worker/src/index.ts:280-293` |
| Background metadata refresh | Verified | `apps/worker/src/index.ts:182-260`, 6-hour schedule at `:526` |
| Backup job | Verified | `apps/worker/src/backup.ts`; 12-hour schedule at `:534` |
| Trust-drop and health admin alerts | Verified | `apps/worker/src/trust.ts`, `ntfy-admin.ts` |
| MCP discovery and agent access | Verified | `apps/mcp/src/index.ts`; `mcp.reqistry.dev/health` 200 |
| 16 MCP tools | Verified | 16 `server.tool(...)` registrations in `apps/mcp/src/index.ts` |
| API-key-authenticated agent access | Verified | `apps/api/src/routes/v1/agent-keys.ts`; MCP reads `X-Agent-Key` |
| Web search / category / API pages | Verified | Next.js admin app routes; production 200 |
| Submit API flow | Verified | `apps/admin/src/app/submit`, `apps/api/src/routes/v1/submissions.ts`; submission remains pending review |
| Operator dashboard | Verified | `apps/admin/src/app/dashboard/*` pages for APIs, categories, submissions, jobs, notifications, analytics, audit, backups, users |
| Mobile bookmarks/folders/watchlists | Partial | API routes exist (`bookmarks.ts`, `folders.ts`, `watchlists.ts`); client source unavailable |
| Mobile push notifications | Partial | FCM token routes, notification worker, preferences schema; delivery not exercised |
| Mobile agent keys / MCP connection | Partial | `agent-keys.ts`; Play listing documents Settings → MCP; client source unavailable |
| "Ship check" | Verified in source | `apps/api/src/routes/v1/ship-check.ts` + test; not advertised on the public site |
| Android app distribution | Verified | Google Play: 5K+ downloads, 4.6 from 66 reviews, updated 13 Oct 2026 |
| Android app source | Unavailable | Empty `reqistry-app/lib`; no `pubspec.yaml` found in workspace |
| Billing / paid plans | Unavailable | Play listing says free, ad-supported; `billing-absent.test.ts` asserts no billing |
| Docs page self-canonicals | Partial / defect | Prior audit found docs pages inherit the docs-root canonical (`apps/docs/src/app/layout.tsx:18`). Still present in source at audit time. Not fixed here. |

## 4. System architecture

```text
                      ┌──────────────────────────────┐
  Browser ───────────▶│ Next.js web app (reqistry.dev)│
                      │ catalog / compare / changelog │
                      └──────────────┬───────────────┘
                                     │ same-origin /backend proxy
                                     ▼
  Flutter Android ───▶┌──────────────────────────────┐      ┌──────────────────┐
  (com.gwhyyy...)     │ Fastify API                  │─────▶│ PostgreSQL       │
                      │ legacy /v1 + admin v1        │      │ 45 Prisma models │
  AI agent ──────────▶│ auth, rate limit, cache      │      └──────────────────┘
  (MCP client)        └───────┬──────────────┬───────┘               ▲
                              │              │                       │
                      ┌───────▼──────┐  ┌────▼─────────┐   ┌────────┴────────┐
                      │ Redis cache  │  │ BullMQ queues│──▶│ Worker          │
                      │ + rate limit │  │ health, meta,│   │ probes, trust,  │
                      └──────────────┘  │ trust, notify│   │ digests, backup │
                                        └──────────────┘   └─────────────────┘
                              ▲
                      ┌───────┴──────────────┐
                      │ MCP server           │
                      │ 16 tools, HTTP       │
                      │ mcp.reqistry.dev     │
                      └──────────────────────┘
```

## 5. Data flow

1. **Catalog ingestion.** APIs enter through admin creation, public submissions, imports, or legacy migration. Submissions are queued as `pending` and only become `PUBLISHED` after review (`apps/api/src/routes/v1/submissions.ts`).
2. **Probing.** The scheduler enqueues due health checks hourly. The worker selects `healthCheckUrl` or the API home link, rejects non-probative targets (static spec files, source pages), records status code, latency, TLS validity, consecutive failures, and 24h/7d/30d uptime, and emits `health_degraded` / `health_recovered` change events after repeated failures.
3. **Metadata.** A 6-hour job fetches page metadata with SSRF protections (`safe-fetch.ts`) and records docs/freshness signals.
4. **Trust.** Every 6 hours the worker recomputes eight weighted factors. Unknown signals are excluded and confidence is reported rather than treated as failure. Grade changes or score moves of 10+ create change events and can alert operators.
5. **Read surfaces.** Web, mobile, and MCP all read the same API. Cached reads are invalidated on writes; the web proxy keeps cookies same-origin.
6. **Notifications.** Change events feed device notification rules, quiet hours, per-device dedupe, weekly digests, project summaries, and saved-API health alerts.

## 6. Web application capabilities

Verified from `apps/admin/src/app` and production:

- Landing page with live catalog counts, search, category chips, and three primary actions (browse, connect MCP, submit).
- `/search` with facets: query, category, auth, pricing, alive, sort.
- `/categories/[slug]` and `/apis/[slug]` server-rendered catalog pages.
- `/compare` and `/compare/[pair]` with 2–8 API comparison and stable "x-vs-y" URLs.
- `/changelog` grouped by day: health, pricing, docs, trust, new APIs.
- `/submit` public submission flow.
- `/docs` route into the standalone docs site.
- `/privacy`, `/terms`, contact.
- Operator dashboard for catalog, submissions, reports, categories, jobs, notifications, users, audit, analytics, backups, settings.
- SEO: sitemap generated from every published API plus compare pairs; robots; JSON-LD; OG images.

Known defect carried from the prior production audit: docs subpages declare the docs root as canonical, and the docs sitemap mixes `/api/` pages with a robots disallow. This is a documentation-site issue, not a website case-study blocker; it is recorded as a follow-up rather than silently fixed.

## 7. Android application capabilities

Verified from the Google Play listing and mobile API routes:

- Discovery across AI, agent tools, finance, weather, music, security, productivity, games, health, education, and more.
- Trust signals on each API: live observed health, trust score, auth, pricing, HTTPS, CORS.
- Compare 2–8 APIs side by side.
- Saved APIs and watchlists with daily health digests and trust-drop alerts.
- Projects/folders that group APIs.
- API submission.
- Agent API keys generated in Settings and used to connect agents through MCP.
- Ad-supported free product with Google UMP consent.

Public metrics: **5K+ downloads**, **4.6 rating**, **66 reviews**, updated **13 October 2026**. The listing says "3,500+ APIs"; the live site reported 3,090 on 28 October 2026. The website should use the live figure with a date, not the stale store copy.

Not verified: exact Flutter architecture, state management, offline behavior, release pipeline, Shorebird use, screen count, and client-side tests. The source was not available. Do not publish those details.

## 8. Backend and monitoring capabilities

- Fastify API with authenticated admin v1, legacy mobile compatibility, API keys, sessions, audit logs, request logs, rate limiting, and cache invalidation.
- Prisma schema with 45 models; migrations and seed scripts; OpenAPI contract generation and `verify:contracts`.
- BullMQ queues for health, metadata, backups, notifications, trust scores.
- Worker schedules: health hourly, metadata 6h, trust 6h, backup 12h, plus daily digests and nudges (`apps/worker/src/index.ts:516-570`).
- Reliability helpers: transient job options, safe fetch with SSRF protection, health locks, quiet hours, dedupe keys.
- Test suite: **48 `*.test.ts` files** across API, MCP, worker, contracts, and scripts.
- Production health endpoint reports API, database, and Redis healthy (28 Oct 2026; API uptime 172,452 s at check).

## 9. MCP capabilities

- Endpoint: `https://mcp.reqistry.dev/mcp`, streamable HTTP, stateless transport per request (`apps/mcp/src/index.ts:280-289`).
- Discovery: `/health`, `/server.json`, `/.well-known/mcp/server.json`, `/.well-known/mcp/server-card.json`.
- **16 tools:** `list_categories`, `get_category_apis`, `get_api`, `get_alternatives`, `check_health`, `get_api_trust_score`, `compare_apis`, `assess_api_production_safety`, `suggest_alternatives`, `get_change_feed`, `get_use_case_collections`, `submit_api`, `recommend_apis`, `search_apis`, `get_snippet`, `swap_api`.
- Read tools require no auth; `check_health` and `submit_api` are consequential writes. Agent keys are forwarded as `X-Agent-Key`.
- The server also exposes starter snippets in curl, Python, JavaScript, and TypeScript, and a `swap_api` workflow that combines status, alternatives, and a snippet.

## 10. Verified production surfaces

| URL | Result (28 Oct 2026) |
| --- | --- |
| `https://reqistry.dev/` | 200, 3,090 APIs, 72 categories, 8 trust signals |
| `https://reqistry.dev/compare` | 200 |
| `https://reqistry.dev/apis/airbnb-api` | 200, unique metadata |
| `https://docs.reqistry.dev/` | 200 |
| `https://api.reqistry.dev/health` | 200, `{"status":"healthy", database + redis healthy}` |
| `https://mcp.reqistry.dev/health` | 200, `{"ok":true}` |
| Google Play listing | 200, 5K+ downloads, 4.6/66 |

Screenshots captured for the website: web homepage, compare, API detail, docs, Play feature graphic/app promo. Assets are stored in `public/work/`.

## 11. Ownership and contribution evidence

- Product and repository instructions identify the workspace owner as the product owner.
- Git history: 87/115 commits by `Anas <work@gwhyyy.com>`; 28 by `GW <gw@api-scout.dev>`.
- The public product and Play listing are published under **Gwhyyy**.
- Android client source is missing, so the case study must not claim specific client implementation choices.
- Gathr and Rollee are employer/client work. Only public product facts and the author's stated role may be published; internal architecture, customer data, and proprietary code must not be exposed.

## 12. Available visual assets

Local, captured 28 October 2026:

- `public/work/reqistry-web.webp` — live web homepage.
- `public/work/reqistry-compare.webp` — live compare page.
- `public/work/reqistry-api.webp` — live API detail page.
- `public/work/reqistry-app.webp` — Google Play feature graphic with app screens.
- `public/work/reqistry-mark.svg` — official mark from `reqistry.dev/reqistry.svg`.

No fabricated UI screenshots. Diagrams must be labelled as architecture diagrams, not product screenshots.

## 13. Safe and accurate public claims

**Safe:**

- "Reqistry is an API intelligence platform for discovering, comparing, monitoring, and connecting APIs and MCP tools."
- "3,090 APIs across 72 categories tracked (28 October 2026)."
- "16 MCP tools over streamable HTTP."
- "Trust scores combine eight factors: uptime, response time, docs, auth clarity, CORS, pricing clarity, freshness, and OpenAPI availability."
- "Published Android app: 5K+ downloads, 4.6 rating from 66 reviews."
- "Automated hourly health probes, six-hourly metadata and trust refresh, change feed, backups."
- "PostgreSQL + Prisma, Redis, BullMQ, Fastify, Next.js, MCP."
- "Primary repository author; product published under Gwhyyy."

**Do not claim:**

- "Sole author of every line." (Two commit identities.)
- Specific Android architecture, offline support, or store release process. (Client source unavailable.)
- That every catalog entry is verified or that every trust score is complete. Unknown factors are explicitly modelled.
- Current "3,500+ APIs" (stale store copy).
- Customer counts, revenue, retention, or growth. None were measured.
- Employer internals or confidential implementation details for Gathr or Rollee.
- That docs canonical/robots defects are fixed. They remain a follow-up.
