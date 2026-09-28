"use client";

import React from "react";
import PageHeroSection from "@/components/blocks/page-hero-section";
import { GalleryCarousel } from "@/components/blocks/gallery-carousel";
import SectionHeader from "@/components/ui/section-header";
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
  /** Label plus result count for every season. */
  seasonIndex: SeasonIndexEntry[];
  /** Every season with results, so switching seasons needs no server round trip. */
  seasons: Season[];
  /** The season shown first: the one in ?sezon=, else the most recent. */
  initialSeasonId: string | null;
}

const AccomplishmentsPage: React.FC<AccomplishmentsPageProps> = ({
  bannerTitle,
  bannerSubtitle,
  notableAchievements,
  galleryImages,
  seasonIndex,
  seasons,
  initialSeasonId,
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

      <section className="relative z-raised bg-surface section">
        <div className="w-full max-w-content mx-auto gutter">
          {/* Section header */}
          <div className="flex flex-col gap-3 mb-16">
            <p className="text-label uppercase text-accent">
              Palmares
            </p>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <h2 className="text-heading text-primary max-w-lg">
                Realizări notabile
              </h2>
              <p className="text-body-sm text-secondary md:text-right md:max-w-aside">
                Momente de referință din activitatea competițională a clubului.
              </p>
            </div>
          </div>

          {/* Notable achievements list — rust chevron markers */}
          {notableAchievements.length > 0 && (
            <ul className="flex flex-col gap-3 mb-24">
              {notableAchievements.map((achievement, i) => (
                <li
                  key={i}
                  className="text-body-sm relative pl-6 text-secondary before:absolute before:left-0.5 before:content-['›'] before:font-extrabold before:text-accent"
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
          <SectionHeader eyebrow="Rezultate" title="Competiții pe sezoane" className="mb-8" />

          <SeasonResults seasonIndex={seasonIndex} seasons={seasons} initialSeasonId={initialSeasonId} />
        </div>
      </section>
    </div>
  );
};

export default AccomplishmentsPage;
