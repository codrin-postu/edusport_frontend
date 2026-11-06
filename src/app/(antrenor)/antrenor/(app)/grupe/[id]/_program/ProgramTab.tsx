"use client";

import { useState } from "react";
import IconButton from "@/components/ui/icon-button";
import { A11Y, PROGRAM } from "@/lib/portal/copy";
import { addMonths } from "@/lib/portal/format";
import type { CoachProgram } from "@/lib/portal/api-types";
import { portalApi } from "../../../../_lib/api";
import { bucharestToday } from "../../../../_lib/today";
import { useNoAccess, usePortal } from "../../../../_lib/use-portal";
import { LoadError } from "../../../../_ui/LoadError";
import { Segmented } from "../../../../_ui/Segmented";
import { Spinner } from "../../../../_ui/Spinner";
import { useToast } from "../../../../_ui/Toast";
import { ProgramList } from "./ProgramList";
import { ProgramMonth } from "./ProgramMonth";
import { PublicSwitch } from "./PublicSwitch";

type View = "list" | "month";

const monthName = (month: string): string =>
  new Intl.DateTimeFormat("ro", { month: "long", year: "numeric" }).format(new Date(Number(month.slice(0, 4)), Number(month.slice(5, 7)) - 1, 1));

export function ProgramTab({ groupId, own }: { groupId: string; own: boolean }) {
  const today = bucharestToday();
  const toast = useToast();
  const noAccess = useNoAccess();
  const [view, setView] = useState<View>("list");
  const [month, setMonth] = useState(today.slice(0, 7));
  const [busy, setBusy] = useState(false);
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

  if (program.state === "error") return <LoadError />;
  return (
    <div className="flex flex-col gap-6">
      {data && data.kind === "club" && data.programPublic !== null && own && <PublicSwitch value={data.programPublic} busy={busy} onChange={(v) => void setPublic(v)} />}
      {data && data.kind === "school" && <p className="text-body-sm text-secondary">{PROGRAM.schoolLocked}</p>}
      <Segmented<View> options={[{ value: "list", label: PROGRAM.list }, { value: "month", label: PROGRAM.month }]} value={view} onChange={setView} />
      <div className="flex items-center justify-between">
        <IconButton icon="chevron-left" label={A11Y.prevMonth} onClick={() => setMonth(addMonths(month, -1))} />
        <p className="text-label text-primary capitalize">{monthName(month)}</p>
        <IconButton icon="chevron-right" label={A11Y.nextMonth} onClick={() => setMonth(addMonths(month, 1))} />
      </div>
      {data === null ? (
        <div className="py-6 flex justify-center"><Spinner /></div>
      ) : view === "list" ? (
        <ProgramList data={data} today={today} />
      ) : (
        <ProgramMonth month={month} occurrences={data.occurrences} />
      )}
    </div>
  );
}
