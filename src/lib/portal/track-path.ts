// Turns a portal path into its route pattern, so analytics never see a name, an id, a secret or a query.
// Pure. Anything not listed is "/[other]". The internal host-rewrite prefix (/sportiv, /antrenor) is dropped.
export type TrackPortal = "sportiv" | "antrenor";

// Literal patterns come before parametrised ones: the first full match wins.
const PATTERNS: Record<TrackPortal, string[]> = {
  sportiv: [
    "/", "/setari", "/setari/parola", "/setari/dispozitive", "/setari/sportiv/[athlete]",
    "/login", "/forgot-password", "/invite",
    "/[athlete]", "/[athlete]/calendar", "/[athlete]/istoric", "/[athlete]/parcurs", "/[athlete]/plati",
    "/[athlete]/concursuri", "/[athlete]/concursuri/[result]",
  ],
  antrenor: [
    "/", "/calendar", "/istoric", "/prezenta", "/concursuri", "/grupe", "/profil", "/profil/securitate", "/profil/setari",
    "/grupe/[group]", "/grupe/[group]/modifica", "/grupe/[group]/adauga", "/grupe/[group]/sportiv-nou",
    "/lectie/noua", "/lectie/[lesson]", "/lectie/[lesson]/modifica",
    "/sportiv/[athlete]", "/antrenament/nou", "/login", "/forgot-password", "/invite",
  ],
};

const PREFIX: Record<TrackPortal, string> = { sportiv: "sportiv", antrenor: "antrenor" };

function matches(pattern: string[], segs: string[]): boolean {
  return pattern.length === segs.length && pattern.every((p, i) => (p.startsWith("[") ? segs[i] !== "" : p === segs[i]));
}

export function trackPath(portal: TrackPortal, path: string): string {
  const clean = path.split(/[?#]/)[0] ?? "";
  let segs = clean.split("/").filter(Boolean);
  if (segs[0] === PREFIX[portal]) {
    // Each portal drops only its own prefix: on antrenor "/sportiv/<id>" is a real page.
    segs = segs.slice(1);
  }
  if (segs[0] === "invite") return "/invite";
  for (const pat of PATTERNS[portal]) {
    const p = pat.split("/").filter(Boolean);
    if (matches(p, segs)) return pat;
  }
  return "/[other]";
}
