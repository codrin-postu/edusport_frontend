"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/ui/button";
import { AZI, LIST } from "@/lib/portal/copy";
import { longDay, monthShort, weekdayShort } from "@/lib/portal/format";
import type { CoachClassRow, CoachToday } from "@/lib/portal/api-types";
import { LoadError } from "@/app/_portal/ui/LoadError";
import { DateBlock } from "@/app/_portal/ui/DateBlock";
import { KeyValueCard } from "@/app/_portal/ui/KeyValueCard";
import { ListRow } from "@/app/_portal/ui/ListRow";
import { NowTile } from "@/app/_portal/ui/NowTile";
import { PageBody } from "@/app/_portal/ui/PageBody";
import { PageHeader } from "@/app/_portal/ui/PageHeader";
import { ListCard } from "@/app/_portal/ui/PortalCard";
import { Section, SectionHeading, SeeAllLink } from "@/app/_portal/ui/SectionHeading";
import { Spinner } from "@/app/_portal/ui/Spinner";
import { StatCard } from "@/app/_portal/ui/StatCard";
import { StatusBlock } from "@/app/_portal/ui/StatusBlock";
import { usePortal } from "../_lib/use-portal";
import { NewTrainingPopup } from "./antrenament/NewTrainingPopup";
import { useMe } from "../_lib/me-context";
import { SessionRow, presenceHref, type SessionRowData } from "../_ui/SessionRow";

/** Both Azi heading rows share this box on the desktop so their tops line up. */
const ROW1 = "portal:min-h-(--portal-tap) portal:items-center";

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
  const router = useRouter();
  const nou = useSearchParams().get("nou");
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
        {rows.slice(0, LIST.azi).map((r) => <SessionRow key={r.lessonId ?? r.occurrenceKey ?? r.sessionId ?? r.startTime} row={r} now={now} />)}
      </ListCard>
    );
  const todayMore = rows.length > LIST.azi && <SeeAllLink href={`/calendar?luna=${data.today.slice(0, 7)}&zi=${data.today}`} label={LIST.seeAll(rows.length)} />;
  const stat = <StatCard big={String(rows.length)} label={AZI.statLabel} side={[{ value: String(done), label: done === 1 ? AZI.doneOne : AZI.doneMany }]} />;
  const addLesson = (
    <div className="portal:hidden">
      <Button variant="secondary" href="/?nou=1" className="w-full">{AZI.addTraining}</Button>
    </div>
  );
  const past =
    data.todo.length > 0 ? (
      <Section title={AZI.pastHeading}>
        <ListCard>
          {data.todo.slice(0, LIST.azi).map((c) => (
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
        {data.todo.length > LIST.azi && <SeeAllLink href="/istoric" label={LIST.seeAll(data.todo.length)} />}
      </Section>
    ) : null;
  const { next, week } = data;
  const nextSection = next && (
    <Section title={AZI.nextHeading}>
      <ListCard>
        <ListRow
          href={next.kind === "individual" ? `/lectie/${encodeURIComponent(next.lessonId ?? "")}` : presenceHref({ sessionId: null, occurrenceKey: next.occurrenceKey })}
          lead={<DateBlock word={weekdayShort(next.date)} big={String(Number(next.date.slice(8)))} />}
          title={next.title}
          sub={AZI.nextSub(next.startTime, next.location)}
        />
      </ListCard>
    </Section>
  );
  const weekSection = (
    <Section title={AZI.weekHeading}>
      <KeyValueCard
        rows={[
          { key: AZI.weekGroups, value: AZI.weekCount(week.groupsHeld, week.groupsLeft) },
          { key: AZI.weekLessons, value: AZI.weekCount(week.lessonsHeld, week.lessonsLeft) },
          { key: AZI.weekMissing, value: String(week.missing) },
        ]}
      />
    </Section>
  );
  return (
    <>
      <PageHeader
        brand
        kicker={AZI.greeting(me?.firstName ?? "")}
        title={AZI.title}
        aside={<NowTile month={monthShort(data.today)} day={String(Number(data.today.slice(8)))} time={now} weekday={weekdayShort(data.today)} label={AZI.nowLabel(longDay(data.today), now)} />}
        actions={<Button variant="secondary" href="/?nou=1" className="h-auto">{AZI.addTraining}</Button>}
      />
      <PageBody>
        {/* Desktop: summary column left (2), list right (3); headings on grid row 1, content on row 2, so both columns start on the same line. */}
        <div className="flex flex-col gap-(--portal-section-gap) portal:grid portal:grid-cols-(--portal-cols-side-first) portal:gap-x-(--portal-cols-gap) portal:gap-y-3 portal:items-start">
          <div className="hidden portal:col-start-1 portal:row-start-1 portal:block"><SectionHeading title={AZI.summaryHeading} className={ROW1} /></div>
          <div className="contents portal:col-start-1 portal:row-start-2 portal:flex portal:flex-col portal:gap-(--portal-section-gap)">
            <div className="order-1 portal:order-none">{stat}</div>
            {nextSection && <div className="order-4 portal:order-none">{nextSection}</div>}
            <div className="order-5 portal:order-none">{weekSection}</div>
            {past && <div className="order-6 portal:order-none">{past}</div>}
          </div>
          <div className="order-2 flex flex-col gap-3 portal:contents">
            <div className="portal:col-start-2 portal:row-start-1"><SectionHeading title={AZI.todayHeading} link={{ href: "/calendar", label: AZI.calendarLink }} className={ROW1} /></div>
            <div data-today-list className="flex flex-col gap-3 portal:col-start-2 portal:row-start-2">{todayCard}{todayMore}</div>
          </div>
          <div className="order-3">{addLesson}</div>
        </div>
      </PageBody>
      {nou && <NewTrainingPopup group={null} individual={nou === "individual"} onClose={() => router.replace("/")} />}
    </>
  );
}
