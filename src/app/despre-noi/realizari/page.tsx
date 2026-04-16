import type { Metadata } from "next";
import { fetchStrapi } from "@/lib/strapi";
import AccomplishmentsPage from "./_View";
import type { Season, GalleryImage, Placement } from "./_data";

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
  bannerTitle?: string | null;
  bannerSubtitle?: string | null;
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
    placement?: Placement | null;
    score?: number | null;
  }[] | null;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337";

function strapiImageUrl(url: string): string {
  if (url.startsWith("http")) return url;
  return `${STRAPI_URL}${url}`;
}

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
        category: p.category ?? "",
        placement: p.placement ?? "top10",
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
      "populate=*&sort=date:desc",
    ).catch(() => [] as StrapiCompetition[]),
  ]);

  const seasons = groupIntoSeasons(rawCompetitions);

  const galleryImages: GalleryImage[] = (cms.galleryImages ?? []).map((img) => ({
    src: strapiImageUrl(img.url),
    alt: img.alternativeText ?? "",
  }));

  return (
    <AccomplishmentsPage
      bannerTitle={cms.bannerTitle ?? undefined}
      bannerSubtitle={cms.bannerSubtitle ?? undefined}
      notableAchievements={cms.notableAchievements ?? []}
      galleryImages={galleryImages}
      seasons={seasons}
    />
  );
}
