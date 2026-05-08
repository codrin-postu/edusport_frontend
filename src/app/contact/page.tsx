import type { Metadata } from "next";
import ContactPage from "./_View";
import { fetchStrapi } from "@/lib/strapi";
import type { SiteContactInfo } from "@/components/blocks/footer/Footer";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contactează-ne pentru informații despre cursurile de patinaj EduSport. Adresă, telefon, email și program de funcționare.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact | EduSport",
    description:
      "Contactează-ne pentru informații despre cursurile de patinaj EduSport.",
    type: "website",
    locale: "ro_RO",
    images: [{ url: "/images/courses_generated.png", width: 1200, height: 630, alt: "EduSport - Școala de Patinaj" }],
  },
};

export const revalidate = 3600;

export default async function Page() {
  let contactInfo: SiteContactInfo = {};
  try {
    const settings = await fetchStrapi<{ contact?: SiteContactInfo }>(
      "site-settings",
      "populate=contact",
    );
    contactInfo = settings?.contact ?? {};
  } catch (err) {
    console.error("[contact/page] Failed to fetch site-settings:", err);
  }
  return <ContactPage contactInfo={contactInfo} />;
}
