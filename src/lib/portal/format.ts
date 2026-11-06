// Date and duration texts of the coach app. Pure, no imports (loaded by Node tests).
const WEEKDAY_TILE = ["DU", "LU", "MA", "MI", "JO", "VI", "SÂ"] as const;
const WEEKDAY_FULL = ["duminică", "luni", "marți", "miercuri", "joi", "vineri", "sâmbătă"] as const;
const MONTH_TILE = ["IAN", "FEB", "MAR", "APR", "MAI", "IUN", "IUL", "AUG", "SEP", "OCT", "NOI", "DEC"] as const;
const MONTH_SHORT = ["ian", "feb", "mar", "apr", "mai", "iun", "iul", "aug", "sep", "oct", "noi", "dec"] as const;
const MONTH_LONG = ["ianuarie", "februarie", "martie", "aprilie", "mai", "iunie", "iulie", "august", "septembrie", "octombrie", "noiembrie", "decembrie"] as const;
const BUCHAREST = "Europe/Bucharest";

type Parts = { year: number; month: number; day: number; weekday: number };

function parts(date: string): Parts {
  const [year, month, day] = date.slice(0, 10).split("-").map(Number);
  const weekday = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
  return { year, month, day, weekday };
}

/** "2026-10-06" -> "MA 6 OCT" */
export function dayTile(date: string): string {
  const p = parts(date);
  return `${WEEKDAY_TILE[p.weekday]} ${p.day} ${MONTH_TILE[p.month - 1]}`;
}

/** "2026-10-07" -> { day: "7", weekday: "MI" } */
export function dateTile(date: string): { day: string; weekday: string } {
  const p = parts(date);
  return { day: String(p.day), weekday: WEEKDAY_TILE[p.weekday] };
}

/** "2026-09-30" -> "30 sep" */
export function shortDate(date: string): string {
  const p = parts(date);
  return `${p.day} ${MONTH_SHORT[p.month - 1]}`;
}

/** "2026-11-14" -> "14 noiembrie" */
export function dayMonth(date: string): string {
  const p = parts(date);
  return `${p.day} ${MONTH_LONG[p.month - 1]}`;
}

/** "2026-10" -> "OCTOMBRIE" */
export function monthName(month: string): string {
  return MONTH_LONG[parts(`${month.slice(0, 7)}-01`).month - 1].toUpperCase();
}

/** "2026-10-16" -> "vineri 16 oct" */
export function pickLabel(date: string): string {
  return `${WEEKDAY_FULL[parts(date).weekday]} ${shortDate(date)}`;
}

/** 50 -> "50 min", 60 -> "1 h", 75 -> "1 h 15 min" */
export function durationText(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h === 0) return `${m} min`;
  return m === 0 ? `${h} h` : `${h} h ${m} min`;
}

function bucharestDay(iso: string): string {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: BUCHAREST }).format(new Date(iso));
}

function dayBefore(date: string): string {
  const p = parts(date);
  return new Date(Date.UTC(p.year, p.month - 1, p.day - 1)).toISOString().slice(0, 10);
}

/** "azi", "ieri", else `shortDate`; the day of `iso` is the Bucharest day. */
export function relativeDay(iso: string, today: string): string {
  const day = bucharestDay(iso);
  if (day === today) return "azi";
  if (day === dayBefore(today)) return "ieri";
  return shortDate(day);
}

/** "2026-10-16" or "2026-10" -> "2026-10-01" */
export function firstOfMonth(date: string): string {
  return `${date.slice(0, 7)}-01`;
}

/** addMonths("2026-12", 1) -> "2027-01" */
export function addMonths(month: string, n: number): string {
  const [year, m] = month.split("-").map(Number);
  const index = year * 12 + (m - 1) + n;
  const y = Math.floor(index / 12);
  return `${y}-${String((index % 12) + 1).padStart(2, "0")}`;
}
