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
}

const CoursesPage: React.FC<CoursesPageProps> = ({
  pricingData,
  footerNotes,
  currentSeason,
  isRegistrationOpen,
  cursuriPageData,
}) => {
  return (
    <div className={cn("min-h-screen", "bg-white")}>
      <CoursesBannerSection
        currentSeason={currentSeason}
        isRegistrationOpen={isRegistrationOpen}
        {...cursuriPageData.banner}
      />

      <div className="relative z-10 bg-white">
        <AboutSection {...cursuriPageData.aboutSection} />

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
