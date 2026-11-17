import { cache } from "react";

import { STRAPI_BASE } from "./strapi-base";
import { parsePublicClubInfo, type PublicClubInfo } from "./club-public";

/** The backend caches this response for 60 s (`Cache-Control: public, max-age=60`). */
const REVALIDATE_SECONDS = 60;

/**
 * GET /api/club/public: current season, membership fee and the public prices.
 * Null when the backend is unreachable or the body is unusable, so each page
 * keeps its own fallback (the "Prețurile nu sunt disponibile" card, no season
 * label). React `cache` shares one call per request.
 */
export const fetchPublicClubInfo = cache(async(): Promise<PublicClubInfo | null> => {
  try {
    const res = await fetch(`${STRAPI_BASE}/api/club/public`, { next: { revalidate: REVALIDATE_SECONDS } });
    if (!res.ok) return null;
    const json = (await res.json().catch(() => null)) as { data?: unknown } | null;
    return parsePublicClubInfo(json?.data);
  } catch {
    return null;
  }
});
