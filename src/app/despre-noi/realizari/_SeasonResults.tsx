"use client";

import React, { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { cn } from "@/utils/cn";
import { Select } from "@/components/ui/select";
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

function resultsLabel(n: number): string {
  return n === 1 ? "1 rezultat" : `${n} rezultate`;
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
                          {season.resultCount}
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

const Stat: React.FC<{ value: number; label: string }> = ({ value, label }) => (
  <div className="flex flex-col gap-px">
    <span className="text-title text-primary tabular-nums">
      {value}
    </span>
    <span className="text-label uppercase text-secondary">
      {label}
    </span>
  </div>
);

const Medal: React.FC<{ count: number; label: string; className: string }> = ({
  count,
  label,
  className,
}) => (
  <span
    className={cn(
      "text-title border-retro border-line px-2 py-1",
      className,
    )}
  >
    <span className="tabular-nums">{count}</span>
    <span className="hidden sm:inline"> {label}</span>
  </span>
);

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

const CompetitionCard: React.FC<{ competition: Competition }> = ({ competition }) => {
  const meta = [competition.date, competition.location].filter(Boolean).join(", ");
  return (
    <article className="border-retro border-line bg-surface-raised mb-4">
      <header className="flex flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3 border-b-retro border-line bg-surface-subtle">
        <h4 className="text-title text-primary">
          {competition.name}
        </h4>
        <span
          className={cn(
            "text-label px-2 py-0.5 border-retro",
            competition.level === "international"
              ? "bg-burgundy text-primary-on-dark border-burgundy"
              : "border-line text-primary",
          )}
        >
          {competition.level === "international" ? "Internațional" : "Național"}
        </span>
        {meta && (
          <span className="text-caption text-secondary w-full sm:w-auto">{meta}</span>
        )}
      </header>

      {/* Desktop and tablet: table */}
      <table className="text-caption hidden sm:table w-full">
        <thead>
          <tr>
            <th className="text-label text-left uppercase text-secondary px-4 py-2 border-b border-line-subtle w-[86px]">
              Loc
            </th>
            <th className="text-label text-left uppercase text-secondary px-4 py-2 border-b border-line-subtle">
              Sportiv
            </th>
            <th className="text-label text-left uppercase text-secondary px-4 py-2 border-b border-line-subtle">
              Categorie
            </th>
            <th className="text-label text-right uppercase text-secondary px-4 py-2 border-b border-line-subtle w-[92px]">
              Punctaj
            </th>
          </tr>
        </thead>
        <tbody>
          {competition.results.map((result, i) => {
            const info = result.placement != null ? getPlacementInfo(result.placement) : null;
            return (
              <tr key={i} className="border-b border-line-subtle last:border-b-0">
                <td className="px-4 py-3">
                  {info?.chipClass ? (
                    <span
                      className={cn(
                        "h-7 px-2 inline-flex items-center justify-center font-display font-extrabold text-primary",
                        info.chipClass,
                      )}
                    >
                      {info.label}
                    </span>
                  ) : (
                    <span className="font-display font-extrabold text-secondary">
                      {info?.label ?? "-"}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <AthleteName result={result} />
                </td>
                <td className="px-4 py-3 text-secondary">{result.category || "-"}</td>
                <td className="px-4 py-3 text-right tabular-nums text-secondary">
                  {formatScore(result.score)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Mobile: one card per result, nothing scrolls sideways */}
      <div className="sm:hidden">
        {competition.results.map((result, i) => {
          const info = result.placement != null ? getPlacementInfo(result.placement) : null;
          const detail = [result.category, result.score != null ? `${result.score.toFixed(2)} puncte` : null]
            .filter(Boolean)
            .join(", ");
          return (
            <div
              key={i}
              className="px-3 py-3 border-b border-line-subtle last:border-b-0"
            >
              <div className="flex items-baseline gap-2 flex-wrap">
                {info?.chipClass ? (
                  <span
                    className={cn(
                      "h-7 px-2 inline-flex items-center justify-center text-title text-primary",
                      info.chipClass,
                    )}
                  >
                    {info.label}
                  </span>
                ) : (
                  <span className="text-title text-secondary">{info?.label ?? "-"}</span>
                )}
                <span className="text-caption">
                  <AthleteName result={result} />
                </span>
              </div>
              <p className="text-caption text-secondary mt-0.5">{detail || "-"}</p>
            </div>
          );
        })}
      </div>
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
  const season = seasons.find((s) => s.id === selectedId) ?? seasons[0] ?? null;

  // Switching seasons is local state: the results for every season are
  // already on the page. The URL is updated in place (no router navigation,
  // which would reload the page and reset the scroll) so it stays shareable.
  const selectSeason = useCallback(
    (id: string) => {
      setSelectedId(id);
      window.history.replaceState(window.history.state, "", seasonHref(pathname, id));
    },
    [pathname],
  );
  // Results are ordered by placement, best first. Entries with no placement
  // sort last rather than being dropped.
  const competitions = useMemo(() => {
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
    label: `${s.label}, ${resultsLabel(s.resultCount)}`,
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

        {/* Summary bar */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-retro border-line bg-surface-subtle px-4 py-3 mb-6">
          <Stat value={summary.results} label="rezultate" />
          <Stat value={summary.competitions} label="competiții" />
          <Stat value={summary.athletes} label="sportivi" />
          <div className="flex gap-2 ml-auto">
            <Medal count={summary.gold} label="aur" className="bg-mustard text-primary" />
            <Medal count={summary.silver} label="argint" className="bg-medal-silver text-primary" />
            <Medal count={summary.bronze} label="bronz" className="bg-brown text-primary-on-dark" />
          </div>
        </div>

        {competitions.length === 0 ? (
          <p className="text-body-sm text-secondary py-2">
            Nu avem rezultate pentru acest sezon.
          </p>
        ) : (
          competitions.map((comp, i) => (
            <CompetitionCard key={`${comp.name}-${comp.date}-${i}`} competition={comp} />
          ))
        )}
      </div>
    </div>
  );
};

export default SeasonResults;
