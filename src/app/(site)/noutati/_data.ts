// Shared types for Noutăți pages. All article data comes from the Strapi
// backend — there is no mocked content here.

export type CategoryKey =
  | "evenimente"
  | "anunturi"
  | "general"
  | "competitii"
  | "tips";

/**
 * Filter that shows events and competitions together. The "Evenimente și
 * competiții" menu item points here; it replaced the separate events page.
 */
export const EVENTS_FILTER = "evenimente-competitii";

/** Every value the list's `category` search param accepts. */
export type CategoryFilter = CategoryKey | "toate" | typeof EVENTS_FILTER;

export const EVENTS_FILTER_CATEGORIES: readonly CategoryKey[] = [
  "evenimente",
  "competitii",
];

/** The Noutăți list pre-filtered to events and competitions. */
export const NOUTATI_EVENTS_HREF = `/noutati?category=${EVENTS_FILTER}`;

const FILTER_KEYS: readonly string[] = [
  "toate",
  EVENTS_FILTER,
  "evenimente",
  "anunturi",
  "general",
  "competitii",
  "tips",
];

/** The search param as a known filter; anything unknown means "toate". */
export function parseCategoryFilter(value: string | undefined): CategoryFilter {
  return value && FILTER_KEYS.includes(value) ? (value as CategoryFilter) : "toate";
}

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
