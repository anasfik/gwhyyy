# gwhyyy.com

Personal portfolio & client acquisition site for [Mohamed Anas Fikhi](https://github.com/anasfik) — Flutter & AI engineer based in Casablanca, Morocco.

## Stack

- **Next.js 14** (App Router) · TypeScript · Tailwind CSS
- **SQLite** via better-sqlite3 — contact messages + page analytics
- **NextAuth** — admin dashboard (`/dashboard`) for projects, messages, analytics
- **Docker + nginx** — self-hosted deployment

## Features

- Content driven by [`config/site.json`](config/site.json) — edit copy, projects, services without touching components
- Contact form with rate limiting, messages stored locally and viewable in the dashboard
- First-party page-view analytics (no third-party trackers)
- Dynamic OG image, sitemap, robots.txt generated at build time

## Development

```bash
npm install
npm run dev        # http://localhost:3000
```

Admin dashboard lives at `/login` → `/dashboard` (credentials via env vars, see `.env.example` if present or ask the owner).

## Deployment

```bash
./deploy.sh        # builds Docker image and brings up docker-compose stack
```

Serves behind nginx on port 80/443. Domain: [gwhyyy.com](https://gwhyyy.com)

## Structure

```
app/            routes (home, /projects/[slug], /dashboard, api/)
components/
  portfolio/    public-facing sections (hero, projects, experience...)
  dashboard/    admin UI
config/site.json   single source of truth for content
lib/            db + auth helpers
```

---

Open-source work referenced here: [openai (666★)](https://github.com/anasfik/openai), [nostr](https://github.com/anasfik/nostr), [FlutterGuard](https://github.com/anasfik/FlutterGuard).
