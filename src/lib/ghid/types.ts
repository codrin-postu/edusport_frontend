// Content model of the staff wiki. Types only: loaded by Node tests and by the pages.
/**
 * `marks` names the keys of the shot (shots.json) this step means. Marks show only the box; with `numbered` each box
 * also gets its position in `marks` (use when the order of use matters). `code` is a command shown under the text.
 */
export type Step = { text: string; shot?: string; marks?: string[]; numbered?: boolean; code?: string };

export type Block =
  | { t: "p"; text: string }
  | { t: "h2"; text: string }
  | { t: "list"; items: string[] }
  | { t: "steps"; steps: Step[] }
  | { t: "warn"; text: string }
  | { t: "code"; text: string }
  | { t: "video"; src: string; length?: string }
  | { t: "links"; items: { slug: string; label?: string }[] };

export type GhidPage = { slug: string; title: string; lead: string; blocks: Block[] };
export type GhidGroup = { title: string; pages: GhidPage[] };

/** box is in percent: left, top, width, height. */
export type ShotData = { w: number; h: number; alt: string; marks: { key: string; box: [number, number, number, number] }[] };
