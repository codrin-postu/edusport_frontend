"use client";

import React, { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { cn } from "@/utils/cn";
import { Select } from "@/components/ui/select";
import { MedalIcon, type MedalPlace } from "@/components/ui/medal-icon";
import {
  decadeOf,
  getPlacementInfo,
  groupSeasonsByDecade,
  summarizeSeason,
  type Competition,
  type Result,
  type Season,
  type SeasonIndexEntry,
} from "./_data";

/** Season links stay on the current route, so the season lives in the query. */
function seasonHref(pathname: string, id: string): string {
  return `${pathname}?sezon=${id}`;
}

function seasonsLabel(n: number): string {
  return n === 1 ? "1 sezon" : `${n} sezoane`;
}

function formatScore(score: number | null): string {
  return score != null ? score.toFixed(2) : "-";
}

// ---------------------------------------------------------------------------
// Rail
// ---------------------------------------------------------------------------

interface RailProps {
  index: SeasonIndexEntry[];
  selectedId: string | null;
  pathname: string;
  onSelect: (id: string) => void;
}

/**
 * Decade-grouped season list. The decade holding the selected season is open,
 * the rest are folded, so forty seasons stay four rows plus one open decade.
 * A folded decade still shows its selected season, so the current choice is
 * always visible. Folding and picking are both local state.
 */
const SeasonRail: React.FC<RailProps> = ({ index, selectedId, pathname, onSelect }) => {
  const decades = useMemo(() => groupSeasonsByDecade(index), [index]);
  const selectedDecade = selectedId ? decadeOf(selectedId) : decades[0]?.id ?? null;
  const [overrides, setOverrides] = useState<Record<string, boolean>>({});

  const isOpen = (id: string) => overrides[id] ?? id === selectedDecade;
  const toggle = (id: string) =>
    setOverrides((prev) => ({ ...prev, [id]: !(prev[id] ?? id === selectedDecade) }));

  return (
    <nav
      aria-label="Sezoane"
      className="hidden lg:block w-[212px] shrink-0 border-r-retro border-line-subtle"
    >
      {decades.map((decade, i) => {
        const open = isOpen(decade.id);
        return (
          <div key={decade.id}>
            <button
              type="button"
              onClick={() => toggle(decade.id)}
              aria-expanded={open}
              className={cn(
                "w-full flex items-center justify-between gap-2 px-3 py-3 text-left",
                "transition-colors hover-layer",
                i > 0 && "border-t-retro border-line-subtle",
                open && "bg-surface-subtle",
              )}
            >
              <span className="flex flex-col gap-1 min-w-0">
                <span className="text-label text-primary">
                  {decade.label}
                </span>
                <span className="text-caption text-secondary">
                  {seasonsLabel(decade.seasons.length)}
                </span>
              </span>
              <ChevronDown
                className={cn(
                  "size-4 shrink-0 text-secondary transition-transform duration-fast",
                  open && "rotate-180",
                )}
                aria-hidden
              />
            </button>

            {(open || decade.seasons.some((season) => season.id === selectedId)) && (
              <ul>
                {decade.seasons.filter((season) => open || season.id === selectedId).map((season) => {
                  const active = season.id === selectedId;
                  return (
                    <li key={season.id}>
                      {/* A real link, so a new tab or a shared URL opens on this
                          season; a plain click is handled here instead of by
                          the router (a router navigation would reload the
                          page and jump to the top). */}
                      <a
                        href={seasonHref(pathname, season.id)}
                        onClick={(e) => {
                          if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
                          e.preventDefault();
                          onSelect(season.id);
                        }}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "flex items-baseline gap-2 px-3 py-2",
                          "text-body-sm",
                          active && "font-semibold",
                          "border-l-[3px] border-transparent transition-colors",
                          active
                            ? "border-l-rust bg-surface-subtle text-primary"
                            : "text-secondary hover:text-primary hover-layer",
                        )}
                      >
                        <span>{season.label}</span>
                        <span className="text-caption ml-auto text-secondary tabular-nums">
                          {season.competitionCount}
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        );
      })}
    </nav>
  );
};

// ---------------------------------------------------------------------------
// Summary bar
// ---------------------------------------------------------------------------

const MedalCount: React.FC<{ place: MedalPlace; count: number }> = ({ place, count }) => (
  <span className="inline-flex items-center gap-2">
    <MedalIcon place={place} />
    <span className="text-body font-semibold text-primary tabular-nums">{count}</span>
  </span>
);

type SortKey = "newest" | "oldest" | "medals" | "name";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "newest", label: "Cele mai noi" },
  { value: "oldest", label: "Cele mai vechi" },
  { value: "medals", label: "Cele mai multe medalii" },
  { value: "name", label: "Alfabetic" },
];

const ALL_ATHLETES = "toti";

function medalCount(comp: Competition): number {
  return comp.results.filter((r) => r.placement === 1 || r.placement === 2 || r.placement === 3).length;
}

function sortCompetitions(list: Competition[], key: SortKey): Competition[] {
  const byDate = (a: Competition, b: Competition) => a.isoDate.localeCompare(b.isoDate);
  const sorted = [...list];
  if (key === "newest") sorted.sort((a, b) => byDate(b, a));
  else if (key === "oldest") sorted.sort(byDate);
  else if (key === "medals") sorted.sort((a, b) => medalCount(b) - medalCount(a) || byDate(b, a));
  else sorted.sort((a, b) => a.name.localeCompare(b.name, "ro"));
  return sorted;
}

// ---------------------------------------------------------------------------
// Competition card
// ---------------------------------------------------------------------------

const AthleteName: React.FC<{ result: Result }> = ({ result }) =>
  result.athleteSlug ? (
    <Link
      href={`/despre-noi/sportivi/${result.athleteSlug}`}
      className="link font-semibold text-primary transition-colors"
    >
      {result.athlete}
    </Link>
  ) : (
    <span className="font-semibold text-primary">{result.athlete}</span>
  );

const Place: React.FC<{ placement: number | null }> = ({ placement }) => {
  if (placement === 1 || placement === 2 || placement === 3) {
    const info = getPlacementInfo(placement);
    return <MedalIcon place={placement} label={`${info.label}, locul ${placement}`} />;
  }
  return (
    <span className="text-body font-semibold text-secondary tabular-nums">
      {placement ?? "-"}
    </span>
  );
};

/** One competition, open by default; the header folds its results away. */
const CompetitionCard: React.FC<{ competition: Competition }> = ({ competition }) => {
  const [open, setOpen] = useState(true);
  const meta = [competition.date, competition.location].filter(Boolean).join(", ");
  return (
    <article className="mb-6">
      <h4>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className={cn(
            "w-full flex items-center justify-between gap-3 px-4 py-3 text-left bg-surface-subtle transition-colors hover-layer",
            "border-b-retro border-line",
          )}
        >
          <span className="flex flex-col gap-1 min-w-0">
            <span className="text-subtitle text-primary">{competition.name}</span>
            {meta && <span className="text-caption text-secondary">{meta}</span>}
          </span>
          <ChevronDown
            className={cn("size-4 shrink-0 text-secondary transition-transform duration-fast", open && "rotate-180")}
            aria-hidden
          />
        </button>
      </h4>

      {open && (
        <>
          {/* Desktop and tablet: table, fixed columns so every card lines up */}
          <table className="text-body-sm hidden sm:table w-full table-fixed">
            <thead>
              <tr>
                <th className="text-label text-left text-secondary px-4 py-2 border-b border-line-subtle w-20">
                  Loc
                </th>
                <th className="text-label text-left text-secondary px-4 py-2 border-b border-line-subtle w-2/5">
                  Sportiv
                </th>
                <th className="text-label text-left text-secondary px-4 py-2 border-b border-line-subtle">
                  Categorie
                </th>
                <th className="text-label text-right text-secondary px-4 py-2 border-b border-line-subtle w-24">
                  Punctaj
                </th>
              </tr>
            </thead>
            <tbody>
              {competition.results.map((result, i) => (
                <tr key={i} className="border-b border-line-subtle last:border-b-0">
                  <td className="px-4 py-3 align-middle">
                    <Place placement={result.placement} />
                  </td>
                  <td className="px-4 py-3">
                    <AthleteName result={result} />
                  </td>
                  <td className="px-4 py-3 text-secondary">{result.category || "-"}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-secondary">
                    {formatScore(result.score)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile: one row per result, nothing scrolls sideways */}
          <div className="sm:hidden">
            {competition.results.map((result, i) => {
              const detail = [result.category, result.score != null ? `${result.score.toFixed(2)} puncte` : null]
                .filter(Boolean)
                .join(", ");
              return (
                <div
                  key={i}
                  className="flex items-center gap-3 px-3 py-3 border-b border-line-subtle last:border-b-0"
                >
                  <span className="w-8 shrink-0 inline-flex justify-center">
                    <Place placement={result.placement} />
                  </span>
                  <span className="min-w-0">
                    <span className="text-body-sm block">
                      <AthleteName result={result} />
                    </span>
                    <span className="text-caption text-secondary block mt-1">{detail || "-"}</span>
                  </span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </article>
  );
};

// ---------------------------------------------------------------------------
// Section
// ---------------------------------------------------------------------------

interface SeasonResultsProps {
  /** Every season, reduced to label plus result count. */
  seasonIndex: SeasonIndexEntry[];
  /** Every season with results, in full. Empty when the club has none yet. */
  seasons: Season[];
  /** The season shown first. */
  initialSeasonId: string | null;
}

const SeasonResults: React.FC<SeasonResultsProps> = ({ seasonIndex, seasons, initialSeasonId }) => {
  const pathname = usePathname();
  const [selectedId, setSelectedId] = useState(initialSeasonId);
  const [sortKey, setSortKey] = useState<SortKey>("newest");
  const [athlete, setAthlete] = useState(ALL_ATHLETES);
  const season = seasons.find((s) => s.id === selectedId) ?? seasons[0] ?? null;

  // Switching seasons is local state: the results for every season are
  // already on the page. The URL is updated in place (no router navigation,
  // which would reload the page and reset the scroll) so it stays shareable.
  const selectSeason = useCallback(
    (id: string) => {
      setSelectedId(id);
      // Another season has other athletes, so the athlete filter starts over.
      setAthlete(ALL_ATHLETES);
      window.history.replaceState(window.history.state, "", seasonHref(pathname, id));
    },
    [pathname],
  );
  // Competitions with results, each ordered by placement, best first.
  // Entries with no placement sort last rather than being dropped.
  const seasonCompetitions = useMemo(() => {
    if (!season) return [];
    return season.competitions
      .map((comp) => ({
        ...comp,
        results: [...comp.results].sort(
          (a, b) => (a.placement ?? 999) - (b.placement ?? 999),
        ),
      }))
      .filter((comp) => comp.results.length > 0);
  }, [season]);

  const athleteOptions = useMemo(() => {
    const names = new Set<string>();
    for (const comp of seasonCompetitions) for (const r of comp.results) names.add(r.athlete);
    return [
      { value: ALL_ATHLETES, label: "Toți sportivii" },
      ...[...names].sort((a, b) => a.localeCompare(b, "ro")).map((name) => ({ value: name, label: name })),
    ];
  }, [seasonCompetitions]);

  // The list as shown: filtered to one athlete when picked, then sorted.
  const competitions = useMemo(() => {
    const filtered =
      athlete === ALL_ATHLETES
        ? seasonCompetitions
        : seasonCompetitions
          .map((comp) => ({ ...comp, results: comp.results.filter((r) => r.athlete === athlete) }))
          .filter((comp) => comp.results.length > 0);
    return sortCompetitions(filtered, sortKey);
  }, [seasonCompetitions, athlete, sortKey]);

  const summary = useMemo(() => (season ? summarizeSeason(season) : null), [season]);

  if (seasonIndex.length === 0 || !season || !summary) {
    return (
      <div className="border-retro border-line bg-surface-subtle px-4 py-6">
        <p className="text-body-sm text-secondary">
          Rezultatele pe sezoane vor apărea aici imediat ce sunt publicate.
        </p>
      </div>
    );
  }

  const seasonOptions = seasonIndex.map((s) => ({
    value: s.id,
    label: `${s.label}, ${s.competitionCount === 1 ? "1 competiție" : `${s.competitionCount} competiții`}`,
  }));

  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
      <SeasonRail index={seasonIndex} selectedId={season.id} pathname={pathname} onSelect={selectSeason} />

      <div className="flex-1 min-w-0 w-full">
        {/* Mobile and tablet season picker */}
        <div className="lg:hidden mb-4">
          <label className="sr-only" htmlFor="selector-sezon">
            Alege sezonul
          </label>
          <Select
            id="selector-sezon"
            value={season.id}
            onValueChange={selectSeason}
            options={seasonOptions}
            size="compact"
            className="w-full"
          />
        </div>

        {/* Summary band: the whole season, whatever the filter shows */}
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 bg-surface-subtle px-4 py-3 mb-6">
          <div className="flex items-center gap-3">
            <span className="text-title text-primary tabular-nums">{seasonCompetitions.length}</span>
            <span className="text-label text-secondary">
              {seasonCompetitions.length === 1 ? "Competiție" : "Competiții"} în sezonul {season.label}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="text-label text-secondary">Medalii</span>
            <MedalCount place={1} count={summary.gold} />
            <MedalCount place={2} count={summary.silver} />
            <MedalCount place={3} count={summary.bronze} />
          </div>
        </div>

        {/* Sort and athlete filter, within the season shown */}
        <div className="flex flex-wrap items-end gap-4 mb-6">
          <div className="w-full sm:w-64">
            <label className="text-label text-secondary block mb-2" htmlFor="sortare-competitii">
              Sortează
            </label>
            <Select
              id="sortare-competitii"
              value={sortKey}
              onValueChange={(v) => setSortKey(v as SortKey)}
              options={SORT_OPTIONS}
              size="compact"
              className="w-full"
            />
          </div>
          <div className="w-full sm:w-72">
            <label className="text-label text-secondary block mb-2" htmlFor="filtru-sportiv">
              Sportiv
            </label>
            <Select
              id="filtru-sportiv"
              value={athlete}
              onValueChange={setAthlete}
              options={athleteOptions}
              size="compact"
              className="w-full"
            />
          </div>
        </div>

        {competitions.length === 0 ? (
          <p className="text-body-sm text-secondary py-2">
            Nu avem rezultate pentru acest sezon.
          </p>
        ) : (
          competitions.map((comp) => (
            <CompetitionCard key={`${season.id}-${comp.name}-${comp.isoDate}`} competition={comp} />
          ))
        )}
      </div>
    </div>
  );
};

export default SeasonResults;
