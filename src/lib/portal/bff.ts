// Server only (route handlers of the coach and sportiv apps). The package "server-only" is not a
// dependency, so this module must never be imported from a client component.
// Never logs a token, a secret or an invite secret: a call logs method, masked path, status.
import { NextResponse, type NextRequest } from "next/server";
import { STRAPI_BASE } from "@/lib/strapi-base";
import type { ApiRefusal } from "./api-types";
import { STATES } from "./copy";
import { clearSessionCookies, cookieNames, isSecureRequest, sessionCookies, type CookieNames, type CookieSpec } from "./cookies";
import { cleanIp } from "./client-ip";
import { createRefresher, type RefreshResult } from "./refresh";
import type { PortalSite } from "./site";
import { isSportivFile } from "./sportiv-routes";
import { bffHeaders, classifyCoach, classifySportiv, maskSecrets, readSession, refreshFailure } from "./upstream";

export type BffContext = {
  site: PortalSite; secure: boolean; names: CookieNames; host: string | null; ip: string | null; userAgent: string | null;
  access: string | null; refresh: string | null; device: string | null;
};
// `file`: a 2xx answer is not read, it comes back as `file` to be streamed on (calendar.ics, the signed agreement).
type StrapiInit = { method: string; body?: unknown; access?: string | null; device?: string | null; userAgent?: boolean; file?: boolean };
type Answer = { status: number; body: unknown; file?: Response };
type SessionAnswer = Answer & { cookies: CookieSpec[] };

const TIMEOUT_MS = 10_000;
const MIN_SECRET = 32;
let warnedSecret = false;

export function refusal(status: number, message: string): ApiRefusal {
  return { data: null, error: { status, name: "PortalBffError", message } };
}

export function bffContext(req: NextRequest, site: PortalSite): BffContext {
  const secure = isSecureRequest(req.url, req.headers.get("x-forwarded-proto"));
  const names = cookieNames(secure);
  const cookie = (name: string): string | null => req.cookies.get(name)?.value ?? null;
  return {
    site, secure, names, host: req.headers.get("host"), ip: cleanIp(req.headers.get("x-real-ip")), userAgent: req.headers.get("user-agent"),
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

// Queries can hold personal data (search terms): they never reach a log line.
const logPath = (path: string): string => path.split("?")[0];

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
    console.log(`portal-bff ${init.method} ${maskSecrets(logPath(path))} ${res.status}`);
    if (init.file && res.ok) return { status: res.status, body: null, file: res };
    return { status: res.status, body: await readAnswer(res) };
  } catch {
    console.log(`portal-bff ${init.method} ${maskSecrets(logPath(path))} 502`);
    return { status: 502, body: refusal(502, STATES.loadFailed) };
  }
}

async function runRefresh(refreshToken: string, ctx: BffContext): Promise<RefreshResult> {
  const res = await callStrapi("auth/refresh", { method: "POST", body: { refreshToken } }, ctx);
  if (res.status === 200) {
    const session = readSession(res.body);
    return session ? { ok: true, session } : { ok: false, transient: 502 };
  }
  if (res.status === 403) console.error("portal-bff: secret refused");
  return { ok: false, transient: refreshFailure(res.status) };
}

const refresher = createRefresher<BffContext>(runRefresh, () => Date.now());

function refreshOnce(ctx: BffContext): Promise<RefreshResult> {
  if (!ctx.refresh) return Promise.resolve({ ok: false, transient: null });
  return refresher(ctx.refresh, ctx.device, ctx);
}

const ended = (ctx: BffContext): SessionAnswer => ({
  status: 401, body: { data: null, error: { status: 401, name: "SessionEnded", message: "" } }, cookies: clearSessionCookies(ctx.secure),
});

// The backend answers a refused BFF secret and a cut account the same way (403 ForbiddenError
// "Forbidden", both thrown by the global::is-coach and global::is-sportiv policies), so the answer cannot tell them
// apart. A BFF-only route that needs no session says which one it is: it answers 403 only for a refused secret.
// An outage during the probe also keeps the session: a cut is never assumed from silence.
async function secretRefused(ctx: BffContext): Promise<boolean> {
  const probe = await callStrapi("auth/google/config", { method: "GET" }, ctx);
  if (probe.status === 403) console.error("portal-bff: secret refused");
  return probe.status === 403 || probe.status >= 500;
}

type Verdict = "refresh" | "cut" | "pass";
type Area = { prefix: "coach" | "sportiv"; verdict: (status: number, body: unknown) => Verdict; file: (path: string) => boolean };

const COACH: Area = {
  prefix: "coach",
  verdict: (status, body) => {
    const o = classifyCoach(status, body);
    return o === "refresh" || o === "cut" ? o : "pass";
  },
  file: () => false,
};

// "lost-athlete" and "show" both go through unchanged: the page reads the 403 ClubAdminError itself.
const SPORTIV: Area = {
  prefix: "sportiv",
  verdict: (status, body) => {
    const o = classifySportiv(status, body);
    return o === "refresh" || o === "cut" ? o : "pass";
  },
  file: isSportivFile,
};

function areaInit(area: Area, method: string, path: string, body: unknown, access: string, ctx: BffContext): StrapiInit {
  const device = method === "GET" && path.startsWith("/me/devices") ? ctx.device : null;
  return { method, body: method === "GET" ? undefined : body, access, device, file: method === "GET" && area.file(path) };
}

async function areaCall(area: Area, ctx: BffContext, method: string, path: string, body: unknown): Promise<SessionAnswer> {
  if (!ctx.refresh) return ended(ctx);
  let access = ctx.access;
  let cookies: CookieSpec[] = [];
  // Only a backend 401 ends the session; an outage or a refused secret leaves the cookies alone.
  const renew = async(): Promise<SessionAnswer | null> => {
    const r = await refreshOnce(ctx);
    if (!r.ok) {
      if (r.transient === null) return ended(ctx);
      return { status: r.transient, body: refusal(r.transient, STATES.loadFailed), cookies: [] };
    }
    access = r.session.accessToken;
    cookies = sessionCookies(r.session, Date.now(), ctx.secure);
    return null;
  };
  const first = access ? null : await renew();
  if (first) return first;
  const ask = (): Promise<Answer> => callStrapi(`${area.prefix}${path}`, areaInit(area, method, path, body, access ?? "", ctx), ctx);
  let res = await ask();
  let verdict = area.verdict(res.status, res.body);
  if (verdict === "refresh") {
    const again = await renew();
    if (again) return again;
    res = await ask();
    verdict = area.verdict(res.status, res.body);
    if (verdict === "refresh") return ended(ctx);
  }
  if (verdict === "cut") return (await secretRefused(ctx)) ? { status: 503, body: refusal(503, STATES.loadFailed), cookies } : ended(ctx);
  return { status: res.status, body: res.body, file: res.file, cookies };
}

export const coachCall = (ctx: BffContext, method: string, path: string, body: unknown): Promise<SessionAnswer> => areaCall(COACH, ctx, method, path, body);
export const sportivCall = (ctx: BffContext, method: string, path: string, body: unknown): Promise<SessionAnswer> => areaCall(SPORTIV, ctx, method, path, body);

export function respond(status: number, body: unknown, cookies: CookieSpec[]): NextResponse {
  const res = NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
  for (const c of cookies) {
    res.cookies.set({ name: c.name, value: c.value, maxAge: c.maxAge, httpOnly: c.httpOnly, secure: c.secure, sameSite: c.sameSite, path: c.path });
  }
  return res;
}
