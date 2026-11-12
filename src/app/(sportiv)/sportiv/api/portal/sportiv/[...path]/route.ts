// The sportiv proxy: only the routes of sportiv-routes.ts, only from the sportiv host, with the
// refresh handled in sportivCall. Strapi set-cookie headers are never forwarded. The two file routes
// (calendar.ics, the signed agreement) stream through with their type, name and cache headers.
import { NextResponse, type NextRequest } from "next/server";
import { bffContext, refusal, respond, secretReady, sportivCall } from "@/lib/portal/bff";
import { readLimitedText } from "@/lib/portal/body-limit";
import { STATES } from "@/lib/portal/copy";
import { clearSessionCookies, type CookieSpec } from "@/lib/portal/cookies";
import { originAllowed } from "@/lib/portal/origin";
import { allowedSportivRoute, sportivQuery } from "@/lib/portal/sportiv-routes";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NOT_FOUND = "Nu a fost găsit.";
const FILE_HEADERS = ["Content-Type", "Content-Disposition", "Cache-Control"];

type Ctx = { params: Promise<{ path: string[] }> };

function fileResponse(file: Response, cookies: CookieSpec[]): NextResponse {
  const res = new NextResponse(file.body, { status: 200 });
  for (const name of FILE_HEADERS) {
    const value = file.headers.get(name);
    if (value) res.headers.set(name, value);
  }
  for (const c of cookies) {
    res.cookies.set({ name: c.name, value: c.value, maxAge: c.maxAge, httpOnly: c.httpOnly, secure: c.secure, sameSite: c.sameSite, path: c.path });
  }
  return res;
}

async function handle(req: NextRequest, { params }: Ctx): Promise<NextResponse> {
  const { path: segments } = await params;
  const path = `/${segments.join("/")}`;
  if (!allowedSportivRoute(req.method, path)) return respond(404, refusal(404, NOT_FOUND), []);
  const ctx = bffContext(req, "sportiv");
  if (!originAllowed(req.method, req.headers.get("origin"), ctx.host, ctx.secure)) return respond(403, refusal(403, STATES.invalid), []);
  if (!secretReady()) return respond(503, refusal(503, STATES.loadFailed), []);
  let body: unknown;
  if (req.method !== "GET") {
    const read = await readLimitedText(req);
    if (!read.ok) return respond(413, refusal(413, STATES.invalid), []);
    if (read.text) {
      try {
        body = JSON.parse(read.text);
      } catch {
        return respond(400, refusal(400, STATES.invalid), []);
      }
    }
  }
  // Only GET reads query names; no write forwards one.
  const target = req.method === "GET" ? `${path}${sportivQuery(path, req.nextUrl.searchParams)}` : path;
  const res = await sportivCall(ctx, req.method, target, body);
  if (res.file) return fileResponse(res.file, res.cookies);
  const data = typeof res.body === "object" && res.body !== null ? (res.body as { data?: unknown }).data : null;
  const revokedCurrent = req.method === "DELETE" && typeof data === "object" && data !== null && (data as { revokedCurrent?: unknown }).revokedCurrent === true;
  return respond(res.status, res.body, revokedCurrent ? [...res.cookies, ...clearSessionCookies(ctx.secure)] : res.cookies);
}

export const GET = handle;
export const POST = handle;
export const PUT = handle;
export const DELETE = handle;
