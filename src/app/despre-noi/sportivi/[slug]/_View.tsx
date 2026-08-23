import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, MapPin } from "lucide-react";
import { cn } from "@/utils/cn";
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
import { getPlacementInfo, type PlacementInfo } from "@/app/despre-noi/realizari/_data";
import { GalleryCarousel } from "@/components/blocks/gallery-carousel";
import { Pagination } from "@/components/Pagination";
import SpotlightButton from "@/components/ui/spotlight-button";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { SITE_URL } from "@/lib/site";
import StrapiBlocks from "@/components/blocks/strapi-blocks/StrapiBlocks";

/**
 * Sportsperson profile — retro editorial layout.
 *
 * Hero is the showpiece: navy band, huge stacked filled+stroked name
 * (League Spartan display, ~110px on desktop), photo as inset with the
 * brand gold→rust→blue gradient, "01" watermark, and a 3-stat row. Right
 * after it comes "Despre mine" — the athlete's narrative bio (Lora serif
 * lead). The rest (attribute grid, Programe, Performanțe, Galerie,
 * Istoric, Outro) sits on cream so the editorial weight lives up top —
 * same rhythm as the sportivi index, in the shared retro system
 * (cream / navy / rust / gold, League Spartan display + Lora serif).
 */

interface Props {
  sportsperson: StrapiSportsperson;
  competitions: SportspersonCompetition[];
  /** Current page of the Istoric competițional list. URL-driven via
   *  `?compPage=N` so the existing `<Pagination>` component can be reused. */
  compPage: number;
}

const ISTORIC_PER_PAGE = 5;

/** Shown in "Despre mine" until an editor fills the athlete's bio in
 *  Strapi. Keeps the section present in the layout (and visible in the
 *  CMS-driven design) rather than collapsing to nothing. */
const STORY_PLACEHOLDER =
  "Biografia sportivului va fi completată în curând. Aici va apărea povestea din spatele rezultatelor — parcursul pe gheață, momentele care au contat și ce îl motivează.";

function formatDate(iso: string): string {
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
}) => {
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
    <div className="min-h-screen bg-retro-cream">
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
      <div className="bg-navy pt-8">
        <div className="mx-auto w-full max-w-content px-4 py-4 md:px-8 lg:px-12">
          <nav className="flex items-center gap-1.5 text-eyebrow font-bold uppercase text-retro-cream/55">
            <Link
              href="/despre-noi/sportivi"
              className="text-retro-cream/80 transition-colors hover:text-gold"
            >
              Sportivi
            </Link>
            <ChevronRight className="h-3 w-3 shrink-0" />
            <span className="truncate text-retro-cream sm:max-w-none max-w-[200px]">
              {sportsperson.name}
            </span>
          </nav>
        </div>
      </div>

      {/* ─── EDITORIAL HERO BAND (navy) ─── */}
      <section className="relative overflow-hidden bg-navy pt-4 pb-12 text-retro-cream md:pb-14">
        <div className="relative mx-auto w-full max-w-content px-4 md:px-8 lg:px-12">
          <div className="grid items-end gap-8 md:grid-cols-[1.4fr_1fr]">
            {/* Left: category eyebrow + huge stacked name. The narrative
                bio now lives in its own "Despre mine" section below. */}
            <div>
              <div className="mb-4 text-2xs font-bold uppercase tracking-[0.32em] text-gold">
                {category}
              </div>
              <h1 className="font-display font-black leading-[0.85] tracking-[-0.055em] text-[56px] md:text-[88px]">
                <NameStack name={sportsperson.name} />
              </h1>
            </div>

            {/* Right: photo inset with the brand gold→rust→blue gradient
                (visible as frame / behind photo-less athletes). */}
            <div className="relative h-[240px] overflow-hidden rounded-sm bg-gradient-to-br from-gold via-rust to-edusport-blue shadow-[0_16px_40px_rgba(0,0,0,0.4)] md:h-[300px]">
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
                <span className="absolute bottom-3 left-3 rounded-[3px] bg-black/45 px-2.5 py-1 text-3xs font-bold uppercase tracking-[0.22em] text-white backdrop-blur-sm">
                  Membru din {sportsperson.activeSince.slice(0, 4)}
                </span>
              )}
            </div>
          </div>

          {/* Stats row */}
          <div className="mt-8 grid grid-cols-1 gap-6 border-t border-retro-cream/15 pt-6 sm:grid-cols-3">
            <HeroStat value={pad(stats.totalCompetitions)} label="Competiții" accent />
            {tier ? (
              <HeroStat value={`${tier.count}×`} label={tier.label} />
            ) : (
              <HeroStat value="—" label="Medalii" />
            )}
            <HeroStat
              value={stats.bestScore !== null ? stats.bestScore.toFixed(2) : "—"}
              label="Cel mai bun scor"
            />
          </div>
        </div>
      </section>

      {/* ─── DESPRE MINE (narrative bio) ─── */}
      <section className="relative overflow-hidden bg-retro-cream py-16 md:py-20">
        <SectionWatermark>DESPRE</SectionWatermark>
        <div className="relative mx-auto w-full max-w-content px-4 md:px-8 lg:px-12">
          <div className="text-2xs font-bold uppercase tracking-[0.32em] text-rust">
            Despre mine
          </div>
          {hasItems(sportsperson.story) ? (
            <div className="mt-6 max-w-[620px] text-lg leading-relaxed text-navy/85">
              <StrapiBlocks blocks={sportsperson.story} />
            </div>
          ) : (
            <p
              className="mt-6 max-w-[620px] text-2xl leading-[1.5] text-navy md:text-[28px]"
              style={{ fontFamily: "var(--font-lora), Georgia, serif" }}
            >
              {sportsperson.description || STORY_PLACEHOLDER}
            </p>
          )}
        </div>
      </section>

      {/* ─── ATRIBUTE (Despre — moves / hobbies / team / goal) ─── */}
      {(hasItems(sportsperson.favoriteMoves) ||
        hasItems(sportsperson.hobbies) ||
        hasItems(sportsperson.coaches) ||
        hasItems(sportsperson.choreographers) ||
        sportsperson.careerGoal) && (
        <section className="relative overflow-hidden bg-retro-cream pb-16 md:pb-20">
          <div className="relative mx-auto w-full max-w-content px-4 md:px-8 lg:px-12">
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
                    <div className="text-sm font-semibold text-navy">
                      {sportsperson.coaches.map((c, i) => (
                        <span key={i}>
                          {i > 0 && <span className="mx-1 text-navy/30">·</span>}
                          {c.name}
                          {c.role && (
                            <span className="ml-1 text-xs font-light text-navy/60">
                              · {c.role}
                            </span>
                          )}
                        </span>
                      ))}
                    </div>
                  )}
                  {hasItems(sportsperson.choreographers) && (
                    <div className="mt-2 text-sm font-semibold text-navy">
                      <span className="mr-2 text-3xs font-extrabold uppercase tracking-[0.22em] text-navy/50">
                        Coregrafe
                      </span>
                      {sportsperson.choreographers.map((c) => c.name).join(", ")}
                    </div>
                  )}
                </DespreCell>
              )}
              {sportsperson.careerGoal && (
                <DespreCell title="Obiectiv">
                  <p
                    className="text-base italic leading-relaxed text-navy/80"
                    style={{ fontFamily: "var(--font-lora), Georgia, serif" }}
                  >
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
        <section className="relative overflow-hidden bg-retro-cream py-16 md:py-20">
          <SectionWatermark>MUZICĂ</SectionWatermark>
          <div className="relative mx-auto w-full max-w-content px-4 md:px-8 lg:px-12">
            <div className="text-2xs font-bold uppercase tracking-[0.32em] text-rust">
              Programe muzicale
            </div>
            <h2 className="font-display mt-2 text-3xl font-extrabold leading-[0.98] tracking-[-0.03em] text-navy md:text-4xl">
              Muzica pe gheață
            </h2>
            <ProgramSeasons seasons={sortSeasonsDesc(sportsperson.seasons)} />
          </div>
        </section>
      )}

      {/* ─── PERFORMANȚE DE VÂRF (oversized placement numerals) ─── */}
      {notableResults.length > 0 && (
        <section className="relative overflow-hidden bg-navy py-16 text-retro-cream md:py-20">
          <SectionWatermark tone="gold">PERFORMANȚE</SectionWatermark>
          <div className="relative mx-auto w-full max-w-content px-4 md:px-8 lg:px-12">
            <div className="text-2xs font-bold uppercase tracking-[0.32em] text-gold">
              Cele mai notabile rezultate
            </div>
            <h2 className="font-display mt-2 text-3xl font-extrabold leading-[0.98] tracking-[-0.03em] text-retro-cream md:text-4xl">
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
                      "grid grid-cols-[64px_1fr] items-center gap-5 py-5 sm:grid-cols-[86px_1fr] sm:gap-7",
                      idx < notableResults.length - 1 && "border-b border-retro-cream/15",
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
                          "text-3xs font-extrabold uppercase tracking-[0.18em]",
                          info.textClass,
                        )}
                      >
                        {info.label}
                      </span>
                      <h3 className="mt-1 text-lg font-bold leading-tight text-retro-cream">
                        {r.competition.name}
                      </h3>
                      <div className="mt-1 text-2xs text-retro-cream/60">
                        {formatDate(r.competition.date)}
                        {r.competition.location && <> · {r.competition.location}</>}
                        {r.score !== undefined && (
                          <>
                            {" · "}
                            <span className="font-bold text-gold">
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
        <section className="relative overflow-hidden bg-retro-cream py-16 md:py-20">
          <SectionWatermark>GALERIE</SectionWatermark>
          <div className="relative mx-auto w-full max-w-content px-4 md:px-8 lg:px-12">
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

      {/* ─── ISTORIC COMPETIȚIONAL ─── */}
      {historyRows.length > 0 && (
        <section
          id="istoric"
          className="relative overflow-hidden bg-retro-cream py-16 md:py-20 scroll-mt-24"
        >
          <SectionWatermark>ISTORIC</SectionWatermark>
          <div className="relative mx-auto w-full max-w-content px-4 md:px-8 lg:px-12">
            <div className="text-2xs font-bold uppercase tracking-[0.32em] text-rust">
              Istoric competițional
            </div>
            <h2 className="font-display mt-2 text-3xl font-extrabold leading-[0.98] tracking-[-0.03em] text-navy md:text-4xl">
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
                      "relative flex flex-col gap-2 py-[18px] sm:grid sm:grid-cols-[1fr_auto_auto] sm:items-center sm:gap-x-6",
                      idx < visibleHistoryRows.length - 1 && "border-b border-navy/10",
                    )}
                  >
                    <div className="relative min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-sm font-bold text-navy">{comp.name}</h4>
                        {comp.level === "international" && (
                          <span className="rounded-full bg-edusport-blue/10 px-2 py-0.5 text-3xs font-semibold uppercase tracking-wider text-edusport-blue">
                            Internațional
                          </span>
                        )}
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-2xs font-light tracking-[0.04em] text-navy/50">
                        <span>{formatDate(comp.date)}</span>
                        {comp.location && (
                          <>
                            <span>·</span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
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
                        <span className="text-xs font-semibold tabular-nums text-navy/60">
                          {row.score.toFixed(2)}
                        </span>
                      )}
                      {info && (
                        <span
                          className={cn(
                            "text-2xs font-extrabold uppercase tracking-[0.22em] sm:min-w-[72px] sm:text-right",
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
      <section className="border-t border-navy/10 bg-retro-cream py-12 md:py-14">
        <div className="mx-auto flex w-full max-w-content flex-col items-start gap-5 px-4 sm:flex-row sm:items-center sm:justify-between md:px-8 lg:px-12">
          <div>
            <div className="text-2xs font-bold uppercase tracking-[0.32em] text-rust">
              Mai departe
            </div>
            <p className="mt-1.5 text-base font-medium text-navy md:text-lg">
              Vezi toți sportivii clubului EduSport.
            </p>
          </div>
          <SpotlightButton
            layers
            layersFace="black"
            href="/despre-noi/sportivi"
            className="text-xs"
          >
            Toți sportivii
          </SpotlightButton>
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
      <span className="block text-retro-cream">{first}</span>
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

function HeroStat({
  value,
  label,
  accent = false,
}: {
  value: string;
  label: string;
  /** Highlight as the lead metric (gold). */
  accent?: boolean;
}) {
  return (
    <div>
      <div
        className={cn(
          "font-display text-[40px] font-black leading-none tracking-[-0.02em] md:text-[44px]",
          accent ? "text-gold" : "text-retro-cream",
        )}
      >
        {value}
      </div>
      <div className="mt-2 text-3xs font-bold uppercase tracking-[0.22em] text-retro-cream/60">
        {label}
      </div>
    </div>
  );
}

/**
 * Borderless 2-column grid for the Despre cells. Each cell is a single
 * rust micro-label + its content — no numbers, no icons, no double
 * labelling (the descriptive title carries the meaning on its own).
 */
function DespreGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid gap-y-10 gap-x-14 md:grid-cols-2">{children}</div>
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
      <div className="mb-3 text-2xs font-bold uppercase tracking-[0.28em] text-rust">
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
    <div className="mt-8 flex flex-col gap-7">
      {primary.map((s) => (
        <SeasonRow key={s.season} season={s.season} items={s.programs ?? []} />
      ))}
      {older.length > 0 && (
        <details className="group/seasons">
          <summary className="-mx-1 inline-flex cursor-pointer list-none items-center gap-2 px-1 text-2xs font-extrabold uppercase tracking-[0.22em] text-rust transition-colors hover:text-rust/70 [&::-webkit-details-marker]:hidden">
            <span className="group-open/seasons:hidden">
              Vezi sezoanele anterioare ({older.length})
            </span>
            <span className="hidden group-open/seasons:inline">Arată mai puțin</span>
            <ChevronRight className="h-3 w-3 transition-transform group-open/seasons:rotate-90" />
          </summary>
          <div className="mt-7 flex flex-col gap-7">
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
      <div className="mb-3 text-2xs font-bold uppercase tracking-[0.24em] text-navy/40">
        Sezon {season}
      </div>
      <div className="grid gap-x-7 gap-y-2 sm:grid-cols-2">
        {items.map((p, i) => (
          <div
            key={`${season}-${i}`}
            className="grid grid-cols-[120px_1fr] items-baseline gap-3 py-2"
          >
            <div className="text-3xs font-extrabold uppercase tracking-[0.22em] text-gold">
              {p.type}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-bold leading-tight text-navy">
                {p.title}
              </div>
              {p.artist && (
                <div className="text-2xs text-navy/50">{p.artist}</div>
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
    <ul className="flex flex-col gap-1.5">
      {items.map((item, i) => (
        <li
          key={i}
          className="flex items-start gap-2 text-sm leading-relaxed text-navy/80"
        >
          <ChevronRight className="mt-[3px] h-3.5 w-3.5 shrink-0 text-rust" />
          {item}
        </li>
      ))}
    </ul>
  );
}

export default SportspersonView;
