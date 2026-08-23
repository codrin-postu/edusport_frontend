import type { Metadata } from "next";
import PartnerView from "./_View";
import { fetchSponsors, fetchCollaborationEvents } from "@/lib/strapi-partners";
import { SPONSORS, COLLAB_EVENTS } from "./_data";

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
  const [sp, ev] = await Promise.allSettled([
    fetchSponsors(),
    fetchCollaborationEvents(),
  ]);
  const sponsors =
    sp.status === "fulfilled" && sp.value.length > 0 ? sp.value : SPONSORS;
  const events =
    ev.status === "fulfilled" && ev.value.length > 0 ? ev.value : COLLAB_EVENTS;
  return <PartnerView sponsors={sponsors} events={events} />;
}
