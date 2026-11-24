"use client";

import { useState } from "react";
import { Input } from "@/components/ui/form-field";
import { SESSION_SHEET } from "@/lib/portal/copy";
import { capitalize, dayMonth, longDay } from "@/lib/portal/format";
import type { CoachCalendarItem } from "@/lib/portal/api-types";
import { dateTargetOf } from "@/lib/portal/calendar";
import { ListRow } from "@/app/_portal/ui/ListRow";
import { ListCard } from "@/app/_portal/ui/PortalCard";
import { Sheet } from "@/app/_portal/ui/Sheet";
import { SheetFooter } from "../../_ui/SheetFooter";
import { useFeatures } from "../../_lib/me-context";
import { presenceHref } from "../../_ui/SessionRow";
import { DateSheet, type DateChoice } from "../grupe/[id]/_program/DateSheet";
import { useSend } from "../grupe/[id]/_program/useSend";
import { cancelBody, isArchived, sessionActions, type SessionAction } from "./session-actions";

type Props = { item: CoachCalendarItem; today: string; onClose: () => void; onDone: () => void };

const DATE_CHOICE: Partial<Record<SessionAction, DateChoice>> = { anuleaza: "cancel", muta: "move", sterge: "remove" };

const LABEL: Record<SessionAction, string> = { prezenta: SESSION_SHEET.presence, anuleaza: SESSION_SHEET.cancel, muta: SESSION_SHEET.move, sterge: SESSION_SHEET.remove };

/** One session of the calendar: Prezență, Anulează (a lesson: with an optional Motiv), Mută and Șterge. A group date is carried out by the program's date sheet. */
export function SessionSheet({ item, today, onClose, onDone }: Props) {
  const [step, setStep] = useState<SessionAction | null>(null);
  const lesson = item.kind === "individual";
  const { prezenta } = useFeatures();
  const target = dateTargetOf(item);
  const all = sessionActions({
    kind: lesson ? "lesson" : "group", archived: isArchived(item.date, today, item.done), future: item.date >= today, cancelled: item.cancelled, done: item.done,
  });
  const own = lesson || target !== null ? all : all.filter((a) => a === "prezenta");
  // Without Prezență a lesson has no action (its routes are off) and a group session has no Prezență.
  const actions = prezenta ? own : lesson ? [] : own.filter((a) => a !== "prezenta");
  if (target !== null && step !== null && step !== "prezenta") return <DateSheet occurrence={target} today={today} initial={DATE_CHOICE[step]} onClose={() => setStep(null)} onDone={onDone} />;
  if (lesson && (step === "anuleaza" || step === "sterge")) return <LessonStep action={step} item={item} onBack={() => setStep(null)} onDone={onDone} />;
  const href = lesson ? `/lectie/${encodeURIComponent(item.lessonId ?? "")}` : presenceHref(item, "calendar");
  return (
    <Sheet open onOpenChange={(open) => { if (!open) onClose(); }} title={`${capitalize(longDay(item.date))}, ${item.startTime}`}>
      <ListCard>
        {actions.map((a) => (a === "prezenta"
          ? <ListRow key={a} href={href} title={LABEL[a]} />
          : <ListRow key={a} onClick={() => setStep(a)} title={LABEL[a]} />))}
      </ListCard>
    </Sheet>
  );
}

/** The two writes of an individual lesson: cancel with the optional Motiv, and delete (for a mistake). */
function LessonStep({ action, item, onBack, onDone }: { action: "anuleaza" | "sterge"; item: CoachCalendarItem; onBack: () => void; onDone: () => void }) {
  const { busy, message, send } = useSend(onDone);
  const [reason, setReason] = useState("");
  const path = `coach/lessons/${encodeURIComponent(item.lessonId ?? "")}`;
  const cancelling = action === "anuleaza";
  const submit = () => void (cancelling
    ? send("POST", `${path}/cancel`, cancelBody(reason), SESSION_SHEET.lessonCancelled)
    : send("DELETE", path, undefined, SESSION_SHEET.lessonDeleted));
  return (
    <Sheet
      open
      onOpenChange={(open) => { if (!open && !busy) onBack(); }}
      title={cancelling ? `${capitalize(longDay(item.date))}, ${item.startTime}` : SESSION_SHEET.deleteTitle(dayMonth(item.date))}
      footer={<SheetFooter message={message} busy={busy} confirm={cancelling ? SESSION_SHEET.cancel : SESSION_SHEET.remove} onClose={onBack} onConfirm={submit} />}
    >
      {cancelling ? (
        <div>
          <label htmlFor="lesson-reason" className="text-field-label text-label-ink mb-(--field-gap) block">{SESSION_SHEET.reason}</label>
          <Input id="lesson-reason" value={reason} maxLength={120} onChange={(e) => setReason(e.target.value)} surface="card" />
        </div>
      ) : null}
    </Sheet>
  );
}
