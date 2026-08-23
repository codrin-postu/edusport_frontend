import type { Metadata } from "next";
import PartnerView from "./_View";

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

export default function ParteneriPage() {
  return <PartnerView />;
}
