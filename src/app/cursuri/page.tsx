import type { Metadata } from "next";
import { fetchStrapi } from "@/lib/strapi";
import CoursesPage from "./_View";
import type { CoursePricingData, CoursePageContent } from "./_types";
import { CURSURI_PAGE_DATA, CURRENT_SEASON, IS_REGISTRATION_OPEN } from "./_data";
import type { PricingTier } from "./_data";

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
  let pricingData: PricingTier[] | null = null;
  let footerNotes: string[] | null = null;
  let currentSeason = CURRENT_SEASON;
  let isRegistrationOpen = IS_REGISTRATION_OPEN;
  let cursuriPageData = CURSURI_PAGE_DATA;

  try {
    const pricing = await fetchStrapi<CoursePricingData>("pricing");
    const tiers = pricing?.tiers;
    if (tiers?.memberTiers?.length || tiers?.nonMemberTiers?.length) {
      pricingData = [
        {
          title: "Pentru Membri",
          priceItems: (tiers.memberTiers ?? []).map((t) => ({
            label: t.label,
            price: t.price,
            tooltip: t.tooltip,
            note: t.note,
          })),
          ...(tiers.memberFeeLabel && tiers.memberFeePrice
            ? { bottomItem: { label: tiers.memberFeeLabel, price: tiers.memberFeePrice } }
            : {}),
        },
        {
          title: "Pentru Non-membri",
          priceItems: (tiers.nonMemberTiers ?? []).map((t) => ({
            label: t.label,
            price: t.price,
            tooltip: t.tooltip,
            note: t.note,
          })),
        },
      ];
    }
    if (pricing?.footerNotes?.length) footerNotes = pricing.footerNotes;
  } catch {
    // Fall through with null — PricingSection renders error state
  }

  try {
    const settings = await fetchStrapi<{
      registration?: { currentSeason?: string; open?: boolean };
    }>("site-settings", "fields[0]=registration");
    if (settings?.registration?.currentSeason)
      currentSeason = settings.registration.currentSeason;
    if (settings?.registration?.open !== undefined)
      isRegistrationOpen = settings.registration.open;
  } catch {
    // Fall through with hardcoded defaults
  }

  try {
    const cms = await fetchStrapi<CoursePageContent>("cursuri-page", "populate=*");
    if (cms) {
      cursuriPageData = {
        banner: cms.banner ?? CURSURI_PAGE_DATA.banner,
        aboutSection: cms.aboutSection ?? CURSURI_PAGE_DATA.aboutSection,
        promoCard: cms.promoCard ?? CURSURI_PAGE_DATA.promoCard,
        infoSection: cms.infoSection ?? CURSURI_PAGE_DATA.infoSection,
      };
    }
  } catch {
    // Fall through with hardcoded defaults
  }

  return (
    <CoursesPage
      pricingData={pricingData}
      footerNotes={footerNotes}
      currentSeason={currentSeason}
      isRegistrationOpen={isRegistrationOpen}
      cursuriPageData={cursuriPageData}
    />
  );
}
