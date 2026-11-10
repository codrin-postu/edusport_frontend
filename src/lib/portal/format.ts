// Date and duration texts of the coach app. Pure, type imports only (loaded by Node tests).
import type { DayKey, WeekOfMonth } from "./api-types";

const WEEKDAY_TILE = ["DU", "LU", "MA", "MI", "JO", "VI", "SÂ"] as const;
const WEEKDAY_FULL = ["duminică", "luni", "marți", "miercuri", "joi", "vineri", "sâmbătă"] as const;
const MONTH_SHORT = ["ian", "feb", "mar", "apr", "mai", "iun", "iul", "aug", "sep", "oct", "noi", "dec"] as const;
const MONTH_LONG = ["ianuarie", "februarie", "martie", "aprilie", "mai", "iunie", "iulie", "august", "septembrie", "octombrie", "noiembrie", "decembrie"] as const;
const BUCHAREST = "Europe/Bucharest";

type Parts = { year: number; month: number; day: number; weekday: number };

function parts(date: string): Parts {
  const [year, month, day] = date.slice(0, 10).split("-").map(Number);
  const weekday = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
  return { year, month, day, weekday };
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

const WEEKDAY_SHORT = ["Dum", "Lun", "Mar", "Mie", "Joi", "Vin", "Sâm"] as const;
const WEEKDAY_LONG = ["Duminică", "Luni", "Marți", "Miercuri", "Joi", "Vineri", "Sâmbătă"] as const;
const MONTH_SHORT_CAP = ["Ian", "Feb", "Mar", "Apr", "Mai", "Iun", "Iul", "Aug", "Sep", "Oct", "Noi", "Dec"] as const;

/** "0722 000 222" or "+40 722 000 222" -> { tel: "tel:+40722000222", wa: "https://wa.me/40722000222" }; fewer than 10 digits -> null */
export function phoneLinks(phone: string): { tel: string; wa: string } | null {
  let digits = phone.replace(/\D/g, "");
  if (digits.length < 10) return null;
  if (digits.startsWith("00")) digits = digits.slice(2);
  else if (digits.startsWith("0")) digits = `40${digits.slice(1)}`;
  return { tel: `tel:+${digits}`, wa: `https://wa.me/${digits}` };
}

/** "2026-11-05" -> "Joi" */
export function weekdayShort(date: string): string {
  return WEEKDAY_SHORT[parts(date).weekday];
}

/** "2026-11-05" -> "Noi" */
export function monthShort(date: string): string {
  return MONTH_SHORT_CAP[parts(date).month - 1];
}

/** "2026-11-04" -> "Miercuri, 4 noiembrie" */
export function longDay(date: string): string {
  const p = parts(date);
  return `${WEEKDAY_LONG[p.weekday]}, ${p.day} ${MONTH_LONG[p.month - 1]}`;
}

/** "2026-11-05" -> "Joi, 5 noi" */
export function shortWhen(date: string): string {
  const p = parts(date);
  return `${WEEKDAY_LONG[p.weekday]}, ${p.day} ${MONTH_SHORT[p.month - 1]}`;
}

/** "2026-10-26" -> "26 oct 2026" */
export function dayMonthYear(date: string): string {
  return `${shortDate(date)} ${parts(date).year}`;
}

/** "2026-11-12" -> "12 noi" */
export function dayMonthShort(date: string): string {
  return shortDate(date);
}

/** 142.3 -> "142,30" (two decimals, comma); the points of a competition result. */
export function pointsText(total: number): string {
  return total.toFixed(2).replace(".", ",");
}

const DAY_ORDER: DayKey[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
const DAY_WORD: Record<DayKey, string> = { mon: "luni", tue: "marți", wed: "miercuri", thu: "joi", fri: "vineri", sat: "sâmbătă", sun: "duminică" };

/** "2026-11-10" -> "marți" */
export function weekdayLong(date: string): string {
  return WEEKDAY_FULL[parts(date).weekday];
}

/** "tue" -> "marți" */
export function weekdayOfDay(day: DayKey): string {
  return DAY_WORD[day];
}

/** ["thu", "tue"] -> "marți și joi"; three: "luni, miercuri și vineri" (Monday first) */
export function daysSpoken(days: DayKey[]): string {
  const words = DAY_ORDER.filter((d) => days.includes(d)).map((d) => DAY_WORD[d]);
  if (words.length < 2) return words.join("");
  return `${words.slice(0, -1).join(", ")} și ${words[words.length - 1]}`;
}

/** "2026-11-11" -> "11 noiembrie" */
export function dayMonthLong(date: string): string {
  return dayMonth(date);
}

/** Day 1-7 "first", 8-14 "second", 15-21 "third", 22-28 "fourth", 29-31 "last". */
export function weekOfMonthOf(date: string): WeekOfMonth {
  const d = parts(date).day;
  if (d <= 7) return "first";
  if (d <= 14) return "second";
  if (d <= 21) return "third";
  if (d <= 28) return "fourth";
  return "last";
}

/** "marți" -> "Marți" */
export const capitalize = (s: string): string => (s ? s[0].toUpperCase() + s.slice(1) : s);
