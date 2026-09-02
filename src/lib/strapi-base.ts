/**
 * Single source of truth for the Strapi base URL.
 *
 * Two URLs are needed because the same code runs in two places:
 *
 * - In the browser, the URL must be reachable from the user's machine, so it
 *   has to be the public host (`NEXT_PUBLIC_STRAPI_URL`).
 * - During server rendering the code runs inside the frontend container, where
 *   `localhost` is that container, not Strapi. There it needs the internal
 *   service address (`STRAPI_INTERNAL_URL`, e.g. `http://strapi_app:1337`).
 *
 * `STRAPI_INTERNAL_URL` is deliberately not prefixed with `NEXT_PUBLIC_`, so
 * Next never inlines it into the client bundle. In the browser the first term
 * is simply undefined and the public URL wins, which makes this one expression
 * correct in both contexts with no branching on `typeof window`.
 */
export const STRAPI_BASE =
  process.env.STRAPI_INTERNAL_URL ??
  process.env.NEXT_PUBLIC_STRAPI_URL ??
  "http://localhost:1337";
