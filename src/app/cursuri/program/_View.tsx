import { cn } from "@/utils/cn";
import { ScheduleSection } from "../blocks";
import PageHeroSection from "@/components/blocks/page-hero-section";
import dynamic from "next/dynamic";
import React from "react";
import type { ProgramPageData } from "./_types";

const SeasonCalendarViewV2 = dynamic(
  () => import("../blocks/SeasonCalendarViewV2"),
  { ssr: true },
);

interface ProgramPageProps {
  data: ProgramPageData;
}

const ProgramPage: React.FC<ProgramPageProps> = ({ data }) => {
  return (
    <div className={cn("min-h-screen", "bg-white")}>
      <PageHeroSection title={["PROGRAM"]} breadcrumb={[{ label: "Cursuri", href: "/cursuri" }, { label: "Program" }]}>
        <h1 className="font-display text-display-md font-extrabold text-retro-cream leading-[1.05] tracking-[-0.5px]">
          {data.bannerTitle}
        </h1>
        <p className="text-retro-cream/70 text-base">
          {data.bannerSubtitle}
        </p>
      </PageHeroSection>

      <div className="relative z-10 bg-white">
        <SeasonCalendarViewV2
          seasonCalendar={data.calendarEvents}
          seasonLabel={data.seasonLabel}
          seasonStart={data.seasonStart}
          seasonEnd={data.seasonEnd}
        />
        <ScheduleSection
          scheduleGroups={data.scheduleGroups}
          scheduleSubtitle={data.scheduleSubtitle}
          disclaimers={data.disclaimers}
        />
      </div>
    </div>
  );
};

export default ProgramPage;
