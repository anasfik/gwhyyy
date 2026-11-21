# gwhyyy.com

Freelance website for [Mohamed Anas Fikhi](https://github.com/anasfik), an independent software engineer and product builder based in Casablanca, Morocco.

## Stack

- Next.js 16 App Router, React 19, TypeScript, Tailwind CSS
- SQLite via `better-sqlite3` for inquiries, first-party analytics, and the content document
- NextAuth for protected admin routes
- Docker and nginx for self-hosted deployment

## Routes

- `/` — positioning, four services, selected work, process, FAQ, inquiry CTA
- `/services` and `/services/[slug]` — four service categories
- `/work` and `/work/[slug]` — five case studies
- `/about`, `/contact`, `/resume`, `/privacy`
- `/privacy/sandouk` — separate app policy
- `/llms.txt`, `/llms.md`, `/profile.json` — machine-readable profile
- `/dashboard` — authenticated lead inbox and content editor

Legacy `/projects/*` and `/hire` links redirect permanently.

## Content

`config/site.ts` is the typed default content: identity, four services, five projects, experience, metrics with sources, FAQ, form options, SEO, and machine-readable profiles.

At runtime the dashboard-edited SQLite document wins. A `schemaVersion` mismatch archives the old document in `site_content_revisions` and installs the current defaults.

## Development

```bash
npm install
npm run dev
npm run lint
npm run typecheck
npm run build
```

## Inquiry email

Inquiries are stored in SQLite first. Optional Resend delivery is configured with:

```bash
RESEND_API_KEY=
CONTACT_FROM_EMAIL=portfolio@gwhyyy.com
CONTACT_TO_EMAIL=work@gwhyyy.com
```

See `docs/rebuild/FORM-SETUP.md` for validation, idempotency, rate limits, and the production verification checklist.

## Deployment

```bash
./deploy.sh
```

Docker Compose exposes nginx on port `8080`; production TLS can terminate at an external proxy or be configured separately.

## Documentation

Rebuild audit and decisions: `docs/rebuild/`.
