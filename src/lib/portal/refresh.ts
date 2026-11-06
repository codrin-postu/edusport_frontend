// One refresh per session at a time. The backend rotates the refresh token on use and
// treats a second use of the old one as theft, so parallel requests that carry the same
// refresh cookie must share one result. Imports: node:crypto and types only.
import { createHash } from "node:crypto";
import type { PortalSession } from "./api-types";

/** `transient` is null when the backend refused the token (the session is over), else the status to answer. */
export type RefreshResult = { ok: true; session: PortalSession } | { ok: false; transient: number | null };

type Entry = { promise: Promise<RefreshResult>; doneAt: number | null };

// The reuse window after a success only covers the Set-Cookie race and a lost response.
const DEFAULT_GRACE_MS = 10_000;
const DOWN: RefreshResult = { ok: false, transient: 502 };

const keyOf = (token: string, device: string | null): string =>
  createHash("sha256").update(`${token}\0${device ?? ""}`).digest("hex");

/**
 * The first caller of a key runs `run` with its own ctx. With a device cookie the success is reused
 * for the grace window, bound to that device so a leaked old token alone gets nothing; without one
 * only calls in flight are shared. A failure is never cached.
 * If the backend rotated the token but the answer was lost, a retry with the old token cannot be recovered here.
 */
export function createRefresher<C>(
  run: (refreshToken: string, ctx: C) => Promise<RefreshResult>,
  nowMs: () => number,
  graceMs: number = DEFAULT_GRACE_MS,
): (refreshToken: string, device: string | null, ctx: C) => Promise<RefreshResult> {
  const entries = new Map<string, Entry>();

  function dropOld(): void {
    const now = nowMs();
    for (const [key, e] of entries) if (e.doneAt !== null && now - e.doneAt > graceMs) entries.delete(key);
  }

  function start(key: string, token: string, reuse: boolean, ctx: C): Entry {
    const entry: Entry = { promise: Promise.resolve(DOWN), doneAt: null };
    entry.promise = Promise.resolve()
      .then(() => run(token, ctx))
      .catch((): RefreshResult => DOWN)
      .then((result) => {
        if (result.ok && reuse) entry.doneAt = nowMs();
        else if (entries.get(key) === entry) entries.delete(key);
        return result;
      });
    entries.set(key, entry);
    return entry;
  }

  return (refreshToken, device, ctx) => {
    dropOld();
    const key = keyOf(refreshToken, device);
    return (entries.get(key) ?? start(key, refreshToken, device !== null, ctx)).promise;
  };
}
