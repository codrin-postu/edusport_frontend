// Server only (route handlers of the coach app). The package "server-only" is not a
// dependency, so this module must never be imported from a client component.
// Never logs a token, a secret or an invite secret: a call logs method, masked path, status.
import { NextResponse, type NextRequest } from "next/server";
import { STRAPI_BASE } from "@/lib/strapi-base";
import type { ApiRefusal } from "./api-types";
import { STATES } from "./copy";
import { clearSessionCookies, cookieNames, isSecureRequest, sessionCookies, type CookieNames, type CookieSpec } from "./cookies";
import { createRefresher, type RefreshResult } from "./refresh";
import { bffHeaders, classifyCoach, maskSecrets, readSession } from "./upstream";

export type BffContext = {
  secure: boolean; names: CookieNames; host: string | null; ip: string | null; userAgent: string | null;
  access: string | null; refresh: string | null; device: string | null;
};
type StrapiInit = { method: string; body?: unknown; access?: string | null; device?: string | null; userAgent?: boolean };
type Answer = { status: number; body: unknown };
type CoachAnswer = Answer & { cookies: CookieSpec[] };

const TIMEOUT_MS = 10_000;
const MIN_SECRET = 32;
let warnedSecret = false;

export function refusal(status: number, message: string): ApiRefusal {
  return { data: null, error: { status, name: "PortalBffError", message } };
}

export function bffContext(req: NextRequest): BffContext {
  const secure = isSecureRequest(req.url, req.headers.get("x-forwarded-proto"));
  const names = cookieNames(secure);
  const cookie = (name: string): string | null => req.cookies.get(name)?.value ?? null;
  return {
    secure, names, host: req.headers.get("host"), ip: req.headers.get("x-real-ip"), userAgent: req.headers.get("user-agent"),
    access: cookie(names.access), refresh: cookie(names.refresh), device: cookie(names.device),
  };
}

export function secretReady(): boolean {
  const ready = (process.env.PORTAL_BFF_SECRET ?? "").length >= MIN_SECRET;
  if (!ready && !warnedSecret) {
    warnedSecret = true;
    console.error("portal-bff: PORTAL_BFF_SECRET missing");
  }
  return ready;
}

async function readAnswer(res: Response): Promise<unknown> {
  const text = await res.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}

export async function callStrapi(path: string, init: StrapiInit, ctx: BffContext): Promise<Answer> {
  if (!secretReady()) return { status: 503, body: refusal(503, STATES.loadFailed) };
  const base = process.env.PORTAL_STRAPI_URL ?? STRAPI_BASE;
  const headers = bffHeaders({
    secret: process.env.PORTAL_BFF_SECRET ?? "", ip: ctx.ip, userAgent: init.userAgent ? ctx.userAgent : null,
    device: init.device, access: init.access,
  });
  try {
    const res = await fetch(`${base}/api/portal/${path}`, {
      method: init.method, headers, cache: "no-store", signal: AbortSignal.timeout(TIMEOUT_MS),
      body: init.body === undefined ? undefined : JSON.stringify(init.body),
    });
    console.log(`portal-bff ${init.method} ${maskSecrets(path)} ${res.status}`);
    return { status: res.status, body: await readAnswer(res) };
  } catch {
    console.log(`portal-bff ${init.method} ${maskSecrets(path)} 502`);
    return { status: 502, body: refusal(502, STATES.loadFailed) };
  }
}

// The refresher runs `run` synchronously for the first caller of a token, so the
// header set (ip, secret) captured here is that first caller's; later callers share the result.
let runCtx: BffContext | null = null;

async function runRefresh(refreshToken: string): Promise<RefreshResult> {
  const ctx = runCtx;
  if (!ctx) return { ok: false };
  const res = await callStrapi("auth/refresh", { method: "POST", body: { refreshToken } }, ctx);
  const session = res.status === 200 ? readSession(res.body) : null;
  return session ? { ok: true, session } : { ok: false };
}

const refresher = createRefresher(runRefresh, () => Date.now());

function refreshOnce(ctx: BffContext): Promise<RefreshResult> {
  if (!ctx.refresh) return Promise.resolve({ ok: false });
  runCtx = ctx;
  return refresher(ctx.refresh);
}

const ended = (ctx: BffContext): CoachAnswer => ({
  status: 401, body: { data: null, error: { status: 401, name: "SessionEnded", message: "" } }, cookies: clearSessionCookies(ctx.secure),
});

function coachInit(method: string, path: string, body: unknown, access: string, ctx: BffContext): StrapiInit {
  const device = method === "GET" && path.startsWith("/me/devices") ? ctx.device : null;
  return { method, body: method === "GET" ? undefined : body, access, device };
}

export async function coachCall(ctx: BffContext, method: string, path: string, body: unknown): Promise<CoachAnswer> {
  if (!ctx.refresh) return ended(ctx);
  let access = ctx.access;
  let cookies: CookieSpec[] = [];
  const renew = async (): Promise<boolean> => {
    const r = await refreshOnce(ctx);
    if (!r.ok) return false;
    access = r.session.accessToken;
    cookies = sessionCookies(r.session, Date.now(), ctx.secure);
    return true;
  };
  if (!access && !(await renew())) return ended(ctx);
  let res = await callStrapi(`coach${path}`, coachInit(method, path, body, access ?? "", ctx), ctx);
  let outcome = classifyCoach(res.status, res.body);
  if (outcome === "refresh") {
    if (!(await renew())) return ended(ctx);
    res = await callStrapi(`coach${path}`, coachInit(method, path, body, access ?? "", ctx), ctx);
    outcome = classifyCoach(res.status, res.body);
    if (outcome === "refresh") return ended(ctx);
  }
  if (outcome === "cut") return ended(ctx);
  return { status: res.status, body: res.body, cookies };
}

export function respond(status: number, body: unknown, cookies: CookieSpec[]): NextResponse {
  const res = NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
  for (const c of cookies) {
    res.cookies.set({ name: c.name, value: c.value, maxAge: c.maxAge, httpOnly: c.httpOnly, secure: c.secure, sameSite: c.sameSite, path: c.path });
  }
  return res;
}
