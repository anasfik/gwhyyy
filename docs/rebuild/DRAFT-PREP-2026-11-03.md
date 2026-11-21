# Draft preparation — 3 November 2026

All 15 unsent drafts were checked. Mailbox verification used SMTP `RCPT TO` only: no `DATA`, no message content, no send by the agent. Updates were written through the outreach API, the same backend the MCP server uses.

## Final state

- **43 Dualsym:** sent by the operator at 14:25 UTC, status `queued`, provider ID 5102. Do not resend.
- **11 ready for final approval:** 66, 67, 68, 69, 70, 71, 73, 74, 75, 76, 77.
- **0 legal holds.**
- **3 removed:** 62 La Fourmi, 65 Reflectly, 72 Livestock Manager.
- Queue: 11 drafts. Attempts today: 4 of 15.

## Ready for approval (11)

| Mail | Company | Basis |
|---|---|---|
| 66 | Klasha | NDPA legitimate interest |
| 67 | Sua Música | LGPD legitimate interest |
| 68 | Field Nation | CAN-SPAM B2B |
| 69 | Carepatron | UEMA inferred consent |
| 70 | PMI | CAN-SPAM B2B; softened copy |
| 71 | Upper | CAN-SPAM B2B; softened copy |
| 73 | Beacon Soft | CAN-SPAM B2B |
| 74 | GlobalFoodSoft | CASL implied consent |
| 75 | RentTracky | CAN-SPAM B2B; optional, 5K+ installs |
| 76 | OWNA | Spam Act inferred consent |
| 77 | BusyDrivers | CASL implied consent |

All 11 have a reachable mailbox (SMTP 250), qualified stage, source evidence and a non-empty basis. They still need **exact-copy approval** and a **fresh sync/inbox review** before sending.

## Legal notes

- NZ/AU/CA bases use inferred or implied consent from conspicuously published business addresses, relevant messages and no “no unsolicited” notice found. These are documented operational reviews, not legal advice.
- 72 Livestock Manager is German (Pila Studio UG, Berlin). German UWG requires prior consent for email marketing, so it was removed rather than given a basis.
- 62 La Fourmi and 65 Reflectly had hard SMTP 550 rejections and were removed.

## Removed and archived

Drafts 62, 65 and 72 were deleted; prospects 433, 6 and 183 were archived with notes retained.

Backups:

- `/app/data/backups/pre-draft-prep-20261103T141500Z.sqlite`
- `/app/data/backups/pre-draft-prune-20261103T143500Z.sqlite`
- `/app/data/backups/pre-legal-basis-20261103T145000Z.sqlite`
- `/app/data/backups/pre-final-prune-20261103T145500Z.sqlite`

## Verification

- 13 of 15 mailboxes returned SMTP 250; 2 returned 550.
- Read-only production checks: PMI and Upper eligibility green; Carepatron send step now shows only approval and inbox freshness missing; queue has 11 rows; no console errors or write attempts.

## Not done by the agent

- No draft was approved on the operator's behalf.
- No inbox review or provider sync was recorded.
- No email was sent by the agent; draft 43 was sent by the operator.
- Dispatch was left enabled as found.
