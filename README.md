# EduSport Frontend

Next.js 15 application served from a self-hosted VM. It renders the public
website for Scoala de Patinaj and pulls content from a Strapi 5 CMS reachable
at `NEXT_PUBLIC_STRAPI_URL`.

## Stack

- Next.js 15 (App Router, standalone output)
- React 19
- Tailwind CSS 4
- Radix UI primitives
- motion (Framer Motion successor)
- FullCalendar
- Node.js 24 LTS

## Repository layout

```
src/
  app/         Route segments, layouts, API routes (App Router)
  components/  Reusable UI: blocks, primitives, layout chrome
  hooks/       Client-side React hooks
  lib/         Server utilities: Strapi client, rate limiter, blur data
  utils/       Pure helpers shared across server and client
public/        Static assets served verbatim
scripts/      Operational scripts (deploy.sh, etc.)
```

## Local development

You need either Docker (recommended) or Node.js 24 LTS.

1. Copy the env template and fill in the values:

   ```bash
   cp .env.example .env.local
   ```

2. Start the dev server. Pick one:

   ```bash
   # Option A: Docker (uses docker-compose.yml, which targets the dev image)
   docker compose up

   # Option B: Native
   npm install
   npm run dev
   ```

3. Open <http://localhost:3000>.

`docker-compose.yml` is the **development** image (hot reload, source mounted).
`docker-compose.production.yml` builds the trimmed standalone image used on
the VM; see `DEPLOY.md` before running it.

## Common scripts

```bash
npm run dev      # Next.js dev server with HMR
npm run build    # Production build (turbopack)
npm run start    # Run the production build locally
npm run lint     # ESLint
npx tsc --noEmit # Type-check without emitting
```

## Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) — request flow, caching, Strapi client
- [DEPLOY.md](./DEPLOY.md) — production deployment on the VM
- [CONTRIBUTING.md](./CONTRIBUTING.md) — branching, commits, code review
