// ---------------------------------------------------------------------------
// Strapi Announcement types & fetch helper
// Used for site-wide popup/banner announcements
// ---------------------------------------------------------------------------

import { fetchStrapi } from "./strapi";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type AnnouncementType = "info" | "warning" | "success" | "error";

// Raw Strapi API response shape for the announcement singleton.
// fetchStrapi() returns json.data directly, so StrapiAnnouncement maps to
// the data object in the API response.
export interface StrapiAnnouncement {
  id: number;
  documentId: string;
  title?: string;
  isActive?: boolean;
  expiresAt?: string | null; // ISO datetime string
  announceContent?: {
    id?: number;
    message?: string;
    type?: AnnouncementType;
    ctaLabel?: string;
    ctaUrl?: string;
  } | null;
}

// Clean frontend type, ready for UI consumption
export interface Announcement {
  message: string;
  type: AnnouncementType;
  ctaLabel?: string;
  ctaUrl?: string;
}

// ---------------------------------------------------------------------------
// Fetch helper
// ---------------------------------------------------------------------------

/** Fetch the active announcement, or null if none is active/valid */
export async function fetchAnnouncement(): Promise<Announcement | null> {
  try {
    const data = await fetchStrapi<StrapiAnnouncement>(
      "announcement",
      "populate=*",
      60,
    );

    if (process.env.NODE_ENV === "development") {
      console.log("[announcement] raw data:", JSON.stringify(data, null, 2));
    }

    if (data?.isActive !== true) {
      if (process.env.NODE_ENV === "development") {
        console.log("[announcement] not shown — isActive:", data?.isActive);
      }
      return null;
    }

    if (data.expiresAt && new Date(data.expiresAt) < new Date()) {
      if (process.env.NODE_ENV === "development") {
        console.log("[announcement] not shown — expired:", data.expiresAt);
      }
      return null;
    }

    const message = data.announceContent?.message;
    if (!message) {
      if (process.env.NODE_ENV === "development") {
        console.log("[announcement] not shown — missing announceContent.message");
      }
      return null;
    }

    return {
      message,
      type: data.announceContent?.type ?? "info",
      ctaLabel: data.announceContent?.ctaLabel,
      ctaUrl: data.announceContent?.ctaUrl,
    };
  } catch (err) {
    console.error("[announcement] fetch error:", err);
    return null;
  }
}
