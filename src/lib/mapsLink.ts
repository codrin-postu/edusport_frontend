/**
 * Where the site's address should link to.
 *
 * Two sources, in order. An explicit link set in the admin wins, for when the
 * address text is ambiguous or you want a specific pin. Otherwise the address
 * text itself becomes a Google Maps search, which means the link works with no
 * admin action at all and keeps working if the address is edited.
 *
 * A plain link rather than an embedded map on purpose: an iframe loads Google's
 * scripts and cookies on every page view, which would pull this into the cookie
 * consent flow for something a link already solves.
 */
export function mapsHref(
  addressDisplay?: string,
  addressMapsUrl?: string,
): string | undefined {
  // The explicit link is admin-supplied text that becomes an href on every page,
  // so the scheme is checked rather than trusted. Without this, pasting
  // `javascript:...` into the field would be stored XSS on the whole site. A
  // rejected value falls through to the generated search rather than producing
  // a broken link.
  const explicit = addressMapsUrl?.trim();
  if (explicit) {
    try {
      const parsed = new URL(explicit);
      if (parsed.protocol === "https:" || parsed.protocol === "http:") {
        return parsed.toString();
      }
    } catch {
      // Not a valid absolute URL. Fall through to the search below.
    }
  }

  const address = addressDisplay?.trim();
  if (!address) return undefined;

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}
