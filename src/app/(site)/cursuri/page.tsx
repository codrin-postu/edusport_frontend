import type { Metadata } from "next";
import { fetchStrapi } from "@/lib/strapi";
import { getSiteSettings } from "@/lib/site-settings";
import { fetchPublicClubInfo } from "@/lib/club-public-fetch";
import { registrationsOpen, websitePriceTiers } from "@/lib/club-public";
import { mapsHref } from "@/lib/mapsLink";
import { FALLBACK_ADDRESS_DISPLAY, FALLBACK_ADDRESS_MAPS_URL } from "@/lib/location";
import CoursesPage from "./_View";
import type { CoursePageContent } from "./_types";
import { CURSURI_PAGE_DATA, IS_REGISTRATION_OPEN } from "./_data";
import { requireEnabled } from "@/lib/strapi-navigation";

export const metadata: Metadata = {
  title: "Cursuri de Patinaj",
  description:
    "Cursuri de patinaj artistic pentru copii și adulți la EduSport. Prețuri, grupe de nivel, program și informații despre înscriere.",
  alternates: { canonical: "/cursuri" },
  openGraph: {
    title: "Cursuri de Patinaj | EduSport",
    description:
      "Cursuri de patinaj artistic pentru copii și adulți. Prețuri, grupe și program.",
    type: "website",
    locale: "ro_RO",
    images: [{ url: "/images/courses_generated.png", width: 1200, height: 630, alt: "EduSport - Școala de Patinaj" }],
  },
};

export const revalidate = 300; // 5 min

export default async function Page() {
  await requireEnabled("scoala");
  let switchOpen = IS_REGISTRATION_OPEN;
  let cursuriPageData = CURSURI_PAGE_DATA;
  let locationDisplay = FALLBACK_ADDRESS_DISPLAY;
  let locationHref: string | undefined = FALLBACK_ADDRESS_MAPS_URL;

  const [clubResult, settingsResult, cursuriPageResult] = await Promise.allSettled([
    // Season, fee and prices: Sezoane and Prețuri in the admin (GET /api/club/public).
    fetchPublicClubInfo(),
    getSiteSettings(),
    fetchStrapi<CoursePageContent>("cursuri-page"),
  ]);
  const club = clubResult.status === "fulfilled" ? clubResult.value : null;

  // This page is the Școala de patinaj page: the first school of the public read.
  const school = club?.schools[0] ?? null;
  const pricingData = websitePriceTiers(school, club?.membershipFee ?? null);
  const footerNotes = school?.priceNotes.length ? school.priceNotes : null;
  // No current Sezon: no season label, and registrations show as closed.
  const currentSeason = club?.season?.label ?? null;

  if (settingsResult.status === "fulfilled") {
    const settings = settingsResult.value;
    if (settings.registrationOpen !== undefined)
      switchOpen = settings.registrationOpen;
    if (settings.contact.addressDisplay) {
      locationDisplay = settings.contact.addressDisplay;
      locationHref =
        mapsHref(settings.contact.addressDisplay, settings.contact.addressMapsUrl) ??
        FALLBACK_ADDRESS_MAPS_URL;
    }
  }

  if (cursuriPageResult.status === "fulfilled" && cursuriPageResult.value) {
    const cms = cursuriPageResult.value;
    cursuriPageData = {
      banner: cms.banner ?? CURSURI_PAGE_DATA.banner,
      aboutSection: cms.aboutSection ?? CURSURI_PAGE_DATA.aboutSection,
      promoCard: cms.promoCard ?? CURSURI_PAGE_DATA.promoCard,
      infoSection: cms.infoSection ?? CURSURI_PAGE_DATA.infoSection,
    };
  }

  const isRegistrationOpen = registrationsOpen(switchOpen, club);

  return (
    <CoursesPage
      pricingData={pricingData}
      footerNotes={footerNotes}
      currentSeason={currentSeason}
      isRegistrationOpen={isRegistrationOpen}
      cursuriPageData={cursuriPageData}
      locationDisplay={locationDisplay}
      locationHref={locationHref}
    />
  );
}
