"use client";

import { useState } from "react";
import DatePickerField from "@/components/ui/date-picker-field";
import { PROGRAM } from "@/lib/portal/copy";
import { weekdayOfDay } from "@/lib/portal/format";
import type { CoachProgramRule, ProgramEndBody } from "@/lib/portal/api-types";
import { Sheet } from "@/app/_portal/ui/Sheet";
import { SheetFooter } from "./SheetFooter";
import { useSend } from "./useSend";

type Props = { rule: CoachProgramRule; today: string; onClose: () => void; onDone: () => void };

/** "Șterge" on one weekday of the program: the program stops from a date, earlier dates stay. */
export function EndSheet({ rule, today, onClose, onDone }: Props) {
  const { busy, message, send } = useSend(onDone);
  const [from, setFrom] = useState(rule.nextDate && rule.nextDate >= today ? rule.nextDate : today);

  function submit() {
    const body: ProgramEndBody = { from, day: rule.day };
    void send("POST", `coach/program/${encodeURIComponent(rule.eventId)}/end`, body, PROGRAM.toasts.programEnded);
  }

  return (
    <Sheet
      open
      onOpenChange={(o) => { if (!o) onClose(); }}
      title={PROGRAM.endTitle(weekdayOfDay(rule.day))}
      description={PROGRAM.endText}
      footer={<SheetFooter message={message} busy={busy} disabled={from < today} confirm={PROGRAM.endProgram} onClose={onClose} onConfirm={submit} />}
    >
      <DatePickerField id="program-end-from" label={PROGRAM.endFrom} value={from} onChange={setFrom} variant="card" />
    </Sheet>
  );
}
