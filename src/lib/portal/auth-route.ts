// Server only (auth route handlers of the coach app). Shared guards and answers.
// Never logs a token, a secret, a password or an invite secret.
import { NextResponse, type NextRequest } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import type { PortalSession } from "./api-types";
import { bffContext, callStrapi, refusal, respond, secretReady, type BffContext } from "./bff";
import { STATES } from "./copy";
import { sessionCookies, type CookieSpec } from "./cookies";
import { originAllowed } from "./origin";
import { readSession } from "./upstream";

const MAX_BODY = 64 * 1024;
const RATE = { max: 30, windowMs: 900_000 };

export type Guarded = { ctx: BffContext; body: Record<string, unknown> };

/** Origin, secret, rate limit and body size, in that order. Answers a response or the parsed request. */
export async function guardPost(req: NextRequest, opts: { limited: boolean; readBody: boolean }): Promise<NextResponse | Guarded> {
  const ctx = bffContext(req);
  if (!originAllowed(req.method, req.headers.get("origin"), ctx.host, ctx.secure)) return respond(403, refusal(403, STATES.invalid), []);
  if (!secretReady()) return respond(503, refusal(503, STATES.loadFailed), []);
  if (opts.limited && !rateLimit(`portal-auth:${ctx.ip ?? "unknown"}`, RATE).ok) return respond(429, refusal(429, STATES.tooMany), []);
  if (!opts.readBody) return { ctx, body: {} };
  const declared = Number(req.headers.get("content-length") ?? "0");
  if (declared > MAX_BODY) return respond(413, refusal(413, STATES.invalid), []);
  const text = await req.text();
  if (Buffer.byteLength(text) > MAX_BODY) return respond(413, refusal(413, STATES.invalid), []);
  try {
    const parsed: unknown = JSON.parse(text);
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

export { callStrapi };
