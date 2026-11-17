import type { Metadata } from "next";
import InscrieriView from "./_View";
import { fetchFormConfig } from "@/lib/strapi-forms";
import { getSiteSettings } from "@/lib/site-settings";
import { fetchPublicClubInfo } from "@/lib/club-public-fetch";
import { fetchCalendarOccurrences } from "@/lib/strapi-calendar";
import { occurrencesToCalendarEvents } from "@/utils/occurrences-to-calendar";
import { requireEnabled } from "@/lib/strapi-navigation";
import { nextMonthWindow, scheduleWeekends } from "./_schedule";

export const metadata: Metadata = {
  title: "Înscrieri",
  description:
    "Înscrie-ți copilul la cursurile de patinaj artistic EduSport. Completează formularul în trei pași simpli.",
  alternates: { canonical: "/inscrieri" },
  openGraph: {
    title: "Înscrieri | EduSport",
    description:
      "Înscrie-ți copilul la cursurile de patinaj artistic EduSport.",
    type: "website",
    locale: "ro_RO",
    images: [{ url: "/images/courses_generated.png", width: 1200, height: 630, alt: "EduSport - Școala de Patinaj" }],
  },
};

// The form shape is CMS-driven, so edits in the admin must show up quickly.
// At 3600 a reordered or renamed question stayed invisible for up to an hour,
// which read as the editor being broken. Prices and the season follow the
// same 60 seconds (GET /api/club/public is cached for 60 s by the backend).
export const revalidate = 60;

export default async function Page() {
  await requireEnabled("inscrieri");
  const range = nextMonthWindow(new Date());
  const [formConfig, settings, club, calendar] = await Promise.all([
    fetchFormConfig("inscriere"),
    getSiteSettings(),
    fetchPublicClubInfo(),
    fetchCalendarOccurrences(range.from, range.to, 300),
  ]);
  // The Școala de patinaj weekends, built exactly as on /cursuri/program.
  const weekends = scheduleWeekends(occurrencesToCalendarEvents(calendar.occurrences), range);
  return (
    <InscrieriView
      formConfig={formConfig}
      club={club}
      registrationOpen={settings.registrationOpen !== false}
      weekends={weekends}
      whatsappUrl={settings.contact.whatsappChannelUrl}
    />
  );
}
