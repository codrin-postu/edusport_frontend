export interface WeekendDate {
  startDate: Date;
  endDate: Date;
  displayText: string;
}

export function parseWeekendDates(dateStr: string, month: number, year: number): WeekendDate[] {
  const dates = dateStr.split(", ");

  return dates.map(dateRange => {
    if (dateRange.includes("-")) {
      const [start, end] = dateRange.split("-").map(d => d.trim());
      const startDay = parseInt(start);
      const endDay = parseInt(end);

      return {
        startDate: new Date(year, month - 1, startDay),
        endDate: new Date(year, month - 1, endDay),
        displayText: `${start}-${end}`
      };
    } else {
      const day = parseInt(dateRange.trim());
      return {
        startDate: new Date(year, month - 1, day),
        endDate: new Date(year, month - 1, day),
        displayText: dateRange.trim()
      };
    }
  });
}

export function getNextActiveWeekend(activeWeekends: WeekendDate[]): WeekendDate | null {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  for (const weekend of activeWeekends) {
    if (weekend.startDate >= today) {
      return weekend;
    }
  }

  return null;
}

export function isWeekendInPast(weekend: WeekendDate): boolean {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  return weekend.endDate < today;
}

export function isNextWeekend(weekend: WeekendDate, nextWeekend: WeekendDate | null): boolean {
  if (!nextWeekend) return false;
  return weekend.startDate.getTime() === nextWeekend.startDate.getTime();
}