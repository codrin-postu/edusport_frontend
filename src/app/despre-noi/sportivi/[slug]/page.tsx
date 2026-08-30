import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  fetchSportspersonBySlug,
  fetchCompetitionsByAthlete,
} from "@/lib/strapi-sportsperson";
import { getSkaterResults } from "@/lib/skate-results";
import { strapiMediaUrl } from "@/lib/strapi-article";
import SportspersonView from "./_View";

// The page reads `searchParams.compPage` for the istoric pagination, so
// it cannot be statically pre-rendered. `force-dynamic` keeps the page
// server-rendered on every request; React `cache()` inside the fetch
// helpers still dedupes calls within a single render.
export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ compPage?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  let title = "Sportiv";
  let description = "";
  let image: string | undefined;

  try {
    const sp = await fetchSportspersonBySlug(slug);
    // Don't leak metadata for private profiles.
    if (sp && sp.showPublicPage) {
      title = sp.name;
      description = sp.description ?? "";
      image = sp.photo ? strapiMediaUrl(sp.photo.url) : undefined;
    }
  } catch {
    // Strapi unavailable — keep generic.
  }

  return {
    title,
    description,
    alternates: { canonical: `/despre-noi/sportivi/${slug}` },
    openGraph: {
      title,
      description,
      type: "profile",
      ...(image && { images: [{ url: image }] }),
    },
  };
}

export default async function Page({ params, searchParams }: Props) {
  const { slug } = await params;
  const { compPage } = await searchParams;
  const compPageNum = Math.max(1, Number(compPage) || 1);

  let sp = null;
  try {
    sp = await fetchSportspersonBySlug(slug);
  } catch {
    notFound();
  }

  // Critical guard: even if the slug resolves, refuse to render when the
  // editor has unticked the public toggle. This is what makes showPublicPage
  // an access-control flag, not just a listing filter.
  if (!sp || !sp.showPublicPage) notFound();

  let competitions = [] as Awaited<ReturnType<typeof fetchCompetitionsByAthlete>>;
  try {
    competitions = await fetchCompetitionsByAthlete(sp.documentId);
  } catch {
    // Stats default to "no competitions" rather than 500.
  }

  // When the athlete is linked to skate-results, pull their scraped history.
  // getSkaterResults already degrades to [] on any failure.
  const skateResults = sp.skateResultsSlug
    ? await getSkaterResults(sp.skateResultsSlug)
    : [];

  return (
    <SportspersonView
      sportsperson={sp}
      competitions={competitions}
      compPage={compPageNum}
      skateResults={skateResults}
    />
  );
}
