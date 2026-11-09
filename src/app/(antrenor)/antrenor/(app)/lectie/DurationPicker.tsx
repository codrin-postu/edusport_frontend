"use client";

import { useId, useState } from "react";
import Button from "@/components/ui/button";
import { LESSON } from "@/lib/portal/copy";
import { durationText } from "@/lib/portal/format";
import { Sheet } from "@/app/_portal/ui/Sheet";

const HOURS = [0, 1, 2, 3];
const MINUTES = Array.from({ length: 12 }, (_, i) => i * 5);
const SELECT = "w-full h-12 px-4 text-body-sm border-retro border-line bg-surface-raised text-primary outline-none focus:outline-2 focus:outline-offset-3 focus:outline-primary";

type DurationPickerProps = { value: number; onChange: (min: number) => void; disabled?: boolean };

export function DurationPicker({ value, onChange, disabled }: DurationPickerProps) {
  const [open, setOpen] = useState(false);
  const [hours, setHours] = useState(Math.floor(value / 60));
  const [minutes, setMinutes] = useState(value % 60);
  const hoursId = useId();
  const minutesId = useId();
  const total = hours * 60 + minutes;
  return (
    <div>
      <p className="text-label text-secondary mb-2">{LESSON.duration}</p>
      <button
        type="button"
        disabled={disabled}
        onClick={() => { setHours(Math.floor(value / 60)); setMinutes(value % 60); setOpen(true); }}
        className="w-full h-12 px-4 text-left text-body-sm border-retro border-line bg-surface-raised text-primary disabled:text-disabled disabled:border-line-subtle outline-none focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-primary"
      >
        {durationText(value)}
      </button>
      <Sheet open={open} onOpenChange={setOpen} title={LESSON.duration}>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor={hoursId} className="text-label text-secondary block mb-2">{LESSON.hours}</label>
            <select id={hoursId} className={SELECT} value={hours} onChange={(e) => setHours(Number(e.target.value))}>
              {HOURS.map((h) => <option key={h} value={h}>{h}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor={minutesId} className="text-label text-secondary block mb-2">{LESSON.minutes}</label>
            <select id={minutesId} className={SELECT} value={minutes} onChange={(e) => setMinutes(Number(e.target.value))}>
              {MINUTES.map((m) => <option key={m} value={m}>{String(m).padStart(2, "0")}</option>)}
            </select>
          </div>
        </div>
        <Button disabled={total === 0} onClick={() => { onChange(total); setOpen(false); }} className="w-full">{LESSON.ok}</Button>
      </Sheet>
    </div>
  );
}
