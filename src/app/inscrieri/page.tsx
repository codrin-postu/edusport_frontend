import type { Metadata } from "next";
import InscrieriView from "./_View";
import { fetchFormConfig } from "@/lib/strapi-forms";
import { getSiteSettings } from "@/lib/site-settings";
import { CURRENT_SEASON } from "../cursuri/_data";
import { requireEnabled } from "@/lib/strapi-navigation";

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
// which read as the editor being broken.
export const revalidate = 60;

export default async function Page() {
  await requireEnabled("inscrieri");
  const [formConfig, settings] = await Promise.all([
    fetchFormConfig("inscriere"),
    getSiteSettings(),
  ]);
  const currentSeason = settings.currentSeason ?? CURRENT_SEASON;
  return <InscrieriView formConfig={formConfig} currentSeason={currentSeason} />;
}
