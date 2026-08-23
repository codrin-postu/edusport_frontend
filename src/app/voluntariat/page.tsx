import type { Metadata } from "next";
import VolunteerView from "./_View";

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

export default function VoluntariatPage() {
  return <VolunteerView />;
}
