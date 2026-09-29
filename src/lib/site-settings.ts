import { cache } from "react";

import { fetchStrapi } from "@/lib/strapi";
import type { SiteContactInfo } from "@/components/blocks/footer/Footer";

export interface SiteSettingsData {
  contact: SiteContactInfo;
  registrationOpen?: boolean;
  currentSeason?: string;
}

/**
 * The CMS `site-settings` single type: contact info (phone, address, socials)
 * plus the registration open/season flags. This is the one place that fetches
 * it, so the layout, the footer/header contact strip and any page that needs
 * the same address or map link all read from a single source instead of each
 * repeating the fetch and its own empty/error fallback.
 *
 * Wrapped in React `cache` so several callers in the same request share one
 * network call (fetchStrapi already dedupes by its own arguments; this just
 * centralizes the shape and the "CMS unreachable" fallback so callers don't
 * each redo the try/catch).
 */
export const getSiteSettings = cache(async(): Promise<SiteSettingsData> => {
  try {
    // Both fields are JSON custom-fields, returned by default — no populate.
    const settings = await fetchStrapi<{
      contact?: SiteContactInfo;
      registration?: { open?: boolean; currentSeason?: string };
    }>("site-settings");
    return {
      contact: settings?.contact ?? {},
      registrationOpen: settings?.registration?.open,
      currentSeason: settings?.registration?.currentSeason,
    };
  } catch {
    // Fall through with empty contact info - callers fall back to their own
    // hardcoded defaults.
    return { contact: {} };
  }
});
