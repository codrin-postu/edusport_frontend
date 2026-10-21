import type { Metadata } from "next";
import { fetchStrapi } from "@/lib/strapi";
import { fetchSeasonOccurrences } from "@/lib/strapi-calendar";
import { fetchPublicClubInfo } from "@/lib/club-public-fetch";
import { seasonMonthBounds } from "@/lib/club-public";
import { occurrencesToCalendarEvents } from "@/utils/occurrences-to-calendar";
import ProgramPage from "./_View";
import type { ProgramPageData, ScheduleGroup, CalendarEvent } from "./_types";
import { PROGRAM_PAGE_DATA } from "./_data";
import { requireEnabled } from "@/lib/strapi-navigation";

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
  disclaimers?: { id: number; text: string }[];
};

// The new unified `program` single type owns the schedule series.
type ProgramShape = {
  scheduleGroups?: ScheduleGroup[];
};

// "YYYY-MM" -> "YYYY-MM-DD" of that month's last day.
function lastDayOfMonth(yyyymm: string): string {
  const [y, m] = yyyymm.split("-").map(Number);
  const day = new Date(y, m, 0).getDate();
  return `${yyyymm}-${String(day).padStart(2, "0")}`;
}

// Shift a "YYYY-MM" month by `delta` months (negative = earlier).
function shiftMonth(yyyymm: string, delta: number): string {
  const [y, m] = yyyymm.split("-").map(Number);
  const d = new Date(y, m - 1 + delta, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

// Widen the season window so the calendar shows shoulder months (empty is fine):
// 2 months before the season starts, 3 months after it ends.
const PAD_BEFORE = 2;
const PAD_AFTER = 3;
function padSeasonBounds(
  bounds: { seasonStart: string; seasonEnd: string } | null,
): { seasonStart: string; seasonEnd: string } | null {
  if (!bounds) return null;
  return {
    seasonStart: shiftMonth(bounds.seasonStart, -PAD_BEFORE),
    seasonEnd: shiftMonth(bounds.seasonEnd, PAD_AFTER),
  };
}

export default async function Page() {
  await requireEnabled("program");

  // program-page still owns the banner / disclaimers; the new `program` single
  // type owns the schedule series; the current Sezon owns the season window.
  const [cmsResult, programResult, clubResult] = await Promise.allSettled([
    fetchStrapi<CmsShape>(
      "program-page",
      // Only `disclaimers` is a real component; the rest are JSON custom-fields.
      "populate[disclaimers]=true",
      false,
    ),
    fetchStrapi<ProgramShape>("program"),
    fetchPublicClubInfo(),
  ]);

  const cms = cmsResult.status === "fulfilled" ? cmsResult.value : null;
  const program = programResult.status === "fulfilled" ? programResult.value : null;
  const season = clubResult.status === "fulfilled" ? clubResult.value?.season ?? null : null;

  // Season window: the current Sezon's start and end month, else the default
  // season bounds so the occurrence fetch always has a range to query.
  const rawBounds =
    seasonMonthBounds(season)
    ?? (PROGRAM_PAGE_DATA.seasonStart && PROGRAM_PAGE_DATA.seasonEnd
      ? { seasonStart: PROGRAM_PAGE_DATA.seasonStart, seasonEnd: PROGRAM_PAGE_DATA.seasonEnd }
      : null);

  // Pad the window (2 months before start, 3 after end) so the calendar and its
  // navigation range include the shoulder months, even when they are empty.
  const bounds = padSeasonBounds(rawBounds);

  // The calendar-event collection (via /api/calendar/occurrences) is the only
  // source of the season calendar now. When it returns nothing, the page
  // renders with an empty calendar (see SeasonCalendarViewV2's empty state)
  // rather than falling back to any seed/legacy data.
  const rangeFrom = bounds ? `${bounds.seasonStart}-01` : null;
  const rangeTo = bounds ? lastDayOfMonth(bounds.seasonEnd) : null;
  let calendarEvents: CalendarEvent[] = [];
  if (rangeFrom && rangeTo) {
    const { occurrences } = await fetchSeasonOccurrences(rangeFrom, rangeTo);
    if (occurrences.length) calendarEvents = occurrencesToCalendarEvents(occurrences);
  }

  const data: ProgramPageData = {
    seasonLabel: season?.label ?? null,
    seasonStart: bounds?.seasonStart ?? PROGRAM_PAGE_DATA.seasonStart,
    seasonEnd: bounds?.seasonEnd ?? PROGRAM_PAGE_DATA.seasonEnd,
    bannerTitle: cms?.banner?.title ?? PROGRAM_PAGE_DATA.bannerTitle,
    bannerSubtitle: cms?.banner?.subtitle ?? PROGRAM_PAGE_DATA.bannerSubtitle,
    scheduleSubtitle: cms?.pageInfo?.scheduleSubtitle ?? PROGRAM_PAGE_DATA.scheduleSubtitle,
    scheduleGroups: program?.scheduleGroups?.length ? program.scheduleGroups : [],
    calendarEvents,
    disclaimers: cms?.disclaimers?.length
      ? cms.disclaimers.map((d) => d.text)
      : PROGRAM_PAGE_DATA.disclaimers,
  };

  return <ProgramPage data={data} />;
}
