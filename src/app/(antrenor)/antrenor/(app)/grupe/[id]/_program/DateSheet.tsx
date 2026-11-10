"use client";

import { useState } from "react";
import DatePickerField from "@/components/ui/date-picker-field";
import { Input } from "@/components/ui/form-field";
import { PROGRAM } from "@/lib/portal/copy";
import { capitalize, dayMonth, longDay } from "@/lib/portal/format";
import { dateKey, dateState, eventDocumentId } from "@/lib/portal/program";
import type { DateBody, Occurrence } from "@/lib/portal/api-types";
import { ChoiceRow } from "@/app/_portal/ui/ChoiceRow";
import { Sheet } from "@/app/_portal/ui/Sheet";
import { SheetFooter } from "../../../../_ui/SheetFooter";
import { TimeDuration } from "./TimeDuration";
import { useSend } from "./useSend";

type Choice = "cancel" | "move" | "remove" | "keep";
type Props = { occurrence: Occurrence; today: string; onClose: () => void; onDone: () => void };

/** One date of the program: "Anulează" with a note, "Mută", "Șterge", and "Se ține" on a date that was cancelled or moved. */
export function DateSheet({ occurrence: o, today, onClose, onDone }: Props) {
  const { busy, message, send } = useSend(onDone);
  const state = dateState(o, today);
  const changed = state === "cancelled" || state === "moved";
  const [choice, setChoice] = useState<Choice>(state === "moved" ? "move" : "cancel");
  const [reason, setReason] = useState(o.note ?? "");
  const [newDate, setNewDate] = useState(o.date);
  const [newTime, setNewTime] = useState(o.startTime ?? "");
  const key = dateKey(o);
  const documentId = eventDocumentId(o);
  const day = dayMonth(key);
  const ready = documentId !== null && (choice !== "move" || (newDate >= today && newTime !== ""));

  function submit() {
    if (documentId === null) return;
    const path = `coach/program/${encodeURIComponent(documentId)}`;
    const note = reason.trim();
    if (choice === "remove" && o.oneOff) return void send("DELETE", path, undefined, PROGRAM.toasts.classDeleted);
    const body: DateBody = choice === "cancel" ? { mode: "cancel", ...(note ? { reason: note } : {}) }
      : choice === "move" ? { mode: "move", newDate, newStartTime: newTime, reason: null }
      : choice === "keep" ? { mode: "keep" } : { mode: "remove" };
    const done = choice === "cancel" ? PROGRAM.toasts.dateCancelled(day) : choice === "move" ? PROGRAM.toasts.dateMoved(day)
      : choice === "keep" ? PROGRAM.toasts.dateKept(day) : PROGRAM.toasts.dateRemoved(day);
    void send("PUT", `${path}/dates/${key}`, body, done);
  }

  return (
    <Sheet
      open
      onOpenChange={(open) => { if (!open) onClose(); }}
      title={`${capitalize(longDay(o.date))}, ${o.startTime ?? ""}`}
      description={PROGRAM.dateOnly}
      footer={<SheetFooter message={message} busy={busy} disabled={!ready} confirm={PROGRAM.save} onClose={onClose} onConfirm={submit} />}
    >
      <div role="radiogroup" aria-label={PROGRAM.thisDate} className="flex flex-col gap-3">
        <ChoiceRow label={PROGRAM.cancel} sub={PROGRAM.cancelSub} checked={choice === "cancel"} onSelect={() => setChoice("cancel")}>
          {choice === "cancel" && (
            <div>
              <label htmlFor="date-note" className="text-field-label text-label-ink mb-(--field-gap) block">{PROGRAM.note}</label>
              <Input id="date-note" value={reason} maxLength={120} onChange={(e) => setReason(e.target.value)} surface="card" />
            </div>
          )}
        </ChoiceRow>
        <ChoiceRow label={PROGRAM.move} sub={PROGRAM.moveSub} checked={choice === "move"} onSelect={() => setChoice("move")}>
          {choice === "move" && (
            <div className="grid grid-cols-2 gap-3">
              <DatePickerField id="date-new" label={PROGRAM.newDate} value={newDate} onChange={setNewDate} variant="card" />
              <TimeDuration time={newTime} onTime={setNewTime} />
            </div>
          )}
        </ChoiceRow>
        <ChoiceRow label={PROGRAM.remove} sub={PROGRAM.removeSub} checked={choice === "remove"} onSelect={() => setChoice("remove")} />
        {changed && <ChoiceRow label={PROGRAM.keepChoice} sub={PROGRAM.keepSub} checked={choice === "keep"} onSelect={() => setChoice("keep")} />}
      </div>
    </Sheet>
  );
}
