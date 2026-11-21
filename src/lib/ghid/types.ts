// Content model of the staff wiki. Types only: loaded by Node tests and by the pages.
export type Step = { text: string; shot?: string };

export type Block =
  | { t: "p"; text: string }
  | { t: "h2"; text: string }
  | { t: "list"; items: string[] }
  | { t: "steps"; steps: Step[] }
  | { t: "warn"; text: string }
  | { t: "video"; src: string; length?: string }
  | { t: "links"; items: { slug: string; label?: string }[] };

export type GhidPage = { slug: string; title: string; lead: string; blocks: Block[] };
export type GhidTopic = { title: string; pages: GhidPage[] };
export type GhidGroup = { title: string; topics: GhidTopic[] };

/** box is in percent: left, top, width, height. */
export type ShotData = { w: number; h: number; alt: string; marks: { n: number; box: [number, number, number, number] }[] };
