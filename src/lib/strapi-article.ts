// ---------------------------------------------------------------------------
// Strapi Article types & fetch helpers
// Used by both /noutati and /cursuri/evenimente
// ---------------------------------------------------------------------------

import { fetchStrapi, fetchStrapiPaginated } from "./strapi";

// Strapi Blocks rich text node types
export type BlockNode =
  | ParagraphNode
  | HeadingNode
  | ListNode
  | ListItemNode
  | QuoteNode
  | CodeNode
  | ImageNode
  | LinkNode
  | TextNode;

export interface TextNode {
  type: "text";
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
}

export interface ParagraphNode {
  type: "paragraph";
  children: BlockNode[];
}

export interface HeadingNode {
  type: "heading";
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: BlockNode[];
}

export interface ListNode {
  type: "list";
  format: "ordered" | "unordered";
  children: ListItemNode[];
}

export interface ListItemNode {
  type: "list-item";
  children: BlockNode[];
}

export interface QuoteNode {
  type: "quote";
  children: BlockNode[];
}

export interface CodeNode {
  type: "code";
  children: TextNode[];
}

export interface ImageNode {
  type: "image";
  image: {
    url: string;
    alternativeText?: string;
    width?: number;
    height?: number;
    caption?: string;
  };
  children: TextNode[];
}

export interface LinkNode {
  type: "link";
  url: string;
  children: TextNode[];
}

export type CategoryKey = "evenimente" | "anunturi" | "general" | "competitii" | "tips";

export const CATEGORY_LABELS: Record<CategoryKey, string> = {
  evenimente: "Evenimente",
  anunturi: "Anunțuri",
  general: "General",
  competitii: "Competiții",
  tips: "Tips",
};

/**
 * Shape stored by the admin's custom Video field (plugin::component-preview.video-embed).
 *  - mode='url': external YouTube/Vimeo URL — rendered as an iframe.
 *  - mode='upload': absolute URL to a Strapi-hosted video file — rendered as <video>.
 */
export interface StrapiVideoField {
  mode: "url" | "upload";
  url: string;
  mime?: string;
}

export interface StrapiMediaImage {
  id?: number;
  url: string;
  alternativeText?: string;
  width?: number;
  height?: number;
  caption?: string;
}

// Raw Strapi API response shape for an article
// Note: fetchStrapi() returns json.data directly.
// For collections json.data is an array, so fetchStrapi<StrapiArticle[]> gives us the array.
export interface StrapiArticle {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  description?: string;
  body?: BlockNode[];
  category: CategoryKey;
  date: string; // "YYYY-MM-DD"
  eventDate?: string; // ISO datetime, only for category=evenimente
  eventLocation?: string;
  eventAdmissionInfo?: string;
  coverImage?: StrapiMediaImage;
  gallery?: StrapiMediaImage[];
  video?: StrapiVideoField | null;
}

// ---------------------------------------------------------------------------
// Fetch helpers
// ---------------------------------------------------------------------------

/** Fetch all articles (optionally filtered by category), newest first */
export async function fetchArticles(category?: CategoryKey): Promise<StrapiArticle[]> {
  const params = new URLSearchParams({
    "populate[coverImage][fields][0]": "url",
    "populate[coverImage][fields][1]": "alternativeText",
    "populate[coverImage][fields][2]": "width",
    "populate[coverImage][fields][3]": "height",
    "populate[gallery][fields][0]": "url",
    "populate[gallery][fields][1]": "alternativeText",
    "populate[gallery][fields][2]": "width",
    "populate[gallery][fields][3]": "height",
    "populate[gallery][fields][4]": "caption",
    "sort[0]": "date:desc",
    "pagination[pageSize]": "100",
  });
  if (category) {
    params.set("filters[category][$eq]", category);
  }

  // fetchStrapi returns json.data; for a collection that's the array directly
  const data = await fetchStrapi<StrapiArticle[]>("articles", params.toString(), 300);
  return data ?? [];
}

/**
 * The next upcoming event, or null when nothing is scheduled.
 *
 * Events are articles: `category` is "evenimente" (or "competitii", which the
 * events page has always counted as events too) plus the `eventDate`,
 * `eventLocation` and `eventAdmissionInfo` fields. `eventDate` wins over `date`
 * because `date` is the publish date of the write-up, not when it happens.
 *
 * Shared by the homepage hero and /cursuri/evenimente so the two can never
 * disagree about which event is next.
 */
export interface NextEvent {
  slug: string;
  title: string;
  date: string;
  location?: string;
  admissionInfo?: string;
  coverImageUrl?: string;
}

export async function fetchNextEvent(): Promise<NextEvent | null> {
  const [evenimente, competitii] = await Promise.all([
    fetchArticles("evenimente"),
    fetchArticles("competitii"),
  ]);

  const now = Date.now();
  const upcoming = [...evenimente, ...competitii]
    .map((a) => ({
      slug: a.slug,
      title: a.title,
      date: a.eventDate ?? a.date,
      location: a.eventLocation ?? undefined,
      admissionInfo: a.eventAdmissionInfo ?? undefined,
      coverImageUrl: a.coverImage ? strapiMediaUrl(a.coverImage.url) : undefined,
    }))
    .filter((e) => e.date && new Date(e.date).getTime() >= now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return upcoming[0] ?? null;
}

/** Fetch a paginated, optionally filtered page of articles */
export async function fetchArticlesPaginated(opts: {
  page?: number;
  pageSize?: number;
  category?: CategoryKey | "toate";
  search?: string;
}): Promise<{ articles: StrapiArticle[]; total: number; pageCount: number }> {
  const { page = 1, pageSize = 6, category, search } = opts;

  const params = new URLSearchParams({
    "populate[coverImage][fields][0]": "url",
    "populate[coverImage][fields][1]": "alternativeText",
    "populate[coverImage][fields][2]": "width",
    "populate[coverImage][fields][3]": "height",
    "populate[gallery][fields][0]": "url",
    "populate[gallery][fields][1]": "alternativeText",
    "populate[gallery][fields][2]": "width",
    "populate[gallery][fields][3]": "height",
    "populate[gallery][fields][4]": "caption",
    "sort[0]": "date:desc",
    "pagination[page]": String(page),
    "pagination[pageSize]": String(pageSize),
  });

  if (category && category !== "toate") {
    params.set("filters[category][$eq]", category);
  }
  if (search && search.trim()) {
    params.set("filters[title][$containsi]", search.trim());
  }

  const result = await fetchStrapiPaginated<StrapiArticle[]>("articles", params.toString(), 300);
  return {
    articles: result.data ?? [],
    total: result.meta?.pagination?.total ?? 0,
    pageCount: result.meta?.pagination?.pageCount ?? 1,
  };
}

/** Fetch a single article by slug */
export async function fetchArticleBySlug(slug: string): Promise<StrapiArticle | null> {
  const params = new URLSearchParams({
    "filters[slug][$eq]": slug,
    "populate[coverImage][fields][0]": "url",
    "populate[coverImage][fields][1]": "alternativeText",
    "populate[coverImage][fields][2]": "width",
    "populate[coverImage][fields][3]": "height",
    "populate[gallery][fields][0]": "url",
    "populate[gallery][fields][1]": "alternativeText",
    "populate[gallery][fields][2]": "width",
    "populate[gallery][fields][3]": "height",
    "populate[gallery][fields][4]": "caption",
  });

  const data = await fetchStrapi<StrapiArticle[]>("articles", params.toString(), 300);
  return data?.[0] ?? null;
}

/**
 * Fetch a single article by Strapi documentId, with optional draft status.
 * Used by the admin Preview flow to render unpublished versions. Drafts
 * require the STRAPI_API_TOKEN to have read access to draft entries.
 *
 * Bypasses Next.js's data cache (revalidate=0) so each preview load shows
 * the latest unpublished edits.
 */
export async function fetchArticleByDocumentId(
  documentId: string,
  status: "draft" | "published" = "draft",
): Promise<StrapiArticle | null> {
  const params = new URLSearchParams({
    "filters[documentId][$eq]": documentId,
    status,
    "populate[coverImage][fields][0]": "url",
    "populate[coverImage][fields][1]": "alternativeText",
    "populate[coverImage][fields][2]": "width",
    "populate[coverImage][fields][3]": "height",
    "populate[gallery][fields][0]": "url",
    "populate[gallery][fields][1]": "alternativeText",
    "populate[gallery][fields][2]": "width",
    "populate[gallery][fields][3]": "height",
    "populate[gallery][fields][4]": "caption",
  });

  const data = await fetchStrapi<StrapiArticle[]>("articles", params.toString(), false);
  return data?.[0] ?? null;
}

/**
 * Convert a YouTube/Vimeo URL to its embed form. Returns null when the URL
 * isn't recognised — caller should fall back to a plain anchor.
 *
 * Kept here (not in StrapiBlocks) so the article-level Video field can reuse
 * the same provider detection without depending on the Blocks renderer.
 */
export function resolveVideoEmbed(url: string): { provider: "youtube" | "vimeo"; embedUrl: string } | null {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }
  const host = parsed.hostname.toLowerCase();

  if (host === "youtu.be") {
    const id = parsed.pathname.replace(/^\//, "").split("/")[0];
    if (id) return { provider: "youtube", embedUrl: `https://www.youtube.com/embed/${id}` };
  }
  if (host.endsWith("youtube.com") || host.endsWith("youtube-nocookie.com")) {
    const v = parsed.searchParams.get("v");
    if (v) return { provider: "youtube", embedUrl: `https://www.youtube.com/embed/${v}` };
    const m = parsed.pathname.match(/^\/(embed|shorts)\/([\w-]+)/);
    if (m) return { provider: "youtube", embedUrl: `https://www.youtube.com/embed/${m[2]}` };
  }
  if (host === "vimeo.com" || host === "www.vimeo.com") {
    const id = parsed.pathname.replace(/^\//, "").split("/")[0];
    if (/^\d+$/.test(id)) return { provider: "vimeo", embedUrl: `https://player.vimeo.com/video/${id}` };
  }
  if (host === "player.vimeo.com") {
    return { provider: "vimeo", embedUrl: url };
  }
  return null;
}

/** Resolve a Strapi media URL to an absolute URL */
export function strapiMediaUrl(url: string): string {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  // Public url on purpose: the result becomes an <img src> the browser loads,
  // so an internal container address would not resolve.
  const base = process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337";
  return `${base}${url}`;
}
