# GWHYYY website audit

**Audited:** 28 October 2026. **Scope:** production `https://gwhyyy.com` plus the local Next.js repository at `apps/gwhyyy`. **Mode:** read-only inspection; no production data or configuration changed.

## Decision summary

The existing site is a competent dark technical portfolio, but it sells an identity ("AI Product & Automation Engineer") before it sells a service a client can buy. It shows six projects, including NostrMind, which the rebuild must remove; it publishes budget bands in the inquiry flow; and the mobile homepage overflows horizontally.

The rebuild should keep the working lead pipeline, rate limiting, structured data, print resume, and OG image machinery. It should replace the content architecture, navigation, visual system, project set, and inquiry flow.

## Verified problems

### C1. Mobile horizontal overflow — High

At a 390 px viewport, `document.documentElement.scrollWidth` measured **1,216 px**. The homepage is the only sampled route affected; `/projects`, `/projects/dart-openai`, `/hire`, and `/resume` measured 390 px. The prior portfolio audit suspected `.section` intrinsic sizing (`app/globals.css:45-47`). This rebuild replaces the layout rather than masking overflow with `overflow-x: hidden`.

### C2. Public pricing — High, business rule violation

- `config/site.ts` defined `budgetOptions` from "Under $5,000" to "$50,000+".
- `components/portfolio/ContactForm.tsx:90` labelled the required budget field **"Budget range — most MVPs $5–15k"**.
- `app/hire/page.tsx:63` published the same bands in an FAQ answer.
- `app/api/contact/route.ts:31-52` validated against that public allowlist.

All of this must be removed. The database column can remain for historical records, but no new budget is collected or displayed publicly.

### C3. Wrong portfolio set — High

The site shows six featured projects, including **NostrMind**. `config/site.ts` orders Dart OpenAI before Reqistry and describes Reqistry as "public-apis", a "Mobile Product / Developer Tools" app with a catalog-only story. That understates the web platform, API, worker, trust scoring, change feed, MCP server, and Android distribution. The rebuild must use exactly five projects with Reqistry as the flagship.

### C4. Positioning is role-led, not client-led — High

The hero reads "AI Product & Automation Engineer" and describes a stack. A founder with a failing integration has to translate that into a service. The primary CTA "Start a project" competes with "Schedule a call", a contact form, and an email link. There is no service page and no way for a service card or case study to preselect the inquiry.

### C5. Inquiry does not collect the decision inputs — High

Current required fields: name, email, free-text objective, budget. No service, no project stage, no company, no preferred contact method. The server stores a free-text message and a budget. There is no idempotency key, so a retried request can create a duplicate lead. The server returns success after a database insert even when email notification fails, without recording notification status.

### C6. Analytics mixed intent with outcomes — Medium

`components/portfolio/ContactForm.tsx:102` set `data-track="contact_submit"` on the submit button. The delegated tracker posts that event on click. `app/api/contact/route.ts:54-58` inserts a second `contact_submit` after a successful database write. A successful submission could be counted twice; a failed click counted as a lead. Rename the events and separate intent from confirmed writes.

### C7. Content and architecture duplication — Medium

- The homepage repeats services, stack, process, experience, open source, FAQ, and a full contact form in one page.
- Project pages use the same generic five-section template regardless of project type.
- "Selected work" and "Open source" show overlapping projects.
- Navigation uses anchors (`/#work`, `/#services`) instead of durable pages, so the site has no indexable service surface.
- The footer links Privacy only to the Sandouk app policy; the website itself has no privacy notice.

### C8. Accessibility and trust gaps — Medium

- Mobile overflow (C1).
- Form errors are a single generic line; fields have no `aria-invalid` or inline messages.
- The form asks for a budget before establishing fit.
- Claims such as "Reply within 48 hours" and "Used across the Dart and Flutter ecosystem" have no supporting evidence on the page.
- Unverified or stale metrics are mixed with verified ones without a date or source.

### C9. Design system is coherent but narrow — Low/Medium

The lime-on-near-black grid, mono labels, and sharp panels are consistent and readable. They also read as a technical dashboard rather than an independent engineering practice. The visual hierarchy is flat: nearly every section uses the same eyebrow + large heading + muted paragraph + bordered grid. The mobile hero pushes the proof panel below the fold.

### C10. SEO surface is incomplete — Medium

- Sitemap lists `/projects`, `/hire`, `/resume`, and project pages, but no service, about, contact, or site privacy route.
- Every service intent is trapped inside `/#services`.
- Old project URLs would 404 after the portfolio change unless redirected.
- Metadata is accurate for the old positioning and must be rewritten.

## What works and should be preserved

| Area | Evidence | Decision |
| --- | --- | --- |
| Lead persistence | SQLite `contacts` table, dashboard inbox, CSV export | Keep; extend with structured fields |
| Abuse controls | SQLite rate limit, honeypot, minimum fill time | Keep and harden |
| Email notification | Resend adapter, env-based configuration | Keep; record delivery status |
| Security headers | CSP, frame denial, permissions policy in `next.config.mjs` | Keep and re-audit after form changes |
| Structured data | Person, WebSite, ProfilePage, ProfessionalService JSON-LD | Keep; update service and project schema |
| OG images | Dynamic root and per-project images | Keep; restyle and move to `/work` |
| Resume | Semantic, print stylesheet, print button | Keep; rewrite for new portfolio |
| Admin | Password auth, rate-limited login, revisions, backup | Keep; update links and lead fields |
| Bot surfaces | `/llms.txt`, `/llms.md`, `/profile.json`, robots | Keep; update to new positioning |
| Legal | `/privacy/sandouk` | Keep unchanged |
| Performance | No heavy client framework beyond React; self-hosted fonts | Preserve low-JS approach |

## Conversion and content findings

1. **No service entry points.** A visitor cannot land on "Flutter development" or "API integration" and see scope, examples, and a matching CTA.
2. **No problem-first language.** The site describes technologies; clients describe symptoms ("the integration keeps failing", "we need an internal dashboard").
3. **Proof is undated.** Stars and downloads are useful but need a date and source.
4. **Reqistry is undervalued.** It is the strongest evidence of end-to-end product ownership and is presented as a small mobile directory.
5. **Case studies do not state role boundaries.** "What I owned" exists, but not what was built by others, what is public, or what is confidential.
6. **No explicit confidentiality posture** for employer work (Gathr, Rollee).
7. **No "small task" invitation.** The budget field and "project" framing filter out maintenance and one-feature work, which the business explicitly accepts.

## Mobile, tablet, desktop observations

| Viewport | Observation |
| --- | --- |
| 1440 px | Hero copy and proof panel are balanced; sections are dense but legible. Nav fits one line. |
| 768 px | Two-column grids collapse; long technical headings become tiring; no overflow measured in the sample. |
| 390 px | Homepage overflow to 1,216 px. Hero CTA stack is clear, but the proof panel sits below the first screen. Budget form is long. |

## Rebuild requirements derived from this audit

- Light, editorial visual system with one accent, real product imagery, and fewer competing devices.
- `/services` index plus four service pages, `/work` index plus five case studies, `/about`, `/contact`, `/resume`, `/privacy`.
- One primary CTA label: **Discuss your project**.
- Five projects only. Reqistry first. NostrMind absent.
- No price, rate, budget, or "starting from" content anywhere.
- Service- and case-study-aware inquiry with server-side validation, rate limiting, idempotency, and honest delivery state.
- Redirects for every removed route.
- Sitemap, metadata, schema, and internal links rebuilt around the new routes.
- Browser QA at 390, 768, and 1440 px, with the overflow regression explicitly re-tested.
