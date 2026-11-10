"use client";

import { useState } from "react";
import DatePickerField from "@/components/ui/date-picker-field";
import { PROGRAM } from "@/lib/portal/copy";
import { capitalize, weekdayOfDay } from "@/lib/portal/format";
import type { CoachProgramRule, DayKey, ProgramChangeBody } from "@/lib/portal/api-types";
import { DaySquares } from "@/app/_portal/ui/DaySquares";
import { Sheet } from "@/app/_portal/ui/Sheet";
import { SheetFooter } from "./SheetFooter";
import { TimeDuration } from "./TimeDuration";
import { useSend } from "./useSend";

type Props = { rule: CoachProgramRule; today: string; onClose: () => void; onDone: () => void };

/** "Schimbă" on one weekday of the program: new days, time and length from a date. Nothing is sent before "Schimbă". */
export function ChangeSheet({ rule, today, onClose, onDone }: Props) {
  const { busy, message, send } = useSend(onDone);
  const [days, setDays] = useState<DayKey[]>([rule.day]);
  const [time, setTime] = useState(rule.startTime);
  const [duration, setDuration] = useState(rule.durationMin);
  const [from, setFrom] = useState(rule.nextDate && rule.nextDate >= today ? rule.nextDate : today);
  const ready = days.length > 0 && time !== "" && from >= today;

  function submit() {
    const body: ProgramChangeBody = {
      freq: rule.freq, days, startTime: time, durationMin: duration, from, day: rule.day,
      ...(rule.freq === "monthly" && rule.weekOfMonth ? { weekOfMonth: rule.weekOfMonth } : {}),
    };
    void send("PUT", `coach/program/${encodeURIComponent(rule.eventId)}`, body, PROGRAM.toasts.programChanged);
  }

  return (
    <Sheet
      open
      onOpenChange={(o) => { if (!o) onClose(); }}
      title={PROGRAM.drawerChange}
      description={PROGRAM.changeSub(PROGRAM.ruleTitle(capitalize(weekdayOfDay(rule.day)), rule.startTime))}
      footer={<SheetFooter message={message} busy={busy} disabled={!ready} confirm={PROGRAM.change} onClose={onClose} onConfirm={submit} />}
    >
      <DaySquares label={PROGRAM.days} value={days} onChange={setDays} />
      <TimeDuration time={time} onTime={setTime} duration={duration} onDuration={setDuration} />
      <DatePickerField id="program-from" label={PROGRAM.appliesFrom} value={from} onChange={setFrom} variant="card" />
    </Sheet>
  );
}
