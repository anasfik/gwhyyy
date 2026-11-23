# gwhyyy.com

Portfolio and project-intake site for [Mohamed Anas Fikhi](https://github.com/anasfik), an independent software engineer and product builder based in Casablanca, working remotely.

**AI-supercharged engineer who actually ships.**

Quality work, built efficiently and shipped fast.

[Live portfolio](https://gwhyyy.com) · [Work and case studies](https://gwhyyy.com/work) · [Services](https://gwhyyy.com/services) · [Reach out](https://gwhyyy.com/contact)

## Stack

- Next.js 16 App Router, React 19, TypeScript, Tailwind CSS
- SQLite via `better-sqlite3` for contact messages and first-party analytics
- NextAuth for protected admin routes
- Docker and nginx for self-hosted deployment

## Content

`config/site.ts` is the typed source of truth for identity, projects, experience, capabilities, metrics, links, FAQ, resume, SEO, and machine-readable profiles.

The live portfolio includes:

- `/`
- `/work` and `/work/[slug]`
- `/services` and `/services/[slug]`
- `/about`
- `/contact`
- `/resume`
- `/privacy`
- `/llms.txt`
- `/llms.md`
- `/profile.json`

The case studies cover Reqistry, FlutterGuard, Dart OpenAI, Dart Nostr, and my contributions to Gathr and Rollee. Deployed site changes may precede their merge into this repository’s default branch.

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
