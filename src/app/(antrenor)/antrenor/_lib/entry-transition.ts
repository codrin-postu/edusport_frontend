/** One-shot sessionStorage flag: set by the login page, read once by EntryReveal in the app. */
export const ENTRY_FLAG = "es-entry";

/** Set on <html> before first paint while the flag is present, so the server-rendered app never shows before the reveal. */
export const COVER_ATTR = "data-entry";

/** Inline, runs during HTML parse in the app layout. */
export const COVER_SCRIPT = `try{if(sessionStorage.getItem("${ENTRY_FLAG}")!==null)document.documentElement.setAttribute("${COVER_ATTR}","")}catch(e){}`;

/** The outgoing half is timed in CSS (globals.css); this is when the navy and the mark are fully in. */
const HOLD_MS = 1700;

/**
 * Plays the sign-in exit on the auth screen (ribbon slides out, navy fades in, centred mark), then
 * navigates. With reduced motion it navigates at once. A failed sign-in never calls this.
 */
export function playEntryAndGo(href: string): void {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.location.assign(href);
    return;
  }
  document.querySelector("[data-auth-frame]")?.setAttribute("data-leaving", "");
  const overlay = document.createElement("div");
  overlay.className = "entry-overlay";
  overlay.setAttribute("data-entry-overlay", "");
  overlay.setAttribute("aria-hidden", "true");
  overlay.innerHTML = "<div class=\"entry-mark\"><p class=\"entry-mark-k\">Clubul Sportiv</p><p class=\"entry-mark-w\">EDUSPORT</p></div>";
  document.body.appendChild(overlay);
  window.setTimeout(() => {
    try {
      window.sessionStorage.setItem(ENTRY_FLAG, "1");
    } catch {
      // Storage blocked: the app just opens without the reveal.
    }
    window.location.assign(href);
  }, HOLD_MS);
}
