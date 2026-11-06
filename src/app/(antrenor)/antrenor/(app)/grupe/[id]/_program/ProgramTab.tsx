"use client";

import { useState } from "react";
import Button from "@/components/ui/button";
import IconButton from "@/components/ui/icon-button";
import { A11Y, PROGRAM } from "@/lib/portal/copy";
import { addMonths } from "@/lib/portal/format";
import { dateState, eventDocumentId, dateKey } from "@/lib/portal/program";
import { dayMonth } from "@/lib/portal/format";
import type { CoachProgram, DateAnswer, Occurrence, ProgramRow } from "@/lib/portal/api-types";
import { portalApi } from "../../../../_lib/api";
import { bucharestToday } from "../../../../_lib/today";
import { useNoAccess, usePortal } from "../../../../_lib/use-portal";
import { LoadError } from "../../../../_ui/LoadError";
import { Segmented } from "../../../../_ui/Segmented";
import { Spinner } from "../../../../_ui/Spinner";
import { useToast } from "../../../../_ui/Toast";
import { AddProgramSheet } from "./AddProgramSheet";
import { ChangeSheet } from "./ChangeSheet";
import { DateSheet, type DateAction } from "./DateSheet";
import { ProgramList } from "./ProgramList";
import { ProgramMonth } from "./ProgramMonth";
import { PublicSwitch } from "./PublicSwitch";

type View = "list" | "month";
type Open =
  | { kind: "add" }
  | { kind: "change"; row: ProgramRow }
  | { kind: "date"; occurrence: Occurrence; action: DateAction };

const monthName = (month: string): string =>
  new Intl.DateTimeFormat("ro", { month: "long", year: "numeric" }).format(new Date(Number(month.slice(0, 4)), Number(month.slice(5, 7)) - 1, 1));

export function ProgramTab({ groupId, own }: { groupId: string; own: boolean }) {
  const today = bucharestToday();
  const toast = useToast();
  const noAccess = useNoAccess();
  const [view, setView] = useState<View>("list");
  const [month, setMonth] = useState(today.slice(0, 7));
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState<Open | null>(null);
  const program = usePortal<CoachProgram>(`coach/groups/${encodeURIComponent(groupId)}/program?month=${month}`);
  const data = program.data;

  async function setPublic(value: boolean) {
    setBusy(true);
    const r = await portalApi<{ toast: string }>("PUT", `coach/groups/${encodeURIComponent(groupId)}/program-public`, { value });
    setBusy(false);
    if (noAccess(r)) return;
    if (!r.ok) {
      toast.show(r.message);
      return;
    }
    toast.show(r.data.toast);
    program.reload();
  }

  async function keep(o: Occurrence) {
    const documentId = eventDocumentId(o);
    if (documentId === null) return;
    setBusy(true);
    const r = await portalApi<DateAnswer>("PUT", `coach/program/${encodeURIComponent(documentId)}/dates/${dateKey(o)}`, { mode: "keep" });
    setBusy(false);
    if (noAccess(r)) return;
    toast.show(r.ok ? PROGRAM.toasts.dateKept(dayMonth(dateKey(o))) : r.message);
    if (r.ok) program.reload();
  }

  const done = () => {
    setOpen(null);
    program.reload();
  };
  const canEdit = own && data !== null && data.kind === "club" && data.editable;
  const dateActions = (o: Occurrence) => {
    if (!canEdit || dateState(o, today) !== "open" || eventDocumentId(o) === null) return null;
    return (
      <>
        <Button variant="secondary" disabled={busy} onClick={() => void keep(o)}>{PROGRAM.keep}</Button>
        <Button variant="secondary" onClick={() => setOpen({ kind: "date", occurrence: o, action: "cancel" })}>{PROGRAM.cancel}</Button>
        <Button variant="secondary" onClick={() => setOpen({ kind: "date", occurrence: o, action: "move" })}>{PROGRAM.move}</Button>
        {o.oneOff && <Button variant="secondary" onClick={() => setOpen({ kind: "date", occurrence: o, action: "delete" })}>{PROGRAM.deleteClass}</Button>}
      </>
    );
  };

  if (program.state === "error") return <LoadError />;
  return (
    <div className="flex flex-col gap-6">
      {data && data.kind === "club" && data.programPublic !== null && own && <PublicSwitch value={data.programPublic} busy={busy} onChange={(v) => void setPublic(v)} />}
      {data && data.kind === "school" && <p className="text-body-sm text-secondary">{PROGRAM.schoolLocked}</p>}
      {canEdit && <div><Button variant="secondary" onClick={() => setOpen({ kind: "add" })}>{PROGRAM.add}</Button></div>}
      <Segmented<View> options={[{ value: "list", label: PROGRAM.list }, { value: "month", label: PROGRAM.month }]} value={view} onChange={setView} />
      <div className="flex items-center justify-between">
        <IconButton icon="chevron-left" label={A11Y.prevMonth} onClick={() => setMonth(addMonths(month, -1))} />
        <p className="text-label text-primary capitalize">{monthName(month)}</p>
        <IconButton icon="chevron-right" label={A11Y.nextMonth} onClick={() => setMonth(addMonths(month, 1))} />
      </div>
      {data === null ? (
        <div className="py-6 flex justify-center"><Spinner /></div>
      ) : view === "list" ? (
        <ProgramList
          data={data}
          today={today}
          seriesActions={canEdit ? (row) => <Button variant="secondary" onClick={() => setOpen({ kind: "change", row })}>{PROGRAM.change}</Button> : undefined}
          dateActions={dateActions}
        />
      ) : (
        <ProgramMonth month={month} occurrences={data.occurrences} />
      )}
      {open?.kind === "add" && <AddProgramSheet groupId={groupId} today={today} onClose={() => setOpen(null)} onDone={done} />}
      {open?.kind === "change" && <ChangeSheet row={open.row} today={today} onClose={() => setOpen(null)} onDone={done} />}
      {open?.kind === "date" && <DateSheet occurrence={open.occurrence} action={open.action} onClose={() => setOpen(null)} onDone={done} />}
    </div>
  );
}
