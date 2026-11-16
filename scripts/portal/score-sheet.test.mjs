import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const canStripTypes = Boolean(process.features?.typescript);
const s = canStripTypes ? await import("../../src/lib/portal/score-sheet.ts") : {};
const it = canStripTypes ? test : (name) => test.skip(name);

const read = (p) => readFileSync(new URL(`../../${p}`, import.meta.url), "utf8");

it("labels the judge columns", () => {
  assert.deepEqual(s.judgeLabels(3), ["J1", "J2", "J3"]);
  assert.deepEqual(s.judgeLabels(0), []);
});

it("counts the judge columns as the longest panel", () => {
  const marks = (n) => Array.from({ length: n }, () => 1);
  const seg = { elements: [{ judges: marks(5) }, { judges: marks(3) }], components: [{ judges: marks(7) }] };
  assert.equal(s.judgeCount(seg), 7);
  assert.equal(s.judgeCount({ elements: [], components: [] }), 0);
});

it("lists the totals in order and skips the missing ones", () => {
  assert.deepEqual(s.segmentTotals({ tss: 90.5, tes: 50, pcs: 41.5, deductions: 1 }).map((t) => t.label), ["TSS", "TES", "PCS", "Deduceri"]);
  assert.deepEqual(s.segmentTotals({ tss: 90.5, tes: null, pcs: 41.5, deductions: null }), [{ label: "TSS", value: 90.5 }, { label: "PCS", value: 41.5 }]);
});

it("a result is expandable only with a result id", () => {
  assert.equal(s.isExpandable({ resultId: null }), false);
  assert.equal(s.isExpandable({ resultId: "7" }), true);
});

it("writes scores with two decimals and a comma", () => {
  assert.equal(s.scoreText(4.2), "4,20");
  assert.equal(s.scoreText(null), "");
  assert.equal(s.markText(-2), "-2");
  assert.equal(s.markText(7.5), "7,50");
  assert.equal(s.infoText({ info: "<", bonus: true }), "< x");
  assert.equal(s.infoText({ info: null, bonus: false }), "");
});

const SHEET_SRC = "src/app/_portal/ui/ScoreSheet.tsx";

it("ScoreSheet renders an elements table, a components table and totals, the judges scrolling sideways", () => {
  const src = read(SHEET_SRC);
  for (const k of ["SHEET.order", "SHEET.element", "SHEET.info", "SHEET.baseValue", "SHEET.goe", "SHEET.score", "SHEET.component", "SHEET.factor", "segmentTotals", "judgeLabels", "judgeCount"]) {
    assert.ok(src.includes(k), k);
  }
  assert.equal((src.match(/<table/g) ?? []).length, 2);
  assert.equal((src.match(/overflow-x-auto/g) ?? []).length, 2);
  assert.ok(!/import .*(coach|antrenor)/i.test(src), "no coach-only imports");
  assert.ok(!/rounded/.test(src), "no rounded shapes");
});

it("CollapseHeader is one button with aria-expanded and a chevron", () => {
  const src = read("src/app/_portal/ui/CollapseHeader.tsx");
  assert.ok(src.includes("aria-expanded"));
  assert.ok(src.includes("portal-chevron-down"));
  assert.ok(src.includes("rotate-180"));
  assert.ok(src.includes("<button"));
});

function files(dir) {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? files(p) : [p];
  });
}

it("every collapsible of the coach portal uses CollapseHeader, no native details or hand-made aria-expanded", () => {
  const root = new URL("../../", import.meta.url).pathname;
  for (const p of ["src/app/_portal/ui/CompetitionCard.tsx", "src/app/(antrenor)/antrenor/(app)/sportiv/[id]/ResultRow.tsx"]) {
    assert.ok(read(p).includes("<CollapseHeader"), p);
  }
  // Anything else under the coach app or its shared kit that built a collapsible by hand would carry one of these.
  const all = [...files(join(root, "src/app/(antrenor)")), ...files(join(root, "src/app/_portal/ui"))].filter((f) => /\.tsx$/.test(f) && !f.includes("kit-preview"));
  for (const f of all) {
    if (f.endsWith("CollapseHeader.tsx") || f.endsWith("_portal/ui/SessionRow.tsx")) continue; // SessionRow is the sportiv app's
    const src = readFileSync(f, "utf8");
    assert.ok(!src.includes("aria-expanded"), `${f} builds its own aria-expanded header`);
    assert.ok(!src.includes("<details"), `${f} uses a native details`);
  }
});

it("the score sheet files carry no description text", () => {
  for (const p of [SHEET_SRC, "src/app/_portal/ui/CollapseHeader.tsx", "src/app/(antrenor)/antrenor/(app)/sportiv/[id]/ResultRow.tsx"]) {
    const src = read(p);
    assert.ok(!/<p[ >]/.test(src.replace(/<p className="[^"]*">\{COMPETITIONS\.unavailable\}<\/p>/, "")), p);
  }
});
