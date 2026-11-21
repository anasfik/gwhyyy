# Outreach service implementation plan

**Goal:** Operate reviewed outreach from the existing dashboard and both MCP transports, with Bulko or standard SMTP behind one provider interface.

**Architecture:** Add an independent mail ledger with immutable recipient and sender snapshots. Keep existing prospect management, transactional Resend notifications, and legacy campaign tables unchanged. A new ledger avoids the legacy tables' cascading deletion and mandatory prospect foreign key, so controlled seed tests do not pollute the prospect list. All consumers call the same authenticated REST service.

## Constraints and rulings
- User requested shipping without further design questions. Only the primary assistant edits files; DeepSeek Free/Go perform read-only research and review.
- Work in the existing feature branch: uncommitted site/MCP changes are prerequisites and must not be discarded, stashed, or committed wholesale. Baseline `npm run typecheck` passed.
- Add only the two approved Cloudflare records; retain existing DMARC, Resend and Zoho records.
- Start paused in test mode. Test allowlist is the two addresses explicitly approved in chat; at most five attempted test messages lifetime.
- Global maximum 15 attempts per UTC day, including tests and follow-ups; domain cap and pause enforced in the same immediate transaction as reservation.
- No prospect sends until qualified, verified address, sourced legal basis, complete sender footer, explicit dashboard approval, and live-mode readiness acknowledgment. Existing 402 prospects remain untouched.
- Bind approval to exact recipient, copy, provider, sender identity, configuration revision and reply-to. Editing invalidates approval. No MCP tool can approve prospect messages.
- Record attempts before network I/O. Unknown outcomes stay `uncertain`; never automatically retry a launch. Accepted/queued is not delivered or inbox placement.
- Never render provider reply HTML. Any received reply stops further cold sends to that address. Suppression is checked immediately before reservation.
- Secrets stay in protected external environment files, never dashboard JSON, client code, MCP output or source. Exposed key rotation remains required.
- Bulko's default domain is an external setting the API cannot verify. Require operator confirmation, preserve this limitation visibly, and do not pretend DNS verifies the From header.
- SMTP is a real alternative using Nodemailer with TLS and certificate validation. SMTP delivery/reply tracking remains manual unless the configured provider supports it.
- No autonomous prospect scheduler, buying, publishing, push or deployment under this local implementation. Request approval immediately before deployment with the tested artifact.

## Tasks
- [x] 1. Provider and ledger: add schema, Bulko/SMTP adapters, settings, drafts, approval, transaction-safe dispatch, polling, durable reply/suppression records. Write failing invariant tests first; run against memory/temp databases only.
- [x] 2. REST and MCP: authenticated state/action routes, same-origin mutation guards, body limits, shared MCP definitions for new tools across remote and stdio; read-only tools cannot send. Test transport parity and unauthorized routes.
- [x] 3. Dashboard: preserve existing colors/type/spacing. Add mail operations page and prospect links, readiness and pause, plain-text draft preview, explicit approval/send confirmation, durable statuses, replies and suppression. Mobile and keyboard checks.
- [x] 4. Operations: deployment complete; Gmail/Zoho delivery and authentication verified; manual reply review path implemented. Live prospect mode still requires corrected postal address, legal acknowledgment, qualified batch and approved copy. Protected environment wiring, approved DNS verification, documentation, controlled seed tests only after Bulko default domain confirmed. Build, lint, tests, DeepSeek Go independent review. Report blockers honestly; no implicit live rollout.

## Review focus
1. Concurrent dispatch or repeated requests cannot exceed caps or submit one draft twice.
2. Email edit, deleted prospect or changed provider cannot redirect an approved message or erase send history.
3. Timeout, malformed 202, partial reply pagination, provider outage or pause fails closed without automatic resending.
4. Replies and unsubscribe stop future sends independent of provider; untrusted reply text stays inert.
5. Missing secrets, unconfirmed external sender default, or missing legal inputs block sends without leaking configuration.

## Progress
- Research complete: both DeepSeek specialists returned integration and data-safety evidence.
- Cloudflare added `bk1._domainkey.outreach` TXT and DNS-only `bnc.outreach` CNAME. Public resolver 1.1.1.1 returned both correctly. Existing DMARC and Zoho MX preserved.
- Context7 has no Bulko library; canonical provider OpenAPI and official Nodemailer documentation used instead.
- Twenty tests, typecheck and lint pass; production dependency audit reports zero vulnerabilities. Next.js updated to 16.4.3 within existing major range. Patched SMTP transport uses Nodemailer 10.3.1 through an npm alias, avoiding NextAuth's outdated optional peer.
- Fresh-database production build passes. A parallel-build WAL initialization lock was reproduced and fixed by setting busy timeout before journal mode.
- Running standalone artifact on loopback with a separate SQLite DB: authorization, same-origin rejection, human-only live approval, required send hash, scanner-safe/idempotent opt-out, and equal 23-tool remote/stdio catalogs pass. No real mail sent. Bulko read-only API still reports 500 email / 50 AI credits.
- Dashboard rendered at 1440x900 and 390x844 with no horizontal page overflow; visible keyboard focus, zero page errors, zero axe violations within the new main region. Actual screen-reader and inbox placement checks remain unperformed.
- DeepSeek Free supplied integration research; DeepSeek Go supplied data audit and independent code review. No child edited files. Initial review and both scoped re-reviews approved the implementation without blocking findings.
- User confirmed Bulko domain verification. Production app remains on the prior image, all 402 prospects unchanged. Deployment and remote MCP credential renewal require immediate explicit approval. Seed delivery/reply tests are pending rollout so unsubscribe URLs resolve publicly.
- Docker/Node 22 release image `sha256:08a11b2e63df68e71dc13518c131f92c079dc76391bac565027dc0c0817033db` built successfully and passed isolated container/browser/API/MCP smoke checks. Its image has no `.env.production` file. Smoke container stopped after checks; no test service left running.
- Prior production image retained as `gwhyyy-app:pre-outreach-20261030` (`sha256:b5f3e6a698af68dd3ffb67804a8d816c1296ff6beb11fb3334e3541f2f2d9886`). Do not run image pruning during release.
- Full dependency audit still reports two development-only advisories (`zod`, `postcss-selector-parser`); production dependency audit is clean. No screen-reader run, live SMTP transport test, verified inbox placement or reply roundtrip has been claimed.
- Released 2026-10-30 with native SQLite backup (`portfolio-pre-email-service-20261030-195052.db`, integrity OK). Two owner-controlled seed emails were each attempted once through Bulko (campaigns 2460/2461), provider reports completed/sent with 0 failed/bounces; dispatch returned to paused/test mode. Remote MCP token `outreach-admin-20261030` expires 2026-11-29; OpenCode server `gwhyyy-admin` connected. Remaining owner checks: corrected postal code (20100 is Casablanca/Maarif; Dar Bouazza is 27223), legal acknowledgment, qualified recipients and per-prospect copy. Automatic reply ingestion remains optional; manual review path is live pending deployment.
