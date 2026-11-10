"use client";

import { useState } from "react";
import Button from "@/components/ui/button";
import Checkbox from "@/components/ui/checkbox";
import DatePickerField from "@/components/ui/date-picker-field";
import { Input } from "@/components/ui/form-field";
import { LESSON, PROGRAM } from "@/lib/portal/copy";
import { dayMonth } from "@/lib/portal/format";
import { dateKey, eventDocumentId } from "@/lib/portal/program";
import type { DateAnswer, DateBody, Occurrence } from "@/lib/portal/api-types";
import { portalApi } from "@/app/_portal/lib/api";
import { useNoAccess } from "../../../../_lib/use-portal";
import { AlertLine } from "@/app/_portal/ui/AuthBits";
import { Sheet } from "@/app/_portal/ui/Sheet";
import { useToast } from "@/app/_portal/ui/Toast";

export type DateAction = "cancel" | "move" | "delete";
type Props = { occurrence: Occurrence; action: DateAction; onClose: () => void; onDone: () => void };

const TITLES: Record<DateAction, string> = { cancel: PROGRAM.cancel, move: PROGRAM.move, delete: PROGRAM.deleteClass };

/** Cancel, move or delete one date ("Ține" needs no sheet: the tab sends it). */
export function DateSheet({ occurrence: o, action, onClose, onDone }: Props) {
  const toast = useToast();
  const noAccess = useNoAccess();
  const key = dateKey(o);
  const documentId = eventDocumentId(o);
  const [reason, setReason] = useState("");
  const [newDate, setNewDate] = useState(o.date);
  const [newTime, setNewTime] = useState(o.startTime ?? "");
  const [notify, setNotify] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const day = dayMonth(key);

  async function submit() {
    if (documentId === null) return;
    setBusy(true);
    setMessage(null);
    const path = `coach/program/${encodeURIComponent(documentId)}`;
    const trimmed = reason.trim();
    let done: string;
    let r;
    if (action === "delete") {
      r = await portalApi<{ date: string }>("DELETE", path);
      done = PROGRAM.toasts.classDeleted;
    } else {
      const body: DateBody = action === "move"
        ? { mode: "move", newDate, newStartTime: newTime, notifyParents: notify, ...(trimmed ? { reason: trimmed } : {}) }
        : { mode: "cancel", notifyParents: notify, ...(trimmed ? { reason: trimmed } : {}) };
      r = await portalApi<DateAnswer>("PUT", `${path}/dates/${key}`, body);
      done = action === "move" ? PROGRAM.toasts.dateMoved(day) : PROGRAM.toasts.dateCancelled(day);
    }
    setBusy(false);
    if (noAccess(r)) return;
    if (!r.ok) {
      setMessage(r.message);
      return;
    }
    toast.show(done);
    onDone();
  }

  return (
    <Sheet open onOpenChange={(open) => { if (!open) onClose(); }} title={TITLES[action]}>
      <div className="flex flex-col gap-6">
        {action === "delete" ? (
          <p className="text-body text-primary">{PROGRAM.deleteClassConfirm(day)}</p>
        ) : (
          <>
            {action === "move" && (
              <>
                <DatePickerField id="date-new" label={PROGRAM.newDate} value={newDate} onChange={setNewDate} variant="card" />
                <div>
                  <label htmlFor="date-time" className="text-label text-secondary block mb-2">{PROGRAM.startAt}</label>
                  <Input id="date-time" type="time" step={300} value={newTime} onChange={(e) => setNewTime(e.target.value)} surface="card" />
                </div>
              </>
            )}
            <div>
              <label htmlFor="date-reason" className="text-label text-secondary block mb-2">{PROGRAM.reason}</label>
              <Input id="date-reason" value={reason} maxLength={120} onChange={(e) => setReason(e.target.value)} surface="card" />
            </div>
            <Checkbox label={PROGRAM.notify} checked={notify} onChange={(e) => setNotify(e.target.checked)} />
          </>
        )}
        <AlertLine message={message} reserve />
        <Button onClick={() => void submit()} disabled={busy || documentId === null || (action === "move" && (newDate === "" || newTime === ""))} className="w-full">
          {action === "delete" ? PROGRAM.deleteClass : PROGRAM.save}
        </Button>
        {action === "delete" && <Button variant="secondary" onClick={onClose} disabled={busy} className="w-full">{LESSON.giveUp}</Button>}
      </div>
    </Sheet>
  );
}
