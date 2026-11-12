// The sportiv half of the mock portal (registered from mock-portal.mjs): every route of backend 04-sportiv.ts.
// State switches (POST /__mock/state): cutAccount, lostAthlete (an athlete id the holder no longer holds), skateDown,
// noCompetitions, promotion (true or an athlete id), inactive (true or an athlete id), emptyHistory, nothingOwed, noDocument,
// unlisted (an athlete id that is not in the picker, `inPicker: false`).
import {
  ADULT_ID, ICS_BODY, PDF_BODY, SPORTIV_ACCOUNTS, SPORTIV_ATHLETES, athleteRow, competitionOf, competitionsOf, historyOf, homeOf, moneyOf, pathOf, profileOf,
} from "./sportiv-fixtures.mjs";
import { FROZEN_TODAY, addDays } from "./portal-fixtures.mjs";

const LOST = "Nu mai ai acces la acest sportiv.";

export const sportivAccount = (email) => SPORTIV_ACCOUNTS[email] ?? null;

/** h: { ok, club, send, state() } from mock-portal. Returns [method, regexp, handler] rows for /api/portal/sportiv. */
export function sportivRoutes(h) {
  const holds = (sess, id) => Boolean(SPORTIV_ACCOUNTS[sess.email]?.athletes.includes(id)) && h.state().lostAthlete !== id;
  // An athlete route: refuses (403 ClubAdminError) an id the holder does not hold, else runs `fn(athleteId, ctx)`.
  const mine = (fn) => (ctx) => (SPORTIV_ATHLETES[ctx.params[0]] && holds(ctx.sess, ctx.params[0]) ? fn(ctx.params[0], ctx) : h.club(ctx.res, 403, LOST));
  const data = (fn) => mine((id, { res, query, params }) => h.ok(res, fn(id, h.state(), query, params)));
  const A = "^\\/athletes\\/([A-Za-z0-9]+)";
  return [
    ["GET", /^\/me$/, ({ res, sess }) => {
      const a = SPORTIV_ACCOUNTS[sess.email];
      h.ok(res, { email: sess.email, name: a.name, phone: a.phone, hasPassword: Boolean(a.password), google: a.google, passwordChangedAt: null, notifySchedule: true, devices: 1 });
    }],
    ["PUT", /^\/me$/, ({ res }) => h.ok(res, { toast: "Salvat." })],
    ["PUT", /^\/me\/notifications$/, ({ res }) => h.ok(res, { toast: "Salvat." })],
    ["POST", /^\/me\/password$/, ({ res }) => h.ok(res, { toast: "Parola a fost schimbată." })],
    ["GET", /^\/me\/devices$/, ({ res }) => h.ok(res, [{ id: "devsportiv1", label: "Chrome pe Mac", lastSeenAt: `${FROZEN_TODAY}T09:00:00.000Z`, current: true, twoFactorUntil: null }])],
    ["DELETE", /^\/me\/devices\/([A-Za-z0-9]+)$/, ({ res }) => h.ok(res, { revokedCurrent: false })],
    ["GET", /^\/athletes$/, ({ res, sess }) => {
      const state = h.state();
      const ids = SPORTIV_ACCOUNTS[sess.email].athletes.filter((id) => state.lostAthlete !== id);
      h.ok(res, { athletes: ids.map((id) => athleteRow(id, state)) });
    }],
    ["GET", new RegExp(`${A}\\/home$`), data((id, state) => homeOf(id, state))],
    ["POST", new RegExp(`${A}\\/promotion\\/seen$`), mine((_id, { res }) => h.ok(res, {}))],
    ["GET", new RegExp(`${A}\\/profile$`), data((id) => profileOf(id))],
    ["GET", new RegExp(`${A}\\/history$`), data((id, state, query) => historyOf(id, state, Math.max(1, Number(query.get("page") ?? 1))))],
    ["GET", new RegExp(`${A}\\/calendar\\.ics$`), mine((id, { res }) => {
      res.writeHead(200, {
        "content-type": "text/calendar; charset=utf-8",
        "content-disposition": `attachment; filename="edusport-${SPORTIV_ATHLETES[id].firstName.toLowerCase()}.ics"`,
        "cache-control": "private, no-store",
      });
      res.end(ICS_BODY);
    })],
    ["GET", new RegExp(`${A}\\/calendar$`), data((id, _state, query) => {
      const month = query.get("month") ?? FROZEN_TODAY.slice(0, 7);
      const a = SPORTIV_ATHLETES[id];
      const items = [0, 2, 7].map((n) => addDays(FROZEN_TODAY, n)).filter((d) => d.startsWith(month)).map((date) => ({
        date, startTime: "17:30", endTime: "18:30", kind: "grupa", title: a.groupName, location: a.level.location, coaches: [a.coach], cancelled: false, note: null,
      }));
      return { month, prevMonth: "2026-10", nextMonth: "2026-12", items };
    })],
    ["GET", new RegExp(`${A}\\/competitions$`), data((id, state, query) => competitionsOf(id, state, query))],
    ["GET", new RegExp(`${A}\\/competitions\\/([A-Za-z0-9_-]+)$`), data((_id, state) => competitionOf(state))],
    ["GET", new RegExp(`${A}\\/path$`), data((id) => pathOf(id))],
    ["GET", new RegExp(`${A}\\/money$`), data((id, state) => moneyOf(id, state))],
    ["GET", new RegExp(`${A}\\/payments$`), data(() => ({ page: 1, pageSize: 20, total: 1, rows: [{ what: "Abonament A-0124", paidOn: addDays(FROZEN_TODAY, -30), method: "numerar", amount: 400 }] }))],
    ["GET", new RegExp(`${A}\\/subscriptions$`), data((id) => {
      const a = SPORTIV_ATHLETES[id].abonament;
      return { active: a ? { code: a.code, itemName: "Abonament 8 ședințe", startsOn: addDays(FROZEN_TODAY, -30), validUntil: addDays(FROZEN_TODAY, 30), slots: a.slots, used: [], left: a.slots - a.next + 1 } : null, earlier: [] };
    })],
    ["GET", new RegExp(`${A}\\/documents\\/acord$`), mine((_id, { res }) => {
      if (h.state().noDocument) return h.club(res, 404, "Nu a fost găsit.");
      res.writeHead(200, { "content-type": "application/pdf", "content-disposition": "attachment; filename=\"fisa-inscriere.pdf\"", "cache-control": "private, no-store" });
      res.end(PDF_BODY);
    })],
  ];
}

export { ADULT_ID };
