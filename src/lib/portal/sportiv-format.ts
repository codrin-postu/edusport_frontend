// Date, money and range texts of the sportiv app. Pure, type imports only (loaded by Node tests).
import { roCount } from "../ro-plural.ts";
import { shortDate, weekdayShort } from "./format.ts";

const BUCHAREST = "Europe/Bucharest";
const DAY_MS = 86_400_000;

/** "2026-11-05", "17:30" -> "Joi 5 noi, 17:30"; no time: "Joi 5 noi" */
export function historyWhen(date: string, time: string | null): string {
  const when = `${weekdayShort(date)} ${shortDate(date)}`;
  return time ? `${when}, ${time}` : when;
}

/** 150 -> "150 RON", 1250.5 -> "1.250,50 RON", 0 -> "0 RON" (cents only when there are some) */
export function ron(n: number): string {
  const cents = Math.round(n * 100);
  const sign = cents < 0 ? "-" : "";
  const abs = Math.abs(cents);
  const whole = Math.floor(abs / 100).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const fraction = abs % 100;
  const decimals = fraction === 0 ? "" : `,${String(fraction).padStart(2, "0")}`;
  return `${sign}${whole}${decimals} RON`;
}

/** (1, 20, 26) -> "1 - 20 din 26" */
export function range(from: number, to: number, total: number): string {
  return `${from} - ${to} din ${total}`;
}

/** The calendar day of an instant in Bucharest, "YYYY-MM-DD". */
export function bucharestDay(value: Date | string): string {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: BUCHAREST }).format(new Date(value));
}

/** "YYYY-MM-DD" -> whole days since the epoch, so two days subtract cleanly. */
function dayNumber(day: string): number {
  const [y, m, d] = day.split("-").map(Number);
  return Date.UTC(y, m - 1, d) / DAY_MS;
}

/** How long ago a date was, in whole months once a month has passed, else days; Bucharest days. */
export function sinceText(iso: string | null, now: Date): string {
  if (iso === null) return "nesetată";
  const from = bucharestDay(iso);
  const to = bucharestDay(now);
  const [fy, fm, fd] = from.split("-").map(Number);
  const [ty, tm, td] = to.split("-").map(Number);
  let months = (ty - fy) * 12 + (tm - fm);
  if (td < fd) months -= 1;
  if (months >= 1) return `acum ${roCount(months, "lună", "luni")}`;
  const days = dayNumber(to) - dayNumber(from);
  if (days <= 0) return "azi";
  return `acum ${roCount(days, "zi", "zile")}`;
}
