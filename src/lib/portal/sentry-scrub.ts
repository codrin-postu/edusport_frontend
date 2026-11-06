// Masks invite secrets and credentials in what Sentry is about to send. Pure.
import { maskSecrets } from "./upstream";

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

type Loose = { request?: { url?: string; data?: unknown; headers?: Record<string, string>; query_string?: unknown } };

export function scrubEvent<T extends object>(event: T): T {
  const e = event as Loose;
  const r = e.request;
  if (r) {
    if (r.url) r.url = maskSecrets(r.url);
    if (r.data !== undefined) r.data = mask(r.data);
    if (r.query_string !== undefined) r.query_string = mask(r.query_string);
    if (r.headers) {
      for (const k of Object.keys(r.headers)) {
        if (/^(referer|referrer)$/i.test(k)) r.headers[k] = maskSecrets(r.headers[k]);
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
    for (const k of ["url", "from", "to"]) if (typeof c.data[k] === "string") c.data[k] = maskSecrets(c.data[k]);
  }
  return crumb;
}
