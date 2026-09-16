import type { Metadata } from "next";
import VolunteerInscriereView from "./_View";
import { fetchFormConfig } from "@/lib/strapi-forms";

export const metadata: Metadata = {
  title: "Înscriere Voluntariat",
  description:
    "Completează formularul de înscriere ca voluntar la clubul EduSport. Trei pași simpli, fără experiență prealabilă.",
  alternates: { canonical: "/voluntariat/inscriere" },
  openGraph: {
    title: "Înscriere Voluntariat | EduSport",
    description:
      "Completează formularul de înscriere ca voluntar la clubul EduSport.",
    type: "website",
    locale: "ro_RO",
  },
};

// The form shape is CMS-driven, so edits in the admin must show up quickly
// (same reasoning as /inscrieri).
export const revalidate = 60;

export default async function Page() {
  const formConfig = await fetchFormConfig("voluntariat");
  return <VolunteerInscriereView formConfig={formConfig} />;
}
