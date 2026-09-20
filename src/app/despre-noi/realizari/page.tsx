import type { Metadata } from "next";
import { fetchStrapi } from "@/lib/strapi";
import { resolveAssetUrl } from "@/utils/markdown";
import { getSkaterResults, seasonKey, levelOf } from "@/lib/skate-results";
import AccomplishmentsPage from "./_View";
import { buildSeasonIndex, type Season, type GalleryImage } from "./_data";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

function readSeasonParam(params: Awaited<SearchParams>): string | null {
  const raw = params.sezon;
  const value = Array.isArray(raw) ? raw[0] : raw;
  return value && /^\d{4}-\d{4}$/.test(value) ? value : null;
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const season = readSeasonParam(await searchParams);
  const canonical = season
    ? `/despre-noi/realizari?sezon=${season}`
    : "/despre-noi/realizari";
  const title = season ? `Realizări, sezonul ${season.replace("-", " - ")}` : "Realizări";
  return {
    title,
    description:
      "Realizările și rezultatele sportivilor EduSport la competițiile de patinaj artistic. Palmares, medalii și performanțe notabile.",
    alternates: { canonical },
    openGraph: {
      title: `${title} | EduSport`,
      description: "Realizările sportivilor EduSport la competiții de patinaj.",
      type: "website",
      locale: "ro_RO",
      images: [{ url: "/images/courses_generated.png", width: 1200, height: 630, alt: "EduSport - Școala de Patinaj" }],
    },
  };
}

// ---------------------------------------------------------------------------
// Strapi types
// ---------------------------------------------------------------------------

interface RealizariPageCms {
  banner?: { bannerTitle?: string | null; bannerSubtitle?: string | null } | null;
  notableAchievements?: string[] | null;
  galleryImages?: { url: string; alternativeText?: string | null }[] | null;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("ro-RO", { month: "long", year: "numeric" });
}

interface LinkedMember {
  name: string;
  slug: string;
  skateResultsSlug: string;
  showPublicPage: boolean;
}

/**
 * Club achievements sourced from skate-results: every linked athlete's scraped
 * results, grouped into seasons and competitions. Replaces the retired manual
 * `competition` collection.
 */
async function buildSeasonsFromSkate(): Promise<Season[]> {
  const members = await fetchStrapi<LinkedMember[]>(
    "sportspeople",
    new URLSearchParams({
      "filters[skateResultsSlug][$notNull]": "true",
      "pagination[pageSize]": "200",
      "fields[0]": "name",
      "fields[1]": "slug",
      "fields[2]": "skateResultsSlug",
      "fields[3]": "showPublicPage",
    }).toString(),
  ).catch(() => [] as LinkedMember[]);

  const perMember = await Promise.all(
    (members ?? [])
      .filter((m) => m.skateResultsSlug)
      .map(async(m) => ({ m, results: await getSkaterResults(m.skateResultsSlug) })),
  );

  const seasons = new Map<string, Map<string, Season["competitions"][number]>>();
  for (const { m, results } of perMember) {
    for (const r of results) {
      const sKey = seasonKey(r.event_date, r.event_name ?? "");
      // No parsable year means no addressable season, so the entry is skipped.
      if (!sKey) continue;
      const cKey = r.event_slug || String(r.event_id ?? "") || (r.event_name ?? "");
      if (!seasons.has(sKey)) seasons.set(sKey, new Map());
      const comps = seasons.get(sKey)!;
      if (!comps.has(cKey)) {
        comps.set(cKey, {
          name: r.event_name ?? "Competiție",
          date: r.event_date ? formatDate(r.event_date) : "",
          location: r.event_location ?? "",
          level: levelOf(r.event_name ?? ""),
          results: [],
        });
      }
      comps.get(cKey)!.results.push({
        athlete: m.name,
        athleteSlug: m.showPublicPage ? m.slug : undefined,
        category: r.category ?? "",
        placement: typeof r.placement === "number" ? r.placement : null,
        score: typeof r.total_score === "number" ? r.total_score : null,
      });
    }
  }

  return [...seasons.entries()]
    .map(([id, comps]) => ({
      id,
      label: id.replace("-", " - "),
      competitions: [...comps.values()],
    }))
    .sort((a, b) => b.id.localeCompare(a.id));
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export const revalidate = 3600;

export default async function Page({ searchParams }: { searchParams: SearchParams }) {
  const [cms, seasons, params] = await Promise.all([
    fetchStrapi<RealizariPageCms>("realizari-page", "populate=galleryImages").catch(
      () => ({} as RealizariPageCms),
    ),
    buildSeasonsFromSkate(),
    searchParams,
  ]);

  const galleryImages: GalleryImage[] = (cms.galleryImages ?? []).map((img) => ({
    src: resolveAssetUrl(img.url),
    alt: img.alternativeText ?? "",
  }));

  // Only seasons that actually carry results are addressable.
  const withResults = seasons.filter((s) =>
    s.competitions.some((c) => c.results.length > 0),
  );
  const seasonIndex = buildSeasonIndex(withResults);

  // The requested season, or the most recent one that has results.
  const requested = readSeasonParam(params);
  const selectedSeason =
    withResults.find((s) => s.id === requested) ?? withResults[0] ?? null;

  return (
    <AccomplishmentsPage
      bannerTitle={cms.banner?.bannerTitle ?? undefined}
      bannerSubtitle={cms.banner?.bannerSubtitle ?? undefined}
      notableAchievements={cms.notableAchievements ?? []}
      galleryImages={galleryImages}
      seasonIndex={seasonIndex}
      season={selectedSeason}
    />
  );
}
