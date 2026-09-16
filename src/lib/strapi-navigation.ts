// ---------------------------------------------------------------------------
// Navigation promo overrides (CMS)
//
// The menu structure stays in code (src/components/blocks/header/navItems.ts).
// The CMS owns only the promo card's description and image, keyed by the menu
// item's `key`. This module fetches those overrides; merging them is
// mergeNavOverrides()'s job.
// ---------------------------------------------------------------------------

import type { NavPromoOverride } from "@/components/blocks/header/mergeNavOverrides";
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
