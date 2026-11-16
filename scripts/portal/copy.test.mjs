import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

// CI runs Node 20, which cannot import .ts files: skip there instead of failing.
const canStripTypes = Boolean(process.features?.typescript);
const copy = canStripTypes ? await import("../../src/lib/portal/copy.ts") : {};
const sportiv = canStripTypes ? await import("../../src/lib/portal/copy-sportiv.ts") : {};
const shared = canStripTypes ? await import("../../src/lib/portal/copy-shared.ts") : {};
const read = (f) => readFileSync(f, "utf8");
const it = canStripTypes ? test : (name) => test.skip(name);

const BANNED = /[–—·“”„]|Email|\p{Extended_Pictographic}/u;

function strings(value, path, out) {
  if (typeof value === "string") out.push([path, value]);
  else if (typeof value === "function") {
    out.push([`${path}("X")`, String(value("X", "X", "X"))]);
    out.push([`${path}(3)`, String(value(3, 3, 3))]);
  } else if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value)) strings(v, `${path}.${k}`, out);
  }
}

it("keeps every coach string free of banned characters", () => {
  const all = [];
  for (const [name, area] of Object.entries(copy)) strings(area, name, all);
  assert.ok(all.length > 100);
  for (const [path, text] of all) assert.ok(!BANNED.test(text), `${path}: ${text}`);
});

it("agrees counts in Romanian", () => {
  assert.equal(copy.AZI.groupLine(1), "grup, 1 copil");
  assert.equal(copy.AZI.groupLine(12), "grup, 12 copii");
  assert.equal(copy.AZI.groupLine(20), "grup, 20 de copii");
  assert.equal(copy.ADD_ATHLETE.submit(1), "Adaugă 1 sportiv");
  assert.equal(copy.PRESENCE.presentCount(10), "10 prezenți");
  assert.equal(copy.HISTORY.lessons(1), "lecție individuală");
  assert.equal(copy.HISTORY.lessons(2), "lecții individuale");
  assert.equal(copy.HISTORY.lessons(20), "de lecții individuale");
  assert.equal(copy.HISTORY.statLabel(1, "noiembrie"), "ședință de grup în noiembrie");
  assert.equal(copy.HISTORY.statLabel(12, "noiembrie"), "ședințe de grup în noiembrie");
  assert.equal(copy.HISTORY.hours("1"), "oră");
  assert.equal(copy.HISTORY.hours("2,8"), "ore");
  assert.equal(copy.HISTORY.hours("24"), "de ore");
  assert.equal(copy.HISTORY.presentSub(1), "grup, 1 prezent");
  assert.equal(copy.HISTORY.standInSub(10), "înlocuitor, 10 prezenți");
});

it("names the training copy", () => {
  assert.equal(copy.AZI.addTraining, "+ Adaugă antrenament");
  assert.ok(!("publicHint" in copy.PROGRAM));
  assert.equal(copy.TRAINING.title, "Antrenament nou");
  assert.ok(!("summaryOnce" in copy.TRAINING));
  const curly = /[\u2014\u2013\u00B7\u201E\u201C\u201D\u2018\u2019]/;
  const all = [];
  for (const [name, area] of Object.entries({ TRAINING: copy.TRAINING, PROGRAM: copy.PROGRAM, LESSON: copy.LESSON, AZI: copy.AZI })) strings(area, name, all);
  for (const [path, text] of all) assert.ok(!curly.test(text), `${path}: ${text}`);
});

it("keeps the sportiv and shared strings short and free of banned characters", () => {
  const all = [];
  for (const [name, area] of Object.entries(sportiv)) strings(area, `sportiv.${name}`, all);
  for (const [name, area] of Object.entries(shared)) strings(area, `shared.${name}`, all);
  assert.ok(all.length > 100);
  for (const [path, text] of all) assert.ok(!BANNED.test(text), `${path}: ${text}`);
  assert.ok(sportiv.HOME.lastCompetition.stale("X").includes("X"));
  assert.ok(sportiv.CAL.sub("X").includes("X"));
  assert.ok(sportiv.HOME.promotion.text("X").includes("X"));
});

it("uses the short sportiv and shared forms", () => {
  assert.equal(sportiv.COMP_DOWN, "Rezultate indisponibile.");
  assert.equal(sportiv.NOTICES.dismissFailed, "Nu s-a putut închide.");
  assert.equal(sportiv.HOME.lastCompetition.stale("5 noi"), "Actualizat 5 noi.");
  assert.equal(sportiv.HOME.promotion.text("Ana"), "Felicitări, Ana!");
  assert.equal(sportiv.CAL.sub("Ana Ionescu"), "Ana Ionescu");
  assert.equal(sportiv.CAL.addToPhone, "Adaugă în telefon");
  assert.equal(sportiv.CAL.emptyDay, "Nicio ședință.");
  assert.equal(sportiv.PATH.next.hint, "Decide antrenorul.");
  assert.equal(sportiv.COMP.detail.official, "Clasament oficial ›");
  assert.equal(sportiv.MONEY.owed.payAtClub, "Plata la club.");
  assert.equal(shared.INVITE.expired, "Invitația a expirat. Cere una nouă.");
  assert.equal(shared.KIT.copied, "Copiat.");
  assert.equal(shared.KIT.copyFailed, "Nu s-a putut copia.");
  assert.ok(!("sub" in sportiv.ACCOUNT.picker));
  assert.ok(!("text" in copy.NOT_FOUND));
});

it("renders rules as icons with the words in a tooltip, and no paragraph under the 404 title or the picker", () => {
  const S = "src/app/(sportiv)/sportiv";
  assert.match(read(`${S}/(app)/[athleteId]/plati/_parts/TicketSheet.tsx`), /<HintIcon icon="info" text=\{MONEY\.sheet\.mayExtend\}/);
  assert.equal(sportiv.MONEY.sheet.mayExtend, "Se poate prelungi dacă școala are weekend liber.");
  assert.match(read(`${S}/(app)/setari/_parts/AccountRows.tsx`), /<HintIcon icon="lock" text=\{SETARI\.me\.emailNote\}/);
  assert.match(read(`${S}/(app)/setari/sportiv/[athleteId]/page.tsx`), /<HintIcon icon="lock" text=\{D\.note\}/);
  assert.equal(sportiv.SETARI.me.emailNote, "Îl schimbă clubul");
  assert.equal(sportiv.SETARI.athleteData.note, "Le schimbă clubul");
  assert.ok(!/NOT_FOUND\.text/.test(read(`${S}/not-found.tsx`)));
  assert.ok(!/NOT_FOUND\.text/.test(read("src/app/(antrenor)/antrenor/not-found.tsx")));
  assert.ok(!/picker\.sub/.test(read(`${S}/(app)/page.tsx`)));
});

it("shows a failed notice dismiss once, as a toast only", () => {
  const src = read("src/app/(sportiv)/sportiv/(app)/_ui/NoticesPanel.tsx");
  assert.equal(src.match(/NOTICES\.dismissFailed/g).length, 1);
  assert.ok(!/role="status"/.test(src));
});

it("uses the short coach forms", () => {
  assert.equal(copy.PRESENCE.archived, "Arhivată");
  assert.equal(copy.CLUB_TODAY.none, "Niciun antrenament azi.");
  assert.ok(!("hint" in copy.CLUB_TODAY));
  assert.equal(copy.CALENDAR.empty, "Nicio ședință.");
  assert.ok(!("sub" in copy.CALENDAR) && !("sub" in copy.COMPETITIONS));
  assert.equal(copy.PROGRAM.nothingThisMonth, "Nimic programat.");
  assert.equal(copy.CARD.copied, "Copiat.");
  assert.equal(copy.CARD.copyFailed, "Nu s-a putut copia.");
  assert.equal(copy.COMPETITIONS.unavailable, "Rezultate indisponibile.");
  assert.equal(copy.PROGRAM.toasts.dateCancelled("marți"), "Ședința din marți anulată.");
  assert.equal(copy.PROGRAM.toasts.dateMoved("marți"), "Ședința din marți mutată.");
  assert.equal(copy.PROGRAM.toasts.dateKept("marți"), "Ședința din marți se ține.");
  assert.equal(copy.PROGRAM.toasts.dateRemoved("marți"), "Ședința din marți ștearsă.");
  assert.equal(copy.TRAINING.scopeFollowingSub("3 nov"), "Din 3 nov până la sfârșitul seriei.");
  assert.equal(copy.TRAINING.scopeFollowingDeleteSub("3 nov"), "Din 3 nov până la sfârșitul seriei. Cele ținute sau plătite rămân.");
  assert.equal(copy.TRAINING.scopeFollowingEndsSub(), "Următoarele se șterg. Aceasta nu se mai repetă.");
  assert.ok(!("scopeOneSub" in copy.TRAINING) && !("monthlyNote" in copy.TRAINING));
  assert.equal(copy.GROUP.otherCoach, "Grupa altui antrenor.");
  assert.equal(copy.EDIT_GROUP.moveText("Grupa 2"), "Prezențele rămân în Grupa 2.");
  assert.equal(copy.EDIT_GROUP.removeText, "Prezențele rămân.");
  assert.equal(copy.EDIT_GROUP.noOtherGroup, "Nu ai altă grupă.");
  assert.equal(copy.PRESENCE.future, "Din ziua antrenamentului.");
  assert.equal(copy.PRESENCE.reactivate.text("Ana"), "Îl reactivezi pe Ana?");
  assert.ok(!("willAppear" in copy.PRESENCE) && !("optional" in copy.NEW_ATHLETE));
  assert.equal(copy.PROGRAM.changeSub("R"), "R. Datele trecute rămân.");
  assert.equal(copy.PROGRAM.endText, "Ședințele și prezențele de până atunci rămân.");
  assert.ok(!("showingNext" in copy.PROGRAM));
  assert.ok(!("settingsSub" in copy.PROFILE) && !("securitySub" in copy.PROFILE));
  assert.equal(copy.SETTINGS.adminNote, "Le schimbă administratorul.");
});

it("renders the coach archived and school-program rules as lock icons", () => {
  const C = "src/app/(antrenor)/antrenor/(app)";
  assert.match(read(`${C}/prezenta/PresenceView.tsx`), /<HintIcon icon="lock" text=\{PRESENCE\.archived\}/);
  assert.match(read(`${C}/lectie/[id]/LessonView.tsx`), /<HintIcon icon="lock" text=\{PRESENCE\.archived\}/);
  assert.match(read(`${C}/grupe/[id]/_program/ProgramTab.tsx`), /<HintIcon icon="lock" text=\{PROGRAM\.schoolLocked\}/);
  assert.equal(copy.PROGRAM.schoolLocked, "Îl schimbă administratorul");
});
