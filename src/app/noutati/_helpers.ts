import { strapiMediaUrl } from "@/lib/strapi-article";
import type { StrapiArticle } from "@/lib/strapi-article";
import type { ArticleCardData, CategoryKey } from "./_data";

export interface CategoryOption {
  key: CategoryKey | "toate";
  label: string;
}

export const CATEGORIES: CategoryOption[] = [
  { key: "toate", label: "Toate" },
  { key: "evenimente", label: "Evenimente" },
  { key: "anunturi", label: "Anunțuri" },
  { key: "general", label: "General" },
  { key: "competitii", label: "Competiții" },
  { key: "tips", label: "Tips" },
];

export const PAGE_SIZE = 6;

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ro-RO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function buildUrl(params: {
  page: number;
  category: string;
  search: string;
}) {
  const q = new URLSearchParams();
  if (params.page > 1) q.set("page", String(params.page));
  if (params.category && params.category !== "toate")
    q.set("category", params.category);
  if (params.search) q.set("search", params.search);
  const qs = q.toString();
  return `/noutati${qs ? `?${qs}` : ""}`;
}

export function mapStrapiArticle(a: StrapiArticle): ArticleCardData {
  return {
    slug: a.slug,
    title: a.title,
    description: a.description ?? "",
    date: a.date,
    category: a.category,
    coverImage: a.coverImage
      ? strapiMediaUrl(a.coverImage.url)
      : "/images/courses_generated.png",
  };
}
