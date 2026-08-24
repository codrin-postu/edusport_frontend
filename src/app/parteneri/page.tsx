import type { Metadata } from "next";
import PartnerView from "./_View";
import {
  fetchSponsors,
  fetchCollaborationEvents,
  fetchPartnersPage,
} from "@/lib/strapi-partners";
import { SPONSORS, COLLAB_EVENTS, PARTNERS_COPY } from "./_data";

// Content is CMS-managed; fall back to the static placeholders when Strapi is
// unavailable or the collections are empty, so the page always renders.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Parteneri",
  description:
    "Partenerii și sponsorii clubului EduSport, evenimentele organizate împreună și cum poți sponsoriza clubul sau organiza un eveniment special.",
  alternates: { canonical: "/parteneri" },
  openGraph: {
    title: "Parteneri | EduSport",
    description:
      "Partenerii și sponsorii clubului EduSport și cum poți colabora — sponsorizare sau evenimente speciale.",
    locale: "ro_RO",
    type: "website",
  },
};

export default async function ParteneriPage() {
  const [sp, ev, pc] = await Promise.allSettled([
    fetchSponsors(),
    fetchCollaborationEvents(),
    fetchPartnersPage(),
  ]);
  const sponsors =
    sp.status === "fulfilled" && sp.value.length > 0 ? sp.value : SPONSORS;
  const events =
    ev.status === "fulfilled" && ev.value.length > 0 ? ev.value : COLLAB_EVENTS;
  const c = pc.status === "fulfilled" && pc.value ? pc.value : {};
  // CMS value per field, else the static fallback copy.
  const copy = {
    heroTitle: c.heroTitle || PARTNERS_COPY.heroTitle,
    heroSubtitle: c.heroSubtitle || PARTNERS_COPY.heroSubtitle,
    introEyebrow: c.introEyebrow || PARTNERS_COPY.introEyebrow,
    introHeading: c.introHeading || PARTNERS_COPY.introHeading,
    introBody: c.introBody || PARTNERS_COPY.introBody,
    ctaEyebrow: c.ctaEyebrow || PARTNERS_COPY.ctaEyebrow,
    ctaHeading: c.ctaHeading || PARTNERS_COPY.ctaHeading,
    ctaBody: c.ctaBody || PARTNERS_COPY.ctaBody,
  };
  return <PartnerView sponsors={sponsors} events={events} copy={copy} />;
}
