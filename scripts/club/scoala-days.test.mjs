import { test } from "node:test";
import assert from "node:assert/strict";
import { register } from "node:module";

const canStripTypes = Boolean(process.features?.typescript);
// occurrences-to-calendar.ts imports through the "@/" alias: map it to src/ for this process.
if (canStripTypes) {
  const root = new URL("../../src/", import.meta.url).href;
  register(
    "data:text/javascript," +
      encodeURIComponent(
        `export async function resolve(spec, ctx, next) {
          if (spec.startsWith("@/")) {
            const base = ${JSON.stringify(root)} + spec.slice(2);
            return next(/\\.[a-z]+$/.test(base) ? base : base + ".ts", ctx);
          }
          return next(spec, ctx);
        }`,
      ),
  );
}
const lib = canStripTypes ? await import("../../src/utils/scoala-days.ts") : {};
const conv = canStripTypes ? await import("../../src/utils/occurrences-to-calendar.ts") : {};
const it = canStripTypes ? test : (name) => test.skip(name);

const occ = (over) => ({
  eventId: 1, title: "Intermediari Bronze", type: "scoala", label: null, color: null, order: 0, date: "2026-11-14", startTime: "11:00", endTime: "11:50",
  status: "scheduled", cancelReason: null, state: "curs", note: null, groupName: "Intermediari Bronze", ...over,
});

it("merges a day's Școala dates into one tile with the time span (W21)", () => {
  const out = lib.mergeScoalaDays([occ({ startTime: "10:00", endTime: "10:50" }), occ({}), occ({ startTime: "09:00", endTime: "09:50", eventId: 3 })]);
  assert.equal(out.length, 1);
  assert.deepEqual([out[0].title, out[0].startTime, out[0].endTime, out[0].state, out[0].status], ["Școala de patinaj", "09:00", "11:50", "curs", "scheduled"]);
});

it("is curs while any group holds class, anulat when every date is cancelled, liber when every date is in a break", () => {
  const cancel = occ({ status: "cancelled", cancelReason: "exception", state: "anulat", note: "Competiție" });
  const brk = occ({ status: "cancelled", cancelReason: "blackout", note: "Vacanța de iarnă" });
  assert.equal(lib.mergeScoalaDays([cancel, occ({})])[0].state, "curs");
  assert.deepEqual([lib.mergeScoalaDays([cancel, brk])[0].state, lib.mergeScoalaDays([cancel, brk])[0].note], ["anulat", "Competiție"]);
  const liber = lib.mergeScoalaDays([brk, occ({ status: "cancelled", cancelReason: "blackout", note: "Vacanța de iarnă" })])[0];
  assert.deepEqual([liber.state, liber.status, liber.cancelReason, liber.note], ["liber", "cancelled", "blackout", "Vacanța de iarnă"]);
});

it("keeps days apart, sorted, and leaves a single old series as it was", () => {
  const out = lib.mergeScoalaDays([occ({ date: "2026-11-15" }), occ({})]);
  assert.deepEqual(out.map((o) => o.date), ["2026-11-14", "2026-11-15"]);
  const old = occ({ title: "Școala de patinaj", groupName: null, status: "cancelled", cancelReason: "exception", state: "liber", note: "Vacanța de toamnă" });
  assert.deepEqual([lib.mergeScoalaDays([old])[0].state, lib.mergeScoalaDays([old])[0].note], ["anulat", "Vacanța de toamnă"]);
});

it("takes the time span and description only from the dates that hold class", () => {
  const cancelled = occ({ startTime: "09:00", endTime: "09:50", status: "cancelled", cancelReason: "exception", state: "anulat", description: "Grupa anulată", note: "Boală" });
  const held = occ({ startTime: "10:00", endTime: "10:50", description: "Grupa activă" });
  const [day] = lib.mergeScoalaDays([cancelled, held]);
  assert.deepEqual([day.state, day.startTime, day.endTime, day.description], ["curs", "10:00", "10:50", "Grupa activă"]);
});

it("occurrencesToCalendarEvents emits one Școala tile per day and names Club tiles after their group", () => {
  const club = { ...occ({ eventId: 9, type: "curs", title: "Club", groupName: "Avansați", state: null, date: "2026-11-16", startTime: "17:00", endTime: "18:00" }) };
  const events = conv.occurrencesToCalendarEvents([
    occ({ startTime: "10:00", endTime: "10:50" }),
    occ({ eventId: 3, startTime: "11:00", endTime: "11:50" }),
    club,
  ]);
  const tiles = events.filter((e) => e.type === "scoala");
  assert.equal(tiles.length, 1);
  assert.deepEqual([tiles[0].title, tiles[0].timeSlot, tiles[0].state], ["Școala de patinaj", "10:00 - 11:50", "curs"]);
  assert.equal(events.filter((e) => e.type === "curs").length, 1, "one weekend row for the day");
  assert.equal(events.find((e) => e.type === "curs-special").title, "Avansați");
});
