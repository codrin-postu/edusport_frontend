import type { Metadata } from "next";
import { fetchStrapi } from "@/lib/strapi";
import { parsePlacement } from "@/lib/strapi-sportsperson";
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

interface StrapiParticipantJSON {
  documentId?: string;
  name?: string;
  category?: string | null;
  placement?: number | null;
  score?: number | null;
}

interface StrapiCompetition {
  id: number;
  name: string;
  date: string;
  location?: string | null;
  level?: "national" | "international" | null;
  season: string;
  participantData?: StrapiParticipantJSON[] | null;
  sportspeople?: {
    documentId: string;
    slug: string;
    showPublicPage: boolean;
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
      map.set(key, { id: key, label: `Sezon ${key}`, competitions: [] });
    }
    // Build a lookup of documentId → { slug, showPublicPage } from the relation
    const spMap = new Map(
      (comp.sportspeople ?? []).map((sp) => [sp.documentId, sp]),
    );
    map.get(key)!.competitions.push({
      name: comp.name,
      date: formatDate(comp.date),
      location: comp.location ?? "",
      level: comp.level ?? "national",
      results: (comp.participantData ?? []).map((p) => {
        const sp = p.documentId ? spMap.get(p.documentId) : undefined;
        return {
          athlete: p.name ?? "",
          athleteSlug: sp?.showPublicPage ? sp.slug : undefined,
          category: p.category ?? "",
          placement: parsePlacement(p.placement) ?? 99,
          score: p.score ?? 0,
        };
      }),
    });
  }
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
      new URLSearchParams({
        "sort[0]": "date:desc",
        "fields[0]": "name",
        "fields[1]": "date",
        "fields[2]": "location",
        "fields[3]": "level",
        "fields[4]": "season",
        "fields[5]": "participantData",
        "populate[sportspeople][fields][0]": "documentId",
        "populate[sportspeople][fields][1]": "slug",
        "populate[sportspeople][fields][2]": "showPublicPage",
      }).toString(),
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
