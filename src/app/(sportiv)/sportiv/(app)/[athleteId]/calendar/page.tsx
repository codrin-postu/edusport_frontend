"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { CAL } from "@/lib/portal/copy-sportiv";
import { longDay } from "@/lib/portal/format";
import { monthTitle } from "@/lib/portal/month-grid";
import { itemsOnDay, sportivMarks } from "@/lib/portal/sportiv-calendar";
import { bucharestDay } from "@/lib/portal/sportiv-format";
import type { SportivCalendar } from "@/lib/portal/sportiv-types";
import { CalendarLegend, type LegendItem } from "@/app/_portal/ui/CalendarLegend";
import { LoadError } from "@/app/_portal/ui/LoadError";
import { MonthGrid } from "@/app/_portal/ui/MonthGrid";
import { MonthPicker } from "@/app/_portal/ui/MonthPicker";
import { Column, Columns, PageBody } from "@/app/_portal/ui/PageBody";
import { PageHeader } from "@/app/_portal/ui/PageHeader";
import { ListCard } from "@/app/_portal/ui/PortalCard";
import { Section } from "@/app/_portal/ui/SectionHeading";
import { SessionRow } from "@/app/_portal/ui/SessionRow";
import { Spinner } from "@/app/_portal/ui/Spinner";
import { useAthletes } from "../../_lib/athletes-context";
import { useSportiv } from "../../_lib/use-sportiv";
import { AccountButton } from "../../_ui/AccountSheet";

const LEGEND: LegendItem[] = [
  { bar: "bg-surface-dark", text: CAL.legend.grup },
  { bar: "bg-ice-blue", text: CAL.legend.individual },
  { bar: "bg-ice", text: CAL.legend.concurs },
  { bar: "bg-cancelled", text: CAL.legend.anulata },
];

const LINK =
  "flex min-h-(--portal-tap) items-center justify-center border-control border-line bg-surface-raised px-(--portal-small-btn-pad-x) text-(length:--portal-text-14) font-bold text-primary outline-none focus-visible:outline-2 focus-visible:outline-offset-(--focus-offset) focus-visible:outline-focus";

/** "YYYY-MM-DDTHH:mm" in Bucharest, to dim the sessions that are over. */
function bucharestNow(): string {
  const d = new Date();
  const time = new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Bucharest", hour: "2-digit", minute: "2-digit" }).format(d);
  return `${bucharestDay(d)}T${time}`;
}

/** Calendar: the athlete's own sessions by month. The first load sends no month; the arrows follow the answer. */
export default function CalendarPage() {
  const { athleteId } = useParams<{ athleteId: string }>();
  const { current } = useAthletes();
  const [month, setMonth] = useState<string | null>(null);
  const [picked, setPicked] = useState<string | null>(null);
  const [now] = useState(bucharestNow);
  const calendar = useSportiv<SportivCalendar>(`athletes/${athleteId}/calendar${month === null ? "" : `?month=${month}`}`);
  const cal = calendar.data;
  const today = now.slice(0, 10);
  const go = (to: string | null) => {
    if (to === null) return;
    setMonth(to);
    setPicked(null);
  };
  const picker = cal && (
    <MonthPicker
      title={monthTitle(cal.month)}
      onPrev={() => go(cal.prevMonth)}
      onNext={() => go(cal.nextMonth)}
      prevLabel={CAL.prevMonth}
      nextLabel={CAL.nextMonth}
      prevDisabled={cal.prevMonth === null}
      nextDisabled={cal.nextMonth === null}
    />
  );
  const inMonth = picked !== null && cal !== null && picked.startsWith(cal.month) ? picked : null;
  const shown = cal ? (inMonth ?? (today.startsWith(cal.month) ? today : (cal.items[0]?.date ?? null))) : null;
  const items = cal && shown ? itemsOnDay(cal.items, shown) : [];
  return (
    <>
      <PageHeader brand noTile title={CAL.title} sub={current ? CAL.sub(current.name) : undefined} actions={picker || undefined} phoneEnd={<AccountButton />} />
      <PageBody>
        {calendar.state === "loading" && cal === null && <div className="flex justify-center py-6"><Spinner /></div>}
        {calendar.state === "error" && <LoadError onRetry={calendar.reload} />}
        {calendar.state === "ready" && cal && (
          <Columns>
            <Column grow={1} className="gap-(--portal-gap-14)">
              <div className="portal:hidden">{picker}</div>
              <MonthGrid month={cal.month} marks={sportivMarks(cal.items)} selected={inMonth} today={today} onSelect={setPicked} label={CAL.title} />
              <CalendarLegend items={LEGEND} />
              <a href={`/api/portal/sportiv/athletes/${athleteId}/calendar.ics`} download className={LINK}>{CAL.addToPhone}</a>
            </Column>
            <Column grow={1}>
              {shown && (
                <Section title={longDay(shown)}>
                  {items.length === 0 ? (
                    <p className="text-(length:--portal-text-14) text-muted">{CAL.emptyDay}</p>
                  ) : (
                    <ListCard>
                      {items.map((i, n) => <SessionRow key={`${i.startTime}${i.title}${n}`} item={i} now={now} />)}
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
