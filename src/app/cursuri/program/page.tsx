import type { Metadata } from "next";
import { fetchStrapi } from "@/lib/strapi";
import ProgramPage from "./_View";
import type { ProgramPageData, ScheduleGroup, CalendarEvent } from "./_types";
import { PROGRAM_PAGE_DATA } from "./_data";

export const metadata: Metadata = {
  title: "Program Cursuri",
  description:
    "Programul cursurilor de patinaj EduSport. Orarul sesiunilor pe grupe de vârstă și nivel.",
  alternates: { canonical: "/cursuri/program" },
  openGraph: {
    title: "Program Cursuri | EduSport",
    description:
      "Programul cursurilor de patinaj EduSport. Orarul sesiunilor pe grupe de vârstă și nivel.",
    type: "website",
    locale: "ro_RO",
    images: [{ url: "/images/courses_generated.png", width: 1200, height: 630, alt: "EduSport - Școala de Patinaj" }],
  },
};

// No caching — always fetch fresh from Strapi during development.
// Switch to: export const revalidate = 300; once content is stable.
export const dynamic = "force-dynamic";

type CmsShape = {
  banner?: { title?: string; subtitle?: string } | null;
  pageInfo?: {
    seasonLabel?: string;
    scheduleSubtitle?: string;
  } | null;
  scheduleGroups?: ScheduleGroup[];
  calendarEvents?: CalendarEvent[];
  disclaimers?: { id: number; text: string }[];
};

function deriveSeasonBounds(events: CalendarEvent[]): { seasonStart: string; seasonEnd: string } | null {
  if (!events.length) return null;
  const dates = events.flatMap((e) => [e.startDate, e.endDate]);
  const sorted = dates.filter(Boolean).sort();
  return {
    seasonStart: sorted[0].slice(0, 7),               // "YYYY-MM"
    seasonEnd: sorted[sorted.length - 1].slice(0, 7), // "YYYY-MM"
  };
}

export default async function Page() {
  let data: ProgramPageData = PROGRAM_PAGE_DATA;

  try {
    const cms = await fetchStrapi<CmsShape>("program-page", "populate=*", false);
    if (cms) {
      const calendarEvents = cms.calendarEvents?.length
        ? cms.calendarEvents
        : PROGRAM_PAGE_DATA.calendarEvents;
      const bounds = deriveSeasonBounds(calendarEvents);

      data = {
        seasonLabel: cms.pageInfo?.seasonLabel ?? PROGRAM_PAGE_DATA.seasonLabel,
        seasonStart: bounds?.seasonStart ?? PROGRAM_PAGE_DATA.seasonStart,
        seasonEnd: bounds?.seasonEnd ?? PROGRAM_PAGE_DATA.seasonEnd,
        bannerTitle: cms.banner?.title ?? PROGRAM_PAGE_DATA.bannerTitle,
        bannerSubtitle: cms.banner?.subtitle ?? PROGRAM_PAGE_DATA.bannerSubtitle,
        scheduleSubtitle: cms.pageInfo?.scheduleSubtitle ?? PROGRAM_PAGE_DATA.scheduleSubtitle,
        scheduleGroups: cms.scheduleGroups?.length
          ? cms.scheduleGroups
          : PROGRAM_PAGE_DATA.scheduleGroups,
        calendarEvents,
        disclaimers: cms.disclaimers?.length
          ? cms.disclaimers.map((d) => d.text)
          : PROGRAM_PAGE_DATA.disclaimers,
      };
    }
  } catch {
    // Strapi unavailable — fall through with PROGRAM_PAGE_DATA
  }

  return <ProgramPage data={data} />;
}
