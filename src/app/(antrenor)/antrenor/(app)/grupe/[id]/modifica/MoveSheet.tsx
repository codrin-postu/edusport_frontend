"use client";

import { useId, useRef, useState } from "react";
import Button from "@/components/ui/button";
import DatePickerField from "@/components/ui/date-picker-field";
import { Select } from "@/components/ui/select";
import { EDIT_GROUP } from "@/lib/portal/copy";
import type { CoachMember } from "@/lib/portal/api-types";
import { portalApi } from "@/app/_portal/lib/api";
import { AlertLine } from "@/app/_portal/ui/AuthBits";
import { Sheet } from "@/app/_portal/ui/Sheet";
import { useToast } from "@/app/_portal/ui/Toast";

type Target = { groupId: string; name: string };
type Saved = { athleteName: string; groupName: string; from: string; toast: string };
type Props = { groupId: string; groupName: string; athlete: CoachMember; targets: Target[]; today: string; onClose: () => void; onDone: () => void };

/** "Mută": the child goes to another of the coach's own groups from a date. Nothing changes on the page until the server answers. */
export function MoveSheet({ groupId, groupName, athlete, targets, today, onClose, onDone }: Props) {
  const toast = useToast();
  const selectId = useId();
  const [to, setTo] = useState(targets[0]?.groupId ?? "");
  const [from, setFrom] = useState(today);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const inFlight = useRef(false);
  const ready = to !== "" && from >= today && !busy;

  async function send() {
    if (!ready || inFlight.current) return;
    inFlight.current = true;
    setBusy(true);
    setMessage(null);
    const r = await portalApi<Saved>("POST", `coach/groups/${encodeURIComponent(groupId)}/members/${encodeURIComponent(athlete.athleteId)}/move`, { toGroupId: to, from });
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
    <Sheet open onOpenChange={(o) => { if (!o && !busy) onClose(); }} title={EDIT_GROUP.moveTitle(athlete.name)} description={EDIT_GROUP.moveText(groupName)}>
      {targets.length === 0 ? (
        <>
          <p className="text-(length:--portal-text-14)">{EDIT_GROUP.noOtherGroup}</p>
          <Button variant="secondary" onClick={onClose} className="w-full">{EDIT_GROUP.cancel}</Button>
        </>
      ) : (
        <>
          <div>
            <label htmlFor={selectId} className="text-field-label text-label-ink mb-(--field-gap) block">{EDIT_GROUP.newGroup}</label>
            <Select id={selectId} value={to} onValueChange={setTo} options={targets.map((t) => ({ value: t.groupId, label: t.name }))} chevron="portal-chevron-down" contentClassName="z-popup" />
          </div>
          <DatePickerField id="move-from" label={EDIT_GROUP.from} value={from} onChange={setFrom} variant="card" />
          <AlertLine message={from !== "" && from < today ? EDIT_GROUP.pastDate : message} />
          <div className="grid grid-cols-2 gap-3">
            <Button variant="secondary" onClick={onClose} disabled={busy} className="w-full">{EDIT_GROUP.cancel}</Button>
            <Button onClick={() => void send()} disabled={!ready} className="w-full">{EDIT_GROUP.moveConfirm}</Button>
          </div>
        </>
      )}
    </Sheet>
  );
}
