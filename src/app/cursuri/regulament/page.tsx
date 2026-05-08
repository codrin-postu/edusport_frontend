import type { Metadata } from "next";
import { fetchStrapi } from "@/lib/strapi";
import RegulamentPage from "./_View";
import type { CourseRegulationsData, RegulationCategory } from "./_types";

export const metadata: Metadata = {
  title: "Regulament Cursuri",
  description:
    "Regulamentul cursurilor de patinaj EduSport. Reguli de participare, echipament necesar și informații importante.",
  alternates: { canonical: "/cursuri/regulament" },
  openGraph: {
    title: "Regulament Cursuri | EduSport",
    description:
      "Regulamentul cursurilor de patinaj EduSport. Reguli de participare, echipament necesar și informații importante.",
    type: "website",
    locale: "ro_RO",
    images: [{ url: "/images/courses_generated.png", width: 1200, height: 630, alt: "EduSport - Școala de Patinaj" }],
  },
};

export const revalidate = 86400; // 24h - regulations rarely change

export default async function Page() {
  let categories: RegulationCategory[] = [];

  try {
    const data = await fetchStrapi<CourseRegulationsData>(
      "course-regulations",
      "populate=categories",
    );
    categories = data?.categories ?? [];
  } catch {
    // Fall through with empty array - _View renders an empty state
  }

  return <RegulamentPage categories={categories} />;
}
