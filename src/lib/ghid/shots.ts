// Pure: which marks a step shows. Types only: loaded by Node tests.
import type { ShotData } from "./types.ts";

export type ShownMark = { n?: number; box: [number, number, number, number] };

/** The step's marks in the order it names them; numbered from 1 only when `numbered`. No keys: no marks. A key the shot lacks throws. */
export function stepMarks(id: string, shot: ShotData, keys: string[] | undefined, numbered = false): ShownMark[] {
  return (keys ?? []).map((key, i) => {
    const m = shot.marks.find((x) => x.key === key);
    if (!m) throw new Error(`shot ${id} has no mark "${key}"`);
    return numbered ? { n: i + 1, box: m.box } : { box: m.box };
  });
}

/** Left edge (percent of the image) under which a badge cannot sit outside its box and goes inside, top-left. */
export const BADGE_OUTSIDE_MIN_LEFT = 6;

export function badgeOutside(box: [number, number, number, number]): boolean {
  return box[0] >= BADGE_OUTSIDE_MIN_LEFT;
}
