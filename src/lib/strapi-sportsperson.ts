// ---------------------------------------------------------------------------
// Sportsperson types, fetch helpers, and derived-stats computation
// ---------------------------------------------------------------------------

import { fetchStrapi, fetchStrapiPaginated } from "./strapi";
import type { StrapiMediaImage, BlockNode } from "./strapi-article";

export interface StrapiSportsperson {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  description?: string;
  /** Long-form bio (Blocks rich-text) rendered in the "Despre mine" section.
   *  Falls back to `description`, then a placeholder, when empty. */
  story?: BlockNode[] | null;
  showPublicPage: boolean;
  /** ISO date string ("YYYY-MM-DD") of the athlete's career start. */
  activeSince?: string;
  /** Optional list of signature/favorite skating elements. JSON-stored
   *  as a string array. Empty/null when the editor hasn't filled it in. */
  favoriteMoves?: string[] | null;
  /** Optional list of other interests/hobbies outside skating. */
  hobbies?: string[] | null;
  /** Optional small photo gallery (action shots, podium photos, etc.). */
  gallery?: StrapiMediaImage[] | null;
  /** Disciplines (many-to-many). Editable in the admin via the Discipline
   *  collection — administrators add/remove entries as the club grows. */
  disciplines?: StrapiDiscipline[] | null;
  /** Linked coaches (many-to-many, team-members). Populated on detail fetch. */
  coaches?: StrapiSportspersonCoach[] | null;
  /** Choreographers (many-to-many, team-members). Each athlete can list one
   *  or more coregrafe from the club's team. */
  choreographers?: StrapiSportspersonCoach[] | null;
  /** Career aspiration / what the athlete is working toward. */
  careerGoal?: string | null;
  /** Program music grouped by season — each entry holds the season string
   *  and its inner programs. */
  seasons?: SportspersonSeason[] | null;
  photo?: StrapiMediaImage;
  /** Slug linking this athlete to skate-results (skate-api.codrin.space) for
   *  their scraped competition history. Set via the CMS "Rezultate" linker;
   *  a scalar, so it returns on the default detail fetch. */
  skateResultsSlug?: string | null;
}

export interface StrapiDiscipline {
  name: string;
}

export interface StrapiSportspersonCoach {
  /** Populated `name` field from the linked team-member. */
  name: string;
  /** Populated `role` field — e.g. "Antrenor Principal". */
  role?: string;
}

export interface SportspersonProgram {
  /** Full label as stored — e.g. "Program Scurt" / "Program Liber" /
   *  "Program Exhibiție". Rendered verbatim, no prefixing in the UI. */
  type: string;
  title: string;
  artist?: string;
}

export interface SportspersonSeason {
  /** Season string in "YYYY-YYYY" format (e.g. "2024-2025"). */
  season: string;
  programs?: SportspersonProgram[] | null;
}

/**
 * The slice of a competition that a single athlete cares about: the
 * competition header + only the participant rows tied to that athlete.
 *
 * A real-world edge case the type accommodates: an athlete can appear in
 * multiple categories of the same competition (e.g. solo + duet), which
 * yields multiple participant rows for that one competition.
 */
export interface SportspersonCompetition {
  documentId: string;
  name: string;
  date: string; // YYYY-MM-DD
  location?: string;
  level?: "national" | "international";
  season?: string;
  participantsForThisAthlete: {
    category?: string;
    placement?: number;
    score?: number;
  }[];
}

const PHOTO_FIELDS_PARAMS = {
  "populate[photo][fields][0]": "url",
  "populate[photo][fields][1]": "alternativeText",
  "populate[photo][fields][2]": "width",
  "populate[photo][fields][3]": "height",
};

// Disciplines are shown on the index card eyebrow, so include them in the
// lightweight listing populate alongside the photo. Other relations
// (coach, choreographers, seasons, gallery) are only needed on the
// profile page and stay in DETAIL_POPULATE_PARAMS below.
const LIST_POPULATE_PARAMS = {
  ...PHOTO_FIELDS_PARAMS,
  "populate[disciplines][fields][0]": "name",
};

const DETAIL_POPULATE_PARAMS = {
  ...LIST_POPULATE_PARAMS,
  "populate[gallery][fields][0]": "url",
  "populate[gallery][fields][1]": "alternativeText",
  "populate[gallery][fields][2]": "width",
  "populate[gallery][fields][3]": "height",
  "populate[gallery][fields][4]": "caption",
  "populate[coaches][fields][0]": "name",
  "populate[coaches][fields][1]": "role",
  "populate[choreographers][fields][0]": "name",
  "populate[choreographers][fields][1]": "role",
  // Nested populate: a season component holds an inner `programs`
  // repeatable, both need to come back populated.
  "populate[seasons][populate][programs]": "true",
};

/**
 * All sportspeople flagged showPublicPage=true, sorted for listing.
 *
 * Used by `generateStaticParams` on the [slug] page (needs every athlete to
 * prerender each profile route). The listing PAGE uses
 * `fetchSpotlightSportsperson` + `fetchPublicSportspeoplePage` instead,
 * which paginate server-side.
 */
/**
 * How many athletes are public, from Strapi's own pagination meta.
 *
 * Counting the array from `fetchPublicSportspeople` silently caps at its
 * `pageSize` of 100, so the homepage would under-report once the roster grows
 * past that. Asks for one row and reads `meta.pagination.total` instead.
 */
export async function fetchPublicSportspeopleTotal(): Promise<number | null> {
  const params = new URLSearchParams({
    "filters[showPublicPage][$eq]": "true",
    "pagination[pageSize]": "1",
    "fields[0]": "documentId",
  });
  try {
    const { meta } = await fetchStrapiPaginated<StrapiSportsperson[]>(
      "sportspeople",
      params.toString(),
      300,
    );
    return meta?.pagination?.total ?? null;
  } catch {
    return null;
  }
}

export async function fetchPublicSportspeople(): Promise<StrapiSportsperson[]> {
  const params = new URLSearchParams({
    "filters[showPublicPage][$eq]": "true",
    "sort[0]": "name:asc",
    "pagination[pageSize]": "100",
    ...LIST_POPULATE_PARAMS,
  });
  const data = await fetchStrapi<StrapiSportsperson[]>(
    "sportspeople",
    params.toString(),
    300,
  );
  return data ?? [];
}

/**
 * The "featured" athlete shown in the index hero spotlight — rotates
 * once per day, deterministically. Pool is restricted to athletes who
 * already have at least one competition (so the spotlight stat row is
 * never just dashes).
 *
 * Picking strategy: hash today's date (UTC) into a stable seed, then
 * index into the alphabetically-sorted eligible list. Same athlete is
 * surfaced for every visitor on the same day, then rotates at midnight
 * UTC. Pure server-render compatible — no client JS / clock skew issues.
 */
export async function fetchSpotlightSportsperson(): Promise<StrapiSportsperson | null> {
  // 1. Pull all public athletes' IDs (cheap: fields-only, ≤100 rows).
  const poolParams = new URLSearchParams({
    "filters[showPublicPage][$eq]": "true",
    "sort[0]": "name:asc",
    "pagination[pageSize]": "200",
    "fields[0]": "documentId",
    "fields[1]": "name",
  });
  const allPublic = await fetchStrapi<Array<{ documentId: string; name: string }>>(
    "sportspeople",
    poolParams.toString(),
    300,
  );
  if (!allPublic || allPublic.length === 0) return null;

  // 2. Restrict pool to athletes with ≥1 competition (so the spotlight
  //    stat row is never just dashes). Uses the batched competitions
  //    helper — one round-trip regardless of cohort size.
  const competitionsByAthlete = await fetchCompetitionsForAthletes(
    allPublic.map((a) => a.documentId),
  );
  const eligible = allPublic.filter(
    (a) => (competitionsByAthlete.get(a.documentId)?.length ?? 0) > 0,
  );
  if (eligible.length === 0) return null;

  // 3. Deterministic daily pick: hash of today's UTC date.
  //    Same athlete for every visitor between 00:00–24:00 UTC; rotates
  //    at midnight. Pure server-render, no client clock involvement.
  const today = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
  let hash = 0;
  for (let i = 0; i < today.length; i++) hash = (hash + today.charCodeAt(i)) | 0;
  const picked = eligible[Math.abs(hash) % eligible.length];

  // 4. Re-fetch the picked athlete with the listing populate (photo,
  //    disciplines) so the spotlight card has everything it needs.
  const fullParams = new URLSearchParams({
    "filters[documentId][$eq]": picked.documentId,
    ...LIST_POPULATE_PARAMS,
  });
  const full = await fetchStrapi<StrapiSportsperson[]>(
    "sportspeople",
    fullParams.toString(),
    300,
  );
  return full?.[0] ?? null;
}

export interface PaginatedSportspeople {
  data: StrapiSportsperson[];
  page: number;
  pageSize: number;
  total: number;
  pageCount: number;
}

/**
 * Paginated sportspeople for the index grid. Optionally excludes a single
 * documentId — used to keep the spotlight athlete out of the grid so they
 * don't appear twice on page 1.
 *
 * Strapi handles the slicing server-side via `pagination[page]` +
 * `pagination[pageSize]`. Meta returned includes `pageCount` so the
 * pagination control can render the right number of links.
 */
export async function fetchPublicSportspeoplePage({
  page = 1,
  pageSize = 8,
  excludeDocumentId,
  search,
}: {
  page?: number;
  pageSize?: number;
  excludeDocumentId?: string;
  /** Case-insensitive substring match against the sportsperson `name`.
   *  Trimmed/empty values are ignored. */
  search?: string;
}): Promise<PaginatedSportspeople> {
  const params = new URLSearchParams({
    "filters[showPublicPage][$eq]": "true",
    "sort[0]": "name:asc",
    "pagination[page]": String(page),
    "pagination[pageSize]": String(pageSize),
    ...LIST_POPULATE_PARAMS,
  });
  if (excludeDocumentId) {
    params.set("filters[documentId][$ne]", excludeDocumentId);
  }
  const trimmedSearch = search?.trim();
  if (trimmedSearch) {
    params.set("filters[name][$containsi]", trimmedSearch);
  }
  const result = await fetchStrapiPaginated<StrapiSportsperson[]>(
    "sportspeople",
    params.toString(),
    300,
  );
  const pag = result.meta?.pagination;
  return {
    data: result.data ?? [],
    page: pag?.page ?? page,
    pageSize: pag?.pageSize ?? pageSize,
    total: pag?.total ?? 0,
    pageCount: pag?.pageCount ?? 1,
  };
}

/** Single sportsperson by slug. Does NOT filter on showPublicPage — the
 *  page-level guard is responsible for 404-ing when the flag is off. */
export async function fetchSportspersonBySlug(
  slug: string,
): Promise<StrapiSportsperson | null> {
  const params = new URLSearchParams({
    "filters[slug][$eq]": slug,
    ...DETAIL_POPULATE_PARAMS,
  });
  const data = await fetchStrapi<StrapiSportsperson[]>(
    "sportspeople",
    params.toString(),
    300,
  );
  return data?.[0] ?? null;
}

interface RawParticipantJSON {
  documentId?: string;
  name?: string;
  category?: string | null;
  placement?: number | null;
  score?: number | null;
}

interface RawCompetitionForAthlete {
  documentId: string;
  name: string;
  date: string;
  location?: string | null;
  level?: "national" | "international" | null;
  season?: string | null;
  participantData?: RawParticipantJSON[] | null;
}

/** Coerce a placement value to a number. Returns undefined for null/undefined. */
export function parsePlacement(raw: number | null | undefined): number | undefined {
  if (raw === null || raw === undefined) return undefined;
  return raw;
}

/**
 * All competitions where this sportsperson is linked via at least one
 * participant component row. Strapi returns the entire competition (with all
 * participants) so we narrow client-side to only THIS athlete's rows.
 */
export async function fetchCompetitionsByAthlete(
  documentId: string,
): Promise<SportspersonCompetition[]> {
  const params = new URLSearchParams({
    "filters[sportspeople][documentId][$eq]": documentId,
    "sort[0]": "date:desc",
    "pagination[pageSize]": "200",
    "fields[0]": "name",
    "fields[1]": "date",
    "fields[2]": "location",
    "fields[3]": "level",
    "fields[4]": "season",
    "fields[5]": "participantData",
  });
  const raw = await fetchStrapi<RawCompetitionForAthlete[]>(
    "competitions",
    params.toString(),
    300,
  );
  if (!raw) return [];
  return raw.map((c) => ({
    documentId: c.documentId,
    name: c.name,
    date: c.date,
    location: c.location ?? undefined,
    level: c.level ?? undefined,
    season: c.season ?? undefined,
    participantsForThisAthlete: (c.participantData ?? [])
      .filter((p) => p.documentId === documentId)
      .map((p) => ({
        category: p.category ?? undefined,
        placement: p.placement ?? undefined,
        score: p.score ?? undefined,
      })),
  }));
}

/**
 * Bulk variant of fetchCompetitionsByAthlete — one request that pulls every
 * competition where ANY of the supplied sportspeople appears as a
 * participant component. Returns a Map keyed by sportsperson.documentId.
 * Empty input → empty Map (skips the query).
 */
export async function fetchCompetitionsForAthletes(
  documentIds: string[],
): Promise<Map<string, SportspersonCompetition[]>> {
  if (documentIds.length === 0) return new Map();
  const params = new URLSearchParams({
    "sort[0]": "date:desc",
    "pagination[pageSize]": "500",
    "fields[0]": "name",
    "fields[1]": "date",
    "fields[2]": "location",
    "fields[3]": "level",
    "fields[4]": "season",
    "fields[5]": "participantData",
  });
  documentIds.forEach((id, i) => {
    params.append(`filters[sportspeople][documentId][$in][${i}]`, id);
  });
  const raw = await fetchStrapi<RawCompetitionForAthlete[]>(
    "competitions",
    params.toString(),
    300,
  );
  const result = new Map<string, SportspersonCompetition[]>();
  for (const id of documentIds) result.set(id, []);
  if (!raw) return result;
  for (const c of raw) {
    const participants = c.participantData ?? [];
    const presentIds = new Set(participants.map((p) => p.documentId).filter(Boolean));
    for (const docId of documentIds) {
      if (!presentIds.has(docId)) continue;
      result.get(docId)!.push({
        documentId: c.documentId,
        name: c.name,
        date: c.date,
        location: c.location ?? undefined,
        level: c.level ?? undefined,
        season: c.season ?? undefined,
        participantsForThisAthlete: participants
          .filter((p) => p.documentId === docId)
          .map((p) => ({
            category: p.category ?? undefined,
            placement: p.placement ?? undefined,
            score: p.score ?? undefined,
          })),
      });
    }
  }
  return result;
}

// ---------------------------------------------------------------------------
// Derived stats
//
// Auto-computed from the competition list — editors don't enter these.
// ---------------------------------------------------------------------------

export interface SportspersonStats {
  totalCompetitions: number;
  /** Distinct seasons / years the athlete competed in; 0 if no competitions. */
  yearsActive: number;
  goldCount: number;
  silverCount: number;
  bronzeCount: number;
  /** placement ≤ 3 across ANY participant row of any competition. */
  podiumCount: number;
  /** Highest decimal score across all participant rows, or null. */
  bestScore: number | null;
}

/** A single notable result — used by the "Most notable wins" UI to show the
 *  athlete's best placements with the competition context. */
export interface NotableResult {
  competition: SportspersonCompetition;
  placement: number;
  category?: string;
  score?: number;
}

/**
 * Pick the athlete's most impressive results. Sort by placement (best
 * first), then by score (high first as tie-breaker), then by date (newer
 * first). Caller decides how many to show.
 */
export function pickNotableResults(
  competitions: SportspersonCompetition[],
  limit = 5,
): NotableResult[] {
  const all: NotableResult[] = [];
  for (const comp of competitions) {
    for (const row of comp.participantsForThisAthlete) {
      if (row.placement === undefined) continue;
      all.push({
        competition: comp,
        placement: row.placement,
        category: row.category,
        score: row.score,
      });
    }
  }
  all.sort((a, b) => {
    if (a.placement !== b.placement) return a.placement - b.placement;
    if ((b.score ?? -Infinity) !== (a.score ?? -Infinity)) {
      return (b.score ?? -Infinity) - (a.score ?? -Infinity);
    }
    return b.competition.date.localeCompare(a.competition.date);
  });
  return all.slice(0, limit);
}

export function computeStats(
  competitions: SportspersonCompetition[],
  /** ISO date string ("YYYY-MM-DD") for the manual activeSince override. */
  manualActiveSince?: string,
): SportspersonStats {
  let gold = 0;
  let silver = 0;
  let bronze = 0;
  let podium = 0;
  let bestScore: number | null = null;
  let minYear: number | null = null;
  let maxYear: number | null = null;

  for (const comp of competitions) {
    const year = Number(comp.date?.slice(0, 4));
    if (Number.isFinite(year)) {
      minYear = minYear === null ? year : Math.min(minYear, year);
      maxYear = maxYear === null ? year : Math.max(maxYear, year);
    }
    for (const row of comp.participantsForThisAthlete) {
      const p = row.placement;
      if (p !== undefined) {
        if (p === 1) gold += 1;
        if (p === 2) silver += 1;
        if (p === 3) bronze += 1;
        if (p <= 3) podium += 1;
      }
      if (row.score !== undefined) {
        bestScore = bestScore === null ? row.score : Math.max(bestScore, row.score);
      }
    }
  }

  // yearsActive: prefer the manual `activeSince` date (career start) when
  // provided; otherwise derive from the competition span. The `+ 1` makes
  // the count inclusive of both endpoints ("started in 2018" → at least 1
  // year of activity even in the same year).
  const currentYear = new Date().getFullYear();
  let yearsActive = 0;
  const manualYear = manualActiveSince
    ? Number(manualActiveSince.slice(0, 4))
    : NaN;
  if (Number.isFinite(manualYear) && manualYear <= currentYear) {
    yearsActive = currentYear - manualYear + 1;
  } else if (minYear !== null && maxYear !== null) {
    yearsActive = maxYear - minYear + 1;
  }

  return {
    totalCompetitions: competitions.length,
    yearsActive,
    goldCount: gold,
    silverCount: silver,
    bronzeCount: bronze,
    podiumCount: podium,
    bestScore,
  };
}

/**
 * Club-wide aggregate stats — used by the sportivi index ticker to display
 * "X SPORTIVI · X COMPETIȚII · X MEDALII" totals. Sums per-athlete stats.
 *
 * `competitions` is the count of DISTINCT competition documentIds across all
 * athletes (not the sum of per-athlete counts, which would double-count
 * meets where multiple club members competed). The caller passes those in
 * directly since this helper doesn't know about competition identities.
 */
export interface ClubAggregateStats {
  athleteCount: number;
  goldCount: number;
  silverCount: number;
  bronzeCount: number;
  medalCount: number;
  competitionCount: number;
  internationalCount: number;
}

export function aggregateClubStats(
  perAthleteStats: Iterable<SportspersonStats>,
  distinctCompetitions: SportspersonCompetition[],
): ClubAggregateStats {
  let gold = 0;
  let silver = 0;
  let bronze = 0;
  let athletes = 0;
  for (const s of perAthleteStats) {
    athletes += 1;
    gold += s.goldCount;
    silver += s.silverCount;
    bronze += s.bronzeCount;
  }
  let international = 0;
  for (const c of distinctCompetitions) {
    if (c.level === "international") international += 1;
  }
  return {
    athleteCount: athletes,
    goldCount: gold,
    silverCount: silver,
    bronzeCount: bronze,
    medalCount: gold + silver + bronze,
    competitionCount: distinctCompetitions.length,
    internationalCount: international,
  };
}

/**
 * Flatten the per-athlete competitions Map into a list of unique competitions
 * (deduped by documentId). Useful for ticker labels and club-wide counts.
 */
export function flattenDistinctCompetitions(
  perAthlete: Map<string, SportspersonCompetition[]>,
): SportspersonCompetition[] {
  const seen = new Map<string, SportspersonCompetition>();
  for (const list of perAthlete.values()) {
    for (const c of list) {
      if (!seen.has(c.documentId)) seen.set(c.documentId, c);
    }
  }
  return Array.from(seen.values()).sort((a, b) => b.date.localeCompare(a.date));
}
