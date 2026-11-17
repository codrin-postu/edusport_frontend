import { test } from "node:test";
import assert from "node:assert/strict";

// CI runs Node 20, which cannot import .ts files: skip there instead of failing.
const canStripTypes = Boolean(process.features?.typescript);
const copy = canStripTypes ? await import("../../src/lib/portal/copy.ts") : {};
const sportiv = canStripTypes ? await import("../../src/lib/portal/copy-sportiv.ts") : {};
const shared = canStripTypes ? await import("../../src/lib/portal/copy-shared.ts") : {};
const it = canStripTypes ? test : (name) => test.skip(name);

// These three are compared with === against messages the backend sends. The same literals are pinned in the
// backend src/club/portal/__tests__/copy.test.ts: change them on both sides together.
it("pins the strings the server matches", () => {
  assert.equal(copy.PRESENCE.archived, "Arhivată");
  assert.equal(shared.STATES.noAccess, "Nu mai ai acces la această grupă.");
  assert.equal(sportiv.LOST_ATHLETE, "Nu mai ai acces la acest sportiv.");
});
