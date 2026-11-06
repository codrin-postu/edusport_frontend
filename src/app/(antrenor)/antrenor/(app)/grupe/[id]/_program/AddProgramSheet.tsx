"use client";

import { useState } from "react";
import Button from "@/components/ui/button";
import { PROGRAM } from "@/lib/portal/copy";
import { dayMonth } from "@/lib/portal/format";
import { portalApi } from "../../../../_lib/api";
import { useNoAccess } from "../../../../_lib/use-portal";
import { Sheet } from "../../../../_ui/Sheet";
import { useToast } from "../../../../_ui/Toast";
import { ProgramFields, addBody, formReady, newForm } from "./ProgramForm";
import { SquareSwitch } from "./SquareSwitch";

type Props = { groupId: string; today: string; onClose: () => void; onDone: () => void };

/** "+ Adaugă program": a repeating series, or one class. */
export function AddProgramSheet({ groupId, today, onClose, onDone }: Props) {
  const toast = useToast();
  const noAccess = useNoAccess();
  const [form, setForm] = useState(() => newForm(today));
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function save() {
    setBusy(true);
    setMessage(null);
    const r = await portalApi<{ eventId: string; date: string | null }>("POST", `coach/groups/${encodeURIComponent(groupId)}/program`, addBody(form));
    setBusy(false);
    if (noAccess(r)) return;
    if (!r.ok) {
      setMessage(r.message);
      return;
    }
    toast.show(r.data.date ? PROGRAM.toasts.classAdded(dayMonth(r.data.date)) : PROGRAM.toasts.programAdded);
    onDone();
  }

  return (
    <Sheet open onOpenChange={(o) => { if (!o) onClose(); }} title={PROGRAM.drawerNew}>
      <div className="flex flex-col gap-6">
        <SquareSwitch label={PROGRAM.repeat} checked={form.repeat} onChange={(repeat) => setForm({ ...form, repeat })} />
        <ProgramFields form={form} onChange={setForm} today={today} />
        <p role="alert" className="text-body-sm text-accent min-h-6">{message}</p>
        <Button onClick={() => void save()} disabled={busy || !formReady(form)} className="w-full">{PROGRAM.save}</Button>
      </div>
    </Sheet>
  );
}
