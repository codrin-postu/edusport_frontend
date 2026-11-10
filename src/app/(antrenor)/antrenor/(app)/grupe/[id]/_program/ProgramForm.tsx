"use client";

import { useId } from "react";
import DatePickerField from "@/components/ui/date-picker-field";
import { Input } from "@/components/ui/form-field";
import { Select } from "@/components/ui/select";
import { PROGRAM } from "@/lib/portal/copy";
import type { DayKey, ProgramAddBody, ProgramChangeBody, RepeatFreq, WeekOfMonth } from "@/lib/portal/api-types";
import { cn } from "@/utils/cn";

export type ProgramFormValue = {
  repeat: boolean;
  freq: RepeatFreq;
  weekOfMonth: WeekOfMonth;
  days: DayKey[];
  startTime: string;
  durationMin: number;
  from: string;
  date: string;
};

const DAY_ORDER: DayKey[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
const FREQS: { value: RepeatFreq; label: string }[] = [
  { value: "weekly", label: PROGRAM.weekly },
  { value: "biweekly", label: PROGRAM.biweekly },
  { value: "monthly", label: PROGRAM.monthly },
];
const WEEKS: { value: WeekOfMonth; label: string }[] = [
  { value: "first", label: PROGRAM.weekFirst },
  { value: "second", label: PROGRAM.weekSecond },
  { value: "third", label: PROGRAM.weekThird },
  { value: "fourth", label: PROGRAM.weekFourth },
  { value: "last", label: PROGRAM.weekLast },
];
const DURATIONS = Array.from({ length: (240 - 15) / 5 + 1 }, (_, i) => 15 + i * 5);

export const newForm = (today: string): ProgramFormValue => ({
  repeat: true, freq: "weekly", weekOfMonth: "first", days: [], startTime: "", durationMin: 50, from: today, date: today,
});

/** The series as it is, from `from`. */
export const formOfRow = (row: { freq: RepeatFreq; weekOfMonth: WeekOfMonth | null; days: DayKey[]; startTime: string; durationMin: number }, from: string): ProgramFormValue => ({
  repeat: true, freq: row.freq, weekOfMonth: row.weekOfMonth ?? "first", days: [...row.days], startTime: row.startTime, durationMin: row.durationMin, from, date: from,
});

export const formReady = (f: ProgramFormValue): boolean => f.startTime !== "" && (f.repeat ? f.days.length > 0 && f.from !== "" : f.date !== "");

export function changeBody(f: ProgramFormValue): ProgramChangeBody {
  return {
    freq: f.freq, days: DAY_ORDER.filter((d) => f.days.includes(d)), startTime: f.startTime, durationMin: f.durationMin, from: f.from,
    ...(f.freq === "monthly" ? { weekOfMonth: f.weekOfMonth } : {}),
  };
}

export function addBody(f: ProgramFormValue): ProgramAddBody {
  if (f.repeat) return { repeat: true, ...changeBody(f) };
  return { repeat: false, date: f.date, startTime: f.startTime, durationMin: f.durationMin };
}

type Props = { form: ProgramFormValue; onChange: (f: ProgramFormValue) => void; today: string };

/** Never before today: an earlier pick becomes today. */
const notBefore = (today: string, value: string): string => (value !== "" && value < today ? today : value);

/** Fields of the add and change sheets (the series fields, or the one-off ones when "Se repetă" is off). */
export function ProgramFields({ form, onChange, today }: Props) {
  const ids = { freq: useId(), week: useId(), time: useId(), dur: useId() };
  const set = (patch: Partial<ProgramFormValue>) => onChange({ ...form, ...patch });
  const toggle = (d: DayKey) => set({ days: form.days.includes(d) ? form.days.filter((x) => x !== d) : [...form.days, d] });
  const timeAndDuration = (
    <>
      <div>
        <label htmlFor={ids.time} className="text-field-label text-label-ink mb-(--field-gap) block">{PROGRAM.startAt}</label>
        <Input id={ids.time} type="time" step={300} value={form.startTime} onChange={(e) => set({ startTime: e.target.value })} surface="card" />
      </div>
      <div>
        <label htmlFor={ids.dur} className="text-field-label text-label-ink mb-(--field-gap) block">{PROGRAM.duration}</label>
        <Select id={ids.dur} value={String(form.durationMin)} onValueChange={(v) => set({ durationMin: Number(v) })} options={DURATIONS.map((m) => ({ value: String(m), label: `${m} min` }))} chevron="portal-chevron-down" contentClassName="z-popup" />
      </div>
    </>
  );
  if (!form.repeat) {
    return (
      <>
        <DatePickerField id="program-date" label={PROGRAM.date} value={form.date} onChange={(v) => set({ date: notBefore(today, v) })} variant="card" />
        {timeAndDuration}
      </>
    );
  }
  return (
    <>
      <div>
        <label htmlFor={ids.freq} className="text-field-label text-label-ink mb-(--field-gap) block">{PROGRAM.howOften}</label>
        <Select id={ids.freq} value={form.freq} onValueChange={(v) => set({ freq: v as RepeatFreq })} options={FREQS} chevron="portal-chevron-down" contentClassName="z-popup" />
      </div>
      {form.freq === "monthly" && (
        <div>
          <label htmlFor={ids.week} className="text-field-label text-label-ink mb-(--field-gap) block">{PROGRAM.weekOfMonth}</label>
          <Select id={ids.week} value={form.weekOfMonth} onValueChange={(v) => set({ weekOfMonth: v as WeekOfMonth })} options={WEEKS} chevron="portal-chevron-down" contentClassName="z-popup" />
        </div>
      )}
      <div role="group" aria-label={PROGRAM.days}>
        <p className="text-field-label text-label-ink mb-(--field-gap) block">{PROGRAM.days}</p>
        <div className="grid grid-cols-7 gap-1">
          {DAY_ORDER.map((d) => (
            <button
              key={d}
              type="button"
              aria-pressed={form.days.includes(d)}
              onClick={() => toggle(d)}
              className={cn(
                "h-12 text-button border-control border-line outline-none focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-primary",
                form.days.includes(d) ? "bg-surface-dark text-primary-on-dark" : "bg-surface-raised text-primary",
              )}
            >
              {PROGRAM.dayLetters[d]}
            </button>
          ))}
        </div>
      </div>
      {timeAndDuration}
      <DatePickerField id="program-from" label={PROGRAM.appliesFrom} value={form.from} onChange={(v) => set({ from: notBefore(today, v) })} variant="card" />
    </>
  );
}
