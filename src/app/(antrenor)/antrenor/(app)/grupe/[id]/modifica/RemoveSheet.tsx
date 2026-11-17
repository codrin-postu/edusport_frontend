"use client";

import { useRef, useState } from "react";
import Button from "@/components/ui/button";
import DatePickerField from "@/components/ui/date-picker-field";
import { EDIT_GROUP } from "@/lib/portal/copy";
import type { CoachMember } from "@/lib/portal/api-types";
import { portalApi } from "@/app/_portal/lib/api";
import { AlertLine } from "@/app/_portal/ui/AuthBits";
import { Sheet } from "@/app/_portal/ui/Sheet";
import { useToast } from "@/app/_portal/ui/Toast";

type Saved = { athleteName: string; groupName: string; from: string; toast: string };
type Props = { groupId: string; athlete: CoachMember; today: string; onClose: () => void; onDone: () => void };

/** "Scoate": the child leaves the group from a date. Nothing changes on the page until the server answers. */
export function RemoveSheet({ groupId, athlete, today, onClose, onDone }: Props) {
  const toast = useToast();
  const [from, setFrom] = useState(today);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const inFlight = useRef(false);
  const ready = from >= today && !busy;

  async function send() {
    if (!ready || inFlight.current) return;
    inFlight.current = true;
    setBusy(true);
    setMessage(null);
    const r = await portalApi<Saved>("POST", `coach/groups/${encodeURIComponent(groupId)}/members/${encodeURIComponent(athlete.athleteId)}/remove`, { from });
    inFlight.current = false;
    setBusy(false);
    if (!r.ok) {
      setMessage(r.message);
      return;
    }
    toast.show(r.data.toast);
    onDone();
  }

  return (
    <Sheet open onOpenChange={(o) => { if (!o && !busy) onClose(); }} title={EDIT_GROUP.removeTitle(athlete.name)} description={EDIT_GROUP.removeText}>
      <DatePickerField id="remove-from" label={EDIT_GROUP.from} value={from} onChange={setFrom} variant="card" />
      <AlertLine message={from !== "" && from < today ? EDIT_GROUP.pastDate : message} />
      <div className="grid grid-cols-2 gap-3">
        <Button variant="secondary" onClick={onClose} disabled={busy} className="w-full">{EDIT_GROUP.cancel}</Button>
        <Button onClick={() => void send()} disabled={!ready} className="w-full">{EDIT_GROUP.removeConfirm}</Button>
      </div>
    </Sheet>
  );
}
