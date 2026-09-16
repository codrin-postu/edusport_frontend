// ---------------------------------------------------------------------------
// Announcement types & fetch helper
//
// The backend exposes a single purpose-built endpoint, `/api/announcements/
// current`, which already applies every selection rule: active flag, schedule
// window and priority order. It returns at most one announcement. The client
// must NOT re-filter — if the server said "show this", we show it.
// ---------------------------------------------------------------------------

import { STRAPI_BASE } from "./strapi-base";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Visual treatment chosen per-announcement in the admin. */
export type AnnouncementFormat = "card" | "modal";

export interface Announcement {
  /** Stable identifier, used as the analytics id and the dismissal key. */
  slug: string;
  /** Small uppercase kicker above the title. Optional. */
  eyebrow?: string;
  title: string;
  /** Markdown body. */
  message: string;
  format: AnnouncementFormat;
  ctaLabel?: string;
  ctaUrl?: string;
  /**
   * How many days a dismissal lasts before the announcement may reappear.
   * `0` means "never show again once closed".
   */
  dismissDays: number;
}

/** Raw envelope returned by `/api/announcements/current`. */
interface AnnouncementResponse {
  data: Partial<Announcement> | null;
}

// ---------------------------------------------------------------------------
// Fetch helper
// ---------------------------------------------------------------------------

const REVALIDATE_SECONDS = 60;

function optionalString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() !== "" ? value : undefined;
}

/**
 * Fetch the announcement the server wants shown right now, or `null`.
 *
 * Every failure mode — endpoint missing, network error, malformed payload —
 * resolves to `null` so a broken or not-yet-deployed backend can never take
 * the site down.
 */
export async function fetchAnnouncement(): Promise<Announcement | null> {
  try {
    const res = await fetch(`${STRAPI_BASE}/api/announcements/current`, {
      headers: process.env.STRAPI_API_TOKEN
        ? { Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}` }
        : {},
      next: { revalidate: REVALIDATE_SECONDS },
    });

    if (!res.ok) return null;

    const json = (await res.json()) as AnnouncementResponse | null;
    const data = json?.data;
    if (!data) return null;

    // Only the fields the UI cannot render without are required here; the
    // server owns the decision of whether to show anything at all.
    const slug = optionalString(data.slug);
    const title = optionalString(data.title);
    const message = optionalString(data.message);
    if (!slug || !title || !message) return null;

    const dismissDays =
      typeof data.dismissDays === "number" && Number.isFinite(data.dismissDays)
        ? Math.max(0, Math.trunc(data.dismissDays))
        : 0;

    return {
      slug,
      title,
      message,
      eyebrow: optionalString(data.eyebrow),
      format: data.format === "modal" ? "modal" : "card",
      ctaLabel: optionalString(data.ctaLabel),
      ctaUrl: optionalString(data.ctaUrl),
      dismissDays,
    };
  } catch {
    // Silent by design: an announcement is decoration, never a hard dependency.
    return null;
  }
}
