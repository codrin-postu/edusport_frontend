// Lightweight analytics wrapper around Umami. SSR-safe and a no-op when Umami
// is not loaded (env not set / dev), so callers never need to guard.
//
// Umami auto-tracks pageviews (incl. SPA route changes); use `track()` only for
// custom events (button clicks, funnel steps). Event names follow a
// `section.action` convention, e.g. "enroll.cta_primary", "contact.submit".

type UmamiEventData = Record<string, string | number | boolean>;

interface UmamiGlobal {
  track?: (event: string, data?: UmamiEventData) => void;
}

export function track(event: string, data?: UmamiEventData): void {
  if (typeof window === "undefined") return;
  const umami = (window as unknown as { umami?: UmamiGlobal }).umami;
  if (!umami || typeof umami.track !== "function") return;
  try {
    if (data) umami.track(event, data);
    else umami.track(event);
  } catch {
    // Never let analytics break the UI.
  }
}
