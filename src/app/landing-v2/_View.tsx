"use client";

import React from "react";
import dynamic from "next/dynamic";
import HeroSection, { type HeroVariant, type HeroNextEvent } from "./blocks/HeroSection";
import type { HomepageCms } from "./_types";
import type {
  StrapiSportsperson,
  SportspersonStats,
} from "@/lib/strapi-sportsperson";
import type { StrapiMediaImage } from "@/lib/strapi-article";
import type { Event } from "../cursuri/evenimente/_data";
import type { RecentMedal } from "./blocks/EventResultsSection";
import type { LatestArticleData } from "../homepage/blocks/LatestArticleSection";

import AthletesSpotlight from "./blocks/AthletesSpotlight";

const AboutUsSection = dynamic(() => import("./blocks/AboutUsSection"), {
  ssr: true,
});
const StatsStrip = dynamic(() => import("./blocks/StatsStrip"), {
  ssr: true,
});
const CompetitionStrip = dynamic(() => import("./blocks/CompetitionStrip"), {
  ssr: true,
});
const EventsNewsSection = dynamic(() => import("./blocks/EventsNewsSection"), {
  ssr: true,
});

interface HomePageProps {
  registrationOpen?: boolean;
  cms?: HomepageCms;
  /** Chosen server-side so SSR renders the right one and there's no hydration flash. */
  heroVariant: HeroVariant;
  featuredAthletes: StrapiSportsperson[];
  featuredStats: Record<string, SportspersonStats>;
  athletesTotal?: number;
  stripImages: StrapiMediaImage[];
  currentEvent: Event | null;
  recentMedals: RecentMedal[];
  heroNextEvent?: HeroNextEvent | null;
  articles: LatestArticleData[];
  registrationSlot?: React.ReactNode;
  registrationClosedSlot?: React.ReactNode;
}

const HomePage: React.FC<HomePageProps> = ({
  registrationOpen = true,
  cms = {},
  heroVariant,
  featuredAthletes,
  featuredStats,
  athletesTotal,
  stripImages,
  currentEvent,
  recentMedals,
  heroNextEvent,
  articles,
  registrationSlot,
  registrationClosedSlot,
}) => {
  return (
    <div>
      <HeroSection
        variant={heroVariant}
        ctaLabel={cms.hero?.ctaLabel}
        ctaUrl={cms.hero?.ctaUrl}
        nextEvent={heroNextEvent}
      />
      {/* Registration (season-open) flows directly into About Us — no SquareTransition wipe. */}
      {registrationOpen ? registrationSlot : registrationClosedSlot}
      <AboutUsSection panels={cms.about?.panels ?? null} />
      <CompetitionStrip images={stripImages} />
      <StatsStrip items={cms.sections?.stats ?? null} />
      <AthletesSpotlight
        athletes={featuredAthletes}
        stats={featuredStats}
        totalCount={athletesTotal}
        copy={cms.sections?.athletes ?? null}
      />
      {/* Merged Actualitate hub: next event + news + recent podiums. */}
      <EventsNewsSection event={currentEvent} medals={recentMedals} articles={articles} />
      {/* The closing register CTA now lives in the global footer (register band). */}
    </div>
  );
};

export default HomePage;
