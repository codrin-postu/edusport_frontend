"use client";

import { useId, useState } from "react";
import Button from "@/components/ui/button";
import { LESSON } from "@/lib/portal/copy";
import { durationText } from "@/lib/portal/format";
import Icon from "@/components/ui/icon";
import { Sheet } from "@/app/_portal/ui/Sheet";

const HOURS = [0, 1, 2, 3];
const MINUTES = Array.from({ length: 12 }, (_, i) => i * 5);
const SELECT = "w-full h-12 px-(--input-pad-x) text-input border-input border-input-line bg-input-bg text-primary outline-none focus:outline-2 focus:outline-offset-(--focus-offset) focus:outline-focus";

type DurationPickerProps = { value: number; onChange: (min: number) => void; disabled?: boolean };

export function DurationPicker({ value, onChange, disabled }: DurationPickerProps) {
  const [open, setOpen] = useState(false);
  const [hours, setHours] = useState(Math.floor(value / 60));
  const [minutes, setMinutes] = useState(value % 60);
  const hoursId = useId();
  const minutesId = useId();
  const total = hours * 60 + minutes;
  return (
    <>
      <div>
        <span className="text-field-label text-label-ink block mb-(--field-gap)">{LESSON.duration}</span>
      <button
        type="button"
        disabled={disabled}
        onClick={() => { setHours(Math.floor(value / 60)); setMinutes(value % 60); setOpen(true); }}
        className="flex h-12 w-full items-center justify-between gap-2 border-input border-input-line bg-input-bg px-(--input-pad-x) text-left text-input text-primary outline-none focus-visible:outline-2 focus-visible:outline-offset-(--focus-offset) focus-visible:outline-focus disabled:border-line-subtle disabled:text-disabled"
      >
        {durationText(value)}
        <Icon name="portal-chevron-down" size="sm" />
      </button>
      </div>
      <Sheet open={open} onOpenChange={setOpen} title={LESSON.duration}>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor={hoursId} className="text-field-label text-label-ink block mb-(--field-gap)">{LESSON.hours}</label>
            <select id={hoursId} className={SELECT} value={hours} onChange={(e) => setHours(Number(e.target.value))}>
              {HOURS.map((h) => <option key={h} value={h}>{h}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor={minutesId} className="text-field-label text-label-ink block mb-(--field-gap)">{LESSON.minutes}</label>
            <select id={minutesId} className={SELECT} value={minutes} onChange={(e) => setMinutes(Number(e.target.value))}>
              {MINUTES.map((m) => <option key={m} value={m}>{String(m).padStart(2, "0")}</option>)}
            </select>
          </div>
        </div>
        <Button disabled={total === 0} onClick={() => { onChange(total); setOpen(false); }} className="w-full">{LESSON.ok}</Button>
      </Sheet>
    </>
  );
}
