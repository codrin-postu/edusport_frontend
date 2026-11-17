// Month grid helpers for the coach calendar. Pure: no imports, loaded by Node tests.
const MONTHS = [
  "Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie",
  "Iulie", "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie",
];

function parts(month: string): [number, number] {
  const [y, m] = month.split("-").map(Number);
  return [y, m];
}

/** The cells of a month grid, Monday first: leading nulls, "YYYY-MM-DD" days, trailing nulls to a multiple of 7. */
export function monthCells(month: string): (string | null)[] {
  const [y, m] = parts(month);
  const lead = (new Date(Date.UTC(y, m - 1, 1)).getUTCDay() + 6) % 7;
  const days = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const cells: (string | null)[] = Array.from({ length: lead }, () => null);
  for (let d = 1; d <= days; d++) cells.push(`${month}-${String(d).padStart(2, "0")}`);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export function shiftMonth(month: string, by: number): string {
  const [y, m] = parts(month);
  const index = y * 12 + (m - 1) + by;
  return `${Math.floor(index / 12)}-${String((index % 12) + 1).padStart(2, "0")}`;
}

export function monthTitle(month: string): string {
  const [y, m] = parts(month);
  return `${MONTHS[m - 1]} ${y}`;
}
