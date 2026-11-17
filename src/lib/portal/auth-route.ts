// Server only (auth route handlers of the coach app). Shared guards and answers.
// Never logs a token, a secret, a password or an invite secret.
import { NextResponse, type NextRequest } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import type { PortalSession } from "./api-types";
import { readLimitedText } from "./body-limit";
import { bffContext, callStrapi, refusal, respond, secretReady, type BffContext } from "./bff";
import { STATES } from "./copy";
import { clearSessionCookies, sessionCookies, shortCookie, type CookieSpec } from "./cookies";
import { originAllowed } from "./origin";
import type { PortalSite } from "./site";
import { readSession } from "./upstream";

const RATE = { max: 30, windowMs: 900_000 };

export type Guarded = { ctx: BffContext; body: Record<string, unknown> };

/** Origin, secret, rate limit and body size, in that order. Answers a response or the parsed request. */
export async function guardPost(req: NextRequest, site: PortalSite, opts: { limited: boolean; readBody: boolean; needSecret?: boolean }): Promise<NextResponse | Guarded> {
  const ctx = bffContext(req, site);
  if (!originAllowed(req.method, req.headers.get("origin"), ctx.host, ctx.secure)) return respond(403, refusal(403, STATES.invalid), []);
  if (opts.needSecret !== false && !secretReady()) return respond(503, refusal(503, STATES.loadFailed), []);
  if (opts.limited && !rateLimit(`portal-auth:${ctx.ip ?? "unknown"}`, RATE).ok) return respond(429, refusal(429, STATES.tooMany), []);
  if (!opts.readBody) return { ctx, body: {} };
  const read = await readLimitedText(req);
  if (!read.ok) return respond(413, refusal(413, STATES.invalid), []);
  try {
    const parsed: unknown = JSON.parse(read.text);
    if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) return { ctx, body: parsed as Record<string, unknown> };
  } catch {
    // falls through to the invalid answer
  }
  return respond(400, refusal(400, STATES.invalid), []);
}

export const text = (body: Record<string, unknown>, key: string): string | null => {
  const v = body[key];
  return typeof v === "string" && v.length > 0 ? v : null;
};

export const invalid = (): NextResponse => respond(400, refusal(400, STATES.invalid), []);

/** Strapi answered: a session becomes cookies and `{ data: { ok: true } }`; a refusal passes through unchanged. */
export function sessionAnswer(res: { status: number; body: unknown }, ctx: BffContext, extra: CookieSpec[] = []): NextResponse {
  if (res.status === 403) {
    console.error("portal-bff: secret refused");
    return respond(503, refusal(503, STATES.loadFailed), []);
  }
  if (res.status < 200 || res.status >= 300) return respond(res.status, res.body, []);
  const session: PortalSession | null = readSession(res.body);
  if (!session) return respond(502, refusal(502, STATES.loadFailed), []);
  return respond(200, { data: { ok: true } }, [...sessionCookies(session, Date.now(), ctx.secure), ...extra]);
}

const MAX_FLASH = 300;

/** Sign-in with e-mail and password. The `host` Strapi checks the entry against is the site, never the request body. */
export async function loginPost(req: NextRequest, site: PortalSite): Promise<NextResponse> {
  const g = await guardPost(req, site, { limited: true, readBody: true });
  if (!("ctx" in g)) return g;
  const email = text(g.body, "email");
  const password = text(g.body, "password");
  if (!email || !password) return invalid();
  const res = await callStrapi(
    "auth/login",
    { method: "POST", body: { host: site, email, password, deviceKey: g.ctx.device }, userAgent: true },
    g.ctx,
  );
  return sessionAnswer(res, g.ctx);
}

export async function logoutPost(req: NextRequest, site: PortalSite): Promise<NextResponse> {
  const g = await guardPost(req, site, { limited: false, readBody: false, needSecret: false });
  if (!("ctx" in g)) return g;
  // The cookies are cleared whatever the backend answers, or whether it answers at all.
  if (g.ctx.refresh) {
    try {
      await callStrapi("auth/logout", { method: "POST", body: { refreshToken: g.ctx.refresh } }, g.ctx);
    } catch {
      // the local session still ends
    }
  }
  return respond(200, { data: { ok: true } }, clearSessionCookies(g.ctx.secure));
}

/** The one-shot message a redirect left in a cookie (a failed Google sign-in); reading it clears it. */
export function flashGet(req: NextRequest, site: PortalSite): NextResponse {
  const ctx = bffContext(req, site);
  const value = req.cookies.get(ctx.names.flash)?.value ?? "";
  const message = value ? value.slice(0, MAX_FLASH) : null;
  return respond(200, { data: { message } }, message === null ? [] : [shortCookie(ctx.names.flash, "", 0, ctx.secure)]);
}

export { callStrapi };
