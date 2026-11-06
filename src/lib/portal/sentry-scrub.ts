// Masks invite secrets and credentials in what Sentry is about to send. Pure.
// Events, transactions and spans all pass through here: a transaction name, a span
// description and a request URL carry the path, and the path can hold an invite secret
// (/invitatie/<secret>) or a Google code and state in the query.
import { maskSecrets } from "./upstream.ts";

const mask = (v: unknown): unknown => {
  if (typeof v === "string") return maskSecrets(v);
  if (typeof v === "object" && v !== null) {
    try {
      return JSON.parse(maskSecrets(JSON.stringify(v)));
    } catch {
      return "***";
    }
  }
  return v;
};

/** A path or URL: the invite secret and the whole query string (and fragment) are masked. */
export function maskUrl(text: string): string {
  return maskSecrets(text).replace(/[?#][^\s"]*/g, (m) => `${m[0]}***`);
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
  transaction?: string;
  request?: { url?: string; data?: unknown; headers?: Record<string, string>; query_string?: unknown };
  contexts?: { nextjs?: { request_path?: unknown }; trace?: LooseSpan };
  spans?: LooseSpan[];
};

export function scrubEvent<T extends object>(event: T): T {
  const e = event as Loose;
  if (typeof e.transaction === "string") e.transaction = maskUrl(e.transaction);
  const nextjs = e.contexts?.nextjs;
  if (nextjs && typeof nextjs.request_path === "string") nextjs.request_path = maskUrl(nextjs.request_path);
  if (e.contexts?.trace) scrubSpan(e.contexts.trace);
  if (Array.isArray(e.spans)) for (const s of e.spans) scrubSpan(s);
  const r = e.request;
  if (r) {
    if (r.url) r.url = maskUrl(r.url);
    if (r.data !== undefined) r.data = mask(r.data);
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
  if (typeof c.message === "string") c.message = maskSecrets(c.message);
  if (c.data) {
    for (const k of ["url", "from", "to"]) if (typeof c.data[k] === "string") c.data[k] = maskUrl(c.data[k]);
  }
  return crumb;
}
