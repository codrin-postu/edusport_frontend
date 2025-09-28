import { parseWeekendDates, getNextActiveWeekend, WeekendDate } from "@/utils/date";

export interface WeekendInfo {
  weekend: string;
  days: string[];
}

export interface MonthData {
  month: string;
  courseDates: WeekendInfo[];
  offDates: WeekendInfo[];
}

export const MONTH_MAPPINGS = {
  Octombrie: 10,
  Noiembrie: 11,
  Decembrie: 12,
  Ianuarie: 1,
  Februarie: 2,
  Martie: 3,
  Aprilie: 4,
  Mai: 5,
} as const;

export const getMonthNumber = (monthName: string): number => {
  return MONTH_MAPPINGS[monthName as keyof typeof MONTH_MAPPINGS] || 1;
};

export const getAllActiveWeekends = (seasonCalendar: MonthData[]): WeekendDate[] => {
  const allWeekends: WeekendDate[] = [];

  seasonCalendar.forEach((month) => {
    month.courseDates.forEach((dateInfo) => {
      const monthName = month.month.split(" ")[0];
      const year = month.month.includes("2026") ? 2026 : 2025;
      const monthNumber = getMonthNumber(monthName);
      const weekendDates = parseWeekendDates(
        dateInfo.weekend,
        monthNumber,
        year,
      );
      allWeekends.push(...weekendDates);
    });
  });

  return allWeekends.sort(
    (a, b) => a.startDate.getTime() - b.startDate.getTime(),
  );
};

export const getAllOffWeekends = (seasonCalendar: MonthData[]): WeekendDate[] => {
  const allWeekends: WeekendDate[] = [];

  seasonCalendar.forEach((month) => {
    month.offDates.forEach((dateInfo) => {
      const monthName = month.month.split(" ")[0];
      const year = month.month.includes("2026") ? 2026 : 2025;
      const monthNumber = getMonthNumber(monthName);
      const weekendDates = parseWeekendDates(
        dateInfo.weekend,
        monthNumber,
        year,
      );
      allWeekends.push(...weekendDates);
    });
  });

  return allWeekends;
};

export const createCalendarModifiers = (
  allActiveWeekends: WeekendDate[],
  allOffWeekends: WeekendDate[],
  nextActiveWeekend: WeekendDate | null
) => {
  const createDateRange = (weekend: WeekendDate): Date[] => {
    const dates = [];
    let current = new Date(weekend.startDate);
    while (current <= weekend.endDate) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return dates;
  };

  return {
    active: allActiveWeekends.flatMap(createDateRange),
    off: allOffWeekends.flatMap(createDateRange),
    next: nextActiveWeekend ? createDateRange(nextActiveWeekend) : [],
  };
};

export const isDateInWeekends = (date: Date, weekends: WeekendDate[]): boolean => {
  return weekends.some(
    (weekend) =>
      date.getTime() >= weekend.startDate.getTime() &&
      date.getTime() <= weekend.endDate.getTime(),
  );
};

export const getTooltipContent = (
  date: Date,
  allActiveWeekends: WeekendDate[],
  allOffWeekends: WeekendDate[],
  nextActiveWeekend: WeekendDate | null,
  formatFn: (date: Date, format: string, options?: any) => string
): string | null => {
  const dayOfWeek = date.getDay();
  if (dayOfWeek !== 0 && dayOfWeek !== 6) return null; // Not weekend

  const isActive = isDateInWeekends(date, allActiveWeekends);
  const isOff = isDateInWeekends(date, allOffWeekends);
  const isNext = nextActiveWeekend && isDateInWeekends(date, [nextActiveWeekend]);

  if (isNext) {
    return `Următorul weekend activ - ${formatFn(date, "d MMM yyyy")}`;
  } else if (isActive) {
    return `Cursuri programate - ${formatFn(date, "d MMM yyyy")}`;
  } else if (isOff) {
    return `Weekend liber - ${formatFn(date, "d MMM yyyy")}`;
  }

  return null;
};