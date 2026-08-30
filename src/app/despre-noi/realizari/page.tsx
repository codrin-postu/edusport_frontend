import type { Metadata } from "next";
import { fetchStrapi } from "@/lib/strapi";
import { resolveAssetUrl } from "@/utils/markdown";
import { getSkaterResults } from "@/lib/skate-results";
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

/** Figure-skating season (Sep–Aug) key from a date/name, e.g. "2025/2026". */
function seasonKey(dateISO: string | null | undefined, name: string): string {
  const y = dateISO?.slice(0, 4) || name.match(/20\d{2}/)?.[0];
  if (!y) return "—";
  const year = Number(y);
  const month = dateISO ? Number(dateISO.slice(5, 7)) : 1;
  const start = month >= 9 ? year : year - 1;
  return `${start}/${start + 1}`;
}

function levelOf(name: string): "national" | "international" {
  return /\bISU\b|international|challenger|grand prix|championship/i.test(name)
    ? "international"
    : "national";
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
    .map(([id, comps]) => ({ id, label: `Sezon ${id}`, competitions: [...comps.values()] }))
    .sort((a, b) => b.id.localeCompare(a.id));
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export const revalidate = 3600;

export default async function Page() {
  const [cms, seasons] = await Promise.all([
    fetchStrapi<RealizariPageCms>("realizari-page", "populate=galleryImages").catch(
      () => ({} as RealizariPageCms),
    ),
    buildSeasonsFromSkate(),
  ]);

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
