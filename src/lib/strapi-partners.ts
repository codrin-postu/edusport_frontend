import { fetchStrapi } from "./strapi";
import { strapiMediaUrl } from "./strapi-article";

// Partners page data: sponsor logos + past collaboration events.
// Shapes mirror the frontend `_data.ts` fallbacks so pages can swap between
// CMS and static without changing components.

export interface Sponsor {
  name: string;
  logo?: string;
  href?: string;
}

export interface CollabEvent {
  title: string;
  partner: string;
  date: string;
  description: string;
  image?: string;
}

interface StrapiMedia {
  url?: string;
  alternativeText?: string | null;
}

interface RawSponsor {
  name?: string;
  logo?: StrapiMedia | null;
  href?: string | null;
}

interface RawCollabEvent {
  title?: string;
  partner?: string | null;
  date?: string | null;
  description?: string | null;
  image?: StrapiMedia | null;
}

/** Public sponsors, ordered. Returns [] on any Strapi failure (caller falls back). */
export async function fetchSponsors(): Promise<Sponsor[]> {
  const data = await fetchStrapi<RawSponsor[]>(
    "sponsors",
    "populate=logo&sort=order:asc&pagination[pageSize]=100",
  );
  return (data ?? []).map((s) => ({
    name: s.name ?? "",
    logo: s.logo?.url ? strapiMediaUrl(s.logo.url) : undefined,
    href: s.href ?? undefined,
  }));
}

/** Past collaboration events, ordered. Returns [] on any Strapi failure. */
export async function fetchCollaborationEvents(): Promise<CollabEvent[]> {
  const data = await fetchStrapi<RawCollabEvent[]>(
    "collaboration-events",
    "populate=image&sort=order:asc&pagination[pageSize]=100",
  );
  return (data ?? []).map((e) => ({
    title: e.title ?? "",
    partner: e.partner ?? "",
    date: e.date ?? "",
    description: e.description ?? "",
    image: e.image?.url ? strapiMediaUrl(e.image.url) : undefined,
  }));
}
