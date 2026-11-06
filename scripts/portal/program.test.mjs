import { test } from "node:test";
import assert from "node:assert/strict";

const canStripTypes = Boolean(process.features?.typescript);
const p = canStripTypes ? await import("../../src/lib/portal/program.ts") : {};
const it = canStripTypes ? test : (name) => test.skip(name);

const occ = (extra = {}) => ({
  eventId: 7, documentId: "ev1", title: "Avansati", type: "curs", label: null, color: null, order: 0, date: "2026-11-05",
  startTime: "18:15", endTime: "19:15", endsNextDay: false, endDate: "2026-11-05", status: "scheduled", cancelReason: null,
  groupId: "g", groupName: "Avansati", oneOff: false, originalDate: null, originalStartTime: null, ...extra,
});

it("dateState reads past, today, pause, cancelled and moved", () => {
  assert.equal(p.dateState(occ({ date: "2026-11-04" }), "2026-11-05"), "past");
  assert.equal(p.dateState(occ(), "2026-11-05"), "open");
  assert.equal(p.dateState(occ({ date: "2026-11-10", status: "cancelled", cancelReason: "blackout", note: "Vacanta" }), "2026-11-05"), "pause");
  assert.equal(p.dateState(occ({ date: "2026-11-10", status: "cancelled", cancelReason: "exception" }), "2026-11-05"), "cancelled");
  assert.equal(p.dateState(occ({ date: "2026-11-11", status: "override", originalDate: "2026-11-10" }), "2026-11-05"), "moved");
});

it("a past pause date is past", () => {
  assert.equal(p.dateState(occ({ date: "2026-11-01", status: "cancelled", cancelReason: "blackout" }), "2026-11-05"), "past");
});

it("eventDocumentId is the documentId, never the numeric id", () => {
  assert.equal(p.eventDocumentId(occ()), "ev1");
  assert.equal(p.eventDocumentId(occ({ documentId: undefined })), null);
});

it("dateKey is the series date of a moved date", () => {
  assert.equal(p.dateKey(occ({ originalDate: "2026-11-10", date: "2026-11-11" })), "2026-11-10");
  assert.equal(p.dateKey(occ()), "2026-11-05");
});
