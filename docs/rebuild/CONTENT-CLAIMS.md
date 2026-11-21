# Content claims and evidence

**Rule:** every public factual claim is either (a) verified from source, (b) observed on a public surface on a stated date, (c) the owner's stated role or availability, or (d) removed. No metric is inferred.

## Identity and positioning

| Claim | Evidence | Status | Location |
| --- | --- | --- | --- |
| Mohamed Anas Fikhi is an independent software engineer and product builder | Owner instruction; repository and public profiles | Owner-stated | Global |
| Based in Casablanca, working remotely worldwide | Existing site config and owner instruction | Owner-stated | Global |
| Builds products, integrations, AI features, backend systems, SDKs, and Flutter apps | Portfolio, packages, and project evidence below | Supported | Home, services, about |
| Available for selected projects | Owner instruction; existing availability flag | Owner-stated | Nav, home, contact |

## Projects

### Reqistry

| Claim | Evidence | Status |
| --- | --- | --- |
| API intelligence platform for discovering, comparing, monitoring, and connecting APIs and MCP tools | `reqistry.dev`; `reqistry-backend/PROJECT_SPEC.md`, `README.md` | Verified |
| 3,090 APIs across 72 categories | Live `reqistry.dev` homepage and `/llms.txt`, 28 Oct 2026 | Verified, dated |
| 5K+ Google Play downloads, 4.6 from 66 reviews | Google Play listing, 28 Oct 2026 | Verified, dated |
| 16 MCP tools | 16 `server.tool(...)` registrations in `apps/mcp/src/index.ts` | Verified |
| 8 weighted trust factors | `packages/contracts/src/index.ts:277-344` | Verified |
| 45 Prisma models | `packages/database/prisma/schema.prisma` model count | Verified |
| 48 backend test files | `find ... -name '*.test.ts'` count, excluding node_modules | Verified |
| Web app, Fastify API, PostgreSQL, Redis, BullMQ worker, Next.js, Flutter Android | Monorepo source and production health endpoint | Verified |
| Hourly health probes, 6-hour metadata/trust refresh, 12-hour backups | `apps/worker/src/index.ts:522-535` | Verified |
| Product owner and engineer | Workspace instructions; 87/115 commits by `work@gwhyyy.com`; product published under Gwhyyy | Owner-stated + repository evidence |
| Android client published under Gwhyyy | Play Store listing | Verified |
| Android implementation details | Flutter source unavailable in workspace | **Not claimed** |
| Current "3,500+ APIs" | Google Play copy, stale vs live 3,090 | **Not used** |
| Docs canonical/robots issues fixed | Known defect remains in `apps/docs/src/app/layout.tsx` | **Not claimed** |

### Dart OpenAI

| Claim | Evidence | Status |
| --- | --- | --- |
| Typed Dart/Flutter SDK for OpenAI and compatible providers | GitHub README, pub.dev package page | Verified |
| 664 GitHub stars, 231 forks | GitHub API, 28 Oct 2026 | Verified, dated |
| 576 pub.dev likes, 160/160 pub points, 18k downloads | pub.dev page, 28 Oct 2026 | Verified, dated |
| v8.0.0 | pub.dev page | Verified, dated |
| Creator and maintainer | GitHub repository ownership, pub.dev publisher | Verified |
| "Full API coverage" | Package README lists Responses, Chat, Realtime, Videos, Batch, fine-tuning, vector stores, evals, administration | Supported by docs; not independently exercised |
| Tests pass | pub.dev displayed a failing tests badge on 28 Oct 2026 | **Not claimed** |

### Gathr

| Claim | Evidence | Status |
| --- | --- | --- |
| Live social product for community fundraising and impact | `gathr.gives`, App Store/TestFlight and Google Play links | Verified |
| Flutter client, event-driven state, Node.js, Firebase, Linux | Owner resume and existing site content; public product | Owner-stated + public product |
| Dec 2023 – Sep 2025, remote | Owner resume | Owner-stated |
| Specific internal architecture, customer data, metrics | Not public | **Not claimed** |

### Rollee Connect SDK

| Claim | Evidence | Status |
| --- | --- | --- |
| Flutter SDK for Rollee employment/income data | `pub.dev/packages/getrollee_flutter_sdk` | Verified |
| v2.0.1 published | pub.dev, 28 Oct 2026 | Verified, dated |
| 2023 engagement, Flutter SDK engineer | Owner resume | Owner-stated |
| Sole engineer / all later versions | Not proven; later versions may be team work | **Not claimed** |
| Internal API, security implementation, customer data | Confidential | **Not claimed** |

### Dart Nostr

| Claim | Evidence | Status |
| --- | --- | --- |
| Pure-Dart Nostr SDK | `pub.dev/packages/nostr`, GitHub README | Verified |
| 51 GitHub stars, 18 forks | GitHub API, 28 Oct 2026 | Verified, dated |
| 25+ NIPs | Package README and pub.dev description | Verified as documented |
| v11.0.0 | pub.dev | Verified, dated |
| NIP-44 v2 passes official test vectors | Package README | Owner/package claim; not re-run here |
| Creator and maintainer | GitHub repository ownership, pub.dev publisher | Verified |

## Services

| Claim | Basis |
| --- | --- |
| Product engineering: SaaS, web/mobile apps, MVPs, features | Work history and projects |
| Integrations & infrastructure: APIs, SDKs, backend, MCP, realtime, automation | Reqistry, Dart OpenAI, Rollee, Dart Nostr |
| AI engineering: LLM integrations, AI features, agents, reliability | Dart OpenAI, Reqistry trust/metadata work, owner experience |
| Existing product development: debugging, modernization, features, ongoing work | Stated service scope |
| Example engagements | Explicitly labelled as examples, not client case studies |

## Metrics strip

Dated 28 October 2026:

- `3,090` — Reqistry APIs tracked.
- `664` — Dart OpenAI GitHub stars.
- `18k` — pub.dev downloads shown for `dart_openai`.
- `5K+` — Reqistry Google Play downloads.

Source labels are rendered under each value. They are not presented as growth or revenue metrics.

## Removed or prohibited content

- All budget bands, hourly rates, minimums, “starting from” language, and budget fields.
- NostrMind project, links, metadata, related-project references, résumé entry.
- “666+ stars” (superseded by 664 on 28 Oct 2026).
- “5K+ Play Store downloads” kept but dated; “3,500+ APIs” store copy not used.
- Unsupported “used across the ecosystem”, “reply within 48 hours”, client logos, testimonials, customer counts, revenue, and delivery guarantees.
- Any claim that Reqistry’s Android source was inspected.
- Any claim that Resend production delivery is configured.

## Maintenance

Metrics decay. Any future edit should update the value and its date/source together, or remove the metric. The source strings live beside each metric in `config/site.ts`. Case-study result strings are dated in the same file.
