"use client";

import { useState } from "react";
import Button from "@/components/ui/button";
import { LESSON, PROGRAM } from "@/lib/portal/copy";
import { shortDate } from "@/lib/portal/format";
import type { ProgramRow } from "@/lib/portal/api-types";
import { portalApi } from "@/app/_portal/lib/api";
import { useNoAccess } from "../../../../_lib/use-portal";
import { AlertLine } from "@/app/_portal/ui/AuthBits";
import { Sheet } from "@/app/_portal/ui/Sheet";
import { useToast } from "@/app/_portal/ui/Toast";
import { ProgramFields, changeBody, formOfRow, formReady } from "./ProgramForm";

type Props = { row: ProgramRow; today: string; onClose: () => void; onDone: () => void };

/** "Schimbă" on a series row: new fields from a date, or "Șterge programul" from that date. */
export function ChangeSheet({ row, today, onClose, onDone }: Props) {
  const toast = useToast();
  const noAccess = useNoAccess();
  const [form, setForm] = useState(() => formOfRow(row, row.nextDate && row.nextDate >= today ? row.nextDate : today));
  const [confirming, setConfirming] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const path = `coach/program/${encodeURIComponent(row.eventId)}`;

  async function send(method: "PUT" | "POST", url: string, body: unknown, done: string) {
    setBusy(true);
    setMessage(null);
    const r = await portalApi<{ eventId: string }>(method, url, body);
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
    <Sheet open onOpenChange={(o) => { if (!o) onClose(); }} title={PROGRAM.drawerChange}>
      {confirming ? (
        <div className="flex flex-col gap-4">
          <p className="text-body text-primary">{PROGRAM.endConfirm(shortDate(form.from))}</p>
          <AlertLine message={message} reserve />
          <Button onClick={() => void send("POST", `${path}/end`, { from: form.from }, PROGRAM.toasts.programEnded)} disabled={busy} className="w-full">{PROGRAM.endProgram}</Button>
          <Button variant="secondary" onClick={() => setConfirming(false)} disabled={busy} className="w-full">{LESSON.giveUp}</Button>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <ProgramFields form={form} onChange={setForm} today={today} />
          <AlertLine message={message} reserve />
          <Button onClick={() => void send("PUT", path, changeBody(form), PROGRAM.toasts.programChanged)} disabled={busy || !formReady(form)} className="w-full">{PROGRAM.save}</Button>
          <Button variant="secondary" onClick={() => setConfirming(true)} disabled={busy} className="w-full">{PROGRAM.endProgram}</Button>
        </div>
      )}
    </Sheet>
  );
}
