import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  fetchPublicSportspeople,
  fetchSportspersonBySlug,
  fetchCompetitionsByAthlete,
} from "@/lib/strapi-sportsperson";
import { strapiMediaUrl } from "@/lib/strapi-article";
import SportspersonView from "./_View";

export const revalidate = 300;
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const sportspeople = await fetchPublicSportspeople();
    return sportspeople.map((sp) => ({ slug: sp.slug }));
  } catch {
    return [];
  }
}

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

  return (
    <SportspersonView
      sportsperson={sp}
      competitions={competitions}
      compPage={compPageNum}
    />
  );
}
