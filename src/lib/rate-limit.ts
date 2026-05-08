// Tiny in-process sliding-window rate-limiter, keyed by IP. Sufficient for a
// single-instance Next.js deploy. If we ever scale horizontally, swap to
// `@upstash/ratelimit` (Redis) — the seam is `check()`'s signature.

type Entry = { hits: number[] };
const buckets = new Map<string, Entry>();

export function rateLimit(
  key: string,
  { max, windowMs }: { max: number; windowMs: number },
): { ok: boolean; retryAfterSec: number } {
  const now = Date.now();
  const cutoff = now - windowMs;
  const entry = buckets.get(key) ?? { hits: [] };
  entry.hits = entry.hits.filter((t) => t > cutoff);

  if (entry.hits.length >= max) {
    buckets.set(key, entry);
    const oldest = entry.hits[0] ?? now;
    return { ok: false, retryAfterSec: Math.ceil((oldest + windowMs - now) / 1000) };
  }

  entry.hits.push(now);
  buckets.set(key, entry);
  return { ok: true, retryAfterSec: 0 };
}
