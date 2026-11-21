import { NextResponse, type NextRequest } from "next/server";
import { routeRequest, siteForHost } from "@/lib/portal/host";
import { GHID_COOKIE, ghidGate, isGhidRequest } from "@/lib/ghid/gate";

export const config = { runtime: "nodejs", matcher: ["/((?!_next/static|_next/image).*)"] };

function withPortalHeaders(res: NextResponse): NextResponse {
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  res.headers.set("Referrer-Policy", "no-referrer");
  return res;
}

export function middleware(req: NextRequest): NextResponse {
  const site = siteForHost(req.headers.get("host"), {
    antrenor: process.env.PORTAL_HOST_ANTRENOR,
    sportiv: process.env.PORTAL_HOST_SPORTIV,
  });
  const route = routeRequest(site, req.nextUrl.pathname);
  const portal = site !== "site";
  let res: NextResponse;
  const ghid = site === "site" && route.action === "next" && isGhidRequest(req.nextUrl.pathname);
  const gate = ghid
    ? ghidGate(req.nextUrl.pathname, req.cookies.get(GHID_COOKIE)?.value, process.env.GHID_PASSWORD, req.nextUrl.search)
    : null;
  if (gate && gate.action === "redirect") {
    res = NextResponse.redirect(new URL(gate.to, req.url), 307);
  } else if (route.action === "notFound") {
    res = new NextResponse(null, { status: 404 });
  } else if (route.action === "rewrite") {
    const url = req.nextUrl.clone();
    url.pathname = route.pathname;
    res = NextResponse.rewrite(url);
  } else {
    res = NextResponse.next();
  }
  if (ghid) res.headers.set("X-Robots-Tag", "noindex, nofollow");
  return portal ? withPortalHeaders(res) : res;
}
