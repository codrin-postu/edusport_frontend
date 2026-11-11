// A stand-in for the Strapi portal routes (auth and coach), for the coach app e2e.
// Synthetic data only (tests/e2e/portal-fixtures.mjs). Plain Node http, as mock-strapi.mjs.
// Usage: node tests/e2e/mock-portal.mjs <port>
//   POST /__mock/state  { accessTtlSec?, cutAccount?, revokeAll?, failGoogle?, googleClientId?, emptyToday?, refreshStatus?, refuseSecret?, competitionsDown? }
//   GET  /__mock/log    { calls: [{ method, path, headers, body }], refreshes: number }
//   POST /__mock/reset  fresh state and an empty log
import { createServer } from "node:http";
import {
  FROZEN_TODAY, INVITE_OLD, INVITE_VALID, RESET_CODE, SECRET, addDays, buildWorld, weekdayOf,
} from "./portal-fixtures.mjs";

const PORT = Number(process.argv[2] ?? 18891);
const GRACE_MS = 30_000;
const ARCHIVE_DAYS = 7;
const MSG = {
  noAccess: "Nu mai ai acces la această grupă.",
  archived: "Arhivată. Nu mai poate fi modificată.",
  notFound: "Nu a fost găsit.",
  invalid: "Cerere invalidă.",
  badLogin: "E-mailul sau parola nu sunt corecte.",
  expired: "Invitația a expirat. Cere administratorului una nouă.",
  saved: "Salvat.",
};

let today;
let world;
let state;
let calls;
let auth;

function reset() {
  today = FROZEN_TODAY;
  world = buildWorld(today);
  state = { accessTtlSec: 600, cutAccount: false, revokeAll: false, failGoogle: false, googleClientId: "e2e-google-client", emptyToday: false, refreshStatus: 0, refuseSecret: false, competitionsDown: false, coachDown: false, unscheduledGroup: false, inactiveGroups: [] };
  calls = [];
  // seq survives a reset so token and device ids stay unique across tests (the BFF caches refreshes by token).
  auth = { seq: auth?.seq ?? 0, access: new Map(), sessions: new Map(), retired: new Map(), refreshes: 0 };
}
reset();

// ---------- http helpers ----------
const send = (res, status, body) => {
  res.writeHead(status, { "content-type": "application/json" });
  res.end(JSON.stringify(body));
};
const ok = (res, data) => send(res, 200, { data });
const club = (res, status, message, details) =>
  send(res, status, { data: null, error: { status, name: "ClubAdminError", message, ...(details ? { details } : {}) } });
const policy403 = (res) => send(res, 403, { data: null, error: { status: 403, name: "ForbiddenError", message: "Forbidden", details: {} } });
const unauthorized = (res) => send(res, 401, { data: null, error: { status: 401, name: "UnauthorizedError", message: "Missing or invalid credentials", details: {} } });

async function readBody(req) {
  const chunks = [];
  for await (const c of req) chunks.push(c);
  const text = Buffer.concat(chunks).toString("utf8");
  if (!text) return {};
  try { return JSON.parse(text); } catch { return {}; }
}

// ---------- sessions and tokens ----------
function issue(email, deviceKey, userAgent) {
  const sid = `sess-${++auth.seq}`;
  const sess = { id: sid, email, current: `rt-${sid}-0`, prev: null, prevAt: 0, n: 0, revoked: false, deviceId: null };
  const known = world.devices.find((d) => d.key === deviceKey);
  let newKey = null;
  if (known) {
    sess.deviceId = known.id;
  } else {
    newKey = `devkey${auth.seq}`;
    const device = { id: `devnew${auth.seq}`, key: newKey, label: userAgent ? "Chrome pe Mac" : "Browser", lastSeenAt: new Date().toISOString() };
    world.devices.push(device);
    sess.deviceId = device.id;
  }
  auth.sessions.set(sid, sess);
  return { ...mint(sess), deviceKey: newKey };
}

function mint(sess) {
  const accessToken = `at-${sess.id}-${++auth.seq}`;
  const exp = Date.now() + state.accessTtlSec * 1000;
  auth.access.set(accessToken, { sid: sess.id, exp });
  return { accessToken, refreshToken: sess.current, accessExpiresAt: new Date(exp).toISOString() };
}

function refresh(token) {
  const sess = [...auth.sessions.values()].find((s) => s.current === token);
  if (sess) {
    if (sess.revoked) return null;
    sess.prev = token;
    sess.prevAt = Date.now();
    auth.retired.set(token, sess.id);
    sess.current = `rt-${sess.id}-${++sess.n}`;
    auth.refreshes += 1;
    return { ...mint(sess), deviceKey: null };
  }
  const owner = auth.sessions.get(auth.retired.get(token));
  if (owner && !(owner.prev === token && Date.now() - owner.prevAt <= GRACE_MS)) owner.revoked = true;
  return null;
}

function coachSession(req) {
  const header = req.headers.authorization ?? "";
  const rec = auth.access.get(header.replace(/^Bearer /, ""));
  const sess = rec ? auth.sessions.get(rec.sid) : null;
  if (!rec || !sess || sess.revoked || rec.exp <= Date.now()) return null;
  return sess;
}

function applyRevokeAll() {
  if (state.revokeAll) for (const s of auth.sessions.values()) s.revoked = true;
}

// ---------- password rules ----------
function passwordRefusal(password) {
  if (typeof password !== "string" || password.length < 10) return "Parola trebuie să aibă cel puțin 10 caractere.";
  if (password.length > 128) return "Parola poate avea cel mult 128 de caractere.";
  if (/^(parola|password|1234)/i.test(password)) return "Parola este prea ușor de ghicit. Alege alta.";
  return null;
}

// ---------- auth routes ----------
const lower = (v) => (typeof v === "string" ? v.trim().toLowerCase() : "");

function login(ctx) {
  const { body, res, req } = ctx;
  const account = world.accounts[lower(body.email)];
  if (body.host !== "antrenor" || !account) return club(res, body.host !== "antrenor" ? 400 : 401, body.host !== "antrenor" ? MSG.invalid : MSG.badLogin);
  if (!account.password || account.password !== body.password) return club(res, 401, MSG.badLogin);
  ok(res, issue(lower(body.email), body.deviceKey, req.headers["x-portal-user-agent"]));
}

function google(ctx) {
  const { body, res, req } = ctx;
  if (state.failGoogle) return club(res, 502, "Nu am putut încărca datele.");
  const email = typeof body.code === "string" && body.code.startsWith("ok:") ? lower(body.code.slice(3)) : "";
  if (!email) return club(res, 400, MSG.invalid);
  if (body.invite) {
    if (body.invite === INVITE_OLD || body.invite !== INVITE_VALID) return club(res, 410, MSG.expired);
    if (email !== "antrenor2@example.invalid") return club(res, 401, "Contul Google nu are adresa antrenor2@example.invalid.");
  } else if (!world.accounts[email]) {
    return club(res, 401, "Nu am găsit un cont pentru adresa asta.");
  }
  world.accounts[email].google = true;
  ok(res, issue(email, body.deviceKey, req.headers["x-portal-user-agent"]));
}

function resetConfirm(ctx) {
  const { body, res, req } = ctx;
  const email = lower(body.email);
  if (body.code !== RESET_CODE || !world.accounts[email]) return club(res, 400, "Codul nu este corect sau a expirat.");
  const refusal = passwordRefusal(body.password);
  if (refusal) return club(res, 400, refusal);
  world.accounts[email].password = body.password;
  ok(res, issue(email, body.deviceKey, req.headers["x-portal-user-agent"]));
}

function inviteAccept(ctx) {
  const { body, res, req } = ctx;
  if (body.secret !== INVITE_VALID) return club(res, 410, MSG.expired);
  const refusal = passwordRefusal(body.password);
  if (refusal) return club(res, 400, refusal);
  world.accounts["antrenor2@example.invalid"].password = body.password;
  ok(res, issue("antrenor2@example.invalid", body.deviceKey, req.headers["x-portal-user-agent"]));
}

function logout({ body, res }) {
  const sess = [...auth.sessions.values()].find((s) => s.current === body.refreshToken);
  if (sess) sess.revoked = true;
  ok(res, { ok: true });
}

const authRoutes = [
  ["POST", /^\/api\/portal\/auth\/login$/, login],
  ["POST", /^\/api\/portal\/auth\/google$/, google],
  ["GET", /^\/api\/portal\/auth\/google\/config$/, ({ res }) => ok(res, { clientId: state.googleClientId })],
  ["POST", /^\/api\/portal\/auth\/refresh$/, ({ body, res }) => {
    if (state.refreshStatus) return club(res, state.refreshStatus, "");
    const out = refresh(body.refreshToken);
    return out ? ok(res, out) : club(res, 401, "");
  }],
  ["POST", /^\/api\/portal\/auth\/logout$/, logout],
  ["POST", /^\/api\/portal\/auth\/reset\/request$/, ({ res }) => ok(res, { message: "Dacă adresa are cont, am trimis un cod." })],
  ["POST", /^\/api\/portal\/auth\/reset\/confirm$/, resetConfirm],
  ["POST", /^\/api\/portal\/auth\/invite\/read$/, ({ body, res }) =>
    ok(res, body.secret === INVITE_VALID ? { state: "valid", email: "antrenor2@example.invalid" } : { state: "expired", email: null })],
  ["POST", /^\/api\/portal\/auth\/invite\/accept$/, inviteAccept],
];

// ---------- coach data builders ----------
const groupOf = (id) => world.groups[id];
const isOwn = (id) => Boolean(groupOf(id)?.own);
const keyOf = (groupId, date) => `occ:${groupId}:${date}`;
const parseKey = (key) => {
  const [, groupId, date] = String(key).split(":");
  return { groupId, date };
};
const childrenOf = (id) => (world.members[id] ?? []).length;
const hasClass = (g, date) => g.days.includes(weekdayOf(date)) || (g.own && date === today);
// Another coach's group also counts the stand-in slots of its page (today and today - 3) as scheduled classes.
const scheduled = (g, date) => hasClass(g, date) || (!g.own && (date === today || date === addDays(today, -3)));
const archivedDate = (date) => date < addDays(today, -ARCHIVE_DAYS);
const ME = "tm-andrei";

/** Backend presenceRight (src/club/portal/coach/rules.ts): what the coach may do with the session of a date. */
function presenceRight(g, date, rec, added) {
  const nothing = { read: false, write: false, archived: false, mustIncludeMe: false };
  const saved = Boolean(rec);
  const correctable = !archivedDate(date);
  const open = date <= today;
  const archived = saved && !correctable;
  if (g.own) return { read: true, write: open && (!saved || correctable), archived, mustIncludeMe: false };
  const listed = saved && rec.coachIds.includes(ME);
  if (added && !listed) return nothing;
  const inWindow = scheduled(g, date) && !added && date >= addDays(today, -ARCHIVE_DAYS) && open;
  return {
    read: listed || (!saved && inWindow),
    write: open && ((!saved && inWindow) || (saved && listed && correctable)),
    archived, mustIncludeMe: true,
  };
}
const refusalOf = (res, right) => club(res, 403, right.archived ? MSG.archived : MSG.noAccess);
const MONTHS = ["ian", "feb", "mar", "apr", "mai", "iun", "iul", "aug", "sep", "oct", "noi", "dec"];
// Backend copy: shortDay "27 oct", longDate "27 oct 2026" (src/club/presence/copy/attendance.ts, dates.ts).
const shortDay = (date) => `${Number(date.slice(8))} ${MONTHS[Number(date.slice(5, 7)) - 1]}`;
const longDay = (date) => `${shortDay(date)} ${date.slice(0, 4)}`;
const notFound = (res) => club(res, 404, MSG.notFound);

function classRow(g, date, done) {
  const rec = world.saved[keyOf(g.id, date)];
  return {
    sessionId: rec?.sessionId ?? null, occurrenceKey: keyOf(g.id, date), groupId: g.id, groupName: g.name, date, startTime: g.start,
    children: childrenOf(g.id), done: done ?? Boolean(rec), standIn: !g.own, location: g.location ?? null,
  };
}

const lessonRow = (l) => ({ lessonId: l.lessonId, athleteName: l.athleteName, date: l.date, startTime: l.startTime, durationMin: l.durationMin, done: l.state === "saved" });

/** Backend nextAndWeek: the browser clock stands at 14:00 Bucharest; own classes and lessons, no cancelled, no stand-in. */
const MOCK_NOW = "14:00";
function nextAndWeek(todo) {
  const monday = addDays(today, -((new Date(`${today}T00:00:00Z`).getUTCDay() + 6) % 7));
  const sunday = addDays(monday, 6);
  const horizon = addDays(today, 14);
  const last = sunday > horizon ? sunday : horizon;
  const months = [...new Set([monday, last].map((d) => d.slice(0, 7)))];
  const items = months.flatMap((m) => calendarData(m).days).flatMap((d) => d.items).filter((i) => i.date >= monday && i.date <= last && !i.cancelled && !i.standIn);
  const started = (i) => i.date < today || (i.date === today && i.startTime <= MOCK_NOW);
  const week = items.filter((i) => i.date <= sunday);
  const count = (kind, held) => week.filter((i) => i.kind === kind && started(i) === held).length;
  const f = items.find((i) => i.date <= horizon && !started(i));
  return {
    next: f ? { kind: f.kind, date: f.date, startTime: f.startTime, title: f.title, location: f.location, occurrenceKey: f.occurrenceKey, lessonId: f.lessonId } : null,
    week: { groupsHeld: count("grup", true), groupsLeft: count("grup", false), lessonsHeld: count("individual", true), lessonsLeft: count("individual", false), missing: todo.filter((r) => r.date >= monday).length },
  };
}

function todayData(date) {
  if (state.emptyToday) { const todo = date === today ? [classRow(world.groups["gavansati"], addDays(today, -6), false)] : []; return { date, today, groups: [], lessons: [], todo, ...nextAndWeek(todo) }; }
  const own = Object.values(world.groups).filter((g) => g.own);
  const isToday = date === today;
  const todo = isToday ? [classRow(world.groups["gavansati"], addDays(today, -6), false)] : [];
  return {
    date, today,
    groups: isToday ? own.map((g) => classRow(g, date)) : [],
    lessons: Object.values(world.lessons).filter((l) => l.date === date).map(lessonRow),
    todo, ...nextAndWeek(todo),
  };
}

function groupPage(g) {
  const slots = [today, addDays(today, -3)].map((date) => ({ occurrenceKey: keyOf(g.id, date), date, startTime: g.start }));
  return {
    groupId: g.id, name: g.name, kind: g.kind, own: g.own, coaches: g.coaches, program: g.program,
    members: g.own ? world.members[g.id] : (world.members[g.id] ?? []).map(({ name, age }) => ({ name, age })),
    membersReadOnly: !g.own,
    standIn: g.own ? [] : slots,
    todayKey: hasClass(g, today) ? keyOf(g.id, today) : null,
    programPublic: g.own && g.kind === "club" ? g.programPublic : null,
    location: g.location ?? null,
  };
}

/** First class from today on, within two weeks: { date, startTime } or null. */
function nextOf(g) {
  for (let i = 0; i < 14; i++) {
    const date = addDays(today, i);
    if (hasClass(g, date)) return { date, startTime: g.start };
  }
  return null;
}

const monthDays = (month) => {
  const [y, mo] = month.split("-").map(Number);
  return Array.from({ length: new Date(y, mo, 0).getDate() }, (_, i) => `${month}-${String(i + 1).padStart(2, "0")}`);
};

/** Backend readCoachCalendar: own classes (scheduled and cancelled), saved stand-in sessions that list the coach, own lessons. */
function calendarData(month) {
  const days = [];
  for (const date of monthDays(month)) {
    const items = [];
    // Own classes come from the group's rules with moved, cancelled and removed dates applied; today keeps its class (the Azi fixture).
    for (const g of Object.values(world.groups).filter((x) => x.own)) {
      let occ = occurrencesOf(g, month).filter((o) => o.date === date).map((o) => ({ start: o.startTime, dur: o.durationMin ?? g.dur, cancelled: o.status === "cancelled" }));
      if (!occ.length && date === today) occ = [{ start: g.start, dur: g.dur, cancelled: false }];
      for (const o of occ) {
        const rec = world.saved[keyOf(g.id, date)];
        const { cancelled } = o;
        items.push({
          kind: "grup", cancelled, date, startTime: o.start, durationMin: o.dur, title: g.name, children: cancelled ? null : childrenOf(g.id),
          location: g.location ?? null, done: !cancelled && Boolean(rec), standIn: false, sessionId: cancelled ? null : rec?.sessionId ?? null, occurrenceKey: keyOf(g.id, date), lessonId: null,
        });
      }
    }
    for (const [key, rec] of Object.entries(world.saved)) {
      const g = groupOf(rec.groupId);
      if (rec.date !== date || g.own || !rec.coachIds.includes(ME)) continue;
      items.push({
        kind: "grup", cancelled: false, date, startTime: rec.startTime, durationMin: rec.durationMin, title: g.name, children: rec.ticks.length,
        location: g.location ?? null, done: true, standIn: true, sessionId: rec.sessionId, occurrenceKey: key, lessonId: null,
      });
    }
    for (const l of Object.values(world.lessons).filter((x) => x.date === date && x.coachIds.includes(ME))) {
      items.push({
        kind: "individual", cancelled: false, date, startTime: l.startTime, durationMin: l.durationMin, title: l.athleteName, children: null,
        location: null, done: l.state === "saved", standIn: false, sessionId: null, occurrenceKey: null, lessonId: l.lessonId,
      });
    }
    items.sort((a, b) => a.startTime.localeCompare(b.startTime));
    if (items.length) days.push({ date, items });
  }
  return { month, today, days };
}

const MEMBER_FROM = /^\d{4}-\d{2}-\d{2}$/;
const SEASON_END = "2027-05-31";
const STALE = "Datele s-au schimbat. Reîncarcă pagina.";
/** Backend moveMember / removeMember: own source, then the body (a date from today to the season end), then an active own target, then the open row; a later `from` keeps the child listed with `leavesOn` and a second change answers 409 (the row is no longer current). */
function changeMember({ res, params, body }, move) {
  const [gid, aid] = params;
  const source = groupOf(gid);
  if (!source || !source.own) return club(res, 403, MSG.noAccess);
  const valid = typeof body.from === "string" && MEMBER_FROM.test(body.from) && body.from >= today && body.from <= SEASON_END;
  if (!valid) return club(res, 400, MSG.invalid);
  let target = null;
  if (move) {
    target = typeof body.toGroupId === "string" ? groupOf(body.toGroupId) : null;
    if (!target || target.id === gid || state.inactiveGroups.includes(target.id)) return club(res, 400, "Alege grupa.");
    if (!target.own) return club(res, 403, MSG.noAccess);
  }
  const list = world.members[gid] ?? [];
  const m = list.find((x) => x.athleteId === aid);
  if (!m || m.leavesOn) return club(res, 409, STALE);
  if (body.from === today) {
    world.members[gid] = list.filter((x) => x.athleteId !== aid);
    if (target) world.members[target.id].push({ ...m, leavesOn: null });
  } else {
    m.leavesOn = body.from;
  }
  ok(res, { athleteName: m.name, groupName: (target ?? source).name, from: body.from, toast: MSG.saved });
}

const EVENTS = [
  { eventId: "ev-cupa", name: "Cupa României", date: "2026-10-26", location: "Brașov", picks: [["amaria", "Advanced Novice Girls", 1, 142.3], ["aana", "Advanced Novice Girls", 2, 131.9], ["adara", "Basic Novice", 3, 38.4]] },
  { eventId: "ev-trophy", name: "Edu Sport Trophy", date: "2026-09-13", location: "București", picks: [["amaria", "Advanced Novice Girls", 2, 138.0], ["aluca", "Basic Novice", 1, 40.2]] },
  { eventId: "ev-nord", name: "Cupa Patinoarului Nord", date: "2026-06-15", location: "București", picks: [["amaria", "Advanced Novice Girls", 3, 120.5], ["avlad", "Basic Novice", 4, 35.0]] },
];
const allMembers = () => [...new Map(Object.values(world.members).flat().map((m) => [m.athleteId, m])).values()];

function competitionsData(query) {
  if (state.competitionsDown) return { available: false };
  const mine = query.get("scope") === "mine";
  const ownIds = new Set(Object.entries(world.members).filter(([gid]) => isOwn(gid)).flatMap(([, l]) => l.map((m) => m.athleteId)));
  const names = new Map(allMembers().map((m) => [m.athleteId, m.name]));
  const events = EVENTS.map((e) => ({
    eventId: e.eventId, name: e.name, date: e.date, location: e.location,
    members: e.picks.filter(([id]) => names.has(id) && (!mine || ownIds.has(id)))
      .map(([id, category, placement, total]) => ({ athleteId: id, name: names.get(id), category, placement, total })),
  })).filter((e) => e.members.length > 0);
  const seasons = ["2026-2027", "2025-2026"];
  const season = seasons.includes(query.get("season")) ? query.get("season") : seasons[0];
  return { available: true, stale: false, seasons, season, events: season === seasons[0] ? events : [] };
}

function sessionRows(g, rec) {
  const all = [...(world.members[g.id] ?? []), ...(world.inactive[g.id] ?? [])];
  return all.map((m) => ({
    athleteId: m.athleteId, name: m.name, age: m.age, inactive: m.inactive, visitor: false,
    grup: Boolean(rec?.ticks.includes(m.athleteId)), uscat: false, abonament: m.inactive ? null : "Abonament 8 ședințe",
  }));
}

function buildSession({ groupId, date, startTime, durationMin, key, rec, free }) {
  const g = groupOf(groupId);
  return {
    sessionId: rec?.sessionId ?? null, occurrenceKey: free ? null : key, added: free ? { groupId, date, startTime, durationMin } : null,
    groupId, groupName: g.name, kind: g.kind, date, startTime, durationMin, outsideSchedule: Boolean(free),
    coachIds: rec?.coachIds ?? ["tm-andrei"], coachOptions: world.coachOptions, rows: sessionRows(g, rec),
    savedLine: rec ? `Salvată de Antrenor Andrei Popa, ${longDay(rec.date)} 18:40` : null, editable: !archivedDate(date) && date <= today, archived: archivedDate(date), standIn: !g.own,
  };
}

/** The group, date, saved record and "added" flag a session query points at. */
function sessionRef(q) {
  if (q.get("occurrence")) {
    const { groupId, date } = parseKey(q.get("occurrence"));
    return { g: groupOf(groupId), date, rec: world.saved[q.get("occurrence")], added: false };
  }
  if (q.get("id")) {
    const rec = Object.values(world.saved).find((r) => r.sessionId === q.get("id"));
    return rec ? { g: groupOf(rec.groupId), date: rec.date, rec, added: false } : null;
  }
  return { g: groupOf(q.get("group")), date: q.get("date"), rec: null, added: true };
}

function sessionFromQuery(q) {
  if (q.get("occurrence")) {
    const { groupId, date } = parseKey(q.get("occurrence"));
    const g = groupOf(groupId);
    if (!g) return null;
    return buildSession({ groupId, date, startTime: g.start, durationMin: g.dur, key: q.get("occurrence"), rec: world.saved[q.get("occurrence")] });
  }
  if (q.get("id")) {
    const [key, rec] = Object.entries(world.saved).find(([, r]) => r.sessionId === q.get("id")) ?? [];
    return rec ? buildSession({ groupId: rec.groupId, date: rec.date, startTime: rec.startTime, durationMin: rec.durationMin, key, rec }) : null;
  }
  const groupId = q.get("group");
  if (!groupOf(groupId)) return null;
  return buildSession({ groupId, date: q.get("date"), startTime: q.get("time"), durationMin: Number(q.get("duration") ?? 50), free: true });
}

function checkSession({ groupId, date, startTime }) {
  const existing = Object.values(world.saved).filter((r) => r.groupId === groupId && r.date === date);
  const g = groupOf(groupId);
  if (existing.length) {
    const saved = existing.map((r) => ({ sessionId: r.sessionId, startTime: r.startTime, present: r.ticks.length, listed: r.coachIds.includes("tm-andrei"), savedBy: "Andrei Popa" }));
    return { kind: "existing", sameTime: existing.some((r) => r.startTime === startTime), saved };
  }
  if (g && startTime === g.start && hasClass(g, date)) return { kind: "occurrence", occurrenceKey: keyOf(groupId, date) };
  return { kind: "free", outsideSchedule: true };
}

function saveSession({ body, res }) {
  const found = body.id ? Object.entries(world.saved).find(([, r]) => r.sessionId === body.id) : null;
  const ref = found ? { groupId: found[1].groupId, date: found[1].date } : body.added ?? parseKey(body.occurrence);
  const g = groupOf(ref.groupId);
  if (!g) return notFound(res);
  const prior0 = found?.[1] ?? world.saved[body.occurrence ?? keyOf(ref.groupId, ref.date)];
  const right = presenceRight(g, ref.date, body.added ? null : prior0, Boolean(body.added));
  if (!right.write) return refusalOf(res, right);
  if (right.mustIncludeMe && !(body.coachIds ?? []).includes(ME)) return club(res, 403, MSG.noAccess);
  const asked = (body.ticks ?? []).filter((t) => t.grup || t.uscat).map((t) => t.athleteId);
  const inactive = (world.inactive[ref.groupId] ?? []).filter((m) => asked.includes(m.athleteId) && !(body.reactivate ?? []).includes(m.athleteId) && !(body.keepInactive ?? []).includes(m.athleteId));
  if (inactive.length) return club(res, 409, "Sportiv inactiv", { inactive: inactive.map((m) => ({ id: m.athleteId, name: m.name })) });
  const key = found?.[0] ?? body.occurrence ?? keyOf(ref.groupId, ref.date);
  const prior = world.saved[key];
  const sessionId = prior?.sessionId ?? `s-new-${Object.keys(world.saved).length}`;
  world.saved[key] = { sessionId, groupId: ref.groupId, date: ref.date, startTime: body.added?.startTime ?? prior?.startTime ?? g.start, durationMin: body.added?.durationMin ?? g.dur, ticks: asked, coachIds: body.coachIds ?? ["tm-andrei"] };
  ok(res, { sessionId, toast: `Prezență salvată: ${g.name}, ${shortDay(ref.date)}.` });
}

function lessonView(l) {
  const archived = archivedDate(l.date);
  return { ...withoutSeries(l), coachOptions: world.coachOptions, savedLine: l.state === "saved" ? `Salvată de Antrenor Andrei Popa, ${longDay(l.date)} 15:55` : null, editable: !archived, archived, deletable: !archived,
    series: l.seriesId ? world.series[l.seriesId] ?? null : null, planEditable: l.state === "planned" && l.date >= today && l.coachIds.includes(ME) };
}

const withoutSeries = (l) => { const copy = { ...l }; delete copy.seriesId; return copy; };
const weekdayWord = ["duminică", "luni", "marți", "miercuri", "joi", "vineri", "sâmbătă"];
const conflictText = (date, time) => `Sportivul are deja o lecție pe ${weekdayWord[weekdayOf(date)]}, ${shortDay(date)}, la ${time}.`;

/** The dates a lesson repeat writes: `from` to `until` (or the season end), by freq and days; biweekly counts weeks from `from`'s week. */
function lessonDates(from, repeat) {
  const to = repeat.until ?? SEASON_END;
  const rule = { from, to, freq: repeat.freq, weekOfMonth: repeat.weekOfMonth ?? null };
  const out = [];
  for (let date = from; date <= to; date = addDays(date, 1)) {
    if (repeat.days.some((day) => ruleHits({ ...rule, day }, date, from))) out.push(date);
  }
  return out;
}

/** Contract validation of a repeat; null when fine. */
function repeatRefusal(repeat, from) {
  if (!repeat || typeof repeat !== "object") return null;
  if (!FREQS.includes(repeat.freq) || !Array.isArray(repeat.days) || !repeat.days.length || !repeat.days.every((d) => DAY_KEYS.includes(d))) return MSG.invalid;
  const until = repeat.until ?? null;
  if (until !== null && (!validDate(until) || until < from || until > SEASON_END)) return MSG.invalid;
  return null;
}

const planFieldsOk = (body) => validDate(body.date) && HHMM.test(body.startTime ?? "") && Number.isInteger(body.durationMin) && body.durationMin >= 15 && body.durationMin <= 240;

function conflictFor(athleteId, dates, time, ignore) {
  const hit = dates.find((date) => Object.values(world.lessons).some((l) => l.athleteId === athleteId && l.date === date && l.startTime === time && !ignore.includes(l.lessonId)));
  return hit ? conflictText(hit, time) : null;
}

/** Writes the lessons of a create or a following edit; answers CoachLessonCreated. */
function writeLessons({ athlete, body }) {
  const repeat = body.repeat ?? null;
  const dates = repeat ? lessonDates(body.date, repeat) : [body.date];
  let seriesId = null;
  if (repeat) {
    seriesId = `sl-new${++world.counters.lesson}`;
    const to = repeat.until ?? SEASON_END;
    world.series[seriesId] = {
      seriesId, freq: repeat.freq, days: repeat.days, weekOfMonth: repeat.freq === "monthly" ? repeat.weekOfMonth ?? weekOfMonthOf(body.date) : null,
      startTime: body.startTime, durationMin: body.durationMin, from: body.date, to, untilSeasonEnd: repeat.until === null || repeat.until === undefined,
    };
  }
  const ids = dates.map((date) => {
    const lessonId = `lnew${++world.counters.lesson}`;
    world.lessons[lessonId] = { lessonId, athleteId: athlete.athleteId, athleteName: athlete.name, date, startTime: body.startTime, durationMin: body.durationMin, coachIds: body.coachIds, state: "planned", present: null, ...(seriesId ? { seriesId } : {}) };
    return lessonId;
  });
  return { lessonId: ids[0], seriesId, count: ids.length, toast: MSG.saved };
}

/** POST /lessons: one lesson, or a series with `repeat` (date is "Din data"). */
function lessonCreate({ body, res }) {
  if (!(body.coachIds ?? []).includes(ME)) return club(res, 403, MSG.noAccess);
  if (archivedDate(body.date)) return club(res, 403, MSG.archived);
  const athlete = Object.values(world.members).flat().find((m) => m.athleteId === body.athleteId);
  if (!athlete || !planFieldsOk(body)) return club(res, 400, MSG.invalid);
  // As the backend (coach/lessons.ts): a repeating lesson dated before today is refused.
  if (body.repeat && body.date < today) return club(res, 400, MSG.invalid);
  const refusal = repeatRefusal(body.repeat, body.date);
  if (refusal) return club(res, 400, refusal);
  const dates = body.repeat ? lessonDates(body.date, body.repeat) : [body.date];
  const conflict = conflictFor(athlete.athleteId, dates, body.startTime, []);
  if (conflict) return club(res, 409, conflict);
  ok(res, writeLessons({ athlete, body }));
}

/** PUT /lessons/:id/plan: change one lesson or this and the following ones of its series. */
function lessonPlan({ body, res, params }) {
  const l = world.lessons[params[0]];
  if (!l || !l.coachIds.includes(ME)) return notFound(res);
  if (l.state === "saved" || l.date < today) return club(res, 409, STALE);
  if (!planFieldsOk(body) || !["one", "following"].includes(body.scope)) return club(res, 400, MSG.invalid);
  if (!(body.coachIds ?? []).includes(ME)) return club(res, 403, MSG.noAccess);
  if (body.scope === "one" && l.seriesId && body.repeat) return club(res, 400, MSG.invalid);
  const refusal = repeatRefusal(body.repeat, body.date);
  if (refusal) return club(res, 400, refusal);
  const athlete = { athleteId: l.athleteId, name: l.athleteName };
  const following = body.scope === "following" && l.seriesId;
  const gone = following ? Object.values(world.lessons).filter((x) => x.seriesId === l.seriesId && x.date >= l.date && x.state === "planned").map((x) => x.lessonId) : [l.lessonId];
  const dates = body.repeat && following ? lessonDates(body.date, body.repeat) : [body.date];
  const conflict = conflictFor(l.athleteId, dates, body.startTime, gone);
  if (conflict) return club(res, 409, conflict);
  if (!following) {
    Object.assign(l, { date: body.date, startTime: body.startTime, durationMin: body.durationMin, coachIds: body.coachIds });
    return ok(res, { lessonId: l.lessonId, seriesId: l.seriesId ?? null, count: 1, toast: MSG.saved });
  }
  for (const id of gone) delete world.lessons[id];
  ok(res, writeLessons({ athlete, body }));
}

/** DELETE /lessons/:id?scope=one|following. */
function lessonDelete({ res, params, query }) {
  const scope = query.get("scope") ?? "one";
  if (!["one", "following"].includes(scope)) return club(res, 400, MSG.invalid);
  const l = world.lessons[params[0]];
  if (!l || !l.coachIds.includes(ME)) return notFound(res);
  if (l.state === "saved" && archivedDate(l.date)) return club(res, 403, MSG.archived);
  const ids = scope === "following" && l.seriesId
    ? Object.values(world.lessons).filter((x) => x.seriesId === l.seriesId && x.date >= l.date && x.state === "planned").map((x) => x.lessonId)
    : [l.lessonId];
  for (const id of ids) delete world.lessons[id];
  ok(res, { deleted: true, count: ids.length, toast: ids.length > 1 ? "Lecții șterse." : "Lecție ștearsă." });
}

function lessonWrite({ body, res, params, method }) {
  const l = world.lessons[params[0]];
  if (!l || !l.coachIds.includes(ME)) return notFound(res);
  if (l.state === "saved" && archivedDate(l.date)) return club(res, 403, MSG.archived);
  if (method === "PUT" && l.date > today) return club(res, 403, MSG.noAccess);
  if (method === "PUT" && !(body.coachIds ?? []).includes(ME)) return club(res, 403, MSG.noAccess);
  const unchanged = l.state === "saved" && l.present === body.present && l.durationMin === body.durationMin
    && JSON.stringify([...l.coachIds].sort()) === JSON.stringify([...(body.coachIds ?? [])].sort());
  if (unchanged) return ok(res, { lessonId: l.lessonId, changed: false, toast: "Nicio modificare." });
  Object.assign(l, { present: body.present, durationMin: body.durationMin, coachIds: body.coachIds, state: "saved" });
  ok(res, { lessonId: l.lessonId, changed: true, toast: MSG.saved });
}

function historyData(month) {
  const m = /^\d{4}-\d{2}$/.test(month ?? "") ? month : today.slice(0, 7);
  return {
    month: m, sessions: 2, lessons: 1, hours: "2,8",
    rows: [
      { kind: "grup", date: `${m}-05`, startTime: "18:15", name: "Avansați", present: 8, durationMin: 60, sessionId: "s-today", lessonId: null, done: true, occurrenceKey: keyOf("gavansati", `${m}-05`) },
      { kind: "inlocuitor", date: `${m}-04`, startTime: "17:00", name: "Intermediari Silver", present: 10, durationMin: 60, sessionId: "s-standin", lessonId: null, done: true, occurrenceKey: null },
      { kind: "individuala", date: `${m}-03`, startTime: "16:30", name: "Matei Radu", present: null, durationMin: 50, sessionId: null, lessonId: "ldone", done: true, occurrenceKey: null },
      { kind: "grup", date: `${m}-02`, startTime: "18:15", name: "Avansați", present: null, durationMin: 60, sessionId: null, lessonId: null, done: false, occurrenceKey: keyOf("gavansati", `${m}-02`) },
    ],
  };
}

const DAY_KEYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
const ISO = /^\d{4}-\d{2}-\d{2}$/;
const HHMM = /^([01]\d|2[0-3]):[0-5]\d$/;
const FREQS = ["weekly", "biweekly", "monthly"];
const weekOfMonthOf = (date) => { const d = Number(date.slice(8)); return d <= 7 ? "first" : d <= 14 ? "second" : d <= 21 ? "third" : d <= 28 ? "fourth" : "last"; };
const dayDiff = (a, b) => Math.round((new Date(`${b}T00:00:00Z`) - new Date(`${a}T00:00:00Z`)) / 86_400_000);
const mondayOf = (date) => addDays(date, -((weekdayOf(date) + 6) % 7));
const validDate = (v) => typeof v === "string" && ISO.test(v) && !Number.isNaN(Date.parse(v));
const addMin = (time, min) => { const [h, m] = time.split(":").map(Number); const t = h * 60 + m + min; return `${String(Math.floor(t / 60) % 24).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`; };

/** Does a rule (or a lesson series: same fields) fall on `date`? `anchor` is its first date. */
function ruleHits(r, date, anchor = r.from) {
  if (date < r.from || date > r.to || DAY_KEYS[weekdayOf(date)] !== r.day) return false;
  if (r.freq === "biweekly") return (dayDiff(mondayOf(anchor), mondayOf(date)) / 7) % 2 === 0;
  if (r.freq === "monthly") return weekOfMonthOf(date) === (r.weekOfMonth ?? weekOfMonthOf(anchor));
  return true;
}
const rulesOf = (gid) => world.rules[gid] ?? (world.rules[gid] = []);
function nextDateOf(r) {
  const away = (date) => isRemoved(r.gid, date) || (world.cancelled[r.gid] ?? []).some((c) => c.date === date) || (world.moved[r.gid] ?? []).some((m) => m.date === date);
  for (let i = 0; i < 400; i++) { const date = addDays(today, i); if (ruleHits(r, date) && !away(date)) return date; }
  return null;
}
const isRemoved = (gid, date) => (world.removed[gid] ?? []).includes(date);
const ruleView = ({ gid: _gid, ...r }) => ({ ...r, nextDate: nextDateOf({ ...r, gid: _gid }) });
const hasSavedSession = (gid, date) => Object.values(world.saved).some((r) => r.groupId === gid && r.date === date);

function occurrence(g, date, startTime, durationMin, eventId, extra = {}) {
  return {
    eventId: 1, documentId: eventId, title: g.name, type: g.kind === "club" ? "curs" : "scoala", label: null, color: null, order: 0, date,
    startTime, endTime: addMin(startTime, durationMin), endsNextDay: false, endDate: date,
    status: "scheduled", cancelReason: null, groupId: g.id, groupName: g.name, oneOff: false, originalDate: null, originalStartTime: null, ...extra,
  };
}

/** Occurrences of a month from the group's rules and one-off classes, with cancelled, moved and removed dates applied. */
function occurrencesOf(g, month) {
  const [y, mo] = month.split("-").map(Number);
  const out = [];
  const moves = world.moved[g.id] ?? [];
  const cancels = world.cancelled[g.id] ?? [];
  for (let d = 1; d <= new Date(y, mo, 0).getDate(); d++) {
    const date = `${month}-${String(d).padStart(2, "0")}`;
    if (isRemoved(g.id, date)) continue;
    for (const r of rulesOf(g.id).map((x) => ({ ...x, gid: g.id }))) {
      if (!ruleHits(r, date)) continue;
      if (moves.some((m) => m.date === date)) continue;
      const cancel = cancels.find((c) => c.date === date);
      out.push(occurrence(g, date, r.startTime, r.durationMin, r.eventId, cancel ? { status: "cancelled", cancelReason: "exception", note: cancel.note } : {}));
    }
    for (const o of world.oneOffs[g.id] ?? []) if (o.date === date) out.push(occurrence(g, date, o.startTime, o.durationMin, o.eventId, { oneOff: true }));
  }
  for (const m of moves) {
    if (!m.newDate.startsWith(month)) continue;
    const rule = rulesOf(g.id).find((r) => r.day === DAY_KEYS[weekdayOf(m.date)] && m.date >= r.from && m.date <= r.to) ?? rulesOf(g.id).find((r) => r.day === DAY_KEYS[weekdayOf(m.date)]);
    out.push(occurrence(g, m.newDate, m.newStartTime, rule?.durationMin ?? g.dur, rule?.eventId ?? g.eventId, { status: "override", originalDate: m.date, originalStartTime: rule?.startTime ?? g.start, note: m.note }));
  }
  return out.sort((a, b) => (a.date + a.startTime).localeCompare(b.date + b.startTime));
}

function programData(g, month) {
  const m = /^\d{4}-\d{2}$/.test(month ?? "") ? month : today.slice(0, 7);
  const row = {
    eventId: g.eventId, freq: "weekly", days: g.days.map((d) => DAY_KEYS[d]), weekOfMonth: null, startTime: g.start,
    durationMin: g.dur, from: `${today.slice(0, 4)}-10-01`, to: `${Number(today.slice(0, 4)) + 1}-05-31`, text: g.program[0], fromText: "1 oct", nextDate: today,
  };
  return {
    kind: g.kind, editable: g.kind === "club", programPublic: g.kind === "club" ? g.programPublic : null,
    program: { season: { documentId: "season-1", label: "2026-2027", past: false }, series: [row] }, occurrences: occurrencesOf(g, m),
    rules: rulesOf(g.id).filter((r) => r.to >= today).map((r) => ruleView({ ...r, gid: g.id })),
  };
}

const groupOfEvent = (eventId) => Object.values(world.groups).find((g) => g.eventId === eventId || rulesOf(g.id).some((r) => r.eventId === eventId) || (world.oneOffs[g.id] ?? []).some((o) => o.eventId === eventId));

const REFUSE = {
  datePresence: "Data are prezența salvată. Poți doar să o anulezi.",
};
const LAST_BACK = 7;

/** POST /groups/:id/program (contract): a series (optionally with `until`) or a one-off class up to 7 days back. */
function programAdd({ res, body }, g) {
  const valid = typeof body.startTime === "string" && HHMM.test(body.startTime) && Number.isInteger(body.durationMin) && body.durationMin >= 15 && body.durationMin <= 240;
  if (!valid) return club(res, 400, MSG.invalid);
  const eventId = `evnew${++world.counters.event}`;
  if (body.repeat === false) {
    if (!validDate(body.date) || body.date < addDays(today, -LAST_BACK) || body.date > SEASON_END) return club(res, 400, MSG.invalid);
    (world.oneOffs[g.id] ??= []).push({ eventId, date: body.date, startTime: body.startTime, durationMin: body.durationMin });
    return ok(res, { eventId, date: body.date });
  }
  const days = Array.isArray(body.days) ? body.days.filter((d) => DAY_KEYS.includes(d)) : [];
  if (!FREQS.includes(body.freq) || !days.length || !validDate(body.from)) return club(res, 400, MSG.invalid);
  const until = body.until ?? null;
  if (until !== null && (!validDate(until) || until < body.from || until > SEASON_END)) return club(res, 400, MSG.invalid);
  const to = until ?? SEASON_END;
  for (const day of DAY_KEYS.slice(1).concat("sun").filter((d) => days.includes(d))) {
    rulesOf(g.id).push({
      eventId, day, freq: body.freq, weekOfMonth: body.freq === "monthly" ? body.weekOfMonth ?? weekOfMonthOf(body.from) : null,
      startTime: body.startTime, durationMin: body.durationMin, from: body.from, to, untilSeasonEnd: to === SEASON_END,
    });
  }
  ok(res, { eventId, date: null });
}

/** PUT /program/:eventId and POST /program/:eventId/end with an optional `day`: a change or an end from a later date splits the weekday (the old row stops the day before). */
function programRuleWrite({ res, body, params }, end) {
  const [eventId] = params;
  const g = groupOfEvent(eventId);
  const list = g ? rulesOf(g.id) : [];
  const mine = list.filter((r) => r.eventId === eventId);
  if (body.day !== undefined && !mine.some((r) => r.day === body.day)) return club(res, 400, MSG.invalid);
  if (!validDate(body.from) || body.from < today) return club(res, 400, MSG.invalid);
  const picked = body.day === undefined ? mine : mine.filter((r) => r.day === body.day);
  // A class of the weekday on that date already has presence: the series is not touched.
  if (g && picked.some((r) => ruleHits({ ...r, gid: g.id }, body.from) && hasSavedSession(g.id, body.from))) return club(res, 409, REFUSE.datePresence);
  const newId = `evnew${++world.counters.event}`;
  const days = Array.isArray(body.days) && body.days.length ? body.days.filter((d) => DAY_KEYS.includes(d)) : null;
  // As the backend (changeLocked): a day the event already holds besides the addressed one is refused.
  if (!end && body.day !== undefined && days?.some((d) => d !== body.day && mine.some((r) => r.day === d))) return club(res, 400, MSG.invalid);
  for (const r of picked) {
    const split = body.from > r.from;
    const oldTo = r.to;
    if (end) {
      if (split) Object.assign(r, { to: addDays(body.from, -1), untilSeasonEnd: false });
      else world.rules[g.id] = rulesOf(g.id).filter((x) => x !== r);
      continue;
    }
    const fields = {
      ...(typeof body.startTime === "string" ? { startTime: body.startTime } : {}),
      ...(Number.isInteger(body.durationMin) ? { durationMin: body.durationMin } : {}),
    };
    if (!split) { Object.assign(r, fields, { eventId: newId }); continue; }
    Object.assign(r, { to: addDays(body.from, -1), untilSeasonEnd: false });
    for (const day of days ?? [r.day]) rulesOf(g.id).push({ ...r, ...fields, eventId: newId, day, from: body.from, to: oldTo, untilSeasonEnd: oldTo === SEASON_END });
  }
  ok(res, { eventId: end || !picked.length ? eventId : newId });
}

/** PUT /program/:eventId/dates/:date. */
function programDate({ res, body, params }) {
  const [eventId, date] = params;
  if (date < today) return club(res, 400, MSG.invalid);
  const g = groupOfEvent(eventId);
  const gid = g?.id;
  const drop = (store) => { world[store][gid] = (world[store][gid] ?? []).filter((x) => (x.date ?? x) !== date); };
  if (body.mode === "remove") {
    if (gid && hasSavedSession(gid, date)) return club(res, 409, REFUSE.datePresence);
    if (gid) (world.removed[gid] ??= []).push(date);
    return ok(res, { mode: "remove", date, emails: 0 });
  }
  if (gid) {
    if (body.mode === "keep") { drop("cancelled"); drop("moved"); world.removed[gid] = (world.removed[gid] ?? []).filter((d) => d !== date); }
    if (body.mode === "cancel") { drop("cancelled"); (world.cancelled[gid] ??= []).push({ date, note: body.reason ?? null }); }
    if (body.mode === "move") { drop("moved"); (world.moved[gid] ??= []).push({ date, newDate: body.newDate, newStartTime: body.newStartTime, note: body.reason ?? null }); }
  }
  ok(res, { mode: body.mode, date, emails: body.notifyParents === true ? 3 : 0 });
}

function meData(email) {
  const a = world.accounts[email];
  return { coachId: a.coachId, name: a.name, firstName: a.firstName, initials: a.initials, email, phone: a.phone, hasPassword: Boolean(a.password), google: a.google, coachOptions: world.coachOptions };
}

function athleteCard(id) {
  const all = Object.entries(world.members).flatMap(([gid, list]) => list.map((m) => ({ ...m, gid })));
  const m = all.find((x) => x.athleteId === id);
  if (!m) return null;
  const own = all.some((x) => x.athleteId === id && isOwn(x.gid));
  const onListed = Object.values(world.saved).some((r) => r.ticks.includes(id) && r.date <= today && r.date >= addDays(today, -ARCHIVE_DAYS) && r.coachIds.includes(ME));
  if (!own && !onListed) return "none";
  const groups = all.filter((x) => x.athleteId === id).map((x) => groupOf(x.gid).name);
  const groupRows = all.filter((x) => x.athleteId === id).map((x) => ({ groupId: x.gid, name: groupOf(x.gid).name, program: groupOf(x.gid).program }));
  const competitions = state.competitionsDown
    ? { available: false }
    : {
      available: true, category: "Advanced Novice Girls", season: "2026-2027", count: 3, podiums: 3,
      recent: EVENTS.map((e) => ({ eventName: e.name, date: e.date, location: e.location, placement: 1, total: 100 })),
    };
  return {
    athleteId: id, name: m.name, age: m.age, groups, school: "Școala de Patinaj AFI Cotroceni", contact: own ? { name: "Părinte Exemplu", phone: "0722 000 222" } : null,
    sectionName: "Școala de patinaj", groupRows,
    presence: { season: 26, lessons: 4, last: addDays(today, -2), missedThisMonth: 1 },
    abonament: own ? { code: "A-0124", next: 5, slots: 8, validUntil: "2026-11-30", location: "AFI Cotroceni" } : null,
    competitions,
  };
}

function changePassword({ body, res, email }) {
  const a = world.accounts[email];
  if (a.password && body.current !== a.password) return club(res, 400, "Parola actuală nu este corectă.");
  const refusal = passwordRefusal(body.password);
  if (refusal) return club(res, 400, refusal);
  a.password = body.password;
  ok(res, { toast: MSG.saved });
}

function devicesOf(req) {
  const key = req.headers["x-portal-device"];
  return world.devices.map((d) => ({ id: d.id, label: d.label, lastSeenAt: d.lastSeenAt, current: d.key === key }));
}

function removeDevice({ res, params, sess }) {
  const i = world.devices.findIndex((d) => d.id === params[0]);
  if (i < 0) return notFound(res);
  world.devices.splice(i, 1);
  for (const s of auth.sessions.values()) if (s.deviceId === params[0]) s.revoked = true;
  ok(res, { revokedCurrent: sess.deviceId === params[0] });
}

// ---------- coach routes ----------
const withGroup = (fn) => (ctx) => {
  const g = groupOf(ctx.params[0]);
  return g ? fn(ctx, g) : notFound(ctx.res);
};
const ownClub = (fn) => withGroup((ctx, g) => (g.own && g.kind === "club" ? fn(ctx, g) : club(ctx.res, 403, MSG.noAccess)));
const ownOnly = (fn) => withGroup((ctx, g) => (g.own ? fn(ctx, g) : club(ctx.res, 403, MSG.noAccess)));
// Backend writeRight: the event's group must be an own Club group; an unknown event is 404.
const eventGuard = (fn) => (ctx) => {
  const g = groupOfEvent(ctx.params[0]);
  if (!g) return fn(ctx);
  return g.own && g.kind === "club" ? fn(ctx) : club(ctx.res, 403, MSG.noAccess);
};

function savedDays({ res, query }, g) {
  const month = query.get("month") ?? "";
  if (!/^\d{4}-\d{2}$/.test(month)) return club(res, 400, MSG.invalid);
  const dates = Object.values(world.saved).filter((r) => r.groupId === g.id && r.date.startsWith(month) && (g.own || r.coachIds.includes("tm-andrei"))).map((r) => r.date).sort();
  ok(res, { month, dates });
}

function searchAthletes({ res, query }) {
  const q = lower(query.get("q") ?? "");
  const inGroup = new Set((groupOf(query.get("group"))?.own ? world.members[query.get("group")] ?? [] : []).map((m) => m.athleteId));
  const all = [...world.pool, ...Object.values(world.members).flat()];
  const rows = all.filter((m) => !inGroup.has(m.athleteId) && lower(m.name).includes(q)).map((m) => ({ athleteId: m.athleteId, name: m.name, age: m.age }));
  ok(res, [...new Map(rows.map((r) => [r.athleteId, r])).values()]);
}

function newAthlete({ body, res }) {
  const g = groupOf(body.groupId);
  if (!g) return club(res, 400, MSG.invalid);
  if (typeof body.name !== "string" || !body.name.trim()) return club(res, 400, MSG.invalid);
  // Real backend: a birth date is accepted as ZZ.LL.AAAA only (readPickedDate).
  if (body.birthDate !== undefined && !/^\d{2}\.\d{2}\.\d{4}$/.test(String(body.birthDate))) return club(res, 400, "Alegeți data nașterii.");
  const athleteId = `anew${++world.counters.athlete}`;
  world.members[g.id].push({ athleteId, name: body.name.trim(), age: null, isNew: true, alsoIn: [], inactive: false });
  ok(res, { athleteId, toast: MSG.saved });
}

function addMembers({ body, res }, g) {
  if (!Array.isArray(body.athleteIds) || !body.athleteIds.length) return club(res, 400, MSG.invalid);
  const names = [];
  for (const id of body.athleteIds) {
    const m = [...world.pool, ...Object.values(world.members).flat()].find((x) => x.athleteId === id);
    if (!m) continue;
    names.push(m.name);
    world.members[g.id].push({ ...m, isNew: false, alsoIn: [] });
  }
  ok(res, { added: names.length, athleteNames: names, groupName: g.name });
}

const coachRoutes = [
  ["GET", /^\/me$/, ({ res, sess }) => ok(res, meData(sess.email))],
  ["PUT", /^\/me$/, ({ res, body, sess }) => { world.accounts[sess.email].phone = body.phone ?? null; ok(res, { toast: MSG.saved }); }],
  ["POST", /^\/me\/password$/, (ctx) => changePassword({ ...ctx, email: ctx.sess.email })],
  ["GET", /^\/me\/devices$/, ({ res, req }) => ok(res, devicesOf(req))],
  ["DELETE", /^\/me\/devices\/([^/]+)$/, removeDevice],
  ["GET", /^\/today$/, ({ res, query }) => ok(res, todayData(query.get("date") ?? today))],
  ["GET", /^\/today\/club$/, ({ res }) => ok(res, {
    date: today,
    rows: [
      { kind: "group", groupId: "gprimii", name: "Primii Pași", school: true, startTime: "10:00", durationMin: 50, coaches: ["Ioana Dinu", "Mihai Stan"], location: "AFI Cotroceni", own: false },
      { kind: "lesson", lessonId: null, startTime: "13:00", durationMin: 45, coach: "Ioana Dinu", own: false },
      { kind: "lesson", lessonId: "ldone", startTime: "15:00", durationMin: 50, coach: "Andrei Popa", own: true },
      { kind: "group", groupId: "gavansati", name: "Avansați", school: false, startTime: "18:15", durationMin: 60, coaches: ["Andrei Popa"], location: "AFI Cotroceni", own: true },
    ],
  })],
  ["GET", /^\/groups$/, ({ res }) => {
    const all = Object.values(world.groups);
    ok(res, {
      mine: all.filter((g) => g.own).map((g) => ({ groupId: g.id, name: g.name, kind: g.kind, program: g.program, children: childrenOf(g.id), next: nextOf(g) })),
      others: [
        ...all.filter((g) => !g.own).map((g) => ({ groupId: g.id, name: g.name, coaches: g.coaches, program: g.program, children: childrenOf(g.id), next: nextOf(g) })),
        // A group with no weekly schedule: no program lines and no next class.
        ...(state.unscheduledGroup ? [{ groupId: "gfaraprogram", name: "Fără program", coaches: ["Bianca Ene"], program: [], children: 18, next: null }] : []),
      ],
    });
  }],
  ["GET", /^\/groups\/([^/]+)$/, withGroup(({ res }, g) => ok(res, groupPage(g)))],
  ["GET", /^\/groups\/([^/]+)\/saved-days$/, withGroup(savedDays)],
  ["GET", /^\/session$/, ({ res, query }) => {
    const s = sessionFromQuery(query);
    if (!s) return notFound(res);
    const ref = sessionRef(query);
    const right = presenceRight(ref.g, ref.date, ref.rec, ref.added);
    return right.read ? ok(res, s) : club(res, 403, MSG.noAccess);
  }],
  ["POST", /^\/session\/check$/, ({ res, body }) => {
    const g = groupOf(body.groupId);
    // Backend checkCoachSession: own group, or a scheduled class of another group in today - 7 .. today; anything else 403.
    const standIn = g && !g.own && scheduled(g, body.date) && body.date <= today && body.date >= addDays(today, -ARCHIVE_DAYS);
    return g && (g.own || standIn) ? ok(res, checkSession(body)) : club(res, 403, MSG.noAccess);
  }],
  ["PUT", /^\/session$/, saveSession],
  ["GET", /^\/lessons\/([^/]+)$/, ({ res, params }) => { const l = world.lessons[params[0]]; return l && l.coachIds.includes(ME) ? ok(res, lessonView(l)) : notFound(res); }],
  ["POST", /^\/lessons$/, lessonCreate],
  ["PUT", /^\/lessons\/([^/]+)\/plan$/, lessonPlan],
  ["PUT", /^\/lessons\/([^/]+)$/, lessonWrite],
  ["DELETE", /^\/lessons\/([^/]+)$/, lessonDelete],
  ["GET", /^\/athletes\/search$/, searchAthletes],
  ["POST", /^\/athletes$/, newAthlete],
  ["GET", /^\/athletes\/([^/]+)$/, ({ res, params }) => { const c = athleteCard(params[0]); return c === "none" ? club(res, 403, MSG.noAccess) : c ? ok(res, c) : notFound(res); }],
  ["POST", /^\/groups\/([^/]+)\/members$/, ownOnly(addMembers)],
  ["GET", /^\/calendar$/, ({ res, query }) => {
    const month = query.get("month") ?? "";
    return /^\d{4}-(0[1-9]|1[0-2])$/.test(month) ? ok(res, calendarData(month)) : club(res, 400, MSG.invalid);
  }],
  ["GET", /^\/competitions$/, ({ res, query }) => ok(res, competitionsData(query))],
  ["POST", /^\/groups\/([^/]+)\/members\/([^/]+)\/move$/, (ctx) => changeMember(ctx, true)],
  ["POST", /^\/groups\/([^/]+)\/members\/([^/]+)\/remove$/, (ctx) => changeMember(ctx, false)],
  ["GET", /^\/history$/, ({ res, query }) => ok(res, historyData(query.get("month")))],
  ["GET", /^\/groups\/([^/]+)\/program$/, ownOnly(({ res, query }, g) => ok(res, programData(g, query.get("month"))))],
  ["POST", /^\/groups\/([^/]+)\/program$/, ownClub(programAdd)],
  ["PUT", /^\/groups\/([^/]+)\/program-public$/, ownClub(({ res, body }, g) => { g.programPublic = Boolean(body.value); ok(res, { toast: MSG.saved }); })],
  ["PUT", /^\/program\/([^/]+)$/, eventGuard((ctx) => programRuleWrite(ctx, false))],
  ["POST", /^\/program\/([^/]+)\/end$/, eventGuard((ctx) => programRuleWrite(ctx, true))],
  ["DELETE", /^\/program\/([^/]+)$/, eventGuard(({ res, params }) => {
    const g = groupOfEvent(params[0]);
    const one = g ? (world.oneOffs[g.id] ?? []).find((o) => o.eventId === params[0]) : null;
    if (g && one && hasSavedSession(g.id, one.date)) return club(res, 409, REFUSE.datePresence);
    if (g && one) world.oneOffs[g.id] = world.oneOffs[g.id].filter((o) => o !== one);
    ok(res, { date: one?.date ?? today });
  })],
  ["PUT", /^\/program\/([^/]+)\/dates\/(\d{4}-\d{2}-\d{2})$/, eventGuard(programDate)],
];

// ---------- dispatch ----------
const PREFIX = "/api/portal/coach";

function record(req, url, body) {
  calls.push({
    method: req.method, path: url.pathname + url.search, body,
    headers: {
      secret: req.headers["x-portal-secret"] ?? null, ip: req.headers["x-portal-client-ip"] ?? null, ua: req.headers["x-portal-user-agent"] ?? null,
      device: req.headers["x-portal-device"] ?? null, auth: req.headers.authorization ?? null,
    },
  });
}

function find(table, method, path) {
  for (const [m, re, fn] of table) {
    const hit = m === method ? re.exec(path) : null;
    if (hit) return { fn, params: hit.slice(1) };
  }
  return null;
}

function handleMock(req, res, url, body) {
  if (url.pathname === "/__mock/log") return send(res, 200, { calls, refreshes: auth.refreshes, requests: world.requests });
  if (url.pathname === "/__mock/reset") { reset(); return send(res, 200, { ok: true }); }
  if (url.pathname === "/__mock/state") {
    Object.assign(state, body);
    applyRevokeAll();
    return send(res, 200, { ok: true, state });
  }
  return null;
}

function handlePortal(req, res, url, body) {
  const wanted = !state.refuseSecret && req.headers["x-portal-secret"] === SECRET;
  const isCoach = url.pathname.startsWith(`${PREFIX}/`);
  const route = isCoach ? find(coachRoutes, req.method, url.pathname.slice(PREFIX.length)) : find(authRoutes, req.method, url.pathname);
  if (!route) return send(res, 404, { data: null, error: { status: 404, name: "NotFoundError", message: "Not Found" } });
  if (!wanted) return isCoach ? policy403(res) : club(res, 403, "Forbidden");
  const ctx = { req, res, body, query: url.searchParams, params: route.params, method: req.method };
  if (!isCoach) return route.fn(ctx);
  const sess = coachSession(req);
  if (!sess) return unauthorized(res);
  if (state.cutAccount) return policy403(res);
  if (state.coachDown && req.method === "GET") return club(res, 500, "Nu am putut încărca datele.");
  return route.fn({ ...ctx, sess });
}

createServer(async(req, res) => {
  const url = new URL(req.url ?? "/", `http://localhost:${PORT}`);
  const body = req.method === "GET" ? {} : await readBody(req);
  if (url.pathname.startsWith("/__mock/")) return handleMock(req, res, url, body);
  record(req, url, body);
  if (req.method !== "GET" && url.pathname.startsWith(`${PREFIX}/`)) world.requests[`${req.method} ${url.pathname.slice(PREFIX.length)}`] = body;
  return handlePortal(req, res, url, body);
}).listen(PORT, () => console.log(`mock portal on ${PORT}`));
