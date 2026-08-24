// Single source of truth for site-wide constants. Imported by layout metadata,
// robots, sitemap, and JSON-LD so the canonical origin and branding never drift.

/**
 * Canonical site origin. Env-first so each deploy can override; falls back to
 * the real production domain. `||` (not `??`) so an empty string from a missing
 * build arg also falls back instead of producing an invalid URL.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://scoaladepatinaj.com";

export const SITE_NAME = "EduSport - Școala de Patinaj";

export const SITE_DESCRIPTION =
  "Școala de patinaj EduSport din București oferă cursuri de patinaj artistic pentru copii și adulți, evenimente sportive și competiții la nivel național.";
