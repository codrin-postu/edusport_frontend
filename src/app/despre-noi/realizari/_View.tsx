"use client";

import React, { useState } from "react";
import Link from "next/link";
import { cn } from "@/utils/cn";
import PageHeroSection from "@/components/blocks/page-hero-section";
import { Trophy, ChevronDown } from "lucide-react";
import { Select } from "@/components/ui/select";
import {
  getPlacementInfo,
  type Season,
  type GalleryImage,
} from "./_data";
import { GalleryCarousel } from "@/components/blocks/gallery-carousel";

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

interface AccomplishmentsPageProps {
  bannerTitle?: string;
  bannerSubtitle?: string;
  notableAchievements: string[];
  galleryImages: GalleryImage[];
  seasons: Season[];
}

const AccomplishmentsPage: React.FC<AccomplishmentsPageProps> = ({
  bannerTitle,
  bannerSubtitle,
  notableAchievements,
  galleryImages,
  seasons,
}) => {
  const allCategories = Array.from(
    new Set(
      seasons.flatMap((s) => s.competitions.flatMap((c) => c.results.map((r) => r.category))),
    ),
  );

  const [openSeasons, setOpenSeasons] = useState<Set<string>>(
    () => new Set([seasons[0]?.id]),
  );
  const [openComps, setOpenComps] = useState<Set<string>>(
    () => new Set([`${seasons[0]?.id}::${seasons[0]?.competitions[0]?.name}`]),
  );
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const toggle = (id: string) =>
    setOpenSeasons((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const toggleComp = (key: string) =>
    setOpenComps((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });

  return (
    <div className="min-h-screen bg-retro-cream">
      <PageHeroSection
        title={[bannerTitle ?? "REALIZĂRI"]}
        variant="blue"
        breadcrumb={[
          { label: "Despre noi", href: "/despre-noi" },
          { label: "Realizări" },
        ]}
      >
        <h1 className="font-display text-display-md font-extrabold text-retro-cream leading-[1.05] tracking-[-0.5px]">
          Realizări
        </h1>
        <p className="text-retro-cream/70 text-base">
          {bannerSubtitle ?? "Rezultatele sportivilor EduSport la competiții naționale și internaționale de patinaj artistic."}
        </p>
      </PageHeroSection>

      <section className="relative z-10 bg-retro-cream py-16 md:py-24">
        <div className="w-full max-w-content mx-auto px-4 md:px-8 lg:px-12">
          {/* Section header */}
          <div className="flex flex-col gap-3 mb-16">
            <p className="text-eyebrow font-bold uppercase text-rust">
              Palmares
            </p>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <h2 className="font-display text-display-sm font-extrabold text-navy leading-[1.05] tracking-[-0.4px] max-w-lg">
                Realizări notabile
              </h2>
              <p className="text-sm text-navy/50 md:text-right md:max-w-xs">
                Momente de referință din activitatea competițională a clubului.
              </p>
            </div>
          </div>

          {/* Notable achievements list — rust chevron markers */}
          {notableAchievements.length > 0 && (
            <ul className="flex flex-col gap-2.5 mb-20">
              {notableAchievements.map((achievement, i) => (
                <li
                  key={i}
                  className="relative pl-5 text-sm text-navy/[0.72] leading-relaxed before:absolute before:left-0.5 before:content-['›'] before:font-extrabold before:text-rust"
                >
                  {achievement}
                </li>
              ))}
            </ul>
          )}

          {/* Image carousel */}
          <GalleryCarousel
            images={galleryImages}
            eyebrow="Galerie"
            title="Imagini de la competiții"
          />

          {/* Results by season */}
          <div className="flex flex-col gap-3 mb-8">
            <p className="text-eyebrow font-bold uppercase text-rust">
              Rezultate
            </p>
            <h2 className="font-display text-display-sm font-extrabold text-navy tracking-[-0.4px]">
              Competiții pe sezoane
            </h2>
          </div>

          {/* Category filter */}
          {allCategories.length > 0 && (
            <div className="mb-10">
              <Select
                value={activeCategory ?? "__all"}
                onValueChange={(value) =>
                  setActiveCategory(value === "__all" ? null : value)
                }
                options={[
                  { value: "__all", label: "Toate categoriile" },
                  ...allCategories.map((cat) => ({ value: cat, label: cat })),
                ]}
                size="compact"
                className="w-full sm:w-64"
              />
            </div>
          )}

          <div className="flex flex-col gap-4">
            {seasons.map((season) => {
              const isOpen = openSeasons.has(season.id);
              const filteredComps = season.competitions
                .map((comp) => ({
                  ...comp,
                  results: [...comp.results]
                    .filter((r) => activeCategory === null || r.category === activeCategory)
                    .sort((a, b) => a.placement - b.placement),
                }))
                .filter((comp) => comp.results.length > 0);
              const resultCount = filteredComps.reduce((s, c) => s + c.results.length, 0);
              return (
                <div key={season.id}>
                  <button
                    onClick={() => toggle(season.id)}
                    className="relative w-full flex items-center gap-3 px-4 py-3 text-left bg-navy hover:bg-navy/90 transition-colors"
                  >
                    <span className="absolute left-0 top-0 bottom-0 w-1.5 bg-rust" aria-hidden />
                    <Trophy className="w-5 h-5 shrink-0 text-mustard" />
                    <h3 className="text-sm font-bold uppercase tracking-[0.1em] text-retro-cream">
                      {season.label}
                    </h3>
                    <span className="ml-auto text-xs tabular-nums mr-3 text-retro-cream/55">
                      {resultCount} {resultCount === 1 ? "rezultat" : "rezultate"}
                    </span>
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 shrink-0 text-retro-cream transition-transform duration-200",
                        isOpen && "rotate-180",
                      )}
                    />
                  </button>

                  {isOpen && (
                    <div className="flex flex-col gap-6 border-l-[1.5px] border-navy ml-4 mb-6 pl-6 pt-4">
                      {filteredComps.length === 0 ? (
                        <p className="text-xs text-navy/45 pb-2">
                          Niciun rezultat pentru categoria selectată.
                        </p>
                      ) : filteredComps.map((comp) => {
                        const compKey = `${season.id}::${comp.name}`;
                        const isCompOpen = openComps.has(compKey);
                        return (
                          <div key={`${comp.name}-${comp.date}`}>
                            <button
                              onClick={() => toggleComp(compKey)}
                              className="w-full flex items-center gap-2 py-2 text-left hover:opacity-70 transition-opacity"
                            >
                              <div className="flex flex-col gap-0.5 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h4 className="text-sm font-bold text-navy">{comp.name}</h4>
                                  {comp.level === "international" && (
                                    <span className="text-3xs font-bold uppercase tracking-[0.06em] text-rust border-[1.5px] border-rust px-2 py-0.5">
                                      Internațional
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-navy/45">
                                  {comp.date} · {comp.location}
                                </p>
                              </div>
                              <ChevronDown
                                className={cn(
                                  "w-3.5 h-3.5 text-navy/40 shrink-0 ml-auto transition-transform duration-200",
                                  isCompOpen && "rotate-180",
                                )}
                              />
                            </button>

                            {isCompOpen && (
                              <div className="mt-2 mb-2 border-t-[1.5px] border-b-[1.5px] border-navy divide-y divide-navy/12">
                                {comp.results.map((result, idx) => {
                                  const info = getPlacementInfo(result.placement);
                                  const medalColor = info.accent
                                    ? info.textClass
                                    : "text-navy/30";
                                  return (
                                    <div
                                      key={idx}
                                      className="flex items-center gap-3 py-2.5"
                                    >
                                      <span
                                        className={cn(
                                          "font-display text-xl font-extrabold w-7 shrink-0 leading-none tabular-nums text-center",
                                          medalColor,
                                        )}
                                        aria-hidden
                                      >
                                        {result.placement}
                                      </span>
                                      {result.athleteSlug ? (
                                        <Link
                                          href={`/despre-noi/sportivi/${result.athleteSlug}`}
                                          className="link-underline-rust text-sm font-semibold text-navy min-w-0 hover:text-rust transition-colors"
                                        >
                                          {result.athlete}
                                        </Link>
                                      ) : (
                                        <span className="text-sm font-semibold text-navy min-w-0">
                                          {result.athlete}
                                        </span>
                                      )}
                                      <span className="text-xs text-navy/45 hidden sm:inline">
                                        {result.category}
                                      </span>
                                      <span className="ml-auto text-xs text-navy/45 tabular-nums shrink-0 w-16 text-right">
                                        {result.score.toFixed(2)} pts
                                      </span>
                                      <span
                                        className={cn(
                                          "text-xs font-bold uppercase tracking-wider shrink-0 w-16 text-right",
                                          info.accent ? info.textClass : "text-navy/45",
                                        )}
                                      >
                                        {info.label}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AccomplishmentsPage;
