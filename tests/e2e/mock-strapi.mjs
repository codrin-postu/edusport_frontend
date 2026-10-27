// A stand-in for Strapi during the registration e2e test. Serves the public
// club data (plan 2A shape), Setări site, the Școala de patinaj weekends of
// any requested window, and the registration submit (plans 2A + 2D shape).
// Everything else is a 404, which every page already tolerates.
// Usage: node tests/e2e/mock-strapi.mjs <port>
import { createServer } from "node:http";

const PORT = Number(process.argv[2] ?? 18890);

// Prices from the approved mockup (form-steps-v4); not the club's real prices.
const item = (name, kind, sessions, memberPrice, nonMemberPrice, tooltip = null) => ({ name, kind, sessions, memberPrice, nonMemberPrice, tooltip });
export const CLUB = {
  season: { label: "2026-2027", startMonth: "2026-10-01", endMonth: "2027-05-31" },
  membershipFee: 270,
  schools: [
    {
      name: "Școala de Patinaj - AFI Cotroceni",
      slug: "afi-cotroceni",
      priceNotes: ["Taxa de membru se achită o singură dată pe sezon."],
      priceLists: [
        {
          name: "Standard",
          items: [
            item("1 ședință grup", "session", null, null, 180, "Disponibil doar pentru prima ședință"),
            item("Abonament 6 ședințe grup", "subscription", 6, 660, 790),
            item("Abonament 8 ședințe grup", "subscription", 8, 770, 890),
          ],
        },
        { name: "Avansați Gold", items: [item("Abonament Avansați Gold 8 ședințe", "subscription", 8, 1080, null)] },
      ],
    },
    {
      name: "Școala de Patinaj - Patinoar 2",
      slug: "patinoar-2",
      priceNotes: [],
      priceLists: [{ name: "Standard", items: [item("Abonament 8 ședințe grup", "subscription", 8, 700, 820)] }],
    },
  ],
};

const SETTINGS = { contact: { whatsappChannelUrl: "https://example.com/canal-whatsapp" }, registration: { open: true } };

const SCHEDULE = [{
  section: { name: "Școala de Patinaj - AFI Cotroceni", slug: "afi-cotroceni" },
  slots: [
    { start: "09:00", end: "09:50", groups: ["Avansați Gold"] },
    { start: "10:00", end: "10:50", groups: ["Primii Pași", "Intermediari Silver", "Avansați Silver"] },
    { start: "11:00", end: "11:50", groups: ["Începători", "Intermediari Bronze", "Avansați Bronze"] },
  ],
}];

const CORS = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, OPTIONS",
  "access-control-allow-headers": "content-type",
};

function json(res, status, body) {
  res.writeHead(status, { "content-type": "application/json", ...CORS });
  res.end(JSON.stringify(body));
}

const pad = (n) => String(n).padStart(2, "0");
const ymd = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

/** The Sunday of the week (Monday to Sunday) that holds the 1st of the month of `now`: the week the calendar opens on. */
function doubledSunday(now) {
  const first = new Date(now.getFullYear(), now.getMonth(), 1);
  return ymd(new Date(first.getFullYear(), first.getMonth(), 1 + ((7 - first.getDay()) % 7)));
}

/**
 * Every Saturday and Sunday in [from, to] as a scheduled Școala date, one occurrence per group
 * (phase 4): the Sunday in the opening week has a second group, and the 1st of the month holds a
 * Club date named after its group.
 */
function weekendOccurrences(from, to) {
  const out = [];
  const now = new Date();
  const doubled = doubledSunday(now);
  const clubDate = ymd(new Date(now.getFullYear(), now.getMonth(), 1));
  const [y, m, d] = from.split("-").map(Number);
  for (let day = new Date(y, m - 1, d); ymd(day) <= to; day.setDate(day.getDate() + 1)) {
    const date = ymd(day);
    if (day.getDay() === 0 || day.getDay() === 6) {
      out.push({ eventId: 1, title: "Școala de patinaj", type: "scoala", label: null, color: null, order: 0, date, startTime: "10:00", endTime: "10:50", status: "scheduled", cancelReason: null, state: "curs", groupName: "Primii Pași" });
      if (date === doubled) {
        out.push({ eventId: 2, title: "Școala de patinaj", type: "scoala", label: null, color: null, order: 0, date, startTime: "09:00", endTime: "09:50", status: "scheduled", cancelReason: null, state: "curs", groupName: "Avansați Gold" });
      }
    }
    if (date === clubDate) {
      out.push({ eventId: 3, title: "Antrenament", type: "antrenament", label: null, color: null, order: 1, date, startTime: "18:00", endTime: "19:00", status: "scheduled", cancelReason: null, groupName: "Grupa Club Alfa" });
    }
  }
  return out;
}

createServer((req, res) => {
  const url = new URL(req.url ?? "/", `http://localhost:${PORT}`);
  if (req.method === "OPTIONS") return json(res, 204, {});
  if (url.pathname === "/api/club/public") return json(res, 200, { data: CLUB });
  if (url.pathname === "/api/site-settings") return json(res, 200, { data: SETTINGS });
  if (url.pathname === "/api/club/schedule") return json(res, 200, { data: SCHEDULE });
  if (url.pathname === "/api/program") return json(res, 200, { data: { scheduleGroups: [{ timeSlot: "10:00 - 10:50", courses: ["Primii Paşi"] }] } });
  if (url.pathname === "/api/calendar/occurrences") {
    return json(res, 200, { data: weekendOccurrences(url.searchParams.get("from"), url.searchParams.get("to")), blackouts: [] });
  }
  if (url.pathname === "/api/forms/inscriere" && req.method === "POST") {
    return json(res, 200, { ok: true, registrationNumber: "2026-0142", downloadToken: "tok-e2e", documents: ["acord", "adeziune"] });
  }
  return json(res, 404, { data: null, error: { status: 404 } });
}).listen(PORT, () => console.log(`mock strapi on ${PORT}`));
