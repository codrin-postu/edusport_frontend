import React from "react";
import Image from "next/image";
import { cn } from "@/utils/cn";
import { Icon } from "@/components/ui/icon";
import Breadcrumb from "@/components/ui/breadcrumb";
import { Stat } from "@/components/ui/stat";
import { Chip } from "@/components/ui/chip";
import {
  computeStats,
  pickNotableResults,
  type SportspersonCompetition,
  type SportspersonProgram,
  type SportspersonSeason,
  type SportspersonStats,
  type StrapiSportsperson,
} from "@/lib/strapi-sportsperson";
import { strapiMediaUrl } from "@/lib/strapi-article";
import type { SkateResult } from "@/lib/skate-results";
import SkateResults from "./_SkateResults";
import { getPlacementInfo, type PlacementInfo } from "@/app/despre-noi/realizari/_data";
import { GalleryCarousel } from "@/components/blocks/gallery-carousel";
import { Pagination } from "@/components/Pagination";
import Button from "@/components/ui/button";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { SITE_URL } from "@/lib/site";
import StrapiBlocks from "@/components/blocks/strapi-blocks/StrapiBlocks";

/**
 * Sportsperson profile — retro editorial layout.
 *
 * Hero is the showpiece: navy band, huge stacked filled+stroked name
 * (League Spartan display, ~110px on desktop), photo as inset with the
 * brand gold→rust→navy gradient, "01" watermark, and a 3-stat row. Right
 * after it comes "Despre mine" — the athlete's narrative bio (Inter
 * lead). The rest (attribute grid, Programe, Performanțe, Galerie,
 * Istoric, Outro) sits on cream so the editorial weight lives up top —
 * same rhythm as the sportivi index, in the shared retro system
 * (cream / navy / rust / gold, League Spartan display + Inter body).
 */

interface Props {
  sportsperson: StrapiSportsperson;
  competitions: SportspersonCompetition[];
  /** Current page of the Istoric competițional list. URL-driven via
   *  `?compPage=N` so the existing `<Pagination>` component can be reused. */
  compPage: number;
  /** Auto-scraped results from skate-results when the athlete is linked
   *  (`skateResultsSlug`). When present, they replace the manual Istoric. */
  skateResults?: SkateResult[];
}

const ISTORIC_PER_PAGE = 5;

/** Competitions sourced from skate-results can arrive without a date, in
 *  which case `date` is an empty string. Render nothing rather than the
 *  literal "Invalid Date". */
function formatDate(iso: string): string {
  if (!iso || Number.isNaN(new Date(iso).getTime())) return "";
  return new Date(iso).toLocaleDateString("ro-RO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

/**
 * Returns the athlete's best medal tier (gold > silver > bronze), its
 * count, and the Romanian label. Mirrors the index card's `tierFor()`
 * priority so the profile and listing stay in sync.
 */
function topTier(stats: SportspersonStats): { count: number; label: string } | null {
  if (stats.goldCount > 0) return { count: stats.goldCount, label: "Aur" };
  if (stats.silverCount > 0) return { count: stats.silverCount, label: "Argint" };
  if (stats.bronzeCount > 0) return { count: stats.bronzeCount, label: "Bronz" };
  return null;
}

/**
 * Category from the athlete's most-recent competition. Competitions are
 * already sorted `date:desc`, so the first non-empty category in the
 * first competition's participant rows is "current tier" — a fresher
 * read than a majority vote across the whole career. Falls back to
 * "Sportiv EduSport" when the athlete has no competitions yet.
 */
function mostRecentCategory(competitions: SportspersonCompetition[]): string {
  for (const comp of competitions) {
    for (const row of comp.participantsForThisAthlete) {
      if (row.category) return row.category;
    }
  }
  return "Sportiv EduSport";
}

const SportspersonView: React.FC<Props> = ({
  sportsperson,
  competitions,
  compPage,
  skateResults,
}) => {
  // When the athlete is linked to skate-results and we got rows back, the rich
  // auto-scraped results replace the manually-entered Istoric list.
  const hasScrapedResults =
    !!sportsperson.skateResultsSlug && (skateResults?.length ?? 0) > 0;
  const stats = computeStats(competitions, sportsperson.activeSince);
  const notableResults = pickNotableResults(competitions, 2);
  const tier = topTier(stats);
  const category = mostRecentCategory(competitions);
  const firstName = sportsperson.name.split(" ")[0];

  // Flatten competition history → one row per participation. An athlete
  // can appear multiple times in the same competition (e.g. solo + duet)
  // so we don't dedupe by competition documentId.
  const historyRows: {
    comp: SportspersonCompetition;
    row: SportspersonCompetition["participantsForThisAthlete"][number];
    key: string;
  }[] = competitions.flatMap((comp) =>
    comp.participantsForThisAthlete.map((row, idx) => ({
      comp,
      row,
      key: `${comp.documentId}-${idx}`,
    })),
  );

  const totalIstoricPages = Math.max(
    1,
    Math.ceil(historyRows.length / ISTORIC_PER_PAGE),
  );
  const safeIstoricPage = Math.min(compPage, totalIstoricPages);
  const visibleHistoryRows = historyRows.slice(
    (safeIstoricPage - 1) * ISTORIC_PER_PAGE,
    safeIstoricPage * ISTORIC_PER_PAGE,
  );

  return (
    <div className="min-h-screen bg-surface">
      <BreadcrumbJsonLd
        items={[
          { name: "Sportivi", url: `${SITE_URL}/despre-noi/sportivi` },
          {
            name: sportsperson.name,
            url: `${SITE_URL}/despre-noi/sportivi/${sportsperson.slug}`,
          },
        ]}
      />
      {/* ─── BREADCRUMB ─── extra top padding to clear the fixed site
          header (other pages either use PageHeroSection which is
          sticky-positioned, or add their own pt clearance — articles use
          pt-8). Without this the bar tucks behind the nav. */}
      <div className="bg-surface-dark pt-8">
        <div className="mx-auto w-full max-w-content gutter py-4">
          <Breadcrumb
            onDark
            items={[
              { label: "Sportivi", href: "/despre-noi/sportivi" },
              { label: sportsperson.name },
            ]}
          />
        </div>
      </div>

      {/* ─── EDITORIAL HERO BAND (navy) ─── */}
      <section className="relative overflow-hidden bg-surface-dark pt-4 pb-12 text-primary-on-dark md:pb-16">
        <div className="relative mx-auto w-full max-w-content gutter">
          <div className="grid items-end gap-8 md:grid-cols-[1.4fr_1fr]">
            {/* Left: category eyebrow + huge stacked name. The narrative
                bio now lives in its own "Despre mine" section below. */}
            <div>
              <div className="text-label mb-4 uppercase text-medal-gold">
                {category}
              </div>
              <h1 className="text-athlete-name">
                <NameStack name={sportsperson.name} />
              </h1>
            </div>

            {/* Right: photo inset with the brand gold→rust→navy gradient
                (visible as frame / behind photo-less athletes). */}
            <div className="relative h-[240px] overflow-hidden bg-gradient-to-br from-medal-gold via-rust to-navy md:h-[300px]">
              {sportsperson.photo?.url && (
                <Image
                  src={strapiMediaUrl(sportsperson.photo.url)}
                  alt={sportsperson.photo.alternativeText ?? sportsperson.name}
                  fill
                  priority
                  sizes="(min-width: 768px) 380px, 100vw"
                  className="object-cover"
                />
              )}
              {sportsperson.activeSince && (
                <span className="text-label absolute bottom-3 left-3 bg-overlay px-3 py-1 uppercase text-primary-on-dark backdrop-blur-sm">
                  Membru din {sportsperson.activeSince.slice(0, 4)}
                </span>
              )}
            </div>
          </div>

          {/* Stats row */}
          <div className="mt-8 grid grid-cols-1 gap-6 border-t border-line-subtle-on-dark pt-6 sm:grid-cols-3">
            <Stat value={pad(stats.totalCompetitions)} label="Competiții" onDark accent />
            {tier ? (
              <Stat value={`${tier.count}×`} label={tier.label} onDark />
            ) : (
              <Stat value="—" label="Medalii" onDark />
            )}
            <Stat
              value={stats.bestScore !== null ? stats.bestScore.toFixed(2) : "—"}
              label="Cel mai bun scor"
              onDark
            />
          </div>
        </div>
      </section>

      {/* ─── DESPRE MINE (narrative bio) ───
          Only rendered when there is something to say. It used to fall back to
          a "biography coming soon" placeholder, which promised content nobody
          had committed to writing and made every unfinished profile look the
          same. An absent section reads as complete; a placeholder reads as
          neglected. */}
      {(hasItems(sportsperson.story) || sportsperson.description) && (
        <section className="relative overflow-hidden bg-surface section">
          <SectionWatermark>DESPRE</SectionWatermark>
          <div className="relative mx-auto w-full max-w-content gutter">
            <div className="text-label uppercase text-accent">
              Despre mine
            </div>
            {hasItems(sportsperson.story) ? (
              <div className="text-body mt-6 max-w-prose text-primary">
                <StrapiBlocks blocks={sportsperson.story} />
              </div>
            ) : (
              <p className="text-body mt-6 max-w-prose text-primary">
                {sportsperson.description}
              </p>
            )}
          </div>
        </section>
      )}

      {/* ─── ATRIBUTE (Despre — moves / hobbies / team / goal) ─── */}
      {(hasItems(sportsperson.favoriteMoves) ||
        hasItems(sportsperson.hobbies) ||
        hasItems(sportsperson.coaches) ||
        hasItems(sportsperson.choreographers) ||
        sportsperson.careerGoal) && (
        <section className="relative overflow-hidden bg-surface pb-16 md:pb-24">
          <div className="relative mx-auto w-full max-w-content gutter">
            <DespreGrid>
              {hasItems(sportsperson.favoriteMoves) && (
                <DespreCell title="Mișcări preferate">
                  <BulletList items={sportsperson.favoriteMoves} />
                </DespreCell>
              )}
              {hasItems(sportsperson.hobbies) && (
                <DespreCell title="Pasiuni & hobby-uri">
                  <BulletList items={sportsperson.hobbies} />
                </DespreCell>
              )}
              {(hasItems(sportsperson.coaches) || hasItems(sportsperson.choreographers)) && (
                <DespreCell title="Antrenori">
                  {hasItems(sportsperson.coaches) && (
                    <div className="text-body-sm text-primary">
                      {sportsperson.coaches.map((c, i) => (
                        <span key={i}>
                          {i > 0 && <span className="mx-1 text-line-subtle">·</span>}
                          {c.name}
                          {c.role && (
                            <span className="text-caption ml-1 text-secondary">
                              · {c.role}
                            </span>
                          )}
                        </span>
                      ))}
                    </div>
                  )}
                  {hasItems(sportsperson.choreographers) && (
                    <div className="text-body-sm mt-2 text-primary">
                      <span className="text-label mr-2 uppercase text-secondary">
                        Coregrafe
                      </span>
                      {sportsperson.choreographers.map((c) => c.name).join(", ")}
                    </div>
                  )}
                </DespreCell>
              )}
              {sportsperson.careerGoal && (
                <DespreCell title="Obiectiv">
                  <p className="text-body border-l-[3px] border-rust pl-3 text-secondary">
                    {sportsperson.careerGoal}
                  </p>
                </DespreCell>
              )}
            </DespreGrid>
          </div>
        </section>
      )}

      {/* ─── PROGRAME MUZICALE ─── */}
      {hasItems(sportsperson.seasons) && (
        <section className="relative overflow-hidden bg-surface section">
          <SectionWatermark>MUZICĂ</SectionWatermark>
          <div className="relative mx-auto w-full max-w-content gutter">
            <div className="text-label uppercase text-accent">
              Programe muzicale
            </div>
            <h2 className="text-heading mt-2 text-primary">
              Muzica pe gheață
            </h2>
            <ProgramSeasons seasons={sortSeasonsDesc(sportsperson.seasons)} />
          </div>
        </section>
      )}

      {/* ─── PERFORMANȚE DE VÂRF (oversized placement numerals) ─── */}
      {notableResults.length > 0 && (
        <section className="relative overflow-hidden bg-surface-dark section text-primary-on-dark">
          <SectionWatermark tone="gold">PERFORMANȚE</SectionWatermark>
          <div className="relative mx-auto w-full max-w-content gutter">
            <div className="text-label uppercase text-medal-gold">
              Cele mai notabile rezultate
            </div>
            <h2 className="text-heading mt-2 text-primary-on-dark">
              Performanțe de vârf
            </h2>
            <div className="mt-8 flex flex-col">
              {notableResults.map((r, idx) => {
                const info = getPlacementInfo(r.placement);
                const stroke = info.accent ?? "var(--color-retro-cream)";
                return (
                  <div
                    key={`${r.competition.documentId}-${idx}`}
                    className={cn(
                      "grid grid-cols-[64px_1fr] items-center gap-6 py-6 sm:grid-cols-[86px_1fr] sm:gap-8",
                      idx < notableResults.length - 1 && "border-b border-line-subtle-on-dark",
                    )}
                  >
                    <div
                      aria-hidden
                      className="font-display select-none text-[56px] font-black leading-[0.8] sm:text-[76px]"
                      style={{ color: "transparent", WebkitTextStroke: `2px ${stroke}` }}
                    >
                      {r.placement ?? "—"}
                    </div>
                    <div className="min-w-0">
                      <span
                        className={cn(
                          "text-label uppercase",
                          info.textClass,
                        )}
                      >
                        {info.label}
                      </span>
                      <h3 className="text-title mt-1 text-primary-on-dark">
                        {r.competition.name}
                      </h3>
                      <div className="text-caption mt-1 text-secondary-on-dark">
                        {formatDate(r.competition.date)}
                        {r.competition.location && <> · {r.competition.location}</>}
                        {r.score !== undefined && (
                          <>
                            {" · "}
                            <span className="font-bold text-medal-gold">
                              {r.score.toFixed(2)}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ─── GALLERY ─── */}
      {hasItems(sportsperson.gallery) && (
        <section className="relative overflow-hidden bg-surface section">
          <SectionWatermark>GALERIE</SectionWatermark>
          <div className="relative mx-auto w-full max-w-content gutter">
            <GalleryCarousel
              images={sportsperson.gallery.map((img) => ({
                src: strapiMediaUrl(img.url),
                alt: img.alternativeText ?? img.caption ?? sportsperson.name,
              }))}
              eyebrow="Galerie"
              className="mb-0"
            />
          </div>
        </section>
      )}

      {/* ─── REZULTATE (auto, din skate-results) ─── */}
      {hasScrapedResults && (
        <section
          id="istoric"
          className="relative overflow-hidden bg-surface section scroll-mt-24"
        >
          <SectionWatermark>REZULTATE</SectionWatermark>
          <div className="relative mx-auto w-full max-w-content gutter">
            <div className="text-label uppercase text-accent">
              Rezultate competiții
            </div>
            <h2 className="text-heading mt-2 text-primary">
              Toate competițiile
            </h2>
            <SkateResults results={skateResults ?? []} />
          </div>
        </section>
      )}

      {/* ─── ISTORIC COMPETIȚIONAL (manual, doar dacă nu e conectat) ─── */}
      {!hasScrapedResults && historyRows.length > 0 && (
        <section
          id="istoric"
          className="relative overflow-hidden bg-surface section scroll-mt-24"
        >
          <SectionWatermark>ISTORIC</SectionWatermark>
          <div className="relative mx-auto w-full max-w-content gutter">
            <div className="text-label uppercase text-accent">
              Istoric competițional
            </div>
            <h2 className="text-heading mt-2 text-primary">
              Toate competițiile
            </h2>
            <div className="mt-8 flex flex-col">
              {visibleHistoryRows.map(({ comp, row, key }, idx) => {
                const info: PlacementInfo | null =
                  row.placement !== undefined ? getPlacementInfo(row.placement) : null;
                return (
                  <article
                    key={key}
                    className={cn(
                      "relative flex flex-col gap-2 py-4 sm:grid sm:grid-cols-[1fr_auto_auto] sm:items-center sm:gap-x-6",
                      idx < visibleHistoryRows.length - 1 && "border-b border-line-subtle",
                    )}
                  >
                    <div className="relative min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-title text-primary">{comp.name}</h4>
                        {comp.level === "international" && (
                          <Chip tone="neutral">Internațional</Chip>
                        )}
                      </div>
                      <div className="text-caption mt-1 flex flex-wrap items-center gap-2 text-secondary">
                        <span>{formatDate(comp.date)}</span>
                        {comp.location && (
                          <>
                            <span>·</span>
                            <span className="flex items-center gap-1">
                              <Icon name="map-pin" />
                              {comp.location}
                            </span>
                          </>
                        )}
                        {row.category && (
                          <>
                            <span>·</span>
                            <span>{row.category}</span>
                          </>
                        )}
                      </div>
                    </div>
                    {/* Score + placement: side-by-side on mobile (flex row,
                        left of the article), promoted to grid columns on
                        sm+ via `display: contents`. */}
                    <div className="flex items-baseline gap-3 sm:contents">
                      {row.score !== undefined && (
                        <span className="text-caption tabular-nums text-secondary">
                          {row.score.toFixed(2)}
                        </span>
                      )}
                      {info && (
                        <span
                          className={cn(
                            "text-label uppercase sm:min-w-[72px] sm:text-right",
                            info.textClass,
                          )}
                        >
                          {info.label}
                        </span>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
            <Pagination
              currentPage={safeIstoricPage}
              totalPages={totalIstoricPages}
              basePath={`/despre-noi/sportivi/${sportsperson.slug}`}
              scrollAnchor="istoric"
              paramName="compPage"
            />
          </div>
        </section>
      )}

      {/* ─── OUTRO ─── */}
      <section className="border-t border-line-subtle bg-surface section-compact">
        <div className="mx-auto flex w-full max-w-content flex-col items-start gap-6 gutter sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-label uppercase text-accent">
              Mai departe
            </div>
            <p className="text-body mt-2 text-primary">
              Vezi toți sportivii clubului EduSport.
            </p>
          </div>
          <Button
            face="black"
            href="/despre-noi/sportivi"
          >
            Toți sportivii
          </Button>
        </div>
      </section>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Local helpers
// ---------------------------------------------------------------------------

/** Strapi JSON/multi-media fields return null when unset. */
function hasItems<T>(list: T[] | null | undefined): list is T[] {
  return Array.isArray(list) && list.length > 0;
}

/**
 * Decorative top-right section watermark — League Spartan display at very
 * low opacity. Echoes the hero "01" treatment. Each editorial section
 * gets one so the profile reads as a magazine spread rather than a stack
 * of CMS panels.
 */
function SectionWatermark({
  children,
  tone = "navy",
}: {
  children: React.ReactNode;
  tone?: "navy" | "gold";
}) {
  const colour = tone === "gold" ? "rgba(251,191,36,0.12)" : "rgba(14,26,60,0.05)";
  return (
    <span
      aria-hidden
      className="font-display pointer-events-none absolute -right-2 top-10 hidden select-none font-black uppercase leading-none md:inline md:top-12 md:text-[88px]"
      style={{ color: colour }}
    >
      {children}
    </span>
  );
}

/** Newest-season-first sort, non-destructive. The CMS may save seasons
 *  in any order; we always render most-recent first to match competition
 *  history sort direction. */
function sortSeasonsDesc(
  seasons: SportspersonSeason[],
): SportspersonSeason[] {
  return [...seasons].sort((a, b) => b.season.localeCompare(a.season));
}

/**
 * Two-line filled+stroked name treatment. First word is filled cream,
 * everything after is stroked (outlined cream). The Spotlight component
 * on the index page uses the identical structure — keeping it in sync
 * here preserves the editorial signature across both surfaces.
 */
function NameStack({ name }: { name: string }) {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.toUpperCase() ?? "";
  const rest = parts.slice(1).join(" ").toUpperCase();
  return (
    <>
      <span className="block text-primary-on-dark">{first}</span>
      {rest && (
        <span
          className="block"
          style={{
            color: "transparent",
            WebkitTextStroke: "1.5px var(--color-retro-cream)",
          }}
        >
          {rest}
        </span>
      )}
    </>
  );
}

/**
 * Borderless 2-column grid for the Despre cells. Each cell is a single
 * rust micro-label + its content — no numbers, no icons, no double
 * labelling (the descriptive title carries the meaning on its own).
 */
function DespreGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid gap-y-12 gap-x-16 md:grid-cols-2">{children}</div>
  );
}

/**
 * Single Despre cell: a rust uppercase micro-label (the descriptive
 * title) above its content (bullets / names / quote).
 */
function DespreCell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-0">
      <div className="text-label mb-3 uppercase text-accent">
        {title}
      </div>
      {children}
    </div>
  );
}

/**
 * Borderless Programe layout: each season is a row with the season
 * label on the left (Inter eyebrow + bold year) and two-column program
 * rows on the right. Shows the 3 most recent seasons by default; older
 * ones collapse behind a `<details>` toggle so a long-career athlete
 * doesn't dominate the page. Native `<details>` keeps this a server
 * component — no client JS needed for the expand interaction.
 */
function ProgramSeasons({ seasons }: { seasons: SportspersonSeason[] }) {
  const PRIMARY = 3;
  const primary = seasons.slice(0, PRIMARY);
  const older = seasons.slice(PRIMARY);
  return (
    <div className="mt-8 flex flex-col gap-8">
      {primary.map((s) => (
        <SeasonRow key={s.season} season={s.season} items={s.programs ?? []} />
      ))}
      {older.length > 0 && (
        <details className="group/seasons">
          <summary className="text-label -mx-1 inline-flex cursor-pointer list-none items-center gap-2 px-1 uppercase text-accent transition-colors hover:text-primary [&::-webkit-details-marker]:hidden">
            <span className="group-open/seasons:hidden">
              Vezi sezoanele anterioare ({older.length})
            </span>
            <span className="hidden group-open/seasons:inline">Arată mai puțin</span>
            <Icon name="chevron-right" className="transition-transform group-open/seasons:rotate-90" />
          </summary>
          <div className="mt-8 flex flex-col gap-8">
            {older.map((s) => (
              <SeasonRow key={s.season} season={s.season} items={s.programs ?? []} />
            ))}
          </div>
        </details>
      )}
    </div>
  );
}

function SeasonRow({
  season,
  items,
}: {
  season: string;
  items: SportspersonProgram[];
}) {
  return (
    <div>
      <div className="text-label mb-3 uppercase text-secondary">
        Sezon {season}
      </div>
      <div className="grid gap-x-8 gap-y-2 sm:grid-cols-2">
        {items.map((p, i) => (
          <div
            key={`${season}-${i}`}
            className="grid grid-cols-[120px_1fr] items-baseline gap-3 py-2"
          >
            <div className="text-label uppercase text-medal-gold">
              {p.type}
            </div>
            <div className="min-w-0">
              <div className="text-body-sm text-primary">
                {p.title}
              </div>
              {p.artist && (
                <div className="text-caption text-secondary">{p.artist}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Compact chevron bullet list — retro convention (rust chevrons). */
function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-2">
      {items.map((item, i) => (
        <li
          key={i}
          className="text-body-sm flex items-start gap-2 text-primary"
        >
          <Icon name="chevron-right" className="mt-1 text-accent" />
          {item}
        </li>
      ))}
    </ul>
  );
}

export default SportspersonView;
