// Pure helpers of the score sheet (judges' protocol of one result). No React, no coach imports.
import { SHEET } from "./copy.ts";
import { pointsText } from "./format.ts";

export type SheetSegment = {
  name: string;
  placement: number | null;
  tss: number | null;
  tes: number | null;
  pcs: number | null;
  deductions: number | null;
  elements: { order: number; name: string; baseValue: number | null; goe: number | null; judges: (number | null)[]; score: number | null; info: string | null; bonus: boolean }[];
  components: { name: string; factor: number | null; judges: (number | null)[]; score: number | null }[];
};

/** "J1" ... "Jn", one per judge column. */
export function judgeLabels(n: number): string[] {
  return Array.from({ length: Math.max(0, n) }, (_, i) => `J${i + 1}`);
}

/** The judge columns a segment needs: the longest panel over its elements and components. */
export function judgeCount(seg: Pick<SheetSegment, "elements" | "components">): number {
  return Math.max(0, ...seg.elements.map((e) => e.judges.length), ...seg.components.map((c) => c.judges.length));
}

/** TSS, TES, PCS, deductions in that order, a missing value skipped. */
export function segmentTotals(seg: Pick<SheetSegment, "tss" | "tes" | "pcs" | "deductions">): { label: string; value: number | null }[] {
  return [
    { label: SHEET.tss, value: seg.tss },
    { label: SHEET.tes, value: seg.tes },
    { label: SHEET.pcs, value: seg.pcs },
    { label: SHEET.deductions, value: seg.deductions },
  ].filter((t) => t.value !== null);
}

/** A result opens into a sheet only when the source has one. */
export function isExpandable(row: { resultId: string | null }): boolean {
  return row.resultId !== null;
}

/** A score: two decimals, decimal comma; a missing one is empty. */
export function scoreText(value: number | null): string {
  return value === null ? "" : pointsText(value);
}

/** One element judge mark: a whole GOE mark as it is, anything else as a score. */
export function markText(value: number | null): string {
  if (value === null) return "";
  return Number.isInteger(value) ? String(value) : pointsText(value);
}

/** The flags of an element: its execution flag, then "x" for a bonus element. */
export function infoText(e: { info: string | null; bonus: boolean }): string {
  return [e.info, e.bonus ? "x" : null].filter((p): p is string => !!p).join(" ");
}
