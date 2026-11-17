/** One-shot sessionStorage flag: set after a presence save, read once by the StatusBlock of that session so its check pops. */
const KEY = "es-presence-saved";
const FRESH_MS = 120_000;

export function setSavedFlag(sessionId: string): void {
  try {
    window.sessionStorage.setItem(KEY, `${sessionId}|${Date.now()}`);
  } catch {
    // Storage blocked: the check just appears without the pop.
  }
}

export function consumeSavedFlag(sessionId: string): boolean {
  try {
    const [id, at] = (window.sessionStorage.getItem(KEY) ?? "").split("|");
    if (id !== sessionId) return false;
    window.sessionStorage.removeItem(KEY);
    return Date.now() - Number(at) < FRESH_MS;
  } catch {
    return false;
  }
}
