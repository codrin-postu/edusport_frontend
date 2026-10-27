import { STRAPI_BASE } from "./strapi-base";
import { parseClubSchedule, type SchoolSchedule } from "./club-schedule";

/** The backend caches this answer for 60 s (`Cache-Control: public, max-age=60`, spec 9.3). */
const REVALIDATE_SECONDS = 60;

/** GET /api/club/schedule; [] when the backend is unreachable or the body is unusable, so the page falls back. */
export async function fetchClubSchedule(): Promise<SchoolSchedule[]> {
  try {
    const res = await fetch(`${STRAPI_BASE}/api/club/schedule`, { next: { revalidate: REVALIDATE_SECONDS } });
    if (!res.ok) return [];
    const json = (await res.json().catch(() => null)) as { data?: unknown } | null;
    return parseClubSchedule(json?.data);
  } catch {
    return [];
  }
}
