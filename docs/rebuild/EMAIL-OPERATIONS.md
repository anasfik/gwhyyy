# Email operations

## What is implemented

`/dashboard/mail`, authenticated `/api/outreach`, and eight additional remote/stdio MCP tools operate one shared `OutreachService`. `EmailProvider` has working Bulko Campaign API and standard SMTP adapters. Change provider and sender settings in the dashboard without changing callers, losing mail history, or moving prospect data.

SMTP uses the patched Nodemailer package under the npm alias `outreach-smtp`; this avoids NextAuth v4's old optional `nodemailer` peer constraint. Authentication still uses the existing credentials/JWT setup. SMTP supports sending and connection verification; reply/bounce tracking is manual unless a future adapter implements polling. It is not a substitute for a provider that permits the intended outreach.

Transactional website inquiries remain on their existing Resend path. No Quickmail dependency. Existing legacy `outreach_campaigns`/`outreach_messages` tables are preserved; the operational ledger is `outreach_mail`, without cascading prospect foreign keys. It also handles seed messages without importing fake prospects. There is no ledger-delete endpoint.

## Secrets and startup

Store credentials in `/home/gw/.config/gwhyyy/email.env`, directory mode 700, file mode 600. Never paste them into dashboard fields or source. Compose loads this file optionally; `OUTREACH_SECRETS_FILE` can point elsewhere. Shell/CLI jobs must export the file variables explicitly or use the guarded `.bashrc` source block.

Bulko requires `BULKO_API_KEY`. SMTP requires `OUTREACH_SMTP_HOST`, `OUTREACH_SMTP_USER`, `OUTREACH_SMTP_PASSWORD`; `OUTREACH_SMTP_PORT` defaults to 587 (also 465/2525). TLS and certificate checks cannot be disabled in the dashboard. Changing a configured key requires service restart; new provider settings invalidate message approvals.

The key supplied in chat is exposed. Rotate it before real outreach; tightening file permissions does not remove historical exposure.

## Initial state and test

Fresh schema starts paused, test mode, no test inboxes and sender unconfirmed. All existing prospects remain unchanged. In the dashboard:
1. Confirm Bulko DNS, save `hello@outreach.gwhyyy.com`, and make `outreach.gwhyyy.com` the default domain **in Bulko**. The current API has no From-address field or default-domain read endpoint. Do not infer this from successful authentication.
2. Allowlist only the owner's approved seed inboxes. Confirm the sender; keep legal clearance unchecked and mode `test`.
3. Save one plain-text draft, preview, approve, then explicitly send once. Maximum five test attempts lifetime; global cap includes them.
4. Compare received From/Reply-To, full SPF/DKIM/DMARC headers, and inbox/spam placement. SMTP/API acceptance is not inbox evidence.
5. Send a real reply from the seed inbox. Sync replies and verify it is retrieved and future cold messages to that address stop. Only then confirm the separate reply-routing checkbox, which is required for live Bulko outreach. A working empty replies API does not establish inbound connectivity. A custom Reply-To mailbox may require external IMAP integration in Bulko; do not assume it is ingested.
6. Unsubscribe uses GET confirmation and a POST mutation, including RFC 8058 POST support. Scanner GETs do not suppress. The token is tied to immutable recipient history, not the prospect's current email.

DNS added with user approval: DKIM selector `bk1._domainkey.outreach` TXT and DNS-only `bnc.outreach` CNAME to `bnc.firelet.net`. Existing monitoring DMARC, Resend selector/bounce records and root Zoho MX are retained. Bulko may falsely label DMARC absent until its own checker refreshes; never create a duplicate DMARC policy.

## Real outreach gates

Explicit human dashboard approval is required for every real message. Each recipient must match a current qualified/contacted prospect with a verified email, source URL, reviewed lawful basis, and no suppression. Publicly listed email is not verification or buying intent. Sender must supply complete usable postal address and confirm applicable legal review. Moroccan/CNDP and recipient-country obligations remain unresolved until reviewed; enabling a checkbox is the operator's assertion, not legal advice.

Caps: at most 15 attempts per UTC day across providers/messages/follow-ups; recipient-domain cap defaults to 3; at least one minute between live attempts. Pausing blocks new attempts, not messages already queued at a provider. Test budget is at most five attempts across all dates. Failed/unknown attempts conservatively consume budget.

Live sends accept either a successful automatic reply/status sync within ten minutes (when provider reply routing is confirmed) or a recent manual inbox review recorded in the dashboard within ten minutes. Manual review is the current intended mode while replies go to `work@gwhyyy.com`; the operator must actually check Zoho, add suppressions for repliers, and only then record the review. It is workable for 10–15 sends/day but is not safe unattended. Every automatically matched reply stops cold follow-ups, including positive replies and auto-replies; manual replies require the operator's suppression action. No auto-response generation or automatic follow-up worker is enabled.

## Failure/reconciliation

Reserve an attempt in `BEGIN IMMEDIATE` before external I/O. `queued` means provider accepted a job, `accepted` means sending/SMTP acceptance reported, **not delivered or read**. `rejected` and `uncertain` are never automatically retried. A crash can leave `sending`: treat it as potentially accepted and investigate; never turn it back into a draft. For uncertain Bulko attempts, locate the exact GWHYYY message/attempt in Bulko and link the confirmed campaign ID, then sync. If no reliable record can be found, keep it unresolved.

Sender/recipient/body/provider changes invalidate approval. Provider/From/Reply-To changes also clear sender and reply-routing acknowledgments; provider changes clear legal acknowledgment. Save the new identity first, then reconfirm its readiness separately. Reserved copy and identity stay immutable. Provider switching does not erase old status or history; switch back to the old configured adapter to poll its outstanding jobs. Do not change Bulko's external default sender silently; local revision cannot detect such a change.

## Production release, 30 October 2026

Deployed image `sha256:08a11b2e63df68e71dc13518c131f92c079dc76391bac565027dc0c0817033db`. Previous image retained as `gwhyyy-app:pre-outreach-20261030`. Pre-migration native SQLite backup: `/home/gw/backups/gwhyyy/portfolio-pre-email-service-20261030-195052.db` (gzip copy alongside), integrity `ok`, 402 prospects all `new`. Public site health 200 after rollout.

Remote MCP credential `outreach-admin-20261030` is active until **2026-11-29 19:53 UTC**. Its plaintext is in `/home/gw/.config/gwhyyy/mcp.env` (mode 600), loaded by the guarded `.bashrc` block, and referenced by the global OpenCode server `gwhyyy-admin` via `{env:GWHYYY_REMOTE_MCP_TOKEN}`. `opencode mcp list` reports `gwhyyy-admin connected`; the endpoint lists 23 tools and rejects a wrong token with 401. Never print or commit the token. Revoke via the `mcp_tokens` row when no longer needed.

Production sender settings: Bulko, **test mode**, paused, `hello@outreach.gwhyyy.com`, reply-to `work@gwhyyy.com`, sender owner-confirmed, complete postal address absent, legal confirmation false, reply-routing confirmation false. Two controlled test attempts were made, both only to owner inboxes:

| Message | Recipient | Bulko campaign | Provider result |
| --- | --- | --- | --- |
| 1 | `ffikhi.aanas@gmail.com` | 2460 | completed, sent 1, failed 0, bounce 0, reply 0 |
| 2 | `work@gwhyyy.com` | 2461 | completed, sent 1, failed 0, bounce 0, reply 0 |

Each was queued exactly once; the dashboard paused dispatch again immediately. Balance after test: 498 email credits, 50 AI credits (third seed subsequently used one more credit). **Provider "completed/sent" is not proof of inbox placement or human receipt.**

Owner confirmed message 1 arrived in the Gmail **Inbox**. Gmail `Authentication-Results`: SPF pass (Bulko IP `212.129.11.8`), DKIM pass for both `firelet.net` and `outreach.gwhyyy.com` (`bk1`), DMARC pass. From and Reply-To matched the intended identity. Zoho delivery for the second Zoho seed was delayed but confirmed; the owner's reply to message 1 arrived at `work@gwhyyy.com` with Gmail SPF/DKIM/DMARC passing at Zoho.

**Reply capture is manual pending a later IMAP decision.** The reply is in Zoho, but Bulko returns zero replies because `Reply-To` is a custom mailbox Bulko does not monitor. The app's Sync therefore saw zero. Live prospect outreach can use a recent manual review of `work@gwhyyy.com` without IMAP, as implemented. Automatic capture remains optional; if enabled later, Zoho IMAP credentials must be an app password in `/home/gw/.config/gwhyyy/zoho.env` (mode 600), never chat.

Provider also injects its own `List-Unsubscribe` URL (`postigo.net`) and footer in addition to the app's unsubscribe link. This duplicates the unsubscribe presentation; clean up before live outreach. The provider's unsubscribe status is polled via its stats API, but one-click unsubscribe from the provider's own URL is not linked to our local token.

Two lifetime test attempts were consumed by messages 1-2; message 3 used a third. No prospect email was sent; all 402 remain unqualified and untouched.

Unsubscribe/delivery tests use public production URLs. The unknown-token path returns 404, protected outreach API returns 401, and public home returns 200. No production inquiry was fabricated for the release check (empty inquiry payloads are absorbed as bot-like and are not a valid persistence test).

## Checks and release

`npm test`, `npm run typecheck`, `npm run lint`, `npm run build`. Tests use in-memory/temp SQLite only. `DATABASE_PATH` can isolate the whole app during browser/integration testing; never point tests at the production volume. Back up SQLite with its native backup API before release. Additive schema may stay in place after code rollback; no old rows/tables are deleted. Keep the previous Docker image for rollback. No git push, production migration, release or mail purchase is implied by local test completion.

MCP endpoint remains `/api/mcp`. Restart/redeploy the service to expose the new catalog. Chat sessions do not run scheduled jobs when closed; no unattended model runner or autonomous prospect campaign has been installed.
