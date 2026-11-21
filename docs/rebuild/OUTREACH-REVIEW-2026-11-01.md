# Outreach review batch — 1 November 2026

Status updated 2 November: 15 attempts on 1 November (14 prospects and one test), now reporting **14 sent and one failed** at Bulko. Draft 32 / campaign 4168, `office@tailored-apps.com`, changed from the initially reported sent result to `sent=0, failed=1`; no automatic retry was attempted. The other 14 campaigns report one sent each. All 15 campaigns are marked completed; completion alone does not mean successful sending. Provider reports zero bounces, replies and unsubscribes for these campaigns. Test 45 / campaign 4165 was confirmed by the owner to have arrived in the Gmail inbox. No inbox-placement inference is made for other recipients. Dispatch remains paused. Dualsym (draft 43) remains deferred and unattempted.

Latest evidence: `/tmp/opencode/bulko-check-2026-11-02.json`. Initial statistics below describe the earlier verification, not a guaranteed or permanent delivery outcome.

## Send audit — 1 November 2026

- Test 45: `GWHYYY delivery test 4 — 1 November 2026`, to the owner's requested Gmail inbox. The owner must confirm actual receipt and spam placement.
- The outreach ledger still records today's messages as `queued`; direct Bulko campaign statistics confirm completion. No production reconciliation was performed during the final read-only audit.
- The earlier runner recorded inbox-review timestamps without access to the Zoho inbox. Those timestamps do not establish an actual inbox review and should not have been recorded as such. The owner must check replies, bounces and opt-outs before any further outreach.
- The earlier preparation also wrote `Owner-confirmed legal review` to prospect records based on a send instruction. That instruction is not independent evidence of legal review. Future sends require a genuinely reviewed lawful basis, not a repeated placeholder attestation.
- The sections below retain the original research and copy. Historical preparation statements are not the current send status.

## What changed

- Reused 15 existing `new` prospects from the Firecrawl-sourced pool; no duplicate prospect rows were created.
- Re-verified every recipient address on official HTML, checked MX, and ran SMTP RCPT probes on 31 October. All 15 returned `250`.
- Saved drafts `30–44` as `draft` with no approval hash and no attempt timestamp.
- Excluded Acquaint Softtech (`243`): its mail server returned `550 sender verify failed` for `hello@outreach.gwhyyy.com`, although the recipient accepted a different MAIL FROM. The deliverability risk was not worth carrying.
- Corrected pool metadata: Tekural is in Tokyo, Japan (the pool said Greece); bitsfabrik is in Austria (the pool said Germany); DBB's contact page gives a Krakow HQ; Blackthorn lists Wroclaw, Warsaw and Lviv.

## Batch

| Draft | Company | Recipient | Reader / role | Signal | Signal source | RCPT |
|---:|---|---|---|---|---|---:|
| 30 | Glueglue | `info@glueglue.com` | Digital product agency; team inbox | Describes itself as the only Italian company partner of Google Flutter; services page pairs Flutter mobile apps with Symfony APIs and AI work. | https://www.glueglue.com/en/services | 250 |
| 31 | Dom & Tom | `hello@domandtom.com` | Digital product agency; team inbox | App Rescue & Modernization covers mobile app takeovers and stabilization; AI-built MVP offer turns prototypes into maintainable products. | https://domandtom.com/ | 250 |
| 32 | Tailored Apps | `office@tailored-apps.com` | Founder & Managing Director: Dr. Maximilian Nimmervoll | 450 projects, positioned as 100% mobile, full service from concept to release. | https://tailored-apps.com/ | 250 |
| 33 | bitsfabrik | `office@bitsfabrik.com` | App and web studio; team inbox | Builds native iOS/Android apps and Smart TV apps, and sometimes takes over an existing product; active since 2014. | https://bitsfabrik.com/ | 250 |
| 34 | Blackthorn Vision | `hello@blackthorn-vision.com` | CTO: Yuriy Horak; Founder & CEO: Mykhaylo Terentyak | .NET/AI development partner with Flutter in its mobile stack and a dedicated-team model. | https://blackthorn-vision.com/ | 250 |
| 35 | Mobikasa | `info@mobikasa.com` | Web and mobile agency; team inbox | Careers page currently lists a Flutter Developer role, including iOS, Android and web apps. | https://www.mobikasa.com/careers/ | 250 |
| 36 | DBB Software | `in@dbbsoftware.com` | Business Development Manager: Mina Morkos | Lists hire-mobile-developer services for iOS, Android, Flutter and React Native, plus fixed-scope delivery. | https://dbbsoftware.com/services/mobile-app-development | 250 |
| 37 | Gits Indonesia | `connect@gits.id` | CEO: Hafizh Akmal; CTO: Sudaryatno | Services include Flutter for Development and an AI Implementor practice; Google Cloud partner. | https://gits.id/ | 250 |
| 38 | Seven Peaks | `sales@sevenpeakssoftware.com` | Software development company; sales/partner inbox | Offers Capacity Scaling and Offshore Delivery, plus partner teams for extending client capacity. | https://sevenpeakssoftware.com/services/ | 250 |
| 39 | Cyclr | `info@cyclr.com` | Embedded iPaaS and MCP platform; team inbox | MCP PaaS for Services delivers custom MCP and AI functionality on a service basis, alongside 600+ prebuilt connectors. | https://cyclr.com/ | 250 |
| 40 | Vstorm | `info@vstorm.co` | Agentic AI engineering company; team inbox | Agent Integration wires agents into CRM, ERP and document workflows; stalled-pilot recovery is a named service. | https://vstorm.co/ | 250 |
| 41 | Teamvoy | `contact@teamvoy.com` | AI engineering and software modernization company; team inbox | Sharp Sprint is a fixed-scope, two-week engagement; stack includes Flutter and MCP. | https://teamvoy.com/ | 250 |
| 42 | RaftLabs | `hi@raftlabs.com` | AI and custom software company; team inbox | AI and automation service is framed around one workflow or agent with a measured result. | https://www.raftlabs.com/ | 250 |
| 43 | Dualsym | `info@dualsym.com` | Software house; team inbox | Builds web, mobile, custom software and AI automation; 30+ projects delivered. | https://dualsym.com/ | 250 |
| 44 | Tekural | `info@tekural.com` | Product agency; representatives Kento Tajiri and Kensaku Furuse | Buzzmash case: mobile AI partner for influencers, about three months, TikTok/YouTube integrations, subscription payments and real-time analytics. | https://www.tekural.com/ | 250 |

## Copy

### 30 — Glueglue

**To:** `info@glueglue.com`  
**Subject:** Flutter overflow alongside your Milan team

**Signal:** Describes itself as the only Italian company partner of Google Flutter; services page pairs Flutter mobile apps with Symfony APIs and AI work.  
**Signal source:** https://www.glueglue.com/en/services  
**Email source:** https://www.glueglue.com/en/contact  
**RCPT:** 250

```text
Hi glueglue team,

I saw that you describe yourselves as the only Italian company partner of Google Flutter, and your services page pairs Flutter mobile apps with Symfony APIs and AI work. That combination is close to what I do.

I'm Anas, an independent engineer in Casablanca. I built Reqistry, an API/MCP product with a Flutter client and its own API server: https://reqistry.dev

If a project needs an extra Flutter/API pair of hands for a defined feature or integration, would you consider an independent engineer alongside your team?
```

### 31 — Dom & Tom

**To:** `hello@domandtom.com`  
**Subject:** App rescue work and a Flutter/API pair of hands

**Signal:** App Rescue & Modernization covers mobile app takeovers and stabilization; AI-built MVP offer turns prototypes into maintainable products.  
**Signal source:** https://domandtom.com/  
**Email source:** https://domandtom.com/contact  
**RCPT:** 250

```text
Hi Dom & Tom team,

Your App Rescue & Modernization service covers mobile app takeovers and stabilization, and your AI-built MVP offer turns prototypes into maintainable products. That's the kind of work where an extra specialist can help without adding a full-time hire.

I'm Anas, an independent Flutter/Dart engineer in Casablanca. I worked on Rollee's Flutter SDK, so I'm used to the boundary between a mobile app and an external data service: https://pub.dev/packages/getrollee_flutter_sdk

If a rescue or MVP needs one defined Flutter/API component, would you consider bringing in an independent engineer for that piece?
```

### 32 — Tailored Apps

**To:** `office@tailored-apps.com`  
**Subject:** Flutter capacity for your mobile projects

**Signal:** 450 projects, positioned as 100% mobile, full service from concept to release.  
**Signal source:** https://tailored-apps.com/  
**Email source:** https://tailored-apps.com/  
**RCPT:** 250

```text
Hi Maximilian,

Tailored Apps has delivered 450 projects and describes itself as 100% mobile, with the full service from concept to release. That focus is why I'm writing.

I'm Anas, an independent Flutter/Dart engineer in Casablanca. I built Reqistry, an API/MCP product with a Flutter app and its own backend: https://reqistry.dev

If a project needs extra Flutter capacity for a defined feature or integration, do you ever work with independent engineers on that basis?
```

### 33 — bitsfabrik

**To:** `office@bitsfabrik.com`  
**Subject:** API/backend support for your app projects

**Signal:** Builds native iOS/Android apps and Smart TV apps, and sometimes takes over an existing product; active since 2014.  
**Signal source:** https://bitsfabrik.com/  
**Email source:** https://bitsfabrik.com/  
**RCPT:** 250

```text
Hi bitsfabrik team,

I noticed you build native iOS and Android apps as well as Smart TV apps, and that you sometimes take over an existing product rather than starting from scratch. The handover and API side is usually where an extra pair of hands helps.

I'm Anas, an independent engineer in Casablanca. I built Reqistry, an API/MCP product with a Flutter client and a backend: https://reqistry.dev

If one of your app projects needs a defined API or backend component, would you consider an independent engineer for that piece?
```

### 34 — Blackthorn Vision

**To:** `hello@blackthorn-vision.com`  
**Subject:** Flutter and MCP work alongside your .NET team

**Signal:** .NET/AI development partner with Flutter in its mobile stack and a dedicated-team model.  
**Signal source:** https://blackthorn-vision.com/  
**Email source:** https://blackthorn-vision.com/contact-us/  
**RCPT:** 250

```text
Hi Yuriy,

Blackthorn Vision combines .NET and AI work with Flutter in your mobile stack, and you offer dedicated teams for longer engagements. I'm writing about the smaller, defined pieces that don't always justify a full team.

I'm Anas, an independent engineer in Casablanca. I built Reqistry, an API/MCP product with a Flutter app and its own API/MCP server: https://reqistry.dev

If a project needs one Flutter or MCP integration component, with tests and handover notes, would you consider an independent engineer alongside your team?
```

### 35 — Mobikasa

**To:** `info@mobikasa.com`  
**Subject:** The Flutter role on your careers page

**Signal:** Careers page currently lists a Flutter Developer role, including iOS, Android and web apps.  
**Signal source:** https://www.mobikasa.com/careers/  
**Email source:** https://www.mobikasa.com/careers/  
**RCPT:** 250

```text
Hi Mobikasa team,

Your careers page currently lists a Flutter Developer role. I'm not writing to apply for the full-time position, but to ask whether you'd use a contract engineer for a defined Flutter piece while the role is open.

I'm Anas, an independent Flutter/Dart engineer in Casablanca. I built Reqistry, an API/MCP product with a Flutter app and backend: https://reqistry.dev

If a current project needs extra Flutter capacity for a bounded feature, would a contract engagement be useful?
```

### 36 — DBB Software

**To:** `in@dbbsoftware.com`  
**Subject:** Flutter engineers for your mobile bench

**Signal:** Lists hire-mobile-developer services for iOS, Android, Flutter and React Native, plus fixed-scope delivery.  
**Signal source:** https://dbbsoftware.com/services/mobile-app-development  
**Email source:** https://dbbsoftware.com/contact  
**RCPT:** 250

```text
Hi Mina,

DBB lists hiring mobile app developers for iOS, Android, Flutter and React Native, and your engagement models include fixed-scope delivery. I'm writing about the overflow case rather than a full-time role.

I'm Anas, an independent Flutter/Dart engineer in Casablanca. I built Reqistry, an API/MCP product with a Flutter app and backend: https://reqistry.dev

If a fixed-scope mobile project needs one Flutter/API component, would you consider an independent engineer for that piece?
```

### 37 — Gits Indonesia

**To:** `connect@gits.id`  
**Subject:** Flutter and AI implementation capacity

**Signal:** Services include Flutter for Development and an AI Implementor practice; Google Cloud partner.  
**Signal source:** https://gits.id/  
**Email source:** https://gits.id/contact  
**RCPT:** 250

```text
Hi Hafizh,

Gits lists Flutter for Development and an AI Implementor practice, alongside your Google Cloud partnership. That mix of mobile and AI implementation is close to my own work.

I'm Anas, an independent engineer in Casablanca. I built Reqistry, an API/MCP product with a Flutter app and its own API/MCP server: https://reqistry.dev

If a project needs extra Flutter or AI-integration capacity for a defined component, would you consider an independent engineer alongside your team?
```

### 38 — Seven Peaks

**To:** `sales@sevenpeakssoftware.com`  
**Subject:** An independent Flutter/API engineer for your bench

**Signal:** Offers Capacity Scaling and Offshore Delivery, plus partner teams for extending client capacity.  
**Signal source:** https://sevenpeakssoftware.com/services/  
**Email source:** https://sevenpeakssoftware.com/  
**RCPT:** 250

```text
Hi Seven Peaks team,

You offer Capacity Scaling and Offshore Delivery, and your partner-teams model is built around extending a client's capacity. I'm writing to ask whether that bench includes independent specialists.

I'm Anas, an independent Flutter/Dart engineer in Casablanca. I built Reqistry, an API/MCP product with a Flutter client and its own backend: https://reqistry.dev

If a project needs one Flutter/API component for a defined period, would you consider adding an independent engineer to your partner bench?
```

### 39 — Cyclr

**To:** `info@cyclr.com`  
**Subject:** Custom MCP and connector work

**Signal:** MCP PaaS for Services delivers custom MCP and AI functionality on a service basis, alongside 600+ prebuilt connectors.  
**Signal source:** https://cyclr.com/  
**Email source:** https://cyclr.com/contact  
**RCPT:** 250

```text
Hi Cyclr team,

Your MCP PaaS for Services delivers custom MCP and AI functionality on a service basis, alongside 600+ prebuilt connectors. I'm writing about the custom side of that work.

I'm Anas, an independent engineer in Casablanca. I built Reqistry, an API/MCP product where the API and MCP server expose the same catalog: https://reqistry.dev

If a customer needs a defined connector or MCP server extension, would you consider an independent engineer for that piece?
```

### 40 — Vstorm

**To:** `info@vstorm.co`  
**Subject:** Overflow for agent integration projects

**Signal:** Agent Integration wires agents into CRM, ERP and document workflows; stalled-pilot recovery is a named service.  
**Signal source:** https://vstorm.co/  
**Email source:** https://vstorm.co/contact-us/  
**RCPT:** 250

```text
Hi Vstorm team,

Your Agent Integration service wires agents into CRM, ERP and document workflows, and your stalled-pilot recovery offer is a specific kind of rescue work. That's the part of agent delivery I'd be interested in supporting.

I'm Anas, an independent engineer in Casablanca. I built Reqistry, an API/MCP product with its own MCP server: https://reqistry.dev

If an integration or recovery project needs one defined connector, evaluation harness or backend component, would you consider an independent engineer for that piece?
```

### 41 — Teamvoy

**To:** `contact@teamvoy.com`  
**Subject:** A Flutter/MCP engineer for your next sprint

**Signal:** Sharp Sprint is a fixed-scope, two-week engagement; stack includes Flutter and MCP.  
**Signal source:** https://teamvoy.com/  
**Email source:** https://teamvoy.com/contact-us/  
**RCPT:** 250

```text
Hi Teamvoy team,

Your Sharp Sprint is a fixed-scope, two-week engagement, and your stack includes both Flutter and MCP. That's an unusual combination, and it's close to the work I do.

I'm Anas, an independent engineer in Casablanca. I built Reqistry, an API/MCP product with a Flutter app and its own MCP server: https://reqistry.dev

If a sprint needs one Flutter or MCP component delivered with tests and handover notes, would you consider an independent engineer for that scope?
```

### 42 — RaftLabs

**To:** `hi@raftlabs.com`  
**Subject:** Extra hands for AI automation builds

**Signal:** AI and automation service is framed around one workflow or agent with a measured result.  
**Signal source:** https://www.raftlabs.com/  
**Email source:** https://www.raftlabs.com/contact-us  
**RCPT:** 250

```text
Hi RaftLabs team,

Your AI and automation service is framed around a specific workflow or agent with a measured result, rather than a broad AI transformation. That's the kind of scoped work I like.

I'm Anas, an independent engineer in Casablanca. I maintain Dart OpenAI, including typed responses and error handling, and built Reqistry's API/MCP server: https://pub.dev/packages/dart_openai

If an automation build needs one defined API or agent-integration component, with tests and handover notes, would you consider an independent engineer for that piece?
```

### 43 — Dualsym

**To:** `info@dualsym.com`  
**Subject:** Flutter/API support for your software projects

**Signal:** Builds web, mobile, custom software and AI automation; 30+ projects delivered.  
**Signal source:** https://dualsym.com/  
**Email source:** https://dualsym.com/  
**RCPT:** 250

```text
Hi Dualsym team,

You describe the studio as building web, mobile, custom software and AI automation for companies in Santo Domingo, with more than 30 projects delivered. That mix is close to my own work.

I'm Anas, an independent engineer in Casablanca. I built Reqistry, an API/MCP product with a Flutter app and its own backend: https://reqistry.dev

If a project needs extra Flutter or API capacity for a defined component, would you consider an independent engineer alongside your team?
```

### 44 — Tekural

**To:** `info@tekural.com`  
**Subject:** The Buzzmash build and extra Flutter/API capacity

**Signal:** Buzzmash case: mobile AI partner for influencers, about three months, TikTok/YouTube integrations, subscription payments and real-time analytics.  
**Signal source:** https://www.tekural.com/  
**Email source:** https://www.tekural.com/about  
**RCPT:** 250

```text
Hi Kento,

I read your Buzzmash case: a mobile AI partner for influencers, built in about three months with TikTok/YouTube integrations, subscription payments and real-time analytics. That combination of mobile, AI and external APIs is close to my own work.

I'm Anas, an independent engineer in Casablanca. I built Reqistry, an API/MCP product with a Flutter app and its own API/MCP server: https://reqistry.dev

If a product build needs extra Flutter or API capacity for one defined component, would you consider an independent engineer alongside your team?
```

## Caveats

- A published address plus an MX record and `RCPT 250` is not proof of mailbox ownership, named-person receipt, paid demand, Morocco contractor eligibility, or a lawful basis.
- At preparation time no approval, qualification, legal-basis entry, inbox review or send had been recorded. The send audit above supersedes that state; draft 43 remains unsent.
- The draft bodies deliberately omit the sender footer; the outreach service adds the full name, postal address, Reply-To and unsubscribe link at preview time.
- Do not send from this review copy. Approve only after reading the exact draft preview in the dashboard.

## Original send checklist — retained for reference, not authorization

1. Review drafts `30–44` at https://gwhyyy.com/dashboard/mail and check each exact preview.
2. Approve only the selected drafts. For each approved prospect, record `qualified`, `email_status=verified`, a reviewed lawful basis, and the source URL.
3. Actually check the monitored inbox for replies, bounces and opt-outs, record necessary suppressions, then record the review no more than ten minutes before sending.
4. Send only approved, qualified messages at least 62 seconds apart. If the review expires, pause and perform another real inbox check; never refresh the timestamp merely to continue a loop.
5. Stop on the first error or uncertain outcome. Never retry automatically. Pause after the batch.
6. The global cap is 15 attempts per UTC day including follow-ups. Today's 15 are already used; this batch can only go out on 1 November UTC.
7. Check `work@gwhyyy.com` for replies, bounces and opt-outs after sending, and suppress as needed.
8. The console sender `/tmp/opencode/send-reviewed-batch-2026-11-01.js` is ready for the authenticated dashboard tab. It refuses unapproved drafts, stops when the review window expires, and pauses afterward; refresh the review and rerun for any remainder.

## Verified status after dispatch

- Attempts on 1 November: 14 prospect messages and one test; 15 total.
- Provider: campaigns 4165–4179 completed, each reporting one sent.
- Dispatch: paused.
- Deferred: draft 43, Dualsym, still unapproved and unattempted.
- Next review batch: drafts 46–60; see OUTREACH-REVIEW-2026-11-02.md.
