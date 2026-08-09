import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Activity, ArrowRight, ChevronRight, Heart, MapPin, Target, Users } from "lucide-react";
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

/**
 * Sportsperson profile — editorial layout.
 *
 * Hero is the showpiece: brand-blue band, huge stacked filled+stroked
 * name (Inter 900, ~110px on desktop), photo as inset, meta strip across
 * the top, big "01" rank watermark, and a 4-stat row at the bottom. The
 * rest of the page (Momente de top, Despre, Gallery, Istoric, Outro) is
 * on white so the editorial weight lives only at the top — same pattern
 * we use on the sportivi index.
 *
 * The slanted-ribbon SVG accent (also used on /despre-noi/realizari and
 * the sportivi cards) carries the medal-tier signal across both Momente
 * and Istoric, keeping visual continuity with the rest of the site.
 */

interface Props {
  sportsperson: StrapiSportsperson;
  competitions: SportspersonCompetition[];
  /** Current page of the Istoric competițional list. URL-driven via
   *  `?compPage=N` so the existing `<Pagination>` component can be reused. */
  compPage: number;
}

const ISTORIC_PER_PAGE = 5;

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
    <div className="min-h-screen bg-white">
      {/* ─── BREADCRUMB ─── extra top padding to clear the fixed site
          header (other pages either use PageHeroSection which is
          sticky-positioned, or add their own pt clearance — articles use
          pt-8). Without this the bar tucks behind the nav. */}
      <div className="border-b border-gray-100 px-6 pt-8 pb-4 md:px-10">
        <nav className="mx-auto flex max-w-content items-center gap-2 text-2xs font-semibold uppercase tracking-[0.16em] text-gray-400">
          <Link
            href="/despre-noi/sportivi"
            className="text-gray-500 transition-colors hover:text-gray-700"
          >
            Sportivi
          </Link>
          <ChevronRight className="h-3 w-3 text-gray-300" />
          <span className="text-gray-700">{sportsperson.name}</span>
        </nav>
      </div>

      {/* ─── EDITORIAL HERO BAND ─── */}
      <section className="relative overflow-hidden bg-edusport-blue px-6 py-16 text-white md:px-10 md:py-20">
        {/* Outlined "01" watermark — uses the athlete's `order` if set */}
        <div
          aria-hidden
          className="pointer-events-none absolute right-6 top-3 select-none text-[140px] leading-[0.82] md:text-[220px]"
          style={{
            color: "transparent",
            WebkitTextStroke: "1.5px rgba(255,255,255,0.12)",
            fontFamily: "var(--font-climate-crisis), sans-serif",
            fontVariationSettings: "\"YEAR\" 1979",
          }}
        >
          {pad(1)}
        </div>

        <div className="relative mx-auto max-w-content">
          <div className="grid items-end gap-10 md:grid-cols-[1.4fr_1fr]">
            {/* Left: name + description. Category sits as a small eyebrow
                above the name — replaced the old top meta strip. "Sportiv
                EduSport" is implied by the section; "Membru din YYYY"
                still appears as a badge on the photo. */}
            <div>
              <div className="mb-4 text-2xs font-bold uppercase tracking-[0.32em] text-[#fbbf24]">
                {category}
                {hasItems(sportsperson.disciplines) && (
                  <>
                    <span className="mx-3 text-white/30">|</span>
                    {sportsperson.disciplines.map((d) => d.name).join(" · ")}
                  </>
                )}
              </div>
              <h1 className="font-black leading-[0.85] tracking-[-0.055em] text-[64px] md:text-[110px]">
                <NameStack name={sportsperson.name} />
              </h1>
              {sportsperson.description && (
                <p className="mt-7 max-w-[480px] text-sm font-light leading-[1.6] text-white/75">
                  {sportsperson.description}
                </p>
              )}
            </div>

            {/* Right: photo inset (with optional "Membru din" badge) */}
            <div className="relative h-[300px] overflow-hidden rounded-sm bg-gradient-to-br from-[#ffd97a] via-[#ff5050] to-edusport-blue shadow-[0_16px_40px_rgba(0,0,0,0.4)] md:h-[360px]">
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
          <div className="mt-10 grid grid-cols-1 gap-6 border-t border-white/15 pt-6 sm:grid-cols-3">
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

      {/* ─── DESPRE <NAME> ─── */}
      {(hasItems(sportsperson.favoriteMoves) ||
        hasItems(sportsperson.hobbies) ||
        hasItems(sportsperson.coaches) ||
        hasItems(sportsperson.choreographers) ||
        sportsperson.careerGoal) && (
        <section className="relative overflow-hidden bg-white px-6 py-16 md:px-10 md:py-20">
          <SectionWatermark>DESPRE</SectionWatermark>
          <div className="relative mx-auto max-w-content">
            <div className="mb-8 text-2xs font-bold uppercase tracking-[0.32em] text-edusport-blue/60">
              Despre {sportsperson.name.split(" ")[0]}
            </div>

            <DespreGrid>
              {hasItems(sportsperson.favoriteMoves) && (
                <DespreCell label="Stil" title="Mișcări preferate" icon={Activity}>
                  <BulletList items={sportsperson.favoriteMoves} />
                </DespreCell>
              )}
              {hasItems(sportsperson.hobbies) && (
                <DespreCell label="Personal" title="Pasiuni & hobby-uri" icon={Heart}>
                  <BulletList items={sportsperson.hobbies} />
                </DespreCell>
              )}
              {(hasItems(sportsperson.coaches) || hasItems(sportsperson.choreographers)) && (
                <DespreCell label="Echipa" title="Cine o pregătește" icon={Users}>
                  <dl className="flex flex-wrap gap-x-6 gap-y-3">
                    {hasItems(sportsperson.coaches) && (
                      <div>
                        <dt className="mb-1 text-3xs font-extrabold uppercase tracking-[0.22em] text-edusport-blue/60">
                          {sportsperson.coaches.length === 1 ? "Antrenor" : "Antrenori"}
                        </dt>
                        <dd className="text-sm font-semibold text-gray-900">
                          {sportsperson.coaches.map((c, i) => (
                            <span key={i}>
                              {i > 0 && <span className="mx-1 text-gray-300">·</span>}
                              {c.name}
                              {c.role && (
                                <span className="ml-1 text-xs font-light text-gray-500">
                                  · {c.role}
                                </span>
                              )}
                            </span>
                          ))}
                        </dd>
                      </div>
                    )}
                    {hasItems(sportsperson.choreographers) && (
                      <div>
                        <dt className="mb-1 text-3xs font-extrabold uppercase tracking-[0.22em] text-edusport-blue/60">
                          {sportsperson.choreographers.length === 1
                            ? "Coregraf"
                            : "Coregrafe"}
                        </dt>
                        <dd className="text-sm font-semibold text-gray-900">
                          {sportsperson.choreographers
                            .map((c) => c.name)
                            .join(", ")}
                        </dd>
                      </div>
                    )}
                  </dl>
                </DespreCell>
              )}
              {sportsperson.careerGoal && (
                <DespreCell label="Aspirație" title="Obiectiv" icon={Target}>
                  <p className="text-sm italic leading-relaxed text-gray-700">
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
        <section className="relative overflow-hidden bg-white px-6 py-16 md:px-10 md:py-20">
          <SectionWatermark>MUZICĂ</SectionWatermark>
          <div className="relative mx-auto max-w-content">
            <div className="text-2xs font-bold uppercase tracking-[0.32em] text-edusport-blue/60">
              Programe muzicale
            </div>
            <h2 className="mt-2 text-3xl font-extrabold leading-[0.98] tracking-[-0.03em] text-gray-900 md:text-4xl">
              Muzica pe gheață
            </h2>
            <ProgramSeasons seasons={sortSeasonsDesc(sportsperson.seasons)} />
          </div>
        </section>
      )}

      {/* ─── PERFORMANȚE DE VÂRF (cream/amber band) ─── */}
      {notableResults.length > 0 && (
        <section
          className="relative overflow-hidden px-6 py-16 md:px-10 md:py-20"
          style={{ backgroundColor: "var(--color-surface-soft)" }}
        >
          <SectionWatermark tone="amber">PERFORMANȚE</SectionWatermark>
          <div className="relative mx-auto max-w-content">
            <div className="text-2xs font-bold uppercase tracking-[0.32em] text-edusport-blue/60">
              Cele mai notabile rezultate
            </div>
            <h2 className="mt-2 text-3xl font-extrabold leading-[0.98] tracking-[-0.03em] text-gray-900 md:text-4xl">
              Performanțe de vârf
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              {notableResults.map((r, idx) => {
                const info = getPlacementInfo(r.placement);
                return (
                  <article
                    key={`${r.competition.documentId}-${idx}`}
                    className="relative flex flex-col gap-2 overflow-hidden p-[18px] pl-7"
                  >
                    {info.accent && <SlantRibbon color={info.accent} />}
                    <span
                      className={cn(
                        "relative inline-flex w-fit items-center text-3xs font-extrabold uppercase tracking-[0.18em]",
                        info.textClass,
                      )}
                    >
                      {info.label}
                    </span>
                    <h3 className="relative text-sm font-bold leading-tight text-gray-900">
                      {r.competition.name}
                    </h3>
                    <div className="relative text-3xs text-stone-600">
                      {formatDate(r.competition.date)}
                      {r.competition.location && <> · {r.competition.location}</>}
                    </div>
                    {r.score !== undefined && (
                      <div className="relative mt-auto border-t border-amber-600/15 pt-2 text-2xs font-bold tabular-nums text-gray-900">
                        {r.score.toFixed(2)}
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ─── GALLERY ─── */}
      {hasItems(sportsperson.gallery) && (
        <section className="relative overflow-hidden bg-white px-6 py-16 md:px-10 md:py-20">
          <SectionWatermark>GALERIE</SectionWatermark>
          <div className="relative mx-auto max-w-content">
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
          className="relative overflow-hidden bg-white px-6 py-16 md:px-10 md:py-20 scroll-mt-24"
        >
          <SectionWatermark>ISTORIC</SectionWatermark>
          <div className="relative mx-auto max-w-content">
            <div className="text-2xs font-bold uppercase tracking-[0.32em] text-edusport-blue/60">
              Istoric competițional
            </div>
            <h2 className="mt-2 text-3xl font-extrabold leading-[0.98] tracking-[-0.03em] text-gray-900 md:text-4xl">
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
                      idx < visibleHistoryRows.length - 1 && "border-b border-gray-100",
                    )}
                  >
                    <div className="relative min-w-0 pl-8">
                      {info?.accent && <SlantRibbon color={info.accent} />}
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-sm font-bold text-gray-900">{comp.name}</h4>
                        {comp.level === "international" && (
                          <span className="rounded-full bg-edusport-blue/5 px-2 py-0.5 text-3xs font-semibold uppercase tracking-wider text-edusport-blue">
                            Internațional
                          </span>
                        )}
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-2xs font-light tracking-[0.04em] text-gray-400">
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
                    <div className="flex items-baseline gap-3 pl-8 sm:contents">
                      {row.score !== undefined && (
                        <span className="text-xs font-semibold tabular-nums text-gray-500">
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
      <section className="bg-white px-6 py-12 md:px-10 md:py-14">
        <div className="mx-auto flex max-w-content flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-2xs font-bold uppercase tracking-[0.32em] text-edusport-blue/60">
              Mai departe
            </div>
            <p className="mt-1.5 text-base font-medium text-gray-900 md:text-lg">
              Vezi toți sportivii clubului EduSport.
            </p>
          </div>
          <Link
            href="/despre-noi/sportivi"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-edusport-blue transition-all hover:gap-3 hover:text-edusport-blue/70"
          >
            Sportivi
            <ArrowRight className="h-4 w-4" />
          </Link>
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
 * Decorative top-right section watermark — Climate Crisis at very low
 * opacity. Echoes the hero "01" treatment and the PageHeroSection used
 * elsewhere on the site. Each editorial section gets one so the profile
 * reads as a magazine spread rather than a stack of CMS panels.
 */
function SectionWatermark({
  children,
  tone = "blue",
}: {
  children: React.ReactNode;
  tone?: "blue" | "amber";
}) {
  const colour = tone === "amber" ? "rgba(217,119,6,0.08)" : "rgba(33,56,184,0.05)";
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute -right-2 top-10 hidden select-none uppercase leading-none md:inline md:top-12 md:text-[88px]"
      style={{
        color: colour,
        fontFamily: "var(--font-climate-crisis), sans-serif",
        fontVariationSettings: "\"YEAR\" 1979",
      }}
    >
      {children}
    </span>
  );
}

/**
 * Group program entries by season descending (newest first), preserving
 * the editor's intra-season order so Short comes before Free if that's
 * how it was entered.
 */
/** Newest-season-first sort, non-destructive. The CMS may save seasons
 *  in any order; we always render most-recent first to match competition
 *  history sort direction. */
function sortSeasonsDesc(
  seasons: SportspersonSeason[],
): SportspersonSeason[] {
  return [...seasons].sort((a, b) => b.season.localeCompare(a.season));
}

/**
 * Two-line filled+stroked name treatment. First word is filled white,
 * everything after is stroked (outlined). The Spotlight component on
 * the index page uses the identical structure — keeping it in sync here
 * preserves the editorial signature across both surfaces.
 */
function NameStack({ name }: { name: string }) {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.toUpperCase() ?? "";
  const rest = parts.slice(1).join(" ").toUpperCase();
  return (
    <>
      <span className="block text-white">{first}</span>
      {rest && (
        <span
          className="block"
          style={{
            color: "transparent",
            WebkitTextStroke: "1.5px #fff",
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
          "text-[40px] leading-none tracking-[-0.02em] md:text-[44px]",
          accent ? "text-[#fbbf24]" : "text-white",
        )}
        style={{
          fontFamily: "var(--font-climate-crisis), sans-serif",
          fontVariationSettings: "\"YEAR\" 1979",
        }}
      >
        {value}
      </div>
      <div className="mt-2 text-3xs font-bold uppercase tracking-[0.22em] text-white/60">
        {label}
      </div>
    </div>
  );
}

/**
 * Slanted-line ribbon — pixel-identical to the accent used on
 * /despre-noi/realizari result rows (same paths, opacities, position).
 * Keeping all three rows (notable tiles, history rows, realizari rows)
 * using the exact same geometry is what makes them feel like "the same
 * accent" across surfaces — any deviation makes them visibly misalign.
 *
 * Positioned at `-left-4 w-20` so the ribbon extends a touch past the
 * card's left edge (clipped by `overflow-hidden`), exactly like
 * realizari. The stripes are translucent enough (opacities 0.22 / 0.28
 * / 0.32) that any content sitting on top still reads clearly without
 * needing extra padding to clear them.
 */
function SlantRibbon({ color }: { color: string }) {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-y-0 -left-4 h-full w-20"
      viewBox="0 0 80 100"
      preserveAspectRatio="none"
      fill="none"
      style={{ color }}
    >
      <path d="M 46 -10 L 22 110" stroke="currentColor" strokeWidth="11" opacity="0.22" />
      <path d="M 63 -10 L 39 110" stroke="currentColor" strokeWidth="11" opacity="0.28" />
      <path d="M 75.5 -10 L 51.5 110" stroke="currentColor" strokeWidth="2" opacity="0.32" />
    </svg>
  );
}

/**
 * 2×2 borderless grid for the Despre cells. Numbers each child cell
 * sequentially (01, 02, …) regardless of how many empty cells were
 * skipped by the parent — the numbers are decorative, not semantic.
 * A single faint horizontal divider sits between the two rows for
 * rhythm, but no per-cell outlines (matches the v5 mockup).
 */
function DespreGrid({ children }: { children: React.ReactNode }) {
  const cells = React.Children.toArray(children);
  return (
    <div className="grid gap-y-12 gap-x-14 md:grid-cols-2">
      {cells.map((cell, idx) => (
        <DespreCellWithNum key={idx} num={String(idx + 1).padStart(2, "0")}>
          {cell}
        </DespreCellWithNum>
      ))}
    </div>
  );
}

function DespreCellWithNum({
  num,
  children,
}: {
  num: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-w-0 grid-cols-[60px_1fr] items-start gap-7">
      <div
        aria-hidden
        className="select-none text-[34px] leading-none"
        style={{
          color: "transparent",
          WebkitTextStroke: "1.5px #fbbf24",
          fontFamily: "var(--font-climate-crisis), sans-serif",
          fontVariationSettings: "\"YEAR\" 1979",
        }}
      >
        {num}
      </div>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

/**
 * Single Despre cell body: icon + eyebrow row, title, slot for the
 * cell's content (bullets / dl / quote). The numbered gold figure is
 * provided by the enclosing DespreCellWithNum.
 */
function DespreCell({
  label,
  title,
  icon: Icon,
  children,
}: {
  label: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-1 flex items-center gap-1.5">
        <Icon className="h-3 w-3 text-edusport-blue/60" />
        <span className="text-3xs font-extrabold uppercase tracking-[0.32em] text-edusport-blue/60">
          {label}
        </span>
      </div>
      <h3 className="mb-3.5 text-lg font-extrabold tracking-[-0.01em] text-gray-900">
        {title}
      </h3>
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
          <summary className="-mx-1 inline-flex cursor-pointer list-none items-center gap-2 px-1 text-2xs font-extrabold uppercase tracking-[0.22em] text-edusport-blue transition-colors hover:text-edusport-blue/70 [&::-webkit-details-marker]:hidden">
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
      <div className="mb-3 text-2xs font-bold uppercase tracking-[0.24em] text-gray-400">
        Sezon {season}
      </div>
      <div className="grid gap-x-7 gap-y-2 sm:grid-cols-2">
        {items.map((p, i) => (
          <div
            key={`${season}-${i}`}
            className="grid grid-cols-[120px_1fr] items-baseline gap-3 py-2"
          >
            <div className="text-3xs font-extrabold uppercase tracking-[0.22em] text-[#fbbf24]">
              {p.type}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-bold leading-tight text-gray-900">
                {p.title}
              </div>
              {p.artist && (
                <div className="text-2xs text-gray-500">{p.artist}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Compact bullet list — small dots, denser than the old BulletColumn. */
function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-1.5">
      {items.map((item, i) => (
        <li
          key={i}
          className="flex items-start gap-2 text-sm leading-relaxed text-gray-700"
        >
          <span className="mt-[7px] inline-block h-[5px] w-[5px] shrink-0 rounded-full bg-edusport-blue" />
          {item}
        </li>
      ))}
    </ul>
  );
}

export default SportspersonView;
