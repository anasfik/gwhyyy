# Implementation plan (as built)

## Goal

Rebuild `gwhyyy.com` as the site of an **independent software engineer and product builder**: product engineering first, with integrations, AI, and existing-product work as the four ways to engage. Five projects prove technical depth; the inquiry flow turns interest into a qualified conversation without publishing prices.

## Constraints carried into the build

- No public pricing, rates, bands, minimums, or budget field.
- Exactly five projects: Reqistry, Dart OpenAI, Gathr, Rollee Connect SDK, Dart Nostr.
- NostrMind removed from project data, navigation, related content, sitemap, feeds, and resume.
- Every public claim traceable to source, a public surface, or the owner's stated role.
- Keep the existing Next.js app, SQLite lead store, authentication, backups, and bot feeds.
- No framework migration, no new runtime dependency, no production deployment.

## Architecture

```text
Next.js App Router (existing)
├── Public pages (server components, light theme)
│   ├── /                    homepage
│   ├── /services            four service categories
│   ├── /services/[slug]     service detail + preselected inquiry
│   ├── /work                five projects
│   ├── /work/[slug]         case study template
│   ├── /about
│   ├── /contact             service-aware inquiry
│   ├── /resume              printable
│   ├── /privacy             site privacy notice
│   └── /privacy/sandouk     existing app policy (unchanged)
├── Content: config/site.ts -> SQLite site_content (schemaVersion 2)
├── Inquiry: POST /api/contact -> SQLite contacts -> optional Resend email
├── Analytics: first-party /api/track, no PII
└── Admin: existing dashboard, extended lead fields
```

### Why the content stayed in SQLite

The repository already has a dashboard-driven content document with revisions. Replacing it with hard-coded pages would remove a working capability. Instead:

- `config/site.ts` is the new default document and defines the public shape.
- `schemaVersion: 4` marks the services-led content.
- `getSiteContentRecord()` archives the old document to `site_content_revisions` and installs the new defaults when the stored schema is older.
- The dashboard keeps working; its generic copy editor and project/service editors were extended for the new shape.

This is a destructive content migration by design: the old copy was the subject of the rebuild. The previous document remains in revisions.

### Why routes moved

The old site used `/projects` and `/hire`, with services trapped in homepage anchors. The new IA needs durable service pages and a `/work` case-study index. Redirects preserve old links:

| Old | New |
| --- | --- |
| `/projects` | `/work` |
| `/hire` | `/contact` |
| `/projects/public-apis` | `/work/reqistry` |
| `/projects/rollee-sdk` | `/work/rollee-connect` |
| `/projects/nostr-mind` | `410 Gone` |
| `/projects/:slug` | `/work/:slug` |

## Page composition

### Homepage

Hero with the required headline and supporting copy, real Reqistry screenshot, verified metrics, four services, five projects, problem-first prompts, four-step process, about, FAQ, final CTA. One primary CTA label throughout: **Discuss your project**.

### Services

Four categories, not six technology packages:

1. Product engineering
2. Integrations & infrastructure
3. AI engineering
4. Existing product development

Each has a detail page with scope, example engagements, fit criteria, related case studies, and a CTA that preselects the service.

### Work

Five case studies share a template but not identical content. Reqistry receives the deepest treatment: product, verified metrics, architecture, engineering decisions, Android distribution, and limitations. Gathr and Rollee state confidentiality boundaries. Dart OpenAI and Dart Nostr cite public package/store data with dates.

### Inquiry

One page, one step. Required: name, email, service, stage, description. Optional: company, website, start timeframe, contact method, additional context. Service cards preselect the service; case-study CTAs add the source project. See `FORM-SETUP.md`.

## Data model changes

`contacts` gained nullable columns:

`service`, `stage`, `company`, `company_website`, `timeframe`, `contact_method`, `source`, `submission_id` (unique partial index), `email_status`, `notified_at`.

`budget` remains for historical rows only. It is no longer collected, validated against a public list, displayed in the public UI, or shown as a current field in the dashboard.

## SEO and machine surfaces

- Per-page metadata, canonical URLs, OG/Twitter images.
- `ProfessionalService` and `Service` structured data; `FAQPage` on the homepage; `SoftwareSourceCode` plus breadcrumbs on case studies.
- Sitemap includes home, four service pages, work, five case studies, about, contact, resume, and both privacy pages.
- `/llms.txt`, `/llms.md`, `/profile.json` now link `/work/*` and the new services.
- Redirects are permanent.
- Robots policy and `Content-Signal` unchanged.

## Accessibility and performance decisions

- No client animation library; CSS-only entrance and hover, removed under `prefers-reduced-motion`.
- Real screenshots through `next/image`; first viewport image is `priority`.
- One accent color, explicit borders, zero border radius, no decorative gradients or orbs.
- Form labels above inputs, visible focus ring, native validation plus server validation, preserved values on error, honest success/error states.
- No marketing cookies. Admin session cookie only.

## Verification plan

1. Typecheck and lint.
2. Production build.
3. Browser QA at 390, 768, 1440 px: all routes, overflow, console errors, redirects.
4. Inquiry: invalid payload, valid payload, duplicate submission, rate limit, error preservation, service preselection, case-study source.
5. Database inspection for stored fields and event names.
6. Lighthouse/performance spot check if the local browser supports it.
7. Confirm no pricing strings and no NostrMind in built output.

Actual results are in `QA-REPORT.md`. Deployment is not performed; see the finish report for the manual steps.
