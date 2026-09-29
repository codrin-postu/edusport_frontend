// ---------------------------------------------------------------------------
// Navigation promo overrides (CMS)
//
// The menu structure stays in code (src/components/blocks/header/navItems.ts).
// The CMS owns only the promo card's description and image, keyed by the menu
// item's `key`. This module fetches those overrides; merging them is
// mergeNavOverrides()'s job.
// ---------------------------------------------------------------------------

import { notFound } from "next/navigation";
import { cache } from "react";
import type { NavPromoOverride } from "@/components/blocks/header/mergeNavOverrides";
import { parseDisabledPages, type PageKey } from "./pages";
import { fetchStrapi } from "./strapi";
import { strapiMediaUrl } from "./strapi-article";

/**
 * Cache tag for the navigation single type. The menu renders on every page, so
 * it is cached for a long time and purged on demand instead:
 *   POST /api/revalidate?tag=navigation   (see src/app/api/revalidate/route.ts)
 */
export const NAVIGATION_TAG = "navigation";

/** A day: the menu almost never changes, and the webhook purges it when it does. */
const REVALIDATE_SECONDS = 86400;

/** Raw payload shape of GET /api/navigation. */
interface NavigationResponse {
  overrides?: Array<{
    key?: string | null;
    description?: string | null;
    image?: { url?: string | null } | null;
  }> | null;
}

/**
 * The promo overrides configured in the CMS, or an empty array.
 *
 * NON-NEGOTIABLE: navigation must never depend on Strapi being up. Every
 * failure mode - endpoint missing (404 while the backend is still being
 * built), network error, auth failure, malformed payload, empty entry -
 * resolves to an empty array here, and an empty array makes the merge a no-op,
 * so the menu renders exactly as the static file defines it.
 */
export async function fetchNavPromoOverrides(): Promise<NavPromoOverride[]> {
  try {
    const data = await fetchStrapi<NavigationResponse | null>(
      "navigation",
      "populate[overrides][populate]=image",
      REVALIDATE_SECONDS,
      [NAVIGATION_TAG],
    );

    const overrides = data?.overrides;
    if (!Array.isArray(overrides)) return [];

    return overrides.flatMap((entry) => {
      const key = typeof entry?.key === "string" ? entry.key.trim() : "";
      if (!key) return [];
      const rawUrl = entry?.image?.url;
      return [
        {
          key,
          description: entry?.description ?? null,
          image: typeof rawUrl === "string" && rawUrl !== "" ? strapiMediaUrl(rawUrl) : null,
        },
      ];
    });
  } catch {
    return [];
  }
}

/** Raw payload shape of GET /api/navigation?populate[pages]=true. */
interface NavigationPagesResponse {
  pages?: unknown;
}

/**
 * The pages switched off in the CMS ("Meniu site" -> pages), as a set of keys.
 *
 * Its own request, separate from the promo overrides: until the backend ships
 * the `pages` field, Strapi rejects `populate[pages]` with a 400, and keeping
 * the two apart means that rejection cannot take the promo cards down with it.
 * Same cache tag, so one POST /api/revalidate?tag=navigation purges both.
 *
 * NON-NEGOTIABLE: a failure never hides a page. Field missing, endpoint down,
 * malformed payload, unknown key: every one of them resolves to an empty set,
 * which means every page is on.
 */
export const fetchDisabledPages = cache(async(): Promise<Set<PageKey>> => {
  try {
    const data = await fetchStrapi<NavigationPagesResponse | null>(
      "navigation",
      "populate[pages]=true",
      REVALIDATE_SECONDS,
      [NAVIGATION_TAG],
    );
    return parseDisabledPages(data?.pages);
  } catch {
    return new Set();
  }
});

/** False only when the CMS explicitly switched this page off. */
export async function isPageEnabled(key: PageKey): Promise<boolean> {
  return !(await fetchDisabledPages()).has(key);
}

/**
 * Call at the top of a switchable page (and its detail routes): renders the
 * normal 404 when the page is switched off, does nothing otherwise.
 * Not for generateMetadata, which should use isPageEnabled() and never throw.
 */
export async function requireEnabled(key: PageKey): Promise<void> {
  if (!(await isPageEnabled(key))) notFound();
}
