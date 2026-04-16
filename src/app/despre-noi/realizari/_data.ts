// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type Placement = "gold" | "silver" | "bronze" | "4th" | "5th" | "6th" | "top10";

export interface Result {
  athlete: string;
  category: string;
  placement: Placement;
  score: number;
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

export const PLACEMENT_CONFIG: Record<Placement, { label: string; bg: string; border: string; text: string; dot: string }> = {
  gold:   { label: "Aur",     bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", dot: "bg-amber-400" },
  silver: { label: "Argint",  bg: "bg-gray-50",  border: "border-gray-200",  text: "text-gray-600",  dot: "bg-gray-400" },
  bronze: { label: "Bronz",   bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-700", dot: "bg-orange-400" },
  "4th":  { label: "Locul 4", bg: "bg-white",    border: "border-gray-100",  text: "text-gray-500",  dot: "bg-gray-300" },
  "5th":  { label: "Locul 5", bg: "bg-white",    border: "border-gray-100",  text: "text-gray-500",  dot: "bg-gray-300" },
  "6th":  { label: "Locul 6", bg: "bg-white",    border: "border-gray-100",  text: "text-gray-500",  dot: "bg-gray-300" },
  top10:  { label: "Top 10",  bg: "bg-white",    border: "border-gray-100",  text: "text-gray-400",  dot: "bg-gray-200" },
};

export function countResults(seasons: Season[]) {
  let gold = 0, silver = 0, bronze = 0, total = 0;
  for (const season of seasons)
    for (const comp of season.competitions)
      for (const result of comp.results) {
        total++;
        if (result.placement === "gold") gold++;
        else if (result.placement === "silver") silver++;
        else if (result.placement === "bronze") bronze++;
      }
  return { gold, silver, bronze, total };
}

export function countSeasonResults(season: Season): number {
  return season.competitions.reduce((sum, comp) => sum + comp.results.length, 0);
}
