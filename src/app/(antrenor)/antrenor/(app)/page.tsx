"use client";

import Button from "@/components/ui/button";
import { AZI } from "@/lib/portal/copy";
import { longDay, monthShort, weekdayShort } from "@/lib/portal/format";
import type { CoachClassRow, CoachToday } from "@/lib/portal/api-types";
import { LoadError } from "@/app/_portal/ui/LoadError";
import { DateBlock } from "@/app/_portal/ui/DateBlock";
import { ListRow } from "@/app/_portal/ui/ListRow";
import { NowTile } from "@/app/_portal/ui/NowTile";
import { Column, Columns, PageBody } from "@/app/_portal/ui/PageBody";
import { PageHeader } from "@/app/_portal/ui/PageHeader";
import { ListCard } from "@/app/_portal/ui/PortalCard";
import { Section } from "@/app/_portal/ui/SectionHeading";
import { Spinner } from "@/app/_portal/ui/Spinner";
import { StatCard } from "@/app/_portal/ui/StatCard";
import { StatusBlock } from "@/app/_portal/ui/StatusBlock";
import { usePortal } from "../_lib/use-portal";
import { useMe } from "../_lib/me-context";
import { SessionRow, presenceHref, type SessionRowData } from "../_ui/SessionRow";

/** HH:mm of the browser clock in the club's time zone. */
function clockNow(): string {
  return new Intl.DateTimeFormat("ro-RO", { timeZone: "Europe/Bucharest", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(new Date());
}

function groupRow(c: CoachClassRow): SessionRowData {
  return {
    kind: "grup", startTime: c.startTime, title: c.groupName, children: c.children, location: c.location, durationMin: null, done: c.done,
    sessionId: c.sessionId, occurrenceKey: c.occurrenceKey, lessonId: null,
  };
}

export default function AziPage() {
  const me = useMe();
  const today = usePortal<CoachToday>("coach/today");
  if (today.state === "loading") return <PageBody><div className="flex justify-center py-6"><Spinner /></div></PageBody>;
  if (today.state === "error" || !today.data) return <PageBody><LoadError onRetry={today.reload} /></PageBody>;
  const { data } = today;
  const now = clockNow();
  const rows: SessionRowData[] = [
    ...data.groups.map(groupRow),
    ...data.lessons.map((l): SessionRowData => ({
      kind: "individual", startTime: l.startTime, title: l.athleteName, children: null, location: null, durationMin: l.durationMin, done: l.done,
      sessionId: null, occurrenceKey: null, lessonId: l.lessonId,
    })),
  ].sort((a, b) => a.startTime.localeCompare(b.startTime));
  const done = rows.filter((r) => r.done).length;
  const todayCard =
    rows.length === 0 ? (
      <p className="text-body text-secondary">{AZI.none}</p>
    ) : (
      <ListCard>
        {rows.map((r) => <SessionRow key={r.lessonId ?? r.occurrenceKey ?? r.sessionId ?? r.startTime} row={r} now={now} />)}
      </ListCard>
    );
  const stat = <StatCard big={String(rows.length)} label={AZI.statLabel} side={[{ value: String(done), label: done === 1 ? AZI.doneOne : AZI.doneMany }]} />;
  const addLesson = (
    <div className="portal:hidden">
      <Button variant="secondary" href="/lectie/noua" className="w-full">{AZI.addLesson}</Button>
    </div>
  );
  const past =
    data.todo.length > 0 ? (
      <Section title={AZI.pastHeading}>
        <ListCard>
          {data.todo.map((c) => (
            <ListRow
              key={c.occurrenceKey ?? c.groupId + c.date}
              href={presenceHref(c)}
              lead={<DateBlock word={weekdayShort(c.date)} big={String(Number(c.date.slice(8)))} />}
              title={c.groupName}
              sub={AZI.todoLine(c.startTime)}
              end={<StatusBlock kind="Grup" done={false} />}
            />
          ))}
        </ListCard>
      </Section>
    ) : null;
  return (
    <>
      <PageHeader
        brand
        kicker={AZI.greeting(me?.firstName ?? "")}
        title={AZI.title}
        aside={<NowTile month={monthShort(data.today)} day={String(Number(data.today.slice(8)))} time={now} weekday={weekdayShort(data.today)} label={AZI.nowLabel(longDay(data.today), now)} />}
        actions={<Button variant="secondary" href="/lectie/noua">{AZI.addLesson}</Button>}
      />
      <PageBody>
        <Columns className="gap-(--portal-section-gap) portal:gap-(--portal-cols-gap)">
          <Column grow={1} basis={300} className="contents portal:flex">
            <div className="order-1 portal:order-none">{stat}</div>
            {past && <div className="order-4 portal:order-none">{past}</div>}
          </Column>
          <Column grow={2} basis={420} className="contents portal:flex">
            <div className="order-2 portal:order-none"><Section title={AZI.todayHeading} link={{ href: "/calendar", label: AZI.calendarLink }}>{todayCard}</Section></div>
            <div className="order-3 portal:order-none">{addLesson}</div>
          </Column>
        </Columns>
      </PageBody>
    </>
  );
}
