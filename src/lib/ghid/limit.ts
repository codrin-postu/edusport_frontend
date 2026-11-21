// Failed-attempt limiter for the wiki password. Pure: loaded by Node tests.
export const GHID_LIMIT = { max: 10, windowMs: 900000 };

export function createLimiter(limit = GHID_LIMIT) {
  const store = new Map<string, number[]>();
  function recent(key: string, now: number): number[] {
    const list = (store.get(key) ?? []).filter((t) => now - t < limit.windowMs);
    if (list.length === 0) store.delete(key);
    else store.set(key, list);
    return list;
  }
  return {
    takeFailure(key: string, now: number): void {
      store.set(key, [...recent(key, now), now]);
    },
    isBlocked(key: string, now: number): boolean {
      return recent(key, now).length >= limit.max;
    },
  };
}

const shared = createLimiter();
export const takeFailure = shared.takeFailure;
export const isBlocked = shared.isBlocked;
