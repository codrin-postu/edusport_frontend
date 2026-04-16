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
  coverImage?: {
    url: string;
    alternativeText?: string;
    width?: number;
    height?: number;
  };
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
  });

  const data = await fetchStrapi<StrapiArticle[]>("articles", params.toString(), 300);
  return data?.[0] ?? null;
}

/** Resolve a Strapi media URL to an absolute URL */
export function strapiMediaUrl(url: string): string {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  const base = process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337";
  return `${base}${url}`;
}
