"use client";

import React, { useState } from "react";
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
    <div className="min-h-screen bg-white">
      <PageHeroSection
        title={[bannerTitle ?? "REALIZĂRI"]}
        variant="purple"
        breadcrumb={[
          { label: "Despre noi", href: "/despre-noi" },
          { label: "Realizări" },
        ]}
      >
        <h1 className="text-4xl md:text-6xl font-semibold text-white leading-[1.1] tracking-tight">
          Realizări
        </h1>
        <p className="text-white/70 text-base font-light border-t border-white/10 pt-4">
          {bannerSubtitle ?? "Rezultatele sportivilor EduSport la competiții naționale și internaționale de patinaj artistic."}
        </p>
      </PageHeroSection>

      <section className="relative z-10 bg-white py-16 md:py-24">
        <div className="w-full max-w-content mx-auto px-4 md:px-8 lg:px-12">
          {/* Section header */}
          <div className="flex flex-col gap-3 mb-16">
            <p className="text-xs font-semibold tracking-widest uppercase text-edusport-blue/60">
              Palmares
            </p>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 max-w-lg">
                Realizări notabile
              </h2>
              <p className="text-sm text-gray-400 font-light md:text-right md:max-w-xs">
                Momente de referință din activitatea competițională a clubului.
              </p>
            </div>
          </div>

          {/* Notable achievements bullet list */}
          {notableAchievements.length > 0 && (
            <ul className="flex flex-col gap-3 mb-20">
              {notableAchievements.map((achievement, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-edusport-blue shrink-0" />
                  <span className="text-sm text-gray-700 font-light leading-relaxed">{achievement}</span>
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
            <p className="text-xs font-semibold tracking-widest uppercase text-edusport-blue/60">
              Rezultate
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900">
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
                    className="w-full flex items-center gap-3 py-4 text-left hover:opacity-70 transition-opacity"
                  >
                    <div className="w-8 h-8 rounded-xl bg-edusport-blue/5 text-edusport-blue flex items-center justify-center shrink-0">
                      <Trophy className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-700">
                      {season.label}
                    </h3>
                    <span className="ml-auto text-xs text-gray-400 font-light tabular-nums mr-3">
                      {resultCount} {resultCount === 1 ? "rezultat" : "rezultate"}
                    </span>
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200",
                        isOpen && "rotate-180",
                      )}
                    />
                  </button>

                  {isOpen && (
                    <div className="flex flex-col gap-6 border-l-2 border-l-edusport-blue/10 ml-4 mb-6 pl-6 pt-2">
                      {filteredComps.length === 0 ? (
                        <p className="text-xs text-gray-400 font-light pb-2">
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
                                <div className="flex items-center gap-2">
                                  <h4 className="text-sm font-semibold text-gray-900">{comp.name}</h4>
                                  {comp.level === "international" && (
                                    <span className="text-[10px] font-semibold uppercase tracking-wider text-edusport-blue bg-edusport-blue/5 px-2 py-0.5 rounded-full">
                                      Internațional
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-gray-400 font-light">
                                  {comp.date} · {comp.location}
                                </p>
                              </div>
                              <ChevronDown
                                className={cn(
                                  "w-3.5 h-3.5 text-gray-400 shrink-0 ml-auto transition-transform duration-200",
                                  isCompOpen && "rotate-180",
                                )}
                              />
                            </button>

                            {isCompOpen && (
                              <div className="flex flex-col gap-1.5 mt-2 mb-2">
                                {comp.results.map((result, idx) => {
                                  const info = getPlacementInfo(result.placement);
                                  return (
                                    <div
                                      key={idx}
                                      className="relative overflow-hidden flex items-center gap-3 px-4 py-2.5 rounded-xl border border-gray-100 bg-white"
                                    >
                                      {info.accent && (
                                        <svg
                                          aria-hidden
                                          className="absolute inset-y-0 -left-4 h-full w-20 pointer-events-none"
                                          viewBox="0 0 80 100"
                                          preserveAspectRatio="none"
                                          fill="none"
                                          style={{ color: info.accent }}
                                        >
                                          {/* Thick slanted line */}
                                          <path
                                            d="M 46 -10 L 22 110"
                                            stroke="currentColor"
                                            strokeWidth="11"
                                            opacity="0.22"
                                          />
                                          {/* Second thick slanted line */}
                                          <path
                                            d="M 63 -10 L 39 110"
                                            stroke="currentColor"
                                            strokeWidth="11"
                                            opacity="0.28"
                                          />
                                          {/* Thin slanted line */}
                                          <path
                                            d="M 75.5 -10 L 51.5 110"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            opacity="0.32"
                                          />
                                        </svg>
                                      )}
                                      <span className="relative text-sm font-medium text-gray-900 min-w-0">
                                        {result.athlete}
                                      </span>
                                      <span className="relative text-xs text-gray-400 font-light hidden sm:inline">
                                        {result.category}
                                      </span>
                                      <span className="relative ml-auto text-xs text-gray-400 font-light tabular-nums shrink-0 w-16 text-right">
                                        {result.score.toFixed(2)} pts
                                      </span>
                                      <span
                                        className={cn(
                                          "relative text-xs font-semibold uppercase tracking-wider shrink-0 w-16 text-right",
                                          info.textClass,
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
