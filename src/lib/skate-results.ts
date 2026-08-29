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

async function getJSON<T>(path: string, fallback: T): Promise<T> {
  try {
    // Always fresh: the sportsperson page is force-dynamic and results change
    // whenever an admin imports, so a cached response would show stale history.
    const res = await fetch(`${SKATE_API}${path}`, {
      headers: { accept: "application/json" },
      cache: "no-store",
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
