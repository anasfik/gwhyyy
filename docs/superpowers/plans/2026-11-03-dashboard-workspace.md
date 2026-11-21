# GWHYYY daily workspace rebuild

**Goal:** Replace the dark command-center dashboard with a calm, task-oriented daily workspace. The owner delegated visual, route and flow decisions and implementation.

**Architecture:** Keep Next.js App Router, native HTML controls, Tailwind 3, SQLite, existing APIs and MCP. Scope new tokens and typography to authenticated dashboard/login surfaces. Separate mail tasks with routes, content tasks with routes, and open CRM details in a focus-managed panel instead of displacing the list. No production data writes or sending during QA.

**Design:** Stone canvas, white working surfaces, charcoal action buttons, muted blue selection, Manrope sans. One body scroll. Sentence-case labels, 44px targets, readable 14-16px working text. No ornamental motion, marketing heroes, stock images or scroll pinning. Light/dark preference is local and dashboard-only.

## Active checklist
- [x] Audit existing pages, CSS, callers and daily flows; obtain read-only contract and UX audits.
- [x] Build scoped workspace shell, grouped navigation, typography, native confirmation dialogs and leave-with-unsaved-changes protection.
- [x] Rebuild overview around actual work and analytics around readable data; preserve real counts and metric definitions.
- [x] Separate mail drafts/history/replies/blocked/settings. Add visible per-message readiness; choose prospects by name, not numeric ID. Preserve exact-preview approval, manual inbox attestations, caps, pause, immutable attempts and suppression.
- [x] Separate content sections, preserve drafts during section navigation and warn before discarding. Make inbox/prospect detail usable without list displacement; clear filters, refresh/error and save feedback.
- [x] Verify using an isolated QA database and browser interception of send/provider/backup endpoints; no real email, provider sync, deletion or production publication. Check 390/768/1440, keyboard, dialogs, light/dark, empty/error states, API regressions, lint, tests, build, public-site isolation. Obtain a final read-only quality audit. Bounded coverage and manual limits are recorded in `2026-11-03-dashboard-verification.md`.

## Flow and state contract
- Overview -> unread inquiries / due prospects / draft review / site editor.
- Prospect -> source + qualification -> save eligibility -> compose -> save -> exact preview -> approve -> deliberate send confirmation. Never auto-verify or invent a legal basis.
- Lists: initial loading, keep rows on refresh, explicit load failure/retry, filtered empty with reset, first-use empty with creation action, pagination.
- Editing: keep fields on error; dirty indicator; browser leave protection; confirmation before reload, route navigation, switching records or irreversible action.
- Dialogs: native modal semantics, safe initial focus, Escape, focus return. Never replace a safety gate with a decorative checkbox.
- Existing /dashboard/messages, /prospects and /mail URLs remain usable; API/MCP contracts remain unchanged. New children are authenticated by the existing layout.

## Review focus
- Long addresses/subjects must wrap without hiding action labels or escaping the viewport.
- Failed/uncertain/sending attempts must not become editable or resendable.
- Manual inbox review is an attestation, not the same action as empty provider sync.
- Unsaved content must not vanish on navigation/reload/record selection.
- Public palette, site content, authentication and persisted history must remain unchanged.

## Boundaries
No new dependencies for styling, routing or animations. No public-site redesign, database migration, auth weakening, new email automation, deployment or commit during this task. Existing unrelated dirty changes remain untouched.

## Final verification
- Typecheck, repository-wide ESLint and optimized production build passed.
- 31 unit/regression checks passed, including recursive copy editing cases reproduced failing before fixing the shared update path.
- 16 routes checked at 390/768/1440: no page overflow or console errors. Native review/confirmation cancellation and focus return passed.
- 11 workflow/race checks passed, including delayed saves across history navigation, retained drafts and immutable attempted mail.
- 32 axe scans passed across representative routes in both themes at desktop/mobile widths.
- Independent read-only correctness findings were integrated and their combined history/mutation cases regression-tested.
- QA used only `/tmp/opencode/gwhyyy-workspace-qa.sqlite`, synthetic `.example` recipients, disabled provider credentials and browser request guards. Production is untouched; deployment requires approval.
