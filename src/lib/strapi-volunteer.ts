import { fetchStrapi } from "./strapi";
import { strapiMediaUrl } from "./strapi-article";

// Volunteer page (single type): hero + intro copy, ways-to-help, photo gallery.

export interface VolunteerContent {
  heroTitle?: string;
  heroSubtitle?: string;
  introEyebrow?: string;
  introHeading?: string;
  introBody?: string;
}

export interface VolunteerHelpWay {
  title: string;
  desc: string;
}

export interface VolunteerPageData {
  content: VolunteerContent | null;
  helpWays: VolunteerHelpWay[];
  photos: { src: string; alt: string }[];
}

interface StrapiMedia {
  url?: string;
  alternativeText?: string | null;
}

interface RawVolunteerPage {
  content?: VolunteerContent | null;
  helpWays?: VolunteerHelpWay[] | null;
  gallery?: StrapiMedia[] | null;
}

/** Volunteer page content, or null on any Strapi failure (caller falls back). */
export async function fetchVolunteerPage(): Promise<VolunteerPageData | null> {
  const data = await fetchStrapi<RawVolunteerPage | null>(
    "volunteer-page",
    "populate=gallery",
  );
  if (!data) return null;
  return {
    content:
      data.content && typeof data.content === "object" ? data.content : null,
    helpWays: Array.isArray(data.helpWays) ? data.helpWays : [],
    photos: Array.isArray(data.gallery)
      ? data.gallery
          .filter((g) => g?.url)
          .map((g) => ({
            src: strapiMediaUrl(g.url as string),
            alt: g.alternativeText ?? "",
          }))
      : [],
  };
}
