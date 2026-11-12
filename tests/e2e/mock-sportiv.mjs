// The sportiv half of the mock portal (registered from mock-portal.mjs): login entry for the sportiv host,
// `me` and the calendar file. The rest of the sportiv routes arrive with the screens that read them.
import { ADULT_ID, ICS_BODY, SPORTIV_ACCOUNTS, SPORTIV_ATHLETES } from "./sportiv-fixtures.mjs";

const LOST = "Nu mai ai acces la acest sportiv.";

export const sportivAccount = (email) => SPORTIV_ACCOUNTS[email] ?? null;

/** h: { ok, club, send, devices() } from mock-portal. Returns [method, regexp, handler] rows for /api/portal/sportiv. */
export function sportivRoutes(h) {
  const holds = (sess, id) => Boolean(SPORTIV_ACCOUNTS[sess.email]?.athletes.includes(id));
  return [
    ["GET", /^\/me$/, ({ res, sess }) => {
      const a = SPORTIV_ACCOUNTS[sess.email];
      h.ok(res, { email: sess.email, name: a.name, phone: a.phone, hasPassword: Boolean(a.password), google: a.google, passwordChangedAt: null, notifySchedule: true, devices: 1 });
    }],
    ["GET", /^\/athletes\/([A-Za-z0-9]+)\/calendar\.ics$/, ({ res, sess, params }) => {
      const athlete = SPORTIV_ATHLETES[params[0]];
      if (!athlete || !holds(sess, params[0])) return h.club(res, 403, LOST);
      res.writeHead(200, {
        "content-type": "text/calendar; charset=utf-8",
        "content-disposition": `attachment; filename="edusport-${athlete.firstName.toLowerCase()}.ics"`,
        "cache-control": "private, no-store",
      });
      res.end(ICS_BODY);
    }],
  ];
}

export { ADULT_ID };
