import { type CategoryKey } from "@/app/noutati/_data";

// The section component that lived here was replaced by the landing page's
// EventsNewsSection. Only the article shape stays, shared by the home page
// data loader and that section.
export interface LatestArticleData {
  title: string;
  excerpt: string;
  date: string;
  image: string;
  slug: string;
  category?: CategoryKey;
}
