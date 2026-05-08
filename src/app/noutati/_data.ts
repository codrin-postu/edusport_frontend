// Shared types for Noutăți pages. All article data comes from the Strapi
// backend — there is no mocked content here.

export type CategoryKey =
  | "evenimente"
  | "anunturi"
  | "general"
  | "competitii"
  | "tips";

export interface ArticleCardData {
  slug: string;
  title: string;
  description: string;
  date: string; // ISO string
  category: CategoryKey;
  coverImage: string;
}

export const CATEGORY_LABELS: Record<CategoryKey, string> = {
  evenimente: "Evenimente",
  anunturi: "Anunțuri",
  general: "General",
  competitii: "Competiții",
  tips: "Tips",
};
