import { cn } from "@/utils/cn";
import { CoursesBannerSection } from "./blocks";
import dynamic from "next/dynamic";
import React from "react";
import type { PricingTier } from "./_data";
import type { CoursePageContent } from "./_types";
import AboutSection from "./blocks/AboutSection";
import InfoSection from "./blocks/InfoSection";

const PricingSection = dynamic(() => import("./blocks/PricingSection"), { ssr: true });

interface CoursesPageProps {
  pricingData: PricingTier[] | null;
  footerNotes: string[] | null;
  currentSeason: string;
  isRegistrationOpen: boolean;
  cursuriPageData: CoursePageContent;
  /** Rink address (site-settings contact data), shared by the banner and about bullet. */
  locationDisplay: string;
  locationHref?: string;
}

const CoursesPage: React.FC<CoursesPageProps> = ({
  pricingData,
  footerNotes,
  currentSeason,
  isRegistrationOpen,
  cursuriPageData,
  locationDisplay,
  locationHref,
}) => {
  return (
    <div className={cn("min-h-screen", "bg-surface-raised")}>
      <CoursesBannerSection
        currentSeason={currentSeason}
        isRegistrationOpen={isRegistrationOpen}
        locationDisplay={locationDisplay}
        locationHref={locationHref}
        {...cursuriPageData.banner}
      />

      <div className="relative z-raised bg-surface-raised">
        <AboutSection
          locationDisplay={locationDisplay}
          locationHref={locationHref}
          {...cursuriPageData.aboutSection}
        />

        <PricingSection
          pricingData={pricingData}
          footerNotes={footerNotes}
          {...cursuriPageData.promoCard}
        />
        <InfoSection {...cursuriPageData.infoSection} />
      </div>
    </div>
  );
};

export default CoursesPage;
