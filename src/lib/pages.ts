// ---------------------------------------------------------------------------
// Switchable pages: the single source of the page key <-> address map.
//
// The CMS single type "Meniu site" stores `pages: [{ key, enabled }]`. A page
// that is switched off returns the normal 404, and the nav bar, the footer and
// the sitemap stop linking to it. Links inside other pages are left alone.
//
// Everything that decides "is this address switched off?" goes through
// pageKeyForPath(), so the menu, the footer and the sitemap never keep a
// second list of addresses.
//
// Kept free of imports on purpose: it is pure, and the node test in
// scripts/pages/pages.test.mjs loads it directly.
// ---------------------------------------------------------------------------

export const PAGE_KEYS = [
  "istoric",
  "echipa",
  "sportivi",
  "realizari",
  "voluntariat",
  "scoala",
  "program",
  "regulament",
  "noutati",
  "parteneri",
  "inscrieri",
] as const;

export type PageKey = (typeof PAGE_KEYS)[number];

interface PageRoute {
  key: PageKey;
  /** The page's own address. */
  path: string;
  /** Also owns every address under `path` (detail pages, sub-forms). */
  subpaths: boolean;
}

/**
 * Every switchable page. Acasă (/), /contact and /protectia-datelor are not
 * here: they are always on, and any address that matches nothing is on.
 */
export const PAGE_ROUTES: readonly PageRoute[] = [
  { key: "istoric", path: "/despre-noi", subpaths: false },
  { key: "echipa", path: "/despre-noi/echipa", subpaths: false },
  { key: "sportivi", path: "/despre-noi/sportivi", subpaths: true },
  { key: "realizari", path: "/despre-noi/realizari", subpaths: false },
  { key: "voluntariat", path: "/voluntariat", subpaths: true },
  { key: "scoala", path: "/cursuri", subpaths: false },
  { key: "program", path: "/cursuri/program", subpaths: false },
  { key: "regulament", path: "/cursuri/regulament", subpaths: false },
  { key: "noutati", path: "/noutati", subpaths: true },
  { key: "parteneri", path: "/parteneri", subpaths: false },
  { key: "inscrieri", path: "/inscrieri", subpaths: false },
];

const KEY_SET: ReadonlySet<string> = new Set(PAGE_KEYS);

export function isPageKey(value: unknown): value is PageKey {
  return typeof value === "string" && KEY_SET.has(value);
}

/** Path part of an internal href: no query, no hash, no trailing slash. */
function normalizePath(href: string): string | null {
  if (typeof href !== "string" || !href.startsWith("/") || href.startsWith("//")) {
    return null;
  }
  const path = href.split(/[?#]/, 1)[0];
  return path.length > 1 ? path.replace(/\/+$/, "") || "/" : path;
}

/**
 * The page key that owns an address, or null when the address is always on
 * (home, contact, legal pages, external links, anything unknown).
 *
 * Accepts hrefs as the menu writes them, query and hash included:
 * "/noutati?category=evenimente" belongs to `noutati`. The most specific
 * route wins, so "/despre-noi/echipa" is `echipa`, not `istoric`.
 */
export function pageKeyForPath(href: string): PageKey | null {
  const path = normalizePath(href);
  if (!path) return null;

  let best: PageRoute | null = null;
  for (const route of PAGE_ROUTES) {
    const matches =
      path === route.path || (route.subpaths && path.startsWith(`${route.path}/`));
    if (matches && (!best || route.path.length > best.path.length)) best = route;
  }
  return best ? best.key : null;
}

/** True unless the href belongs to a page that is switched off. */
export function isHrefEnabled(href: string, disabled: ReadonlySet<PageKey>): boolean {
  if (disabled.size === 0) return true;
  const key = pageKeyForPath(href);
  return key === null || !disabled.has(key);
}

/**
 * Parse the CMS `pages` list into the set of switched-off keys.
 *
 * Only an entry with a known key and `enabled === false` switches a page off.
 * A missing list, a malformed entry, an unknown key or a non-boolean flag all
 * leave the page on: hiding on bad data would take pages down by accident.
 */
export function parseDisabledPages(pages: unknown): Set<PageKey> {
  const disabled = new Set<PageKey>();
  if (!Array.isArray(pages)) return disabled;
  for (const entry of pages) {
    if (!entry || typeof entry !== "object") continue;
    const { key, enabled } = entry as { key?: unknown; enabled?: unknown };
    const trimmed = typeof key === "string" ? key.trim() : key;
    if (isPageKey(trimmed) && enabled === false) disabled.add(trimmed);
  }
  return disabled;
}

/** The parts of a menu item this filter reads. */
interface FilterableNavItem {
  href?: string;
  dropdown?: Array<{ href: string }>;
}

/**
 * The menu without links to switched-off pages. Never mutates the input.
 *
 * - A plain link to a switched-off page is dropped.
 * - A dropdown loses its switched-off children; a dropdown left with none
 *   disappears, and its promo card goes with it. A dropdown that keeps at
 *   least one child keeps its promo card.
 */
export function filterNavItems<T extends FilterableNavItem>(
  items: T[],
  disabled: ReadonlySet<PageKey>,
): T[] {
  if (disabled.size === 0) return items;
  return items.flatMap((item) => {
    if (item.dropdown) {
      const dropdown = item.dropdown.filter((child) => isHrefEnabled(child.href, disabled));
      if (dropdown.length === 0) return [];
      if (dropdown.length === item.dropdown.length) return [item];
      return [{ ...item, dropdown }];
    }
    if (item.href && !isHrefEnabled(item.href, disabled)) return [];
    return [item];
  });
}
