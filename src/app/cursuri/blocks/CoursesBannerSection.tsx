import Button from "@/components/ui/button";
import { Pill } from "@/components/ui/pill";
import Icon from "@/components/ui/icon";
import Link from "@/components/ui/link";
import React from "react";
import PageHeroSection from "@/components/blocks/page-hero-section";
import { ENROL_CTA, ENROL_HREF } from "@/lib/cta";

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
          <Icon name="calendar" className="text-primary-on-dark" />
          {scheduleDays}
        </span>
        <span className="flex items-center gap-2">
          <Icon name="clock" className="text-primary-on-dark" />
          {scheduleTimes}
        </span>
        <Link href={locationUrl} tone="quiet" onDark external className="flex items-center gap-2">
          <Icon name="map-pin" className="text-primary-on-dark" />
          {locationName}
        </Link>
      </div>

      {isRegistrationOpen && (
        <div className="flex flex-col sm:flex-row gap-3 sm:items-start pt-1">
          <Button
            face="cream"
            href={ENROL_HREF}
            className="w-full sm:w-auto"
          >
            {ENROL_CTA}
          </Button>
          <Button variant="secondary" onDark href="/cursuri/program" className="w-full sm:w-auto">
            Vezi programul
          </Button>
        </div>
      )}
    </PageHeroSection>
  );
};

export default CoursesBannerSection;
