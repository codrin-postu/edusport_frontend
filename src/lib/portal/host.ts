// Host routing for the coach app. Pure: no imports, loaded by Node tests.
export type Site = "site" | "antrenor" | "reserved";

export type RouteAction =
  | { action: "next" }
  | { action: "rewrite"; pathname: string }
  | { action: "notFound" };

const NEXT: RouteAction = { action: "next" };
const NOT_FOUND: RouteAction = { action: "notFound" };

export function siteForHost(host: string | null, antrenorHost: string | undefined): Site {
  if (!host) return "site";
  const name = host.toLowerCase().replace(/:\d+$/, "");
  const wanted = antrenorHost?.toLowerCase().replace(/:\d+$/, "");
  if (name === "antrenor.localhost" || (wanted && name === wanted)) return "antrenor";
  if (name.split(".")[0] === "sportiv") return "reserved";
  return "site";
}

function underPrefix(pathname: string, prefix: string): boolean {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

function routeSite(pathname: string): RouteAction {
  if (underPrefix(pathname, "/antrenor") || underPrefix(pathname, "/api/portal")) return NOT_FOUND;
  return NEXT;
}

const PUBLIC_EXTENSIONS = new Set(["txt", "xml", "webmanifest"]);

function isPublicFile(pathname: string): boolean {
  const last = pathname.split("/").pop() ?? "";
  const dot = last.lastIndexOf(".");
  if (dot <= 0) return false;
  return !PUBLIC_EXTENSIONS.has(last.slice(dot + 1).toLowerCase());
}

function routeAntrenor(pathname: string): RouteAction {
  if (underPrefix(pathname, "/_next") || pathname === "/api/health") return NEXT;
  if (isPublicFile(pathname)) return NEXT;
  if (pathname === "/robots.txt") return { action: "rewrite", pathname: "/antrenor/robots.txt" };
  if (pathname === "/sitemap.xml" || pathname === "/manifest.webmanifest") return NOT_FOUND;
  if (pathname.startsWith("/opengraph-image") || underPrefix(pathname, "/antrenor")) return NOT_FOUND;
  return { action: "rewrite", pathname: pathname === "/" ? "/antrenor" : `/antrenor${pathname}` };
}

export function routeRequest(site: Site, pathname: string): RouteAction {
  if (site === "site") return routeSite(pathname);
  if (site === "reserved") return pathname === "/api/health" ? NEXT : NOT_FOUND;
  return routeAntrenor(pathname);
}
