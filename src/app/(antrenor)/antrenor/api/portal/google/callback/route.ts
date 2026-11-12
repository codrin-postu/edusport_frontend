// Never logs the code, the state or any token: the callback URL carries the code.
import { NextResponse, type NextRequest } from "next/server";
import { bffContext, callStrapi } from "@/lib/portal/bff";
import { STATES } from "@/lib/portal/copy";
import { sessionCookies, shortCookie, type CookieSpec } from "@/lib/portal/cookies";
import { decodeGoogleCookie, googleRedirectUri } from "@/lib/portal/google";
import { readSession } from "@/lib/portal/upstream";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FLASH_SECONDS = 60;

function go(to: string, cookies: CookieSpec[]): NextResponse {
  const res = new NextResponse(null, { status: 303, headers: { Location: to, "Cache-Control": "no-store", "Referrer-Policy": "no-referrer" } });
  for (const c of cookies) res.cookies.set({ name: c.name, value: c.value, maxAge: c.maxAge, httpOnly: c.httpOnly, secure: c.secure, sameSite: c.sameSite, path: c.path });
  return res;
}

function refusalMessage(status: number, body: unknown): string {
  if (status === 403) {
    console.error("portal-bff: secret refused");
    return STATES.loadFailed;
  }
  const error = typeof body === "object" && body !== null ? (body as { error?: unknown }).error : null;
  const message = typeof error === "object" && error !== null ? (error as { message?: unknown }).message : null;
  return typeof message === "string" && message ? message : STATES.loadFailed;
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  const ctx = bffContext(req, "antrenor");
  const clearGoogle = shortCookie(ctx.names.google, "", 0, ctx.secure);
  const saved = decodeGoogleCookie(req.cookies.get(ctx.names.google)?.value ?? null, Date.now());
  const q = req.nextUrl.searchParams;
  const state = q.get("state");
  const code = q.get("code");
  const back = saved?.invite ? "/invite" : "/login";
  if (!saved || !state || state !== saved.state || q.has("error") || !code) return go(back, [clearGoogle]);
  const invite = saved.invite ? req.cookies.get(ctx.names.invite)?.value : undefined;
  const redirectUri = googleRedirectUri(process.env.PORTAL_HOST_ANTRENOR, ctx.host, ctx.secure);
  if (!redirectUri) return go(back, [clearGoogle]);
  const res = await callStrapi(
    "auth/google",
    { method: "POST", body: { host: ctx.site, code, codeVerifier: saved.verifier, redirectUri, nonce: saved.nonce, ...(invite ? { invite } : {}), ...(ctx.device ? { deviceKey: ctx.device } : {}) }, userAgent: true },
    ctx,
  );
  const session = res.status === 200 ? readSession(res.body) : null;
  if (session) return go("/", [clearGoogle, ...sessionCookies(session, Date.now(), ctx.secure), shortCookie(ctx.names.invite, "", 0, ctx.secure)]);
  const message = refusalMessage(res.status, res.body);
  return go(back, [clearGoogle, shortCookie(ctx.names.flash, message, FLASH_SECONDS, ctx.secure)]);
}
