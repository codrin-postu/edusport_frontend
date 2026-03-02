export interface HolidayEntry {
  start: string; // "YYYY-MM-DD"
  end: string; // "YYYY-MM-DD" (inclusive — event converter adds +1 day for FullCalendar's exclusive end)
  title: string;
  type: "holiday" | "vacation";
}

// Romanian public holidays within the 2025-2026 skating season (Oct 2025 – May 2026)
export const ROMANIAN_HOLIDAYS_2025_2026: HolidayEntry[] = [
  { start: "2025-11-01", end: "2025-11-01", title: "Ziua Tuturor Sfinților", type: "holiday" },
  { start: "2025-11-30", end: "2025-11-30", title: "Sf. Andrei", type: "holiday" },
  { start: "2025-12-01", end: "2025-12-01", title: "Ziua Națională", type: "holiday" },
  { start: "2025-12-25", end: "2025-12-26", title: "Crăciun", type: "holiday" },
  { start: "2026-01-01", end: "2026-01-02", title: "Anul Nou", type: "holiday" },
  { start: "2026-01-24", end: "2026-01-24", title: "Unirea Principatelor", type: "holiday" },
  { start: "2026-04-20", end: "2026-04-21", title: "Paști", type: "holiday" },
  { start: "2026-05-01", end: "2026-05-01", title: "Ziua Muncii", type: "holiday" },
];

// Romanian school vacation periods for 2025-2026 academic year
// Source: approximate MECTS calendar — verify before publishing
export const SCHOOL_VACATIONS_2025_2026: HolidayEntry[] = [
  { start: "2025-10-25", end: "2025-11-02", title: "Vacanță de toamnă", type: "vacation" },
  { start: "2025-12-20", end: "2026-01-11", title: "Vacanță de iarnă", type: "vacation" },
  { start: "2026-01-31", end: "2026-02-08", title: "Vacanță semestrială", type: "vacation" },
  { start: "2026-04-11", end: "2026-04-26", title: "Vacanță de primăvară", type: "vacation" },
];
