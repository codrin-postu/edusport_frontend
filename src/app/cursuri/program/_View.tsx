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
        <h1 className="text-4xl md:text-6xl font-semibold text-white leading-[1.1] tracking-tight">
          {data.bannerTitle}
        </h1>
        <p className="text-white/70 text-base font-light border-t border-white/10 pt-4">
          {data.bannerSubtitle}
        </p>
      </PageHeroSection>

      <div className="relative z-10 bg-white">
        <ScheduleSection
          scheduleGroups={data.scheduleGroups}
          scheduleSubtitle={data.scheduleSubtitle}
          disclaimers={data.disclaimers}
        />
        <SeasonCalendarViewV2
          seasonCalendar={data.calendarEvents}
          seasonLabel={data.seasonLabel}
          seasonStart={data.seasonStart}
          seasonEnd={data.seasonEnd}
        />
      </div>
    </div>
  );
};

export default ProgramPage;
