// The sportiv half of the mock portal (registered from mock-portal.mjs): every route of backend 04-sportiv.ts.
// State switches (POST /__mock/state): athletesDown (the athletes list answers 500), listPerformance (athlete ids the athletes list marks as performance), cutAccount, lostAthlete (an athlete id the holder no longer holds), skateDown, stale (the Acasă last competition is stale),
// noCompetitions, noOfficialUrl, promotion (true or an athlete id), inactive (true or an athlete id), emptyHistory, nothingOwed, noDocument, noPathNow,
// noUpcoming, noPrevMonth, noAthletes (the athletes list is empty), documentFile (the PDF file name; null = no Content-Disposition), documentForbidden (a 403 that is not the lost-access one),
// moneyMismatch, advance (a number), manyPayments, noPassword (a Google only account), notifySchedule (set by PUT me/notifications), unlisted (an athlete id that is not in the picker, `inPicker: false`), noticesDismissed (per account e-mail, the dismissed notice ids; reset with the state).
import {
  ADULT_ID, ICS_BODY, PDF_BODY, SPORTIV_ACCOUNTS, SPORTIV_ATHLETES, athleteRow, competitionOf, competitionsOf, historyOf, homeOf, moneyOf, noticesOf, pathOf, paymentsOf, profileOf, subscriptionsOf,
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
  const open = (email) => {
    const gone = (h.state().noticesDismissed ??= {})[email] ??= [];
    return noticesOf(email).filter((n) => !gone.includes(n.id));
  };
  const A = "^\\/athletes\\/([A-Za-z0-9]+)";
  return [
    ["GET", /^\/me$/, ({ res, sess }) => {
      const a = SPORTIV_ACCOUNTS[sess.email];
      h.ok(res, { email: sess.email, name: a.name, phone: a.phone, hasPassword: Boolean(a.password) && !h.state().noPassword, google: a.google, passwordChangedAt: h.state().noPassword ? null : "2026-08-05T09:00:00.000Z", notifySchedule: h.state().notifySchedule !== false, devices: 2 });
    }],
    ["PUT", /^\/me$/, ({ res }) => h.ok(res, { toast: "Salvat." })],
    ["PUT", /^\/me\/notifications$/, ({ res, body }) => { h.state().notifySchedule = body.schedule; h.ok(res, { toast: "Salvat." }); }],
    ["POST", /^\/me\/password$/, ({ res }) => h.ok(res, { toast: "Parola a fost schimbată." })],
    ["GET", /^\/me\/devices$/, ({ res }) => h.ok(res, [
      { id: "devsportiv1", label: "Chrome pe Mac", lastSeenAt: `${FROZEN_TODAY}T09:00:00.000Z`, current: true, twoFactorUntil: null },
      { id: "devsportiv2", label: "Safari pe iPhone", lastSeenAt: `${addDays(FROZEN_TODAY, -2)}T09:00:00.000Z`, current: false, twoFactorUntil: null },
    ])],
    ["DELETE", /^\/me\/devices\/([A-Za-z0-9]+)$/, ({ res }) => h.ok(res, { revokedCurrent: false })],
    ["GET", /^\/me\/notices$/, ({ res, sess }) => { const notices = open(sess.email); h.ok(res, { count: notices.length, notices }); }],
    ["POST", /^\/me\/notices\/([A-Za-z0-9]+)\/dismiss$/, ({ res, sess, params }) => {
      (h.state().noticesDismissed ??= {})[sess.email] = [...(h.state().noticesDismissed[sess.email] ?? []), params[0]];
      h.ok(res, { count: open(sess.email).length });
    }],
    ["GET", /^\/athletes$/, ({ res, sess }) => {
      const state = h.state();
      if (state.athletesDown) return h.club(res, 500, "Eroare.");
      const ids = state.noAthletes ? [] : SPORTIV_ACCOUNTS[sess.email].athletes.filter((id) => state.lostAthlete !== id);
      h.ok(res, { athletes: ids.map((id) => athleteRow(id, state)) });
    }],
    ["GET", new RegExp(`${A}\\/home$`), data((id, state) => homeOf(id, state))],
    ["POST", new RegExp(`${A}\\/promotion\\/seen$`), mine((id, { res }) => { if (h.state().promotion === true || h.state().promotion === id) h.state().promotion = false; h.ok(res, {}); })],
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
      const group = (n, over = {}) => ({
        date: addDays(FROZEN_TODAY, n), startTime: "17:30", endTime: "18:30", kind: "grupa", title: a.groupName, location: a.level.location, coaches: [a.coach], cancelled: false, reason: null, movedFrom: null, ...over,
      });
      const all = [
        group(0), group(2, { cancelled: true, reason: "Vacanță" }), group(4, { startTime: "18:00", endTime: "19:00", movedFrom: { date: addDays(FROZEN_TODAY, 3), startTime: "17:30" } }), group(7),
        group(7, { startTime: "16:00", endTime: "16:45", kind: "individual", title: "Lecție individuală", coaches: ["Andrei Pop"] }),
        group(15, { startTime: null, endTime: null, kind: "concurs", title: "Cupa României 2026", location: "București", coaches: [] }),
      ];
      const items = all.filter((i) => i.date.startsWith(month));
      return { month, prevMonth: h.state().noPrevMonth ? null : "2026-10", nextMonth: month >= "2026-12" ? null : "2026-12", items };
    })],
    ["GET", new RegExp(`${A}\\/competitions$`), data((id, state, query) => competitionsOf(id, state, query))],
    ["GET", new RegExp(`${A}\\/competitions\\/([A-Za-z0-9_-]+)$`), mine((id, { res, params }) => {
      const body = competitionOf(id, h.state(), params[1]);
      return body === null ? h.club(res, 404, "Nu a fost găsit.") : h.ok(res, body);
    })],
    ["GET", new RegExp(`${A}\\/path$`), data((id, state) => pathOf(id, state))],
    ["GET", new RegExp(`${A}\\/money$`), data((id, state) => moneyOf(id, state))],
    ["GET", new RegExp(`${A}\\/payments$`), data((_id, state, query) => paymentsOf(state, Math.max(1, Number(query.get("page") ?? 1))))],
    ["GET", new RegExp(`${A}\\/subscriptions$`), data((id) => subscriptionsOf(id))],
    ["GET", new RegExp(`${A}\\/documents\\/acord$`), mine((_id, { res }) => {
      if (h.state().noDocument) return h.club(res, 404, "Nu a fost găsit.");
      if (h.state().documentForbidden) return h.club(res, 403, "Nu ai voie.");
      const file = h.state().documentFile === undefined ? "fisa-inscriere.pdf" : h.state().documentFile;
      res.writeHead(200, { "content-type": "application/pdf", ...(file === null ? {} : { "content-disposition": `attachment; filename="${file}"` }), "cache-control": "private, no-store" });
      res.end(PDF_BODY);
    })],
  ];
}

export { ADULT_ID };
