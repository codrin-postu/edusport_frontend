/**
 * Lightweight, always-available blur placeholder for next/image.
 *
 * Using a static SVG keeps things simple: no build-time fetching of remote
 * Strapi thumbnails, no runtime network calls, and it works for any
 * dynamic Strapi-hosted image URL out of the box.
 *
 * The SVG is a 1x1 grey rectangle (Tailwind gray-200) which next/image
 * scales up + blurs as the placeholder.
 */
export const SHIMMER_DATA_URL =
  "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3Crect width='1' height='1' fill='%23e5e7eb'/%3E%3C/svg%3E";

interface StrapiMediaLike {
  formats?: {
    thumbnail?: {
      url?: string;
    };
  };
}

/**
 * Returns a blurDataURL for next/image's `blurDataURL` prop.
 *
 * Currently always returns the shimmer fallback for predictability and to
 * avoid Next.js domain/loader configuration when sourcing remote thumbnails.
 * Signature accepts a Strapi media object so future enhancements can
 * upgrade to a real thumbnail without callsite changes.
 */
export function blurDataUrlFor(
  _media?: StrapiMediaLike | null,
  _baseUrl?: string,
): string {
  return SHIMMER_DATA_URL;
}
