// Pure: which marks a step shows. Types only: loaded by Node tests.
import type { ShotData } from "./types.ts";

export type ShownMark = { n: number; box: [number, number, number, number] };

/** The step's marks in the order it names them, numbered from 1. No keys: no marks. A key the shot lacks throws. */
export function stepMarks(id: string, shot: ShotData, keys: string[] | undefined): ShownMark[] {
  return (keys ?? []).map((key, i) => {
    const m = shot.marks.find((x) => x.key === key);
    if (!m) throw new Error(`shot ${id} has no mark "${key}"`);
    return { n: i + 1, box: m.box };
  });
}
