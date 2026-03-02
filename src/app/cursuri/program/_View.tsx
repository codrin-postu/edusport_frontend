import { cn } from "@/utils/cn";
import { ScheduleSection } from "../blocks";
import PageHeroSection from "@/components/blocks/page-hero-section";
import dynamic from "next/dynamic";
import React from "react";

const SeasonCalendarViewV2 = dynamic(
  () => import("../blocks/SeasonCalendarViewV2"),
  { ssr: true },
);

const ProgramPage: React.FC = () => {
  const scheduleGroups = [
    {
      timeSlot: "10:00 - 10:50",
      schedule: "Sâmbătă și Duminică",
      duration: "50 minute",
      courses: ["Primii Pași", "Intermediari Silver", "Avansați Silver"],
    },
    {
      timeSlot: "11:00 - 11:50",
      schedule: "Sâmbătă și Duminică",
      duration: "50 minute",
      courses: ["Începători", "Intermediari Bronze", "Avansați Bronze"],
    },
  ];

  const seasonCalendar = [
    {
      month: "Octombrie 2025",
      courseDates: [
        { weekend: "4-5 Oct", days: ["4 Oct (Sâm)", "5 Oct (Dum)"] },
        { weekend: "11-12 Oct", days: ["11 Oct (Sâm)", "12 Oct (Dum)"] },
        { weekend: "18-19 Oct", days: ["18 Oct (Sâm)", "19 Oct (Dum)"] },
        { weekend: "25-26 Oct", days: ["25 Oct (Sâm)", "26 Oct (Dum)"] },
      ],
      offDates: [],
    },
    {
      month: "Noiembrie 2025",
      courseDates: [
        { weekend: "8-9 Nov", days: ["8 Nov (Sâm)", "9 Nov (Dum)"] },
        { weekend: "15-16 Nov", days: ["15 Nov (Sâm)", "16 Nov (Dum)"] },
        { weekend: "22-23 Nov", days: ["22 Nov (Sâm)", "23 Nov (Dum)"] },
      ],
      offDates: [
        { weekend: "1-2 Nov", days: ["1 Nov (Sâm)", "2 Nov (Dum)"] },
        { weekend: "29-30 Nov", days: ["29 Nov (Sâm)", "30 Nov (Dum)"] },
      ],
    },
    {
      month: "Decembrie 2025",
      courseDates: [
        { weekend: "6-7 Dec", days: ["6 Dec (Sâm)", "7 Dec (Dum)"] },
        { weekend: "20-21 Dec", days: ["20 Dec (Sâm)", "21 Dec (Dum)"] },
      ],
      offDates: [
        { weekend: "13-14 Dec", days: ["13 Dec (Sâm)", "14 Dec (Dum)"] },
        { weekend: "27-28 Dec", days: ["27 Dec (Sâm)", "28 Dec (Dum)"] },
      ],
    },
    {
      month: "Ianuarie 2026",
      courseDates: [
        { weekend: "10-11 Ian", days: ["10 Ian (Sâm)", "11 Ian (Dum)"] },
        { weekend: "17-18 Ian", days: ["17 Ian (Sâm)", "18 Ian (Dum)"] },
        { weekend: "24-25 Ian", days: ["24 Ian (Sâm)", "25 Ian (Dum)"] },
        { weekend: "31 Ian", days: ["31 Ian (Sâm)"] },
      ],
      offDates: [{ weekend: "3-4 Ian", days: ["3 Ian (Sâm)", "4 Ian (Dum)"] }],
    },
    {
      month: "Februarie 2026",
      courseDates: [
        { weekend: "1 Feb", days: ["1 Feb (Dum)"] },
        { weekend: "7-8 Feb", days: ["7 Feb (Sâm)", "8 Feb (Dum)"] },
        { weekend: "21-22 Feb", days: ["21 Feb (Sâm)", "22 Feb (Dum)"] },
        { weekend: "28 Feb", days: ["28 Feb (Sâm)"] },
      ],
      offDates: [
        { weekend: "14-15 Feb", days: ["14 Feb (Sâm)", "15 Feb (Dum)"] },
      ],
    },
    {
      month: "Martie 2026",
      courseDates: [
        { weekend: "7-8 Mar", days: ["7 Mar (Sâm)", "8 Mar (Dum)"] },
        { weekend: "14-15 Mar", days: ["14 Mar (Sâm)", "15 Mar (Dum)"] },
        { weekend: "21-22 Mar", days: ["21 Mar (Sâm)", "22 Mar (Dum)"] },
        { weekend: "28-29 Mar", days: ["28 Mar (Sâm)", "29 Mar (Dum)"] },
      ],
      offDates: [],
    },
    {
      month: "Aprilie 2026",
      courseDates: [
        { weekend: "4-5 Apr", days: ["4 Apr (Sâm)", "5 Apr (Dum)"] },
        { weekend: "11-12 Apr", days: ["11 Apr (Sâm)", "12 Apr (Dum)"] },
        { weekend: "18-19 Apr", days: ["18 Apr (Sâm)", "19 Apr (Dum)"] },
        { weekend: "25-26 Apr", days: ["25 Apr (Sâm)", "26 Apr (Dum)"] },
      ],
      offDates: [],
    },
    {
      month: "Mai 2026",
      courseDates: [
        { weekend: "2-3 Mai", days: ["2 Mai (Sâm)", "3 Mai (Dum)"] },
        { weekend: "9-10 Mai", days: ["9 Mai (Sâm)", "10 Mai (Dum)"] },
        { weekend: "16-17 Mai", days: ["16 Mai (Sâm)", "17 Mai (Dum)"] },
        { weekend: "23-24 Mai", days: ["23 Mai (Sâm)", "24 Mai (Dum)"] },
      ],
      offDates: [
        { weekend: "30-31 Mai", days: ["30 Mai (Sâm)", "31 Mai (Dum)"] },
      ],
    },
  ];

  return (
    <div className={cn("min-h-screen", "bg-white")}>
      <PageHeroSection title={["PROGRAM"]} breadcrumb={[{ label: "Cursuri", href: "/cursuri" }, { label: "Program" }]}>
        <h1 className="text-4xl md:text-6xl font-semibold text-white leading-[1.1] tracking-tight">
          Program Cursuri
        </h1>
        <p className="text-white/70 text-base font-light border-t border-white/10 pt-4">
          Orarul săptămânal și calendarul complet al sezonului — toate
          datele de curs și weekend-urile libere într-un singur loc.
        </p>
      </PageHeroSection>

      <div className="relative z-10 bg-white">
        <ScheduleSection scheduleGroups={scheduleGroups} />
        <SeasonCalendarViewV2 seasonCalendar={seasonCalendar} />
      </div>
    </div>
  );
};

export default ProgramPage;
