# Architecture

## Overview

Next.js 15 App Router app rendering server components on Node.js 24. Content
comes from a Strapi 5 CMS backed by PostgreSQL. Both services run on the
same VM behind an nginx reverse proxy that terminates TLS.

## Request flow

```
                    443/TLS                  internal :3000
   Browser  ----------------->  nginx  ----------------->  Next.js (Node)
                                                              |
                                                              | HTTP/JSON
                                                              v
                                                          Strapi (:1337)
                                                              |
                                                              | TCP
                                                              v
                                                        PostgreSQL (:5432)
```

All inter-service traffic stays on the `edusport_net` Docker network. Only
nginx publishes ports on the host (80, 443). The browser never reaches the
Next.js or Strapi container directly.

## Data fetching

- `src/lib/strapi.ts` is the **single Strapi client**. It wraps `fetch` in
  `React.cache` so multiple components in the same request share one
  network call. Server components import from this module; client code
  goes through API routes instead.
- Pages use ISR (`export const revalidate = N`) where appropriate.
- On-demand cache busting: Strapi calls `POST /api/revalidate` with the
  header `x-revalidate-secret: <REVALIDATE_SECRET>` whenever an editor
  publishes content. That route is already implemented; it calls
  `revalidatePath` / `revalidateTag` for the affected segments.

## Caching layers

1. Next.js full-route cache (ISR) — primary layer.
2. `React.cache` request-level dedupe inside `src/lib/strapi.ts`.
3. On-demand revalidation via the Strapi webhook.
4. nginx proxy cache — disabled by default; the app's own caching is
   sufficient.

## Build output

`next.config.ts` sets `output: "standalone"`, so the production build emits
a self-contained `server.js` and a trimmed `node_modules`. The runner
stage of `Dockerfile.production` copies only:

- `.next/standalone/`
- `.next/static/`
- `public/`
- `package.json`

That keeps the runtime image well under 200 MB.

## Image handling

`next/image` is the only way images load. Allowed remote hosts are declared
in `next.config.ts` via `images.remotePatterns`. The CMS upload host is
whitelisted dynamically from `NEXT_PUBLIC_STRAPI_IMAGE_HOST`. Local dev
also whitelists `localhost:1337/uploads/**`.

## Health endpoint

`GET /api/health` returns:

```json
{ "ok": true, "commit": "<short-sha>", "time": "<iso8601>" }
```

The deploy script and the container healthcheck both hit it. The route is
marked `dynamic = "force-dynamic"` so it never gets cached.

## Environment

See `.env.example` for the full list. Important runtime variables:

- `NEXT_PUBLIC_SITE_URL` — used by sitemap, robots, OpenGraph.
- `NEXT_PUBLIC_STRAPI_URL` — base URL for server-side and client-side
  Strapi reads.
- `NEXT_PUBLIC_STRAPI_IMAGE_HOST` — hostname (no protocol) added to
  `next/image` remote patterns.
- `STRAPI_API_TOKEN` — server-only read token.
- `REVALIDATE_SECRET` — shared with the Strapi webhook.
- `NEXT_PUBLIC_COMMIT_SHA` — injected by `scripts/deploy.sh`.
