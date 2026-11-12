// Host routing for the coach and student portal apps. Pure: no imports, loaded by Node tests.
export type Site = "site" | "antrenor" | "sportiv";

export type RouteAction =
  | { action: "next" }
  | { action: "rewrite"; pathname: string }
  | { action: "notFound" };

const NEXT: RouteAction = { action: "next" };
const NOT_FOUND: RouteAction = { action: "notFound" };

function hostName(host: string): string {
  return host.toLowerCase().replace(/:\d+$/, "");
}

export function siteForHost(host: string | null, hosts: { antrenor?: string; sportiv?: string }): Site {
  if (!host) return "site";
  const name = hostName(host);
  const dev = process.env.NODE_ENV !== "production";
  for (const site of ["antrenor", "sportiv"] as const) {
    const wanted = hosts[site] ? hostName(hosts[site]) : undefined;
    if ((dev && name === `${site}.localhost`) || (wanted && name === wanted)) return site;
  }
  return "site";
}

function underPrefix(pathname: string, prefix: string): boolean {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

function routeSite(pathname: string): RouteAction {
  if (underPrefix(pathname, "/antrenor") || underPrefix(pathname, "/sportiv") || underPrefix(pathname, "/api/portal")) return NOT_FOUND;
  return NEXT;
}

// Only real static assets pass through on a portal host: root-level images and fonts,
// and the public/ asset folders. Any other path (even with a dot) is a coach page or a 404.
const ROOT_ASSET = /^\/[^/]+\.(ico|png|svg|jpe?g|webp|avif|gif|woff2?)$/i;
const ASSET_PREFIXES = ["/icons", "/images", "/fonts"];

function isPublicFile(pathname: string): boolean {
  if (ROOT_ASSET.test(pathname)) return true;
  return ASSET_PREFIXES.some((p) => underPrefix(pathname, p)) && !pathname.split("/").includes("..");
}

function routePortal(site: "antrenor" | "sportiv", pathname: string, rawPathname: string): RouteAction {
  if (underPrefix(pathname, "/_next") || pathname === "/api/health") return NEXT;
  if (isPublicFile(pathname)) return NEXT;
  if (pathname === "/robots.txt") return { action: "rewrite", pathname: `/${site}/robots.txt` };
  if (pathname === "/sitemap.xml" || pathname === "/manifest.webmanifest") return NOT_FOUND;
  if (pathname.startsWith("/opengraph-image") || underPrefix(pathname, `/${site}`)) return NOT_FOUND;
  if (site === "sportiv" && underPrefix(pathname, "/antrenor")) return NOT_FOUND;
  // The rewrite keeps the raw path, so Next decodes it only once.
  return { action: "rewrite", pathname: rawPathname === "/" ? `/${site}` : `/${site}${rawPathname}` };
}

// An encoded slash, backslash or dot could turn into a traversal after Next decodes the path
// (/..%2Fnoutati reaches a main-site page on the coach origin). Such paths are 404 on every host.
const ENCODED_SEPARATOR = /%(2f|5c|2e)/i;

function hasTraversal(rawPathname: string, pathname: string): boolean {
  // The decoded form is checked as well, so a double-encoded %252F is caught too.
  if (ENCODED_SEPARATOR.test(rawPathname) || ENCODED_SEPARATOR.test(pathname)) return true;
  if (pathname.includes("\\")) return true;
  return pathname.split("/").some((s) => s === "." || s === "..");
}

function decoded(pathname: string): string {
  try {
    return decodeURIComponent(pathname);
  } catch {
    return pathname;
  }
}

export function routeRequest(site: Site, rawPathname: string): RouteAction {
  // Next matches routes on the decoded path, so the rules must too (/%61ntrenor is /antrenor).
  const pathname = decoded(rawPathname);
  if (hasTraversal(rawPathname, pathname)) return NOT_FOUND;
  if (site === "site") return routeSite(pathname);
  return routePortal(site, pathname, rawPathname);
}
