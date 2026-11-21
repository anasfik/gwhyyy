# Dashboard rebuild verification

## Scope

Dashboard and login only: scoped palette/type, grouped navigation, Today and analytics, inquiry/prospect review dialogs, focused mail routes, focused website routes and shared drafts. No API/MCP or database schema changes in this rebuild. Unrelated pre-existing changes remain uncommitted and untouched.

## Confirmed checks

- `npm run typecheck`: passed.
- `npm run lint`: passed across the repository.
- `npm test`: 31 passed, 0 failed. Includes recursive copy updates, case-study array item shapes, route uniqueness, advisory readiness and the existing outreach/provider/analytics safety suite.
- `npm run build`: optimized production build passed with the new dashboard children.
- Unauthenticated checks: dashboard and sampled child routes redirect to login; content/messages/prospects/outreach APIs return 401.
- Browser evidence is stored at `/tmp/opencode/workspace-qa/`. Final responsive sweep: 16 destinations at 390/768/1440, no document overflow or browser console errors. Inquiry confirmation cancellation, save completion and keyboard focus return passed; no unexpected native dialogs or blocked provider requests occurred.
- Final axe sweep: 32 scans across eight representative routes, two widths and both themes, no WCAG-tagged violations. Low-contrast copy-path hints found during the initial pass were corrected.

## State and race regression coverage

Browser scripts under `/tmp/opencode/` exercise:

- Dirty mail, inquiry and prospect state across Back/Forward; anchor cancellation and native unload protection.
- Delayed draft creation, blocked switching/typing, and exactly one creation across history navigation.
- Retained message-specific dirty scope while browsing another email section.
- Sender edits surviving unrelated refresh/actions and failed settings submission.
- Website drafts surviving section changes; a delayed publication keeps every section disabled.
- Stable project name focus, typed list separators and canceling a reload discard.
- Attempted mail remains non-editable.
- Native inquiry detail/confirmation cancellation and focus return to the originating Open button.

The follow-up audit found two combined history/mutation cases beyond the original scenarios. Retained state now uses React's native external-store subscription so completions update the workspace even after a route unmounts. Pending mail/CRM operations live in that store; mail draft and sender dirtiness have separate scopes. All 11 combined flow checks passed after this correction, including exactly one delayed draft creation across Back/Forward and unload protection for an off-screen edited message.

The focus test waits for the review mutation to finish before closing: Close intentionally does nothing while saving. Repeated QA sign-ins reached the unchanged eight-attempt login cap; the final accessibility sweep used a separate synthetic local client IP rather than altering authentication or production data.

## QA isolation and limits

- Only `/tmp/opencode/gwhyyy-workspace-qa.sqlite` is used. Its contacts and recipients are synthetic `.example` fixtures.
- Provider credentials are disabled. Browser guards block external origins, sends, provider actions, permanent deletion and backup downloads. Draft writes affect only the QA database.
- Publication is intercepted with a synthetic response. No production publication, restore, email, suppression, provider sync or deletion was performed.
- Draft recovery is in memory for the current workspace session, not durable offline storage or cross-tab synchronization. Confirming discard or ending the session clears it.
- Browser automation used the installed Python Playwright/Chromium fallback because `agent-browser` was unavailable. This is not a manual screen-reader audit or real-device Safari/Firefox verification.
- Deployment remains approval-gated. The public site and production data were not changed during this rebuild.
