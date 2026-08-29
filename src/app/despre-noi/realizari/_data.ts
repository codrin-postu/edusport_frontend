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
  /** Null when the source has no placement for this entry (renders as "—"). */
  placement: Placement | null;
  /** Null when the source has no total score (renders as "—"). */
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
  id: string;
  label: string;
  competitions: Competition[];
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

export function countResults(seasons: Season[]) {
  let gold = 0, silver = 0, bronze = 0, total = 0;
  for (const season of seasons)
    for (const comp of season.competitions)
      for (const result of comp.results) {
        total++;
        if (result.placement === 1) gold++;
        else if (result.placement === 2) silver++;
        else if (result.placement === 3) bronze++;
      }
  return { gold, silver, bronze, total };
}

export function countSeasonResults(season: Season): number {
  return season.competitions.reduce((sum, comp) => sum + comp.results.length, 0);
}
