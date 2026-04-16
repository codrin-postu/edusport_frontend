import type { Metadata } from "next";
import InscrieriView from "./_View";

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

export const revalidate = 3600;

export default function Page() {
  return <InscrieriView />;
}
