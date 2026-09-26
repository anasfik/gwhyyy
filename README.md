# gwhyyy.com

Portfolio and project-intake site for [Mohamed Anas Fikhi](https://github.com/anasfik), AI Product & Automation Engineer based in Casablanca, Morocco.

## Stack

- Next.js 16 App Router, React 19, TypeScript, Tailwind CSS
- SQLite via `better-sqlite3` for contact messages and first-party analytics
- NextAuth for protected admin routes
- Docker and nginx for self-hosted deployment

## Content

`config/site.ts` is the typed source of truth for identity, projects, experience, capabilities, metrics, links, FAQ, resume, SEO, and machine-readable profiles.

Public routes include:

- `/`
- `/projects`
- `/projects/[slug]`
- `/hire`
- `/resume`
- `/llms.txt`
- `/llms.md`
- `/profile.json`

## Development

```bash
npm install
npm run dev
npm run lint
npm run typecheck
npm run build
```

Admin dashboard lives at `/login` and `/dashboard`. Runtime credentials come from environment variables documented in `.env.example`.

## Deployment

```bash
./deploy.sh
```

Docker Compose exposes nginx on port `8080`; production TLS can terminate at an external proxy or be configured separately.
