import type { Metadata } from "next";
import { fetchStrapi } from "@/lib/strapi";
import { resolveAssetUrl } from "@/utils/markdown";
import TeamPage from "./_View";

export const metadata: Metadata = {
  title: "Echipa Noastră",
  description:
    "Cunoaște echipa de antrenori EduSport. Antrenori cu experiență în patinaj artistic, dedicați formării sportivilor de toate vârstele.",
  alternates: { canonical: "/despre-noi/echipa" },
  openGraph: {
    title: "Echipa Noastră | EduSport",
    description: "Cunoaște echipa de antrenori EduSport.",
    type: "website",
    locale: "ro_RO",
    images: [{ url: "/images/courses_generated.png", width: 1200, height: 630, alt: "EduSport - Școala de Patinaj" }],
  },
};

interface StrapiPhoto {
  url: string;
}

interface StrapiTeamMember {
  id: number;
  name: string;
  role?: string | null;
  bio?: string | null;
  photo?: StrapiPhoto | null;
  groups?: string[] | null;
  order?: number | null;
}

interface TeamPageCms {
  banner?: { title?: string | null; subtitle?: string | null } | null;
  pageInfo?: { introText?: string | null } | null;
}

export const revalidate = 3600;

export default async function Page() {
  const [cms, rawMembers] = await Promise.all([
    fetchStrapi<TeamPageCms>("team-page").catch(() => ({} as TeamPageCms)),
    fetchStrapi<StrapiTeamMember[]>("team-members", "sort=order:asc&populate=photo").catch(() => []),
  ]);

  const members = rawMembers.map((m) => ({
    name: m.name,
    role: m.role ?? "",
    bio: m.bio ?? "",
    image: m.photo?.url ? resolveAssetUrl(m.photo.url) : undefined,
    teaches: m.groups ?? [],
  }));

  return (
    <TeamPage
      bannerTitle={cms.banner?.title ?? undefined}
      bannerSubtitle={cms.banner?.subtitle ?? undefined}
      introText={cms.pageInfo?.introText ?? undefined}
      members={members}
    />
  );
}
