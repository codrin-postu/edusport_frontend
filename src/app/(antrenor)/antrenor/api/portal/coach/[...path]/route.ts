// The coach proxy: only the routes of coach-routes.ts, only from the coach host, with the
// refresh handled in coachCall. Strapi set-cookie headers are never forwarded.
import type { NextRequest, NextResponse } from "next/server";
import { bffContext, coachCall, refusal, respond, secretReady } from "@/lib/portal/bff";
import { readLimitedText } from "@/lib/portal/body-limit";
import { allowedCoachRoute, forwardedQuery } from "@/lib/portal/coach-routes";
import { STATES } from "@/lib/portal/copy";
import { clearSessionCookies } from "@/lib/portal/cookies";
import { originAllowed } from "@/lib/portal/origin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NOT_FOUND = "Nu a fost găsit.";

type Ctx = { params: Promise<{ path: string[] }> };

async function handle(req: NextRequest, { params }: Ctx): Promise<NextResponse> {
  const { path: segments } = await params;
  const path = `/${segments.join("/")}`;
  if (!allowedCoachRoute(req.method, path)) return respond(404, refusal(404, NOT_FOUND), []);
  const ctx = bffContext(req);
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
  // GET reads the allowed names; DELETE /lessons/:id carries `scope`. Other writes forward nothing.
  const target = req.method === "GET" || req.method === "DELETE" ? `${path}${forwardedQuery(path, req.nextUrl.searchParams)}` : path;
  const res = await coachCall(ctx, req.method, target, body);
  const data = typeof res.body === "object" && res.body !== null ? (res.body as { data?: unknown }).data : null;
  const revokedCurrent = req.method === "DELETE" && typeof data === "object" && data !== null && (data as { revokedCurrent?: unknown }).revokedCurrent === true;
  return respond(res.status, res.body, revokedCurrent ? [...res.cookies, ...clearSessionCookies(ctx.secure)] : res.cookies);
}

export const GET = handle;
export const POST = handle;
export const PUT = handle;
export const DELETE = handle;
