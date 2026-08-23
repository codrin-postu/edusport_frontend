import Link from "@/components/ui/link";
import SpotlightButton from "@/components/ui/spotlight-button";
import { Pill } from "@/components/ui/pill";
import { Calendar, Clock, MapPin } from "lucide-react";
import React from "react";
import PageHeroSection from "@/components/blocks/page-hero-section";

interface CoursesBannerSectionProps {
  currentSeason: string;
  isRegistrationOpen: boolean;
  title: string;
  scheduleDays: string;
  scheduleTimes: string;
  locationName: string;
  locationUrl: string;
}

const CoursesBannerSection: React.FC<CoursesBannerSectionProps> = ({
  currentSeason,
  isRegistrationOpen,
  title,
  scheduleDays,
  scheduleTimes,
  locationName,
  locationUrl,
}) => {
  return (
    <PageHeroSection
      title={["SCOALA", "DE", "PATINAJ"]}
      variant={isRegistrationOpen ? "blue" : "dark"}
    >
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-eyebrow font-bold uppercase text-retro-cream">
          Sezonul {currentSeason}
        </span>
        {isRegistrationOpen ? (
          <Pill color="var(--color-mustard)" shape="slanted" className="text-navy">
            Înscrieri deschise
          </Pill>
        ) : (
          <Pill variant="error" shape="slanted">Înscrieri închise</Pill>
        )}
      </div>

      <h1 className="font-display text-display-md font-extrabold text-retro-cream leading-[1.05] tracking-[-0.5px]">
        {title}
      </h1>

      <div className="flex flex-wrap gap-x-5 gap-y-2 text-retro-cream/70 text-sm">
        <span className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 shrink-0 text-retro-cream" />
          {scheduleDays}
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 shrink-0 text-retro-cream" />
          {scheduleTimes}
        </span>
        <a
          href={locationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 hover:text-retro-cream transition-colors"
        >
          <MapPin className="w-3.5 h-3.5 shrink-0 text-retro-cream" />
          {locationName}
        </a>
      </div>

      {isRegistrationOpen && (
        <div className="flex flex-col sm:flex-row gap-3 sm:items-start pt-1">
          <SpotlightButton
            layers
            layersFace="cream"
            href="/inscrieri"
            className="w-full sm:w-auto text-sm"
          >
            Înscrie-te acum
          </SpotlightButton>
          <Link
            href="/cursuri/program"
            className="inline-flex items-center justify-center w-full sm:w-auto border-[1.5px] border-retro-cream bg-transparent px-8 py-3.5 text-sm font-bold uppercase tracking-[0.03em] text-retro-cream transition-colors hover:bg-retro-cream hover:text-navy"
          >
            Vezi programul
          </Link>
        </div>
      )}
    </PageHeroSection>
  );
};

export default CoursesBannerSection;
