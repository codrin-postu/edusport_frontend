"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DayPicker } from "react-day-picker";
import { ro } from "react-day-picker/locale";
import Button from "@/components/ui/button";
import IconButton from "@/components/ui/icon-button";
import { A11Y, PRESENCE } from "@/lib/portal/copy";
import { addMonths, pickLabel } from "@/lib/portal/format";
import type { CoachSession, SessionCheck } from "@/lib/portal/api-types";
import { portalApi } from "@/app/_portal/lib/api";
import { bucharestToday } from "../../_lib/today";
import { usePortal } from "../../_lib/use-portal";
import { AlertLine } from "@/app/_portal/ui/AuthBits";
import { Sheet } from "@/app/_portal/ui/Sheet";
import { ExistingDialog } from "./ExistingDialog";

const toKey = (d: Date): string => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const toDate = (key: string): Date => new Date(Number(key.slice(0, 4)), Number(key.slice(5, 7)) - 1, Number(key.slice(8, 10)));

type DaySheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  session: CoachSession;
  /** Stand-in sessions: the only dates that may be picked. */
  allowed: string[] | null;
};

export function DaySheet({ open, onOpenChange, session, allowed }: DaySheetProps) {
  const router = useRouter();
  const today = bucharestToday();
  const [month, setMonth] = useState(session.date.slice(0, 7));
  const [picked, setPicked] = useState<string>(session.date);
  const [existing, setExisting] = useState<Extract<SessionCheck, { kind: "existing" }> | null>(null);
  const [failed, setFailed] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const saved = usePortal<{ month: string; dates: string[] }>(open ? `coach/groups/${encodeURIComponent(session.groupId)}/saved-days?month=${month}` : null);
  const markedKeys = new Set(saved.data?.month === month ? saved.data.dates : []);

  const qs = (extra: Record<string, string>): string => new URLSearchParams({ group: session.groupId, date: picked, ...extra }).toString();

  async function choose() {
    if (busy) return;
    setBusy(true);
    setFailed(null);
    const r = await portalApi<SessionCheck>("POST", "coach/session/check", { groupId: session.groupId, date: picked, startTime: session.startTime });
    setBusy(false);
    if (!r.ok) {
      setFailed(r.message);
      return;
    }
    if (r.data.kind === "existing") setExisting(r.data);
    else if (r.data.kind === "occurrence") router.push(`/prezenta?${new URLSearchParams({ occurrence: r.data.occurrenceKey }).toString()}`);
    else router.push(`/prezenta?${qs({})}`);
    if (r.data.kind !== "existing") onOpenChange(false);
  }

  const blocked = (d: Date): boolean => {
    const key = toKey(d);
    return key > today || (allowed !== null && !allowed.includes(key));
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange} title={PRESENCE.pickDay}>
        <div className="flex items-center justify-between">
          <IconButton icon="chevron-left" label={A11Y.prevMonth} onClick={() => setMonth(addMonths(month, -1))} />
          <p className="text-(length:--portal-text-14) font-bold">{new Intl.DateTimeFormat("ro", { month: "long", year: "numeric" }).format(toDate(`${month}-01`))}</p>
          <IconButton icon="chevron-right" label={A11Y.nextMonth} disabled={month >= today.slice(0, 7)} onClick={() => setMonth(addMonths(month, 1))} />
        </div>
        <DayPicker
          mode="single"
          locale={ro}
          weekStartsOn={1}
          month={toDate(`${month}-01`)}
          onMonthChange={(d) => setMonth(toKey(d).slice(0, 7))}
          hideNavigation
          selected={toDate(picked)}
          onSelect={(d) => d && setPicked(toKey(d))}
          disabled={blocked}
          modifiers={{ saved: (d) => markedKeys.has(toKey(d)) }}
          classNames={{
            root: "w-full",
            month_caption: "hidden",
            month_grid: "w-full border-collapse",
            weekday: "text-(length:--portal-text-12) font-bold text-secondary h-10",
            day: "p-0 text-center",
            day_button: "size-10 w-full text-(length:--portal-text-14) text-primary outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary",
            selected: "bg-surface-dark text-primary-on-dark",
            today: "font-semibold",
            disabled: "text-line-subtle",
            outside: "text-line-subtle",
          }}
          modifiersClassNames={{ saved: "bg-surface-highlight" }}
        />
        <p className="flex items-center gap-2 text-(length:--portal-text-13) text-muted">
          <span aria-hidden="true" className="size-4 bg-surface-highlight border border-line-subtle" />
          {PRESENCE.hasSaved}
        </p>
        <AlertLine message={failed} />
        <Button onClick={() => void choose()} disabled={busy} className="w-full">{PRESENCE.pick(pickLabel(picked))}</Button>
      </Sheet>
      <ExistingDialog
        open={existing !== null}
        onOpenChange={(o) => { if (!o) setExisting(null); }}
        saved={existing?.saved ?? []}
        standIn={session.standIn}
        openHref={(id) => `/prezenta?${new URLSearchParams({ id }).toString()}`}
        addHref={`/prezenta?${qs({ time: session.startTime, duration: String(session.durationMin) })}`}
      />
    </>
  );
}
