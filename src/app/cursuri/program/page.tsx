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

// No caching - always fetch fresh from Strapi during development.
// Switch to: export const revalidate = 300; once content is stable.
export const revalidate = 300;

type CmsShape = {
  banner?: { title?: string; subtitle?: string } | null;
  pageInfo?: {
    scheduleSubtitle?: string;
  } | null;
  scheduleGroups?: ScheduleGroup[];
  calendarEvents?: CalendarEvent[];
  disclaimers?: { id: number; text: string }[];
};

type SiteSettingsShape = {
  registration?: {
    currentSeason?: string;
    seasonStartDate?: string; // "YYYY-MM-DD"
    seasonEndDate?: string;   // "YYYY-MM-DD"
  };
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

// Site-settings now owns the canonical season window. Convert the registration
// ISO dates ("YYYY-MM-DD") to "YYYY-MM" for the calendar's valid range.
function seasonBoundsFromSiteSettings(
  start: string | undefined,
  end: string | undefined,
): { seasonStart: string; seasonEnd: string } | null {
  const isoMonth = /^\d{4}-\d{2}/;
  if (!start || !end) return null;
  if (!isoMonth.test(start) || !isoMonth.test(end)) return null;
  return { seasonStart: start.slice(0, 7), seasonEnd: end.slice(0, 7) };
}

export default async function Page() {
  let data: ProgramPageData = PROGRAM_PAGE_DATA;

  // Pull site-settings in parallel - it owns the canonical season window
  // (start/end dates and label) that program-page used to carry.
  const [cmsResult, siteSettingsResult] = await Promise.allSettled([
    fetchStrapi<CmsShape>(
      "program-page",
      "populate[banner]=true&populate[pageInfo]=true&populate[scheduleGroups][populate]=*&populate[calendarEvents]=true&populate[disclaimers]=true",
      false,
    ),
    fetchStrapi<SiteSettingsShape>("site-settings", "fields[0]=registration"),
  ]);

  const cms = cmsResult.status === "fulfilled" ? cmsResult.value : null;
  const settings =
    siteSettingsResult.status === "fulfilled" ? siteSettingsResult.value : null;
  const reg = settings?.registration;

  if (cms) {
    const calendarEvents = cms.calendarEvents?.length
      ? cms.calendarEvents
      : PROGRAM_PAGE_DATA.calendarEvents;

    // Prefer site-settings dates; fall back to deriving from events; finally
    // fall back to the static seed data.
    const bounds =
      seasonBoundsFromSiteSettings(reg?.seasonStartDate, reg?.seasonEndDate)
      ?? deriveSeasonBounds(calendarEvents);

    data = {
      seasonLabel:
        reg?.currentSeason ?? PROGRAM_PAGE_DATA.seasonLabel,
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

  return <ProgramPage data={data} />;
}
