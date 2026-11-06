// One refresh per session at a time. The backend rotates the refresh token on use and
// treats a second use of the old one as theft, so parallel requests that carry the same
// refresh cookie must share one result. Imports: node:crypto and types only.
import { createHash } from "node:crypto";
import type { PortalSession } from "./api-types";

export type RefreshResult = { ok: true; session: PortalSession } | { ok: false };

type Entry = { promise: Promise<RefreshResult>; doneAt: number | null };

const DEFAULT_GRACE_MS = 30_000;
const FAILED: RefreshResult = { ok: false };

const keyOf = (token: string): string => createHash("sha256").update(token).digest("hex");

export function createRefresher(
  run: (refreshToken: string) => Promise<RefreshResult>,
  nowMs: () => number,
  graceMs: number = DEFAULT_GRACE_MS,
): (refreshToken: string) => Promise<RefreshResult> {
  const entries = new Map<string, Entry>();

  function dropOld(): void {
    const now = nowMs();
    for (const [key, e] of entries) if (e.doneAt !== null && now - e.doneAt > graceMs) entries.delete(key);
  }

  function start(key: string, token: string): Entry {
    const entry: Entry = { promise: Promise.resolve(FAILED), doneAt: null };
    entry.promise = Promise.resolve()
      .then(() => run(token))
      .catch((): RefreshResult => FAILED)
      .then((result) => {
        // Only a success is worth reusing; a failure is retried by the next caller.
        if (result.ok) entry.doneAt = nowMs();
        else if (entries.get(key) === entry) entries.delete(key);
        return result;
      });
    entries.set(key, entry);
    return entry;
  }

  return (refreshToken) => {
    dropOld();
    const key = keyOf(refreshToken);
    return (entries.get(key) ?? start(key, refreshToken)).promise;
  };
}
