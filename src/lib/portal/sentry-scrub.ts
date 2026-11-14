// Masks invite secrets and credentials in what Sentry is about to send. Pure.
// Events, transactions and spans all pass through here: a transaction name, a span
// description and a request URL carry the path, and the path can hold an invite secret
// (/invite/<secret>) or a Google code and state in the query.
import { maskSecrets } from "./upstream.ts";
import { trackPath } from "./track-path.ts";

/** A path or URL: the invite secret and the whole query string (and fragment) are masked. */
export function maskUrl(text: string): string {
  return maskSecrets(text).replace(/[?#][^\s"]*/g, (m) => `${m[0]}***`);
}

const EMAIL = /[^\s@"'<>()]+@[^\s@"'<>()]+\.[^\s@"'<>()]+/g;
const ID24 = /\b[a-z0-9]{24}\b/g;
// A full URL, or a path under the internal host-rewrite prefix (/sportiv, /antrenor).
const PATHISH = /https?:\/\/[^\s"'<>)]+|\/(?:sportiv|antrenor)\/[^\s"'<>)?#]*(?:[?#][^\s"'<>)]*)?/g;

const portalOfHost = (host: string): "sportiv" | "antrenor" | null => /^(sportiv|antrenor)\./i.exec(host)?.[1]?.toLowerCase() as "sportiv" | "antrenor" | null ?? null;

/** Ids the route patterns do not cover: a segment that mixes in a digit is an id. */
const maskIdSegments = (path: string): string => path.replace(/[^/]*\d[^/]*/g, (seg) => (seg.length >= 6 ? "[id]" : seg));

function scrubPathPart(path: string, portal: "sportiv" | "antrenor" | null): string {
  if (portal) {
    const pattern = trackPath(portal, path);
    if (pattern !== "/[other]") return pattern;
    return maskIdSegments(path);
  }
  return path;
}

/** One URL or internal path: portal paths become route patterns, the invite secret and the query are masked. */
function scrubPathish(token: string): string {
  const m = /^(https?:\/\/([^/?#]*))?([^?#]*)([?#].*)?$/.exec(token);
  if (!m) return maskUrl(token);
  const [, origin = "", host = "", path = "", tail = ""] = m;
  const portal = origin ? portalOfHost(host) : /^\/(sportiv|antrenor)\//.exec(path)?.[1] as "sportiv" | "antrenor" | undefined ?? null;
  return maskUrl(`${origin}${scrubPathPart(path, portal)}${tail}`);
}

/** A URL (a request URL, a page URL): portal paths as route patterns, no ids, no query. */
export function scrubUrl(url: string): string {
  return scrubPathish(maskSecrets(url)).replace(ID24, "[id]");
}

/** Free text (a message, an exception value, a breadcrumb): e-mails, ids, portal paths and invite secrets removed. */
export function scrubText(text: string): string {
  return maskSecrets(text)
    .replace(PATHISH, (t) => scrubPathish(t))
    .replace(EMAIL, "***@***")
    .replace(ID24, "[id]");
}

/** Does this transaction belong to the portals? Their paths carry athletes, so no traces leave from them. */
export function isPortalTransaction(name: string | undefined, url: string | undefined): boolean {
  if (name && /(^|\s)\/(sportiv|antrenor)(\/|$|\?)/.test(name)) return true;
  if (url) {
    const host = /^https?:\/\/([^/?#]*)/.exec(url)?.[1] ?? "";
    if (portalOfHost(host)) return true;
    if (/^\/(sportiv|antrenor)(\/|$|\?)/.test(url)) return true;
  }
  return false;
}

/** 0 on portal paths (and in the browser on a portal host), 0.1 elsewhere: the site keeps its rate. */
export function tracesSampler(ctx: { name?: string; normalizedRequest?: { url?: string } }): number {
  if (isPortalTransaction(ctx.name, ctx.normalizedRequest?.url)) return 0;
  const host = (globalThis as { location?: { hostname?: string } }).location?.hostname;
  if (host && portalOfHost(host)) return 0;
  return 0.1;
}

const QUERY_KEYS = /(^|[._])(query|query_string|search|fragment)$/i;
const URL_KEYS = /(^|[._])(url|full|target|path|route|request_path|description|name)$/i;

function scrubData(data: Record<string, unknown> | undefined): void {
  if (!data) return;
  for (const k of Object.keys(data)) {
    const v = data[k];
    if (typeof v !== "string") continue;
    if (QUERY_KEYS.test(k)) data[k] = v ? "***" : v;
    else data[k] = URL_KEYS.test(k) ? maskUrl(v) : maskSecrets(v);
  }
}

type LooseSpan = { description?: string; data?: Record<string, unknown> };

export function scrubSpan<T extends object>(span: T): T {
  const s = span as LooseSpan;
  if (typeof s.description === "string") s.description = maskUrl(s.description);
  scrubData(s.data);
  return span;
}

type Loose = {
  message?: string;
  logentry?: { message?: string };
  user?: unknown;
  extra?: unknown;
  exception?: { values?: { value?: string }[] };
  breadcrumbs?: { message?: string; category?: string; data?: Record<string, unknown> }[];
  transaction?: string;
  request?: { url?: string; data?: unknown; cookies?: unknown; headers?: Record<string, string>; query_string?: unknown };
  contexts?: { nextjs?: { request_path?: unknown }; trace?: LooseSpan };
  spans?: LooseSpan[];
};

export function scrubEvent<T extends object>(event: T): T {
  const e = event as Loose;
  // Who and what the user typed never leave the process.
  delete e.user;
  delete e.extra;
  if (typeof e.message === "string") e.message = scrubText(e.message);
  if (typeof e.logentry?.message === "string") e.logentry.message = scrubText(e.logentry.message);
  if (Array.isArray(e.exception?.values)) for (const v of e.exception.values) if (typeof v.value === "string") v.value = scrubText(v.value);
  if (Array.isArray(e.breadcrumbs)) for (const b of e.breadcrumbs) scrubBreadcrumb(b);
  if (typeof e.transaction === "string") e.transaction = maskUrl(e.transaction).replace(ID24, "[id]");
  const nextjs = e.contexts?.nextjs;
  if (nextjs && typeof nextjs.request_path === "string") nextjs.request_path = maskUrl(nextjs.request_path);
  if (e.contexts?.trace) scrubSpan(e.contexts.trace);
  if (Array.isArray(e.spans)) for (const s of e.spans) scrubSpan(s);
  const r = e.request;
  if (r) {
    if (r.url) r.url = scrubUrl(r.url);
    delete r.data;
    delete r.cookies;
    if (r.query_string !== undefined && r.query_string !== "" && r.query_string !== null) r.query_string = "***";
    if (r.headers) {
      for (const k of Object.keys(r.headers)) {
        if (/^(referer|referrer)$/i.test(k)) r.headers[k] = maskUrl(r.headers[k]);
        if (/^(cookie|authorization|x-portal-secret)$/i.test(k)) r.headers[k] = "***";
      }
    }
  }
  return event;
}

export function scrubBreadcrumb<T extends object>(crumb: T): T {
  const c = crumb as { message?: string; data?: Record<string, unknown> };
  const category = (crumb as { category?: string }).category;
  // What was clicked or typed is text the user can see: a name, a label with a name.
  if (category === "ui.click" || category === "ui.input") delete c.message;
  else if (typeof c.message === "string") c.message = scrubText(c.message);
  if (c.data) {
    for (const k of ["url", "from", "to"]) if (typeof c.data[k] === "string") c.data[k] = scrubUrl(c.data[k]);
  }
  return crumb;
}
