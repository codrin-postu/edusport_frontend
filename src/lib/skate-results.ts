/**
 * Client for the self-hosted skate-results API (skate-api.codrin.space).
 *
 * A sportsperson is linked to a skate-results skater by `skateResultsSlug`
 * (set in the CMS). These helpers fetch that skater's profile + competition
 * history server-side with ISR, and degrade to null/[] on any failure so the
 * public page renders without the results section rather than erroring.
 */

const SKATE_API = (
  process.env.SKATE_RESULTS_API ?? "https://skate-api.codrin.space"
).replace(/\/+$/, "");

export interface SkateSegment {
  segment: string;
  is_short: boolean;
  placement: number | null;
  tss: number | null;
  tes: number | null;
  pcs: number | null;
  deductions: number | null;
  components: Record<string, number> | null;
}

export interface SkateResult {
  placement: number | null;
  event_id: number;
  event_slug?: string | null;
  event_name: string;
  event_date: string | null;
  event_location?: string | null;
  category: string;
  total_score: number | null;
  short_score: number | null;
  free_score: number | null;
  club?: string | null;
  segments?: SkateSegment[];
}

export interface SkateSkater {
  id: number;
  slug?: string | null;
  display_name: string;
  nation?: string | null;
  club?: string | null;
  coach?: string | null;
  events_count?: number;
  wins?: number;
  best_total?: number | null;
}

/**
 * How long a skate-results response stays in Next's Data Cache.
 *
 * Competition history only changes when an admin runs an import, so an hour
 * of staleness is harmless. It matters because the sportivi listing resolves
 * one athlete per card: uncached, that was one request per athlete on every
 * render. Same window as the Realizari page's own `revalidate`.
 */
const SKATE_REVALIDATE_SECONDS = 3600;

async function getJSON<T>(path: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(`${SKATE_API}${path}`, {
      headers: { accept: "application/json" },
      next: { revalidate: SKATE_REVALIDATE_SECONDS },
    });
    if (!res.ok) return fallback;
    return (await res.json()) as T;
  } catch {
    return fallback;
  }
}

export function getSkaterProfile(slug: string): Promise<SkateSkater | null> {
  return getJSON<SkateSkater | null>(
    `/skaters/${encodeURIComponent(slug)}`,
    null,
  );
}

export function getSkaterResults(slug: string): Promise<SkateResult[]> {
  return getJSON<SkateResult[]>(
    `/skaters/${encodeURIComponent(slug)}/results`,
    [],
  );
}

// ---------------------------------------------------------------------------
// Derivations shared by every consumer of skate-results
//
// The API returns no season and no national/international flag, so both are
// derived from the event date and name. Kept here so the Realizari page and
// the sportsperson pages classify an event identically.
// ---------------------------------------------------------------------------

/** Figure-skating season (Sep to Aug) key from a date/name, e.g. "2025-2026". */
export function seasonKey(
  dateISO: string | null | undefined,
  name: string,
): string | null {
  const y = dateISO?.slice(0, 4) || name.match(/20\d{2}/)?.[0];
  if (!y) return null;
  const year = Number(y);
  const month = dateISO ? Number(dateISO.slice(5, 7)) : 1;
  const start = month >= 9 ? year : year - 1;
  return `${start}-${start + 1}`;
}

export function levelOf(name: string): "national" | "international" {
  return /\bISU\b|international|challenger|grand prix|championship/i.test(name)
    ? "international"
    : "national";
}
