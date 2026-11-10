"use client";

import { useId } from "react";
import { Input } from "@/components/ui/form-field";
import { Select } from "@/components/ui/select";
import { TRAINING } from "@/lib/portal/copy";

export const DURATION_OPTIONS = Array.from({ length: (240 - 15) / 5 + 1 }, (_, i) => ({ value: String(15 + i * 5), label: `${15 + i * 5} min` }));
export const LABEL = "text-field-label text-label-ink block mb-(--field-gap)";

type Props = { time: string; onTime: (v: string) => void; duration?: number; onDuration?: (v: number) => void };

/** "Ora" and, when a duration is given, "Durată" side by side. */
export function TimeDuration({ time, onTime, duration, onDuration }: Props) {
  const ids = { time: useId(), duration: useId() };
  return (
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label htmlFor={ids.time} className={LABEL}>{TRAINING.time}</label>
        <Input id={ids.time} type="time" step={300} value={time} onChange={(e) => onTime(e.target.value)} surface="card" />
      </div>
      {duration !== undefined && onDuration && (
        <div>
          <label htmlFor={ids.duration} className={LABEL}>{TRAINING.duration}</label>
          <Select id={ids.duration} value={String(duration)} onValueChange={(m) => onDuration(Number(m))} options={DURATION_OPTIONS} chevron="portal-chevron-down" contentClassName="z-popup" />
        </div>
      )}
    </div>
  );
}
