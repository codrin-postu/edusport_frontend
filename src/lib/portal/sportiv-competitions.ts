// Query and link helpers of the sportiv Concursuri screen. Pure, type imports only (loaded by Node tests).
import type { CompetitionSort } from "./sportiv-types.ts";

export type CompetitionState = { q: string; season: string | null; sort: CompetitionSort; page: number };

const SORTS: readonly CompetitionSort[] = ["recent", "place", "points"];

/** The page's query string ("" when everything is default): only q, season, sort, page; defaults left out. */
export function competitionQuery(s: CompetitionState): string {
  const p = new URLSearchParams();
  if (s.q !== "") p.set("q", s.q);
  if (s.season !== null) p.set("season", s.season);
  if (s.sort !== "recent") p.set("sort", s.sort);
  if (s.page > 1) p.set("page", String(s.page));
  return p.toString();
}

/** Inverse of `competitionQuery`; an unknown sort is `recent`, a page under 1 is 1. */
export function readQuery(params: URLSearchParams): CompetitionState {
  const sort = params.get("sort");
  const page = Math.floor(Number(params.get("page")));
  return {
    q: params.get("q") ?? "",
    season: params.get("season") || null,
    sort: SORTS.includes(sort as CompetitionSort) ? (sort as CompetitionSort) : "recent",
    page: Number.isFinite(page) && page >= 1 ? page : 1,
  };
}

/** The official results link only when it is http(s); anything else is dropped. */
export function safeOfficialUrl(url: string | null): string | null {
  if (url === null) return null;
  try {
    const u = new URL(url);
    return u.protocol === "https:" || u.protocol === "http:" ? url : null;
  } catch {
    return null;
  }
}
