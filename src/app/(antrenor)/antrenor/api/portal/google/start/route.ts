import { NextResponse, type NextRequest } from "next/server";
import { bffContext } from "@/lib/portal/bff";
import { shortCookie } from "@/lib/portal/cookies";
import { authUrl, encodeGoogleCookie, pkcePair, randomToken } from "@/lib/portal/google";
import { googleClientId } from "@/lib/portal/google-config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const COOKIE_SECONDS = 600;

const go = (to: string): NextResponse =>
  new NextResponse(null, { status: 303, headers: { Location: to, "Cache-Control": "no-store", "Referrer-Policy": "no-referrer" } });

export async function GET(req: NextRequest): Promise<NextResponse> {
  const ctx = bffContext(req);
  const invite = req.nextUrl.searchParams.get("invite") === "1";
  const clientId = await googleClientId(ctx);
  if (!clientId) return go(invite ? "/invitatie" : "/intrare");
  const state = randomToken(24);
  const nonce = randomToken(24);
  const { verifier, challenge } = pkcePair();
  const redirectUri = `${ctx.secure ? "https" : "http"}://${ctx.host ?? ""}/api/portal/google/callback`;
  const res = go(authUrl({ clientId, redirectUri, state, nonce, challenge }));
  const c = shortCookie(ctx.names.google, encodeGoogleCookie({ state, nonce, verifier, invite, exp: Date.now() + COOKIE_SECONDS * 1000 }), COOKIE_SECONDS, ctx.secure);
  res.cookies.set({ name: c.name, value: c.value, maxAge: c.maxAge, httpOnly: c.httpOnly, secure: c.secure, sameSite: c.sameSite, path: c.path });
  return res;
}
