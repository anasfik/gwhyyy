# Route-based mail send flow

**Problem:** Draft list, editor, exact preview, approval, send and readiness checks were stacked on `/dashboard/mail`, making a high-risk action hard to scan.

**Flow:** `/dashboard/mail` is now a queue only. Selecting a draft opens a focused route sequence:

1. `/dashboard/mail/draft/[id]` — review recipient and copy, save changes, inspect recipient eligibility.
2. `/dashboard/mail/draft/[id]/approve` — exact saved preview and approval only.
3. `/dashboard/mail/draft/[id]/send` — final readiness checks and one confirmed send.

`/dashboard/mail/new` is the compose route. `/dashboard/mail?messageId=` and `?prospectId=` redirect into the new flow. Existing APIs, send-once semantics, approval hash, suppression, caps, inbox review and immutable attempts are unchanged.

## Checks

- Queue has no editor or sending stepper; each step has one primary action.
- Existing and new drafts save into the approval step.
- Send is disabled until approval hash and every advisory gate agree; the server remains authoritative.
- Attempted messages render an immutable panel with no send/edit controls.
- Old history/prospect links redirect correctly.
- 34 tests pass, including new prospect gate tests.
- 10 workflow browser checks pass at desktop/mobile, no console errors or unexpected native dialogs.
- 48 axe scans across light/dark and 390/1440, no WCAG-tagged violations.
- QA uses an isolated SQLite database and blocks send/provider/settings writes; no production mail or settings touched.

## Deployment (3 Nov 2026)
- Deployed app image `sha256:d83022a05c99dc394f73bd8522e1a7733efbf91a1333ef925a70ace0874f26ed` at 14:03 UTC; `latest` points to it.
- Retained previous image as `gwhyyy-app:pre-mail-flow-20261103T140146Z` and a consistent SQLite backup at `/app/data/backups/pre-mail-flow-20261103T140146Z.sqlite` (`quick_check=ok`).
- Only the app container was recreated. The SQLite volume stayed mounted and the app retained `172.19.0.3`, so nginx required no reload.
- Production dispatch was found enabled and was intentionally left enabled. No new mail attempts, content changes or settings changes occurred. One older message (#43) remains approved; the final send view correctly blocks it on stale inbox review and missing lawful basis.
- Live smoke checks passed on queue, redirects, review, approve, send and mobile widths with no write attempts or console errors.

## Residual

- The final live-send action was not executed. It remains one email, explicit confirmation, server rechecked.
- The step flow is client-side navigation; direct links to approve/send remain guarded by saved state and approval checks.
