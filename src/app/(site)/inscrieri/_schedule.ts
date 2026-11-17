// ---------------------------------------------------------------------------
// "Programul pe următoarea lună" on the Abonament step: the Școala de patinaj
// weekends from today to the same day next month, from the site calendar
// (/api/calendar/occurrences, turned into weekend events by
// utils/occurrences-to-calendar.ts, as on /cursuri/program).
// No runtime imports: scripts/inscrieri/schedule.test.mjs loads this file.
// ---------------------------------------------------------------------------

export type WeekendState = "curs" | "liber" | "anulat";

/** One weekend row. Plain strings, so the server page can pass it to the client form. */
export type ScheduleWeekend = {
  startDate: string; // YYYY-MM-DD
  endDate: string;
  state: WeekendState;
  description: string | null;
};

export type ScheduleMonth = { month: string; weekends: ScheduleWeekend[] }; // month = "YYYY-MM"

const pad = (n: number) => String(n).padStart(2, "0");
const ymd = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

/** Today to the same day next month (31 January -> 28/29 February), local dates. */
export function nextMonthWindow(today: Date): { from: string; to: string } {
  const y = today.getFullYear();
  const m = today.getMonth();
  const lastDay = new Date(y, m + 2, 0).getDate();
  const to = new Date(y, m + 1, Math.min(today.getDate(), lastDay));
  return { from: ymd(today), to: ymd(to) };
}

const STATES: readonly WeekendState[] = ["curs", "liber", "anulat"];

/** The weekend events touching the window, oldest first. Other calendar events are dropped. */
export function scheduleWeekends(
  events: { type: string; startDate: string; endDate: string; description?: string | null }[],
  window: { from: string; to: string },
): ScheduleWeekend[] {
  return events
    .filter((e) => (STATES as readonly string[]).includes(e.type))
    .filter((e) => e.endDate >= window.from && e.startDate <= window.to)
    .map((e) => ({ startDate: e.startDate, endDate: e.endDate, state: e.type as WeekendState, description: e.description ?? null }))
    .sort((a, b) => a.startDate.localeCompare(b.startDate));
}

export function groupByMonth(weekends: ScheduleWeekend[]): ScheduleMonth[] {
  const months: ScheduleMonth[] = [];
  for (const w of weekends) {
    const month = w.startDate.slice(0, 7);
    const last = months[months.length - 1];
    if (last && last.month === month) last.weekends.push(w);
    else months.push({ month, weekends: [w] });
  }
  return months;
}
