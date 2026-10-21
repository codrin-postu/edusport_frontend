// ---------------------------------------------------------------------------
// Which school a registration is for (spec 3.3): `?scoala=<slug>`, or the only
// school with a public page, or "Alege școala" when there are 2 or more.
// No runtime imports: scripts/inscrieri/school.test.mjs loads this file.
// ---------------------------------------------------------------------------

export type SchoolResolution<T> =
  | { state: "chosen"; school: T }
  | { state: "choose"; schools: T[]; unknownSlug: boolean }
  | { state: "none" };

/**
 * An unknown slug is never mapped to another school (the backend refuses it
 * too): the parent sees "Școala nu a fost găsită." above the list.
 */
export function resolveSchool<T extends { slug: string }>(schools: T[], slug: string | null): SchoolResolution<T> {
  if (!schools.length) return { state: "none" };
  const wanted = (slug ?? "").trim().toLowerCase();
  if (wanted) {
    const hit = schools.find((s) => s.slug === wanted);
    return hit ? { state: "chosen", school: hit } : { state: "choose", schools, unknownSlug: true };
  }
  if (schools.length === 1) return { state: "chosen", school: schools[0] };
  return { state: "choose", schools, unknownSlug: false };
}

/** The chosen school stays at the top of every step only when there was a choice. */
export function showsPinnedSchool(schoolCount: number): boolean {
  return schoolCount >= 2;
}
