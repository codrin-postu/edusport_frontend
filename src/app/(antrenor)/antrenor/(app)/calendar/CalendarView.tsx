"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CALENDAR, NAV } from "@/lib/portal/copy";
import { itemsOn, marksOf } from "@/lib/portal/calendar";
import { longDay } from "@/lib/portal/format";
import { monthTitle, shiftMonth } from "@/lib/portal/month-grid";
import type { CoachCalendar } from "@/lib/portal/api-types";
import { CalendarLegend } from "@/app/_portal/ui/CalendarLegend";
import { LoadError } from "@/app/_portal/ui/LoadError";
import { MonthGrid } from "@/app/_portal/ui/MonthGrid";
import { MonthPicker } from "@/app/_portal/ui/MonthPicker";
import { Column, Columns, PageBody } from "@/app/_portal/ui/PageBody";
import { PageHeader, PageSub } from "@/app/_portal/ui/PageHeader";
import { ListCard } from "@/app/_portal/ui/PortalCard";
import { Section } from "@/app/_portal/ui/SectionHeading";
import { Spinner } from "@/app/_portal/ui/Spinner";
import { bucharestToday } from "../../_lib/today";
import { usePortal } from "../../_lib/use-portal";
import { SessionRow } from "../../_ui/SessionRow";

const MONTH = /^\d{4}-(0[1-9]|1[0-2])$/;
const DAY = /^\d{4}-\d{2}-\d{2}$/;

/** The day the list shows when none was picked: today when it is in the month, else the first day with items. */
function defaultDay(cal: CoachCalendar): string | null {
  if (cal.today.startsWith(cal.month)) return cal.today;
  return cal.days[0]?.date ?? null;
}

export function CalendarView() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const rawMonth = params.get("luna");
  const rawDay = params.get("zi");
  const [fallbackMonth] = useState(() => bucharestToday().slice(0, 7));
  const month = rawMonth !== null && MONTH.test(rawMonth) ? rawMonth : fallbackMonth;
  const picked = rawDay !== null && DAY.test(rawDay) && rawDay.startsWith(month) ? rawDay : null;
  const calendar = usePortal<CoachCalendar>(`coach/calendar?month=${month}`);
  const goMonth = (n: number) => router.replace(`${pathname}?luna=${shiftMonth(month, n)}`);
  const pick = (date: string) => router.replace(`${pathname}?luna=${month}&zi=${date}`);
  const picker = (
    <MonthPicker
      title={monthTitle(month)}
      onPrev={() => goMonth(-1)}
      onNext={() => goMonth(1)}
      prevLabel={CALENDAR.prev}
      nextLabel={CALENDAR.next}
    />
  );
  const cal = calendar.data;
  const shown = cal ? (picked ?? defaultDay(cal)) : null;
  const items = cal && shown ? itemsOn(cal, shown) : [];
  return (
    <>
      <PageHeader back={{ href: "/", label: NAV.today }} title={CALENDAR.title} sub={CALENDAR.sub} actions={picker} />
      <PageBody>
        <PageSub>{CALENDAR.sub}</PageSub>
        {calendar.state === "loading" && <div className="flex justify-center py-6"><Spinner /></div>}
        {calendar.state === "error" && <LoadError onRetry={calendar.reload} />}
        {calendar.state === "ready" && cal && (
          <Columns>
            <Column grow={1} className="gap-(--portal-gap-14)">
              <div className="portal:hidden">{picker}</div>
              <MonthGrid month={month} marks={marksOf(cal)} selected={picked} today={cal.today} onSelect={pick} label={CALENDAR.grid} />
              <CalendarLegend />
            </Column>
            <Column grow={1}>
              {shown && (
                <Section title={longDay(shown)}>
                  {items.length === 0 ? (
                    <p className="text-body text-secondary">{CALENDAR.empty}</p>
                  ) : (
                    <ListCard>
                      {items.map((i) => (
                        <SessionRow
                          from="calendar"
                          key={i.lessonId ?? i.occurrenceKey ?? i.sessionId ?? `${i.startTime}${i.title}`}
                          row={{
                            kind: i.kind, date: shown, startTime: i.startTime, title: i.title, children: i.children, location: i.location, durationMin: i.durationMin,
                            done: i.done, cancelled: i.cancelled, sessionId: i.sessionId, occurrenceKey: i.occurrenceKey, lessonId: i.lessonId,
                          }}
                        />
                      ))}
                    </ListCard>
                  )}
                </Section>
              )}
            </Column>
          </Columns>
        )}
      </PageBody>
    </>
  );
}
