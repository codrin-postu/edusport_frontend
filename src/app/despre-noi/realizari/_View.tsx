"use client";

import React from "react";
import PageHeroSection from "@/components/blocks/page-hero-section";
import { GalleryCarousel } from "@/components/blocks/gallery-carousel";
import SeasonResults from "./_SeasonResults";
import type { GalleryImage, Season, SeasonIndexEntry } from "./_data";

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

interface AccomplishmentsPageProps {
  bannerTitle?: string;
  bannerSubtitle?: string;
  notableAchievements: string[];
  galleryImages: GalleryImage[];
  /** Label plus result count for every season, a few hundred bytes in total. */
  seasonIndex: SeasonIndexEntry[];
  /** Full data for the requested season only. */
  season: Season | null;
}

const AccomplishmentsPage: React.FC<AccomplishmentsPageProps> = ({
  bannerTitle,
  bannerSubtitle,
  notableAchievements,
  galleryImages,
  seasonIndex,
  season,
}) => {
  return (
    <div className="min-h-screen bg-surface">
      <PageHeroSection
        title={[bannerTitle ?? "REALIZĂRI"]}
        variant="blue"
        breadcrumb={[
          { label: "Despre noi", href: "/despre-noi" },
          { label: "Realizări" },
        ]}
      >
        <h1 className="text-display text-primary-on-dark">
          Realizări
        </h1>
        <p className="text-body text-secondary-on-dark">
          {bannerSubtitle ?? "Rezultatele sportivilor EduSport la competiții naționale și internaționale de patinaj artistic."}
        </p>
      </PageHeroSection>

      <section className="relative z-10 bg-surface py-16 md:py-24">
        <div className="w-full max-w-content mx-auto px-4 md:px-8 lg:px-12">
          {/* Section header */}
          <div className="flex flex-col gap-3 mb-16">
            <p className="text-label uppercase text-accent">
              Palmares
            </p>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <h2 className="text-heading text-primary max-w-lg">
                Realizări notabile
              </h2>
              <p className="text-body-sm text-secondary md:text-right md:max-w-xs">
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
                  className="text-body-sm relative pl-5 text-secondary before:absolute before:left-0.5 before:content-['›'] before:font-extrabold before:text-accent"
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

          {/* Results, one season at a time */}
          <div className="flex flex-col gap-3 mb-8">
            <p className="text-label uppercase text-accent">
              Rezultate
            </p>
            <h2 className="text-heading text-primary">
              Competiții pe sezoane
            </h2>
          </div>

          <SeasonResults seasonIndex={seasonIndex} season={season} />
        </div>
      </section>
    </div>
  );
};

export default AccomplishmentsPage;
