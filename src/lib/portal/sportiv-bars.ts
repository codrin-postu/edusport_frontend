/** Height of a presence month bar as a share of the tallest one: 0 to 1; no count (a month to come) or no tallest is 0. */
export function barLevel(count: number | null, max: number): number {
  if (count === null || max <= 0) return 0;
  return Math.min(1, Math.max(0, count / max));
}
