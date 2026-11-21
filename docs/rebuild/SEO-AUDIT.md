# SEO audit — rebuilt gwhyyy.com

**Target:** `https://gwhyyy.com` and the rebuilt local production build. **Date:** 28 October 2026. **Business type:** independent software engineering / product development services. **Mode:** read-only crawl, local build checks, public DNS/header checks.

## SEO health score

**93 / 100** before deployment; **100 SEO** in the post-deployment Lighthouse run.

| Category | Weight | Score | Basis |
| --- | --- | --- | --- |
| Technical SEO | 22% | 95 | Canopies, robots, sitemap, 404, redirects, HTTPS, HSTS |
| Content quality | 23% | 92 | Specific case studies, dated evidence, role/ownership, confidentiality boundaries |
| On-page SEO | 20% | 96 | One H1, titles/descriptions, internal links, alt text |
| Schema | 10% | 90 | Valid JSON-LD; FAQ rich results deprecated; no price offers |
| Performance | 10% | 91 | Lighthouse local production |
| AI search readiness | 10% | 95 | llms.txt, llms.md, profile.json, robots policy, direct answers |
| Images | 5% | 92 | Real screenshots, alt text, dimensions, lazy/priority |

## Technical findings

| Check | Result |
| --- | --- |
| `https://gwhyyy.com` | 200 |
| `https://www.gwhyyy.com` | 301 to apex |
| `http://gwhyyy.com` | 301 |
| HSTS | `max-age=63072000; includeSubDomains; preload` |
| Googlebot fetch | 200 |
| `robots.txt` | Allows public pages, disallows `/dashboard/`, `/login`, `/api/`; sitemap declared |
| Sitemap | 17 URLs, every URL 200, self-canonical, no redirects |
| 404 | Real 404 for an unknown path |
| Dashboard / login | Noindex; dashboard redirects to login |
| Canonicals | Self-referencing on all 17 sitemap URLs; apex host |
| Mixed content | None observed; assets same-origin |
| Security headers | CSP, frame denial, referrer policy, permissions policy, HSTS |

### Fixed before deployment

1. **Homepage title was 68 characters.** Shortened to 60: `Mohamed Anas Fikhi — Software Engineer & Product Builder`.
2. **Homepage description was 166 characters.** Trimmed to 151.
3. **Generic section titles.** `/services`, `/work`, and `/contact` now use intent-bearing titles; service details append “services”.
4. **Bracketed robots.txt user-agent line.** Split into valid per-agent groups. The old line was not standard robots syntax.
5. **No NostrMind / old URLs in sitemap.** `/projects/nostr-mind` returns 410 Gone; other legacy `/projects/*` and `/hire` URLs redirect permanently.

## On-page audit

All 17 indexable pages have:

- one `h1`;
- a unique title;
- a meta description within 70–165 characters after the fixes;
- a self-referencing canonical;
- descriptive image alt text;
- at least one internal link out (nav/footer plus body links);
- explicit Open Graph and Twitter card metadata;
- no public price, budget, or “starting from” text.

Homepage title 60 characters. Service titles now e.g. `Product engineering services | GWHYYY`. Work and contact use intent-led titles.

## Structured data

Valid JSON-LD on:

- Home: `Person`, `WebSite`, `ProfilePage`, `ProfessionalService`, `FAQPage`.
- Services: `CollectionPage`, `ItemList`, `BreadcrumbList`.
- Service detail: `Service`, `BreadcrumbList`.
- Case studies: `SoftwareSourceCode`, `BreadcrumbList`.
- About: `ProfilePage`.
- Contact: `ContactPage`, `BreadcrumbList`.

No `Offer`, price, rating, or review markup exists. That is deliberate: there are no public prices or verified testimonials.

Notes:

- `FAQPage` no longer produces Google FAQ rich results since May 2026. It remains because it is valid and useful for machine parsing; it is not treated as a SERP feature.
- `SoftwareSourceCode` is semantically exact for the Dart packages and SDK. It is a reasonable creative-work type for Reqistry and Gathr, though not their only possible type. No rich-result claim is made.
- `ProfessionalService` is a `LocalBusiness` subtype. The provider is remote worldwide; the address entity is the person, not a storefront.

## Content and E-E-A-T

Strong signals:

- Named author, location, contact, direct email, and scheduling link.
- Five case studies with role, period, status, ownership, and dated public evidence.
- Explicit limitation statements for Reqistry Android and employer confidentiality.
- Dated metrics with source labels.
- No fabricated testimonials, client logos, ratings, or customer counts.
- Deep service pages tied to real projects.

Gaps / risks:

- No third-party testimonials or client references. Truthful, but weaker commercial trust for some buyers.
- The site depends on a small number of pages; no editorial/blog engine. That is intentional for a freelance site.
- `About` includes a monogram rather than a real portrait; not an SEO issue, but it reduces personal trust for some visitors.
- `llms.txt` is a link index, not a full content mirror; `llms.md` carries the full profile.

## AI / generative search readiness

- `robots.txt` explicitly allows AI search and training agents via `Content-Signal`.
- `/llms.txt`, `/llms.md`, and `/profile.json` are live, linked, and use the new `/work/*` and `/services/*` URLs.
- Page headings answer the service intent directly.
- FAQ answers are short, declarative, and quotable.
- Entity name is consistent: Mohamed Anas Fikhi, GWHYYY, anasfik.
- No `ai-catalog.json`; not required for this site.

## Images

- Real public screenshots and the official Reqistry mark only.
- All images have alt text.
- Width/height or `fill` with fixed aspect ratios prevents layout shift.
- Hero screenshot is `priority`; case-study gallery images are lazy.
- No stock photography, fake terminals, or invented product UI.

## Google Search Console

**Verification:** DNS TXT record present:

```text
google-site-verification=0TN_Db1062mCaOwsrmAtyel2duGapAE5dAV_bttRE8U
```

**Constraint:** no Search Console API credentials or authenticated browser session are available in this environment. The sitemap cannot be submitted programmatically here. Exact manual steps and the inspection list are in `GOOGLE-SEARCH.md`.

**Current index state:** Google still showed the old homepage, `/projects/*`, and `/hire` results when checked after deployment (29 October 2026). The live URLs now return the new content or 308 redirects; Search Console recrawl is the remaining step. Google Search Console authentication is unavailable here, so sitemap submission and URL Inspection are documented in `GOOGLE-SEARCH.md`.

## Priority actions

| Priority | Action | Status |
| --- | --- | --- |
| High | Deploy the rebuilt site so the new sitemap, canonicals, and redirects are live | Done 29 Oct 2026 |
| High | Submit `https://gwhyyy.com/sitemap.xml` in Search Console | Blocked by missing GSC auth; manual steps ready |
| High | Request indexing for `/`, `/services`, `/work/reqistry` in URL Inspection | Blocked by missing GSC auth; manual steps ready |
| Medium | Monitor 308 legacy URLs in GSC Pages report for two weeks | Manual after deploy |
| Medium | Validate the live homepage in Rich Results Test and URL Inspection | Manual after deploy |
| Low | Reconsider a real portrait and 2–3 attributable client references when available | Backlog |
| Info | FAQPage remains valid but no longer earns FAQ rich results | No action |

## Measurement plan

- GSC: sitemap status, indexed pages, 308 legacy URL handling, impressions/clicks for service and case-study queries.
- First-party analytics: `cta_contact_click`, `service_view:*`, `inquiry_start`, `inquiry_submitted`. No PII.
- Recheck titles, canonical, and sitemap after the first production crawl.
- Compare 28-day GSC performance before/after; do not attribute all movement to this rebuild without controlling for seasonality and the previous index state.
