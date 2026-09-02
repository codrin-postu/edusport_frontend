// ---------------------------------------------------------------------------
// Events data - replace with Strapi API calls when ready
// ---------------------------------------------------------------------------

export interface Event {
  slug: string;
  title: string;
  date: string; // ISO string
  location?: string;
  coverImage?: string;
  excerpt: string;
  body: string;
  tags?: string[];
  admissionInfo?: string;
}
