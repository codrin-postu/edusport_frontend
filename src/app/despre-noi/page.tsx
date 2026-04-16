import type { Metadata } from "next";
import { fetchStrapi } from "@/lib/strapi";
import HistoryPage from "./_View";

export const metadata: Metadata = {
  title: "Istoric",
  description:
    "Istoria școlii de patinaj EduSport. Momente importante, evoluția clubului și reperele parcursului nostru.",
  alternates: { canonical: "/despre-noi" },
  openGraph: {
    title: "Despre Noi | EduSport",
    description:
      "Istoria școlii de patinaj EduSport. Momente importante, evoluția clubului și reperele parcursului nostru.",
    type: "website",
    locale: "ro_RO",
    images: [{ url: "/images/courses_generated.png", width: 1200, height: 630, alt: "EduSport - Școala de Patinaj" }],
  },
};

interface HistoricPageCms {
  banner?: { title?: string | null; subtitle?: string | null } | null;
  pageInfo?: { introText?: string | null; sectionHeading?: string | null; sectionSubheading?: string | null } | null;
  stats?: string[] | null;
  eventsOrganized?: string[] | null;
  eventsParticipated?: string[] | null;
}

interface StrapiMilestone {
  id: number;
  year: string;
  title: string;
  description?: string | null;
}

export const revalidate = 3600;

export default async function Page() {
  const [cms, rawMilestones] = await Promise.all([
    fetchStrapi<HistoricPageCms>("historic-page").catch(() => ({} as HistoricPageCms)),
    fetchStrapi<StrapiMilestone[]>("history-milestones", "sort=year:asc").catch(() => []),
  ]);

  return (
    <HistoryPage
      bannerTitle={cms.banner?.title ?? undefined}
      bannerSubtitle={cms.banner?.subtitle ?? undefined}
      sectionHeading={cms.pageInfo?.sectionHeading ?? undefined}
      sectionSubheading={cms.pageInfo?.sectionSubheading ?? undefined}
      introText={cms.pageInfo?.introText ?? undefined}
      stats={cms.stats ?? undefined}
      milestones={rawMilestones.map((m) => ({ year: m.year, title: m.title, description: m.description ?? "" }))}
      eventsOrganized={cms.eventsOrganized ?? undefined}
      eventsParticipated={cms.eventsParticipated ?? undefined}
    />
  );
}
