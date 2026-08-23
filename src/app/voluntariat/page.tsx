import type { Metadata } from "next";
import VolunteerView from "./_View";
import { fetchVolunteerPage } from "@/lib/strapi-volunteer";
import { HELP_WAYS, VOLUNTEER_PHOTOS, VOLUNTEER_COPY } from "./_data";

// CMS-managed with static fallback: if Strapi is down or the volunteer-page is
// empty, fall back to the placeholders so the page always renders.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Voluntariat",
  description:
    "Devino voluntar la clubul EduSport — ajută la competiții, organizare, mentorat sau promovare. Fără experiență prealabilă.",
  alternates: { canonical: "/voluntariat" },
  openGraph: {
    title: "Voluntariat | EduSport",
    description:
      "Devino voluntar la clubul EduSport — ajută la competiții, organizare, mentorat sau promovare.",
    locale: "ro_RO",
    type: "website",
  },
};

export default async function VoluntariatPage() {
  let cms: Awaited<ReturnType<typeof fetchVolunteerPage>> = null;
  try {
    cms = await fetchVolunteerPage();
  } catch {
    cms = null;
  }
  const c = cms?.content ?? {};
  return (
    <VolunteerView
      heroTitle={c.heroTitle || VOLUNTEER_COPY.heroTitle}
      heroSubtitle={c.heroSubtitle || VOLUNTEER_COPY.heroSubtitle}
      introEyebrow={c.introEyebrow || VOLUNTEER_COPY.introEyebrow}
      introHeading={c.introHeading || VOLUNTEER_COPY.introHeading}
      introBody={c.introBody || VOLUNTEER_COPY.introBody}
      helpWays={cms?.helpWays.length ? cms.helpWays : HELP_WAYS}
      photos={cms?.photos.length ? cms.photos : VOLUNTEER_PHOTOS}
    />
  );
}
