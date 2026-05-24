import type { Metadata } from "next";
import { fetchStrapi } from "@/lib/strapi";
import { resolveAssetUrl } from "@/utils/markdown";
import AccomplishmentsPage from "./_View";
import type { Season, GalleryImage } from "./_data";

export const metadata: Metadata = {
  title: "Realizări",
  description:
    "Realizările și rezultatele sportivilor EduSport la competițiile de patinaj artistic. Palmares, medalii și performanțe notabile.",
  alternates: { canonical: "/despre-noi/realizari" },
  openGraph: {
    title: "Realizări | EduSport",
    description: "Realizările sportivilor EduSport la competiții de patinaj.",
    type: "website",
    locale: "ro_RO",
    images: [{ url: "/images/courses_generated.png", width: 1200, height: 630, alt: "EduSport - Școala de Patinaj" }],
  },
};

// ---------------------------------------------------------------------------
// Strapi types
// ---------------------------------------------------------------------------

interface RealizariPageCms {
  banner?: { bannerTitle?: string | null; bannerSubtitle?: string | null } | null;
  notableAchievements?: string[] | null;
  galleryImages?: { url: string; alternativeText?: string | null }[] | null;
}

interface StrapiCompetition {
  id: number;
  name: string;
  date: string; // ISO date string from Strapi
  location?: string | null;
  level?: "national" | "international" | null;
  season: string;
  participants?: {
    athleteName: string;
    category?: string | null;
    placement?: string | number | null;
    score?: number | null;
    /** Linked sportsperson — only populated for club athletes. Null/missing
     *  means it's an external participant (other clubs) and we keep the
     *  athleteName string as the display value. */
    sportsperson?: {
      slug: string;
      showPublicPage: boolean;
    } | null;
  }[] | null;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("ro-RO", { month: "long", year: "numeric" });
}

function groupIntoSeasons(competitions: StrapiCompetition[]): Season[] {
  const map = new Map<string, Season>();
  for (const comp of competitions) {
    const key = comp.season;
    if (!map.has(key)) {
      map.set(key, {
        id: key,
        label: `Sezon ${key}`,
        competitions: [],
      });
    }
    map.get(key)!.competitions.push({
      name: comp.name,
      date: formatDate(comp.date),
      location: comp.location ?? "",
      level: comp.level ?? "national",
      results: (comp.participants ?? []).map((p) => ({
        athlete: p.athleteName,
        // Only expose the slug when the linked profile is public — keeps
        // private/hidden sportspeople from leaking via the realizari page.
        athleteSlug:
          p.sportsperson?.showPublicPage ? p.sportsperson.slug : undefined,
        category: p.category ?? "",
        placement: Number(p.placement) || 99,
        score: p.score ?? 0,
      })),
    });
  }
  // Sort seasons descending (newest first)
  return Array.from(map.values()).sort((a, b) => b.id.localeCompare(a.id));
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export const revalidate = 3600;

export default async function Page() {
  const [cms, rawCompetitions] = await Promise.all([
    fetchStrapi<RealizariPageCms>("realizari-page", "populate=galleryImages").catch(
      () => ({} as RealizariPageCms),
    ),
    fetchStrapi<StrapiCompetition[]>(
      "competitions",
      "populate[participants][populate][sportsperson][fields][0]=slug&populate[participants][populate][sportsperson][fields][1]=showPublicPage&sort=date:desc",
    ).catch(() => [] as StrapiCompetition[]),
  ]);

  const seasons = groupIntoSeasons(rawCompetitions);

  const galleryImages: GalleryImage[] = (cms.galleryImages ?? []).map((img) => ({
    src: resolveAssetUrl(img.url),
    alt: img.alternativeText ?? "",
  }));

  return (
    <AccomplishmentsPage
      bannerTitle={cms.banner?.bannerTitle ?? undefined}
      bannerSubtitle={cms.banner?.bannerSubtitle ?? undefined}
      notableAchievements={cms.notableAchievements ?? []}
      galleryImages={galleryImages}
      seasons={seasons}
    />
  );
}
