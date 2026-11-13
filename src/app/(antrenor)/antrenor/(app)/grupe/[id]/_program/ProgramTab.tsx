"use client";

import { useState } from "react";
import Button from "@/components/ui/button";
import IconButton from "@/components/ui/icon-button";
import { A11Y, GROUP, PROGRAM } from "@/lib/portal/copy";
import { addMonths } from "@/lib/portal/format";
import { dateState, eventDocumentId } from "@/lib/portal/program";
import type { CoachProgram, CoachProgramRule, Occurrence } from "@/lib/portal/api-types";
import { portalApi } from "@/app/_portal/lib/api";
import { bucharestToday } from "../../../../_lib/today";
import { useNoAccess, usePortal } from "../../../../_lib/use-portal";
import { LoadError } from "@/app/_portal/ui/LoadError";
import Link from "@/components/ui/link";
import { ListCard } from "@/app/_portal/ui/PortalCard";
import { Section } from "@/app/_portal/ui/SectionHeading";
import { Segmented } from "@/app/_portal/ui/Segmented";
import { Spinner } from "@/app/_portal/ui/Spinner";
import { useToast } from "@/app/_portal/ui/Toast";
import { ChangeSheet } from "./ChangeSheet";
import { DateRow } from "./DateRow";
import { DateSheet } from "./DateSheet";
import { EndSheet } from "./EndSheet";
import { ProgramMonth } from "./ProgramMonth";
import { PublicSwitch } from "./PublicSwitch";
import { RulesCard } from "./RulesCard";
import { byWeekday } from "./rules";

type View = "list" | "month";
type Open = { kind: "change" | "end"; rule: CoachProgramRule } | { kind: "date"; occurrence: Occurrence };

const monthName = (month: string): string =>
  new Intl.DateTimeFormat("ro", { month: "long", year: "numeric" }).format(new Date(Number(month.slice(0, 4)), Number(month.slice(5, 7)) - 1, 1));
const programPath = (groupId: string, month: string): string => `coach/groups/${encodeURIComponent(groupId)}/program?month=${month}`;
const byStart = (a: Occurrence, b: Occurrence): number => `${a.date}${a.startTime ?? ""}`.localeCompare(`${b.date}${b.startTime ?? ""}`);

type ProgramTabProps = {
  groupId: string;
  own: boolean;
  /** Opens the "Antrenament nou" popup with this group preset. */
  addHref: string;
};

/** The list shows the next 4 dates; "Vezi toate" opens the calendar (the board's choice). */
const NEXT_DATES = 4;

/** The Program tab: weekly rules, "+ Adaugă program", the public switch, and the next dates as a list or a month. */
export function ProgramTab({ groupId, own, addHref }: ProgramTabProps) {
  const today = bucharestToday();
  const toast = useToast();
  const noAccess = useNoAccess();
  const [view, setView] = useState<View>("list");
  const [month, setMonth] = useState(today.slice(0, 7));
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState<Open | null>(null);
  // The list reads this month and the next (to the end of next month); the month view reads the month it shows.
  const nextMonth = addMonths(today.slice(0, 7), 1);
  const first = usePortal<CoachProgram>(programPath(groupId, today.slice(0, 7)));
  const second = usePortal<CoachProgram>(view === "list" ? programPath(groupId, nextMonth) : null);
  const picked = usePortal<CoachProgram>(view === "month" ? programPath(groupId, month) : null);
  const data = first.data;
  const reload = () => { first.reload(); second.reload(); picked.reload(); };

  async function setPublic(value: boolean) {
    setBusy(true);
    const r = await portalApi<{ toast: string }>("PUT", `coach/groups/${encodeURIComponent(groupId)}/program-public`, { value });
    setBusy(false);
    if (noAccess(r)) return;
    toast.show(r.ok ? r.data.toast : r.message);
    if (r.ok) reload();
  }

  const done = () => { setOpen(null); reload(); };
  const canEdit = own && data !== null && data.editable;
  const openDate = (o: Occurrence) => {
    const state = dateState(o, today);
    return canEdit && (state === "open" || state === "cancelled" || state === "moved") && eventDocumentId(o) !== null ? () => setOpen({ kind: "date", occurrence: o }) : undefined;
  };

  if (first.state === "error") return <LoadError onRetry={reload} />;
  const listed = [...(first.data?.occurrences ?? []), ...(second.data?.occurrences ?? [])].filter((o) => o.date >= today).sort(byStart);
  const monthRows = (picked.data?.occurrences ?? []).slice().sort(byStart);
  const dateRows = (rows: Occurrence[], more = false) => (
    <ListCard>
      {rows.map((o) => <DateRow key={`${o.documentId ?? o.eventId}:${o.date}:${o.startTime}`} occurrence={o} today={today} onOpen={openDate(o)} />)}
      {more && (
        <div data-dates-footer className="flex min-h-(--portal-tap) items-center justify-between gap-3 px-(--portal-row-pad-x) text-(length:--portal-text-13) text-muted">
          <span>{PROGRAM.showingNext(NEXT_DATES)}</span>
          <Link href="/calendar" tone="plain" className="inline-flex min-h-(--portal-tap) items-center text-(length:--portal-text-14) font-bold text-primary no-underline">{PROGRAM.seeAll} ›</Link>
        </div>
      )}
    </ListCard>
  );
  const spinner = <div className="flex justify-center py-6"><Spinner /></div>;

  const datesBody = view === "list"
    ? (data === null || second.data === null ? spinner : listed.length === 0 ? <p className="text-body-sm text-secondary">{PROGRAM.nothingThisMonth}</p> : dateRows(listed.slice(0, NEXT_DATES), listed.length > NEXT_DATES))
    : (
      <>
        <div className="flex items-center justify-between">
          <IconButton icon="chevron-left" label={A11Y.prevMonth} onClick={() => setMonth(addMonths(month, -1))} />
          <p className="text-(length:--portal-text-16) font-bold text-primary capitalize">{monthName(month)}</p>
          <IconButton icon="chevron-right" label={A11Y.nextMonth} onClick={() => setMonth(addMonths(month, 1))} />
        </div>
        {picked.data === null ? spinner : (
          <>
            <ProgramMonth month={month} occurrences={picked.data.occurrences} />
            {monthRows.length > 0 && dateRows(monthRows)}
          </>
        )}
      </>
    );

  return (
    <>
      <div className="flex flex-col gap-(--portal-section-gap)">
        <div className="flex flex-col gap-(--portal-section-gap)">
          {data === null ? spinner : (
            <>
              {!data.editable && <p className="text-body-sm text-secondary">{PROGRAM.schoolLocked}</p>}
              {data.rules.length > 0 && (
                <Section title={PROGRAM.weeklyHeading}>
                  <ListCard>
                    {byWeekday(data.rules).map((r) => <RulesCard key={`${r.eventId}:${r.day}`} rule={r} later={r.from > today} editable={canEdit} onChange={() => setOpen({ kind: "change", rule: r })} onEnd={() => setOpen({ kind: "end", rule: r })} />)}
                  </ListCard>
                </Section>
              )}
              {own && data.programPublic !== null && <PublicSwitch value={data.programPublic} busy={busy} onChange={(v) => void setPublic(v)} />}
            </>
          )}
        </div>
        <div className="flex flex-col gap-(--portal-section-gap)">
          <Section title={PROGRAM.nextHeading}>
            <Segmented<View> label={GROUP.tabProgram} options={[{ value: "list", label: PROGRAM.list }, { value: "month", label: PROGRAM.month }]} value={view} onChange={setView} />
            {datesBody}
          </Section>
        </div>
      </div>
      {open?.kind === "change" && <ChangeSheet rule={open.rule} rules={data?.rules ?? []} today={today} onClose={() => setOpen(null)} onDone={done} />}
      {open?.kind === "end" && <EndSheet rule={open.rule} rules={data?.rules ?? []} today={today} onClose={() => setOpen(null)} onDone={done} />}
      {open?.kind === "date" && <DateSheet occurrence={open.occurrence} today={today} onClose={() => setOpen(null)} onDone={done} />}
    </>
  );
}
