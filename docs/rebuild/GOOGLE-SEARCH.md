# Google Search Console setup and submission

## Verified status

DNS TXT verification exists for the apex domain:

```text
google-site-verification=0TN_Db1062mCaOwsrmAtyel2duGapAE5dAV_bttRE8U
```

This indicates the Search Console property was previously verified by DNS. It does not provide API access to this environment.

## Credential check

An installed Search Console MCP server was tested read-only. Its `list_properties` call returned:

```text
Authentication failed. Set GSC_OAUTH_CLIENT_SECRETS_FILE and call reauthenticate, or set GSC_CREDENTIALS_PATH to a service account.
```

No OAuth token, refresh token, or service-account key is present. A `reauthenticate` attempt returned `could not locate runnable browser`. Therefore:

- No sitemap was submitted through the API.
- No URL Inspection request was made.
- No property, user, DNS, or Search Console setting was changed.

Do not treat the existing DNS verification as proof that the current property is actively monitored.

## Sitemap to submit

```text
https://gwhyyy.com/sitemap.xml
```

It contains 20 URLs: home, four services, work index, six case studies (including FlutterGuard), about, contact, resume, and three privacy pages. Every URL returns 200 and is self-canonical. It is live at `https://gwhyyy.com/sitemap.xml` after the 3 November 2026 deployment.

## Manual submission steps

1. Sign in to Google Search Console with the account that owns the verified `gwhyyy.com` property.
2. Open **Sitemaps**.
3. Submit `sitemap.xml` under `https://gwhyyy.com/`.
4. Confirm status becomes **Success**. A new sitemap may show as pending for a few hours.
5. Open **URL Inspection** and request indexing for:
   - `https://gwhyyy.com/`
   - `https://gwhyyy.com/services`
   - `https://gwhyyy.com/work`
   - `https://gwhyyy.com/work/reqistry`
6. Inspect `https://gwhyyy.com/projects/nostr-mind`. It returns **410 Gone** with `X-Robots-Tag: noindex`; no removal request is normally needed. If Google keeps the old snippet after the next crawl, use **Removals → New request → Remove URL** as a temporary measure while the 410 is processed.
7. In **Pages**, monitor the legacy URLs:
   - `/projects`
   - `/projects/public-apis`
   - `/projects/dart-openai`
   - `/projects/gathr`
   - `/projects/rollee-sdk`
   - `/projects/dart-nostr`
   - `/projects/nostr-mind` (now 410 Gone)
   - `/hire`
   These now return 308, except `/projects/nostr-mind`, which returns 410 Gone. Google should consolidate the redirected URLs to `/work`, `/work/reqistry`, `/work/rollee-connect`, or `/contact`, and drop the retired NostrMind URL.
8. Use **Rich Results Test** on the homepage and `/work/reqistry`. Do not expect FAQ rich results; Google retired FAQ rich results in May 2026. The markup remains for machine parsing.
9. Check **Core Web Vitals** after field data accumulates. Lab result at handoff: Lighthouse performance 86-92 across runs, LCP 1.1s, CLS 0.

## Indexing API

Do not use the Google Indexing API for these pages. It is restricted to JobPosting and BroadcastEvent/VideoObject content. Sitemap + URL Inspection is the correct path.

## Expected timeline

- Recrawl of the homepage and sitemap: hours to days.
- Replacement of old `/projects/*` results: days to weeks.
- Stable service-page impressions: weeks, depending on competition and existing domain history.
- Core Web Vitals field data: up to 28 days after sufficient traffic.

## Monitoring

- Search Console: sitemap success, indexed page count, 308 handling, queries containing “software engineer”, “API integration”, “Flutter developer”, “AI integration”, and case-study names.
- First-party dashboard: CTA clicks, service views, inquiry starts, confirmed inquiry writes.
- Re-run URL Inspection on the five main URLs after 7 days.
- Compare 28-day GSC performance before and after deployment; do not attribute all movement to the rebuild without controlling for the old index state and seasonality.

## Blocked by access, not by the site

The site is technically ready: valid robots, sitemap, canonicals, 200s, 301/308 redirects, HSTS, structured data, Googlebot access, and `llms` surfaces. Authenticated submission and index inspection require the property owner to complete the steps above or provide a Search Console OAuth token/service account.
