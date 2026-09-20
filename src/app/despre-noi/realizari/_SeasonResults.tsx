"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, ChevronRight } from "lucide-react";
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
}

/**
 * Decade-grouped season list. The decade holding the selected season is open,
 * the rest are folded, so forty seasons stay four rows plus one open decade.
 * Folding is local state, picking a season navigates.
 */
const SeasonRail: React.FC<RailProps> = ({ index, selectedId, pathname }) => {
  const decades = useMemo(() => groupSeasonsByDecade(index), [index]);
  const selectedDecade = selectedId ? decadeOf(selectedId) : decades[0]?.id ?? null;
  const [overrides, setOverrides] = useState<Record<string, boolean>>({});

  const isOpen = (id: string) => overrides[id] ?? id === selectedDecade;
  const toggle = (id: string) =>
    setOverrides((prev) => ({ ...prev, [id]: !(prev[id] ?? id === selectedDecade) }));

  return (
    <nav
      aria-label="Sezoane"
      className="hidden lg:block w-[212px] shrink-0 border-r-[1.5px] border-navy/15"
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
                "w-full flex items-start gap-2 px-3 py-2.5 text-left",
                "transition-colors hover:bg-navy/[0.07]",
                i > 0 && "border-t border-navy/12",
                open && "bg-navy/5",
              )}
            >
              {open ? (
                <ChevronDown className="w-3 h-3 shrink-0 mt-1 text-navy/45" aria-hidden />
              ) : (
                <ChevronRight className="w-3 h-3 shrink-0 mt-1 text-navy/45" aria-hidden />
              )}
              <span className="flex flex-col gap-0.5 min-w-0">
                <span className="font-display text-2xs font-extrabold uppercase tracking-[0.06em] text-navy">
                  {decade.label}
                </span>
                <span className="text-3xs font-semibold text-navy/45">
                  {seasonsLabel(decade.seasons.length)}, {resultsLabel(decade.resultCount)}
                </span>
              </span>
            </button>

            {open && (
              <ul>
                {decade.seasons.map((season) => {
                  const active = season.id === selectedId;
                  return (
                    <li key={season.id}>
                      <Link
                        href={seasonHref(pathname, season.id)}
                        scroll={false}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "flex items-baseline gap-2 px-3 py-2",
                          "font-display text-[13.5px] font-extrabold",
                          "border-l-[3px] border-transparent transition-colors",
                          active
                            ? "border-l-rust bg-navy/5 text-navy"
                            : "text-navy/55 hover:text-navy hover:bg-navy/[0.03]",
                        )}
                      >
                        <span>{season.label}</span>
                        <span className="ml-auto font-sans text-2xs font-semibold text-navy/45 tabular-nums">
                          {season.resultCount}
                        </span>
                      </Link>
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
    <span className="font-display text-xl sm:text-[23px] font-extrabold leading-none text-navy tabular-nums">
      {value}
    </span>
    <span className="text-3xs font-bold uppercase tracking-[0.1em] text-navy/50">
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
      "font-display text-2xs sm:text-xs font-extrabold border-[1.5px] border-navy px-2 py-1 leading-none",
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
      className="link-underline-rust font-semibold text-navy hover:text-rust transition-colors"
    >
      {result.athlete}
    </Link>
  ) : (
    <span className="font-semibold text-navy">{result.athlete}</span>
  );

const CompetitionCard: React.FC<{ competition: Competition }> = ({ competition }) => {
  const meta = [competition.date, competition.location].filter(Boolean).join(", ");
  return (
    <article className="border-[1.5px] border-navy bg-white mb-3.5">
      <header className="flex flex-wrap items-center gap-x-3 gap-y-1.5 px-3.5 py-2.5 border-b-[1.5px] border-navy bg-cream">
        <h4 className="font-display text-[15px] font-extrabold text-navy">
          {competition.name}
        </h4>
        <span
          className={cn(
            "font-display text-3xs font-extrabold uppercase tracking-[0.1em] px-1.5 py-0.5 border-[1.5px]",
            competition.level === "international"
              ? "bg-burgundy text-white border-burgundy"
              : "border-navy text-navy",
          )}
        >
          {competition.level === "international" ? "Internațional" : "Național"}
        </span>
        {meta && (
          <span className="text-2xs text-navy/55 w-full sm:w-auto">{meta}</span>
        )}
      </header>

      {/* Desktop and tablet: table */}
      <table className="hidden sm:table w-full text-[13px]">
        <thead>
          <tr>
            <th className="text-left text-3xs font-extrabold uppercase tracking-[0.11em] text-navy/45 px-3.5 py-2 border-b border-navy/12 w-[86px]">
              Loc
            </th>
            <th className="text-left text-3xs font-extrabold uppercase tracking-[0.11em] text-navy/45 px-3.5 py-2 border-b border-navy/12">
              Sportiv
            </th>
            <th className="text-left text-3xs font-extrabold uppercase tracking-[0.11em] text-navy/45 px-3.5 py-2 border-b border-navy/12">
              Categorie
            </th>
            <th className="text-right text-3xs font-extrabold uppercase tracking-[0.11em] text-navy/45 px-3.5 py-2 border-b border-navy/12 w-[92px]">
              Punctaj
            </th>
          </tr>
        </thead>
        <tbody>
          {competition.results.map((result, i) => {
            const info = result.placement != null ? getPlacementInfo(result.placement) : null;
            return (
              <tr key={i} className="border-b border-navy/[0.07] last:border-b-0">
                <td
                  className={cn(
                    "px-3.5 py-2.5 font-display font-extrabold",
                    info?.accent ? info.textClass : "text-navy/60",
                  )}
                >
                  {info?.label ?? "-"}
                </td>
                <td className="px-3.5 py-2.5">
                  <AthleteName result={result} />
                </td>
                <td className="px-3.5 py-2.5 text-navy/70">{result.category || "-"}</td>
                <td className="px-3.5 py-2.5 text-right tabular-nums text-navy/60">
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
              className="px-3 py-2.5 border-b border-navy/[0.07] last:border-b-0"
            >
              <div className="flex items-baseline gap-2 flex-wrap">
                <span
                  className={cn(
                    "font-display text-[13px] font-extrabold",
                    info?.accent ? info.textClass : "text-navy/60",
                  )}
                >
                  {info?.label ?? "-"}
                </span>
                <span className="text-[13.5px]">
                  <AthleteName result={result} />
                </span>
              </div>
              <p className="text-2xs text-navy/55 mt-0.5">{detail || "-"}</p>
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
  /** The one season shown in full. Null when the club has no results yet. */
  season: Season | null;
}

const SeasonResults: React.FC<SeasonResultsProps> = ({ seasonIndex, season }) => {
  const router = useRouter();
  const pathname = usePathname();
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
      <div className="border-[1.5px] border-navy bg-cream px-4 py-6">
        <p className="text-sm text-navy/60">
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
    <div className="flex flex-col lg:flex-row gap-5 lg:gap-7 items-start">
      <SeasonRail index={seasonIndex} selectedId={season.id} pathname={pathname} />

      <div className="flex-1 min-w-0 w-full">
        {/* Mobile and tablet season picker */}
        <div className="lg:hidden mb-4">
          <label className="sr-only" htmlFor="selector-sezon">
            Alege sezonul
          </label>
          <Select
            id="selector-sezon"
            value={season.id}
            onValueChange={(value) => router.push(seasonHref(pathname, value), { scroll: false })}
            options={seasonOptions}
            size="compact"
            className="w-full"
          />
        </div>

        {/* Summary bar */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-[1.5px] border-navy bg-cream px-4 py-3 mb-5">
          <Stat value={summary.results} label="rezultate" />
          <Stat value={summary.competitions} label="competiții" />
          <Stat value={summary.athletes} label="sportivi" />
          <div className="flex gap-1.5 ml-auto">
            <Medal count={summary.gold} label="aur" className="bg-mustard text-navy" />
            <Medal count={summary.silver} label="argint" className="bg-silver text-navy" />
            <Medal count={summary.bronze} label="bronz" className="bg-orange text-white" />
          </div>
        </div>

        {competitions.length === 0 ? (
          <p className="text-sm text-navy/50 py-2">
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
