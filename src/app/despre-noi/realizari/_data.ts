// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Raw placement value (1-based finishing position). */
export type Placement = number;

export interface Result {
  athlete: string;
  /** Set when the participant has a linked sportsperson with a public
   *  profile. The name renders as a link to /despre-noi/sportivi/<slug>. */
  athleteSlug?: string;
  category: string;
  /** Null when the source has no placement for this entry (renders as "-"). */
  placement: Placement | null;
  /** Null when the source has no total score (renders as "-"). */
  score: number | null;
}

export interface Competition {
  name: string;
  date: string;
  location: string;
  level: "national" | "international";
  results: Result[];
}

export interface Season {
  /** URL-safe season key, e.g. "2024-2025". Used as `?sezon=`. */
  id: string;
  label: string;
  competitions: Competition[];
}

/**
 * The only season data the client receives for seasons it is not showing:
 * enough to draw the rail and the mobile dropdown, nothing more.
 */
export interface SeasonIndexEntry {
  id: string;
  label: string;
  resultCount: number;
}

/** A rail group: one calendar decade of seasons. */
export interface DecadeGroup {
  /** Decade start year as a string, e.g. "2020". */
  id: string;
  /** Display label, e.g. "2020 - 2029". */
  label: string;
  seasons: SeasonIndexEntry[];
  resultCount: number;
}

export interface GalleryImage {
  src: string;
  alt: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export interface PlacementInfo {
  /** Display label: "Aur", "Argint", "Bronz", or "Locul N". */
  label: string;
  /** Accent colour for top-3 podium positions; null otherwise. */
  accent: string | null;
  /** Class for the placement text colour. */
  textClass: string;
}

const PODIUM_ACCENT: Record<number, string> = {
  1: "var(--color-medal-gold)",
  2: "var(--color-medal-silver)",
  3: "var(--color-medal-bronze)",
};

const PODIUM_LABEL: Record<number, string> = {
  1: "Aur",
  2: "Argint",
  3: "Bronz",
};

const PODIUM_TEXT: Record<number, string> = {
  1: "text-medal-gold",
  2: "text-medal-silver",
  3: "text-medal-bronze",
};

export function getPlacementInfo(placement: Placement): PlacementInfo {
  if (placement === 1 || placement === 2 || placement === 3) {
    return {
      label: PODIUM_LABEL[placement],
      accent: PODIUM_ACCENT[placement],
      textClass: PODIUM_TEXT[placement],
    };
  }
  return {
    label: `Locul ${placement}`,
    accent: null,
    textClass: "text-gray-500",
  };
}

export function countSeasonResults(season: Season): number {
  return season.competitions.reduce((sum, comp) => sum + comp.results.length, 0);
}

// ---------------------------------------------------------------------------
// Season index and decade grouping
// ---------------------------------------------------------------------------

/** Strips every season down to what the rail needs. */
export function buildSeasonIndex(seasons: Season[]): SeasonIndexEntry[] {
  return seasons.map((s) => ({
    id: s.id,
    label: s.label,
    resultCount: countSeasonResults(s),
  }));
}

/** Decade bucket of a season id such as "2024-2025" (starting year wins). */
export function decadeOf(seasonId: string): string {
  const start = Number.parseInt(seasonId.slice(0, 4), 10);
  if (!Number.isFinite(start)) return "0";
  return String(Math.floor(start / 10) * 10);
}

/** Groups an index into decades, newest decade first, seasons newest first. */
export function groupSeasonsByDecade(index: SeasonIndexEntry[]): DecadeGroup[] {
  const groups = new Map<string, SeasonIndexEntry[]>();
  for (const entry of index) {
    const key = decadeOf(entry.id);
    const bucket = groups.get(key);
    if (bucket) bucket.push(entry);
    else groups.set(key, [entry]);
  }
  return [...groups.entries()]
    .map(([id, entries]) => ({
      id,
      label: `${id} - ${Number(id) + 9}`,
      seasons: [...entries].sort((a, b) => b.id.localeCompare(a.id)),
      resultCount: entries.reduce((sum, e) => sum + e.resultCount, 0),
    }))
    .sort((a, b) => Number(b.id) - Number(a.id));
}

// ---------------------------------------------------------------------------
// Season summary (the bar above the competitions)
// ---------------------------------------------------------------------------

export interface SeasonSummary {
  results: number;
  competitions: number;
  athletes: number;
  gold: number;
  silver: number;
  bronze: number;
}

export function summarizeSeason(season: Season): SeasonSummary {
  const athletes = new Set<string>();
  let results = 0, gold = 0, silver = 0, bronze = 0;
  for (const comp of season.competitions)
    for (const r of comp.results) {
      results++;
      athletes.add(r.athlete);
      if (r.placement === 1) gold++;
      else if (r.placement === 2) silver++;
      else if (r.placement === 3) bronze++;
    }
  return {
    results,
    competitions: season.competitions.length,
    athletes: athletes.size,
    gold,
    silver,
    bronze,
  };
}

/** Distinct result categories present in a season, in first-seen order. */
export function seasonCategories(season: Season): string[] {
  const seen = new Set<string>();
  for (const comp of season.competitions)
    for (const r of comp.results) if (r.category) seen.add(r.category);
  return [...seen];
}
