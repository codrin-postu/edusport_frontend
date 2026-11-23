# Env changes (chore/env-cleanup)

## Behaviour changes
- `NEXT_PUBLIC_SITE_URL` is required in production builds: the build fails with a clear message when it is missing or empty (no fallback to the old domain). docker-compose.production.yml also refuses to build without it and without `NEXT_PUBLIC_STRAPI_URL`.
- Umami: analytics is on only when both the website id and `NEXT_PUBLIC_UMAMI_URL` are set. No fallback to Umami Cloud (site and both portals).
- `NEXT_PUBLIC_STRAPI_URL`, `STRAPI_INTERNAL_URL`, `PORTAL_STRAPI_URL`, `SKATE_RESULTS_API`, `NEXT_PUBLIC_COMMIT_SHA` treat an empty value as missing (small helper in `src/lib/env.ts`).
- Portals: no switch needed on the frontend. With `PORTAL_HOST_ANTRENOR` and `PORTAL_HOST_SPORTIV` unset (or empty) no host maps to a portal and `/antrenor`, `/sportiv`, `/api/portal/*` answer 404 on every host (`src/lib/portal/host.ts`).

## Renamed or removed
- Removed: `SENTRY_DSN`, `SENTRY_ENVIRONMENT`, `SENTRY_RELEASE` (server and edge now read the `NEXT_PUBLIC_SENTRY_*` values; changing the environment label needs a rebuild).
- Removed: `NEXT_PUBLIC_STRAPI_IMAGE_HOST` (derived from `NEXT_PUBLIC_STRAPI_URL` in next.config.ts, with its scheme and port; no override kept because the CMS uploads host is the same host as the Strapi URL). Build arg removed from the Dockerfile and compose file.

## New names
- None. `PORTAL_HOST_SPORTIV`, `STRAPI_INTERNAL_URL`, `SKATE_RESULTS_API` were added to `.env.example` (they already existed in code).

## Production must set before deploying
- Frontend `.env.production`: `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_STRAPI_URL` non-empty (live has both).
- Frontend: keep `NEXT_PUBLIC_UMAMI_URL` set next to `NEXT_PUBLIC_UMAMI_WEBSITE_ID` (live has both) and `NEXT_PUBLIC_SENTRY_DSN` (live has it).
- Optional cleanup of `.env.production`: delete `SENTRY_DSN`, `SENTRY_ENVIRONMENT`, `NEXT_PUBLIC_STRAPI_IMAGE_HOST` (now ignored, harmless).
- Backend (deploy together): see `edusport_backend/docs/ENV-CHANGES.md`.
