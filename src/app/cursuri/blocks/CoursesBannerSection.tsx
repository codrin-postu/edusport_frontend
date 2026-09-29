import Button from "@/components/ui/button";
import Chip from "@/components/ui/chip";
import MetaList from "@/components/ui/meta-list";
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
      tight
      title={["SCOALA", "DE", "PATINAJ"]}
      variant={isRegistrationOpen ? "blue" : "dark"}
    >
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-label uppercase text-primary-on-dark">
          Sezonul {currentSeason}
        </span>
        {isRegistrationOpen ? (
          <Chip tone="highlight" size="md" shape="slanted">
            Înscrieri deschise
          </Chip>
        ) : (
          <Chip tone="accent" size="md" shape="slanted">Înscrieri închise</Chip>
        )}
      </div>

      <h1 className="text-display text-primary-on-dark">
        {title}
      </h1>

      <MetaList
        layout="inline"
        onDark
        items={[
          { icon: "calendar", text: scheduleDays },
          { icon: "clock", text: scheduleTimes },
          { icon: "map-pin", text: locationName, href: locationUrl, external: true },
        ]}
      />

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
