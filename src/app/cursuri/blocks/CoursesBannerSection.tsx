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
        <span className="text-label uppercase text-primary-on-dark">
          Sezonul {currentSeason}
        </span>
        {isRegistrationOpen ? (
          <Pill color="var(--color-mustard)" shape="slanted" className="text-primary">
            Înscrieri deschise
          </Pill>
        ) : (
          <Pill variant="error" shape="slanted">Înscrieri închise</Pill>
        )}
      </div>

      <h1 className="text-display text-primary-on-dark">
        {title}
      </h1>

      <div className="text-body-sm flex flex-wrap gap-x-6 gap-y-2 text-secondary-on-dark">
        <span className="flex items-center gap-2">
          <Calendar className="size-4 shrink-0 text-primary-on-dark" />
          {scheduleDays}
        </span>
        <span className="flex items-center gap-2">
          <Clock className="size-4 shrink-0 text-primary-on-dark" />
          {scheduleTimes}
        </span>
        <a
          href={locationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 link link-on-dark"
        >
          <MapPin className="size-4 shrink-0 text-primary-on-dark" />
          {locationName}
        </a>
      </div>

      {isRegistrationOpen && (
        <div className="flex flex-col sm:flex-row gap-3 sm:items-start pt-1">
          <SpotlightButton
            layers
            layersFace="cream"
            href="/inscrieri"
            className="text-body-sm w-full sm:w-auto"
          >
            Înscrie-te acum
          </SpotlightButton>
          <Link
            href="/cursuri/program"
            className="text-label inline-flex items-center justify-center w-full sm:w-auto h-12 px-6 border-retro border-line-on-dark bg-transparent uppercase text-primary-on-dark transition-colors hover-layer-on-dark"
          >
            Vezi programul
          </Link>
        </div>
      )}
    </PageHeroSection>
  );
};

export default CoursesBannerSection;
