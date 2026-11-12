// Server only. The Google sign-in redirect and callback, shared by the coach and sportiv apps.
// Never logs the code, the state or any token: the callback URL carries the code.
import { NextResponse, type NextRequest } from "next/server";
import { bffContext, callStrapi } from "./bff";
import { STATES } from "./copy";
import { sessionCookies, shortCookie, type CookieSpec } from "./cookies";
import { authUrl, decodeGoogleCookie, encodeGoogleCookie, googleRedirectUri, pkcePair, randomToken } from "./google";
import { googleClientId } from "./google-config";
import type { PortalSite } from "./site";
import { isSessionless, readSession } from "./upstream";

const COOKIE_SECONDS = 600;
const FLASH_SECONDS = 60;

const configuredHost = (site: PortalSite): string | undefined => (site === "sportiv" ? process.env.PORTAL_HOST_SPORTIV : process.env.PORTAL_HOST_ANTRENOR);

const go = (to: string): NextResponse =>
  new NextResponse(null, { status: 303, headers: { Location: to, "Cache-Control": "no-store", "Referrer-Policy": "no-referrer" } });

export async function googleStart(req: NextRequest, site: PortalSite): Promise<NextResponse> {
  const ctx = bffContext(req, site);
  const invite = req.nextUrl.searchParams.get("invite") === "1";
  const redirectUri = googleRedirectUri(configuredHost(site), ctx.host, ctx.secure, site);
  const clientId = redirectUri ? await googleClientId(ctx) : null;
  if (!redirectUri || !clientId) return go(invite ? "/invite" : "/login");
  const state = randomToken(24);
  const nonce = randomToken(24);
  const { verifier, challenge } = pkcePair();
  const res = go(authUrl({ clientId, redirectUri, state, nonce, challenge }));
  const c = shortCookie(ctx.names.google, encodeGoogleCookie({ state, nonce, verifier, invite, exp: Date.now() + COOKIE_SECONDS * 1000 }), COOKIE_SECONDS, ctx.secure);
  res.cookies.set({ name: c.name, value: c.value, maxAge: c.maxAge, httpOnly: c.httpOnly, secure: c.secure, sameSite: c.sameSite, path: c.path });
  return res;
}

function goWith(to: string, cookies: CookieSpec[]): NextResponse {
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

export async function googleCallback(req: NextRequest, site: PortalSite): Promise<NextResponse> {
  const ctx = bffContext(req, site);
  const clearGoogle = shortCookie(ctx.names.google, "", 0, ctx.secure);
  const saved = decodeGoogleCookie(req.cookies.get(ctx.names.google)?.value ?? null, Date.now());
  const q = req.nextUrl.searchParams;
  const state = q.get("state");
  const code = q.get("code");
  const back = saved?.invite ? "/invite" : "/login";
  if (!saved || !state || state !== saved.state || q.has("error") || !code) return goWith(back, [clearGoogle]);
  const invite = saved.invite ? req.cookies.get(ctx.names.invite)?.value : undefined;
  const redirectUri = googleRedirectUri(configuredHost(site), ctx.host, ctx.secure, site);
  if (!redirectUri) return goWith(back, [clearGoogle]);
  const res = await callStrapi(
    "auth/google",
    { method: "POST", body: { host: ctx.site, code, codeVerifier: saved.verifier, redirectUri, nonce: saved.nonce, ...(invite ? { invite } : {}), ...(ctx.device ? { deviceKey: ctx.device } : {}) }, userAgent: true },
    ctx,
  );
  const session = res.status === 200 ? readSession(res.body) : null;
  if (session) return goWith("/", [clearGoogle, ...sessionCookies(session, Date.now(), ctx.secure), shortCookie(ctx.names.invite, "", 0, ctx.secure)]);
  // An invite for the other app's holder is accepted without a session: the login page shows.
  if (res.status === 200 && isSessionless(res.body)) return goWith("/login", [clearGoogle, shortCookie(ctx.names.invite, "", 0, ctx.secure)]);
  const message = refusalMessage(res.status, res.body);
  return goWith(back, [clearGoogle, shortCookie(ctx.names.flash, message, FLASH_SECONDS, ctx.secure)]);
}
