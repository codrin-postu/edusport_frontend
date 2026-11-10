"use client";

import { useId, useState } from "react";
import Button from "@/components/ui/button";
import DatePickerField from "@/components/ui/date-picker-field";
import { Input } from "@/components/ui/form-field";
import { Select } from "@/components/ui/select";
import { TRAINING } from "@/lib/portal/copy";
import type { CoachGroupRow, CoachMe } from "@/lib/portal/api-types";
import { dayKeyOf, initialValue, monthlyNote, ready, trainingSummary, type RepeatChoice, type TrainingKind, type TrainingMode, type TrainingValue } from "@/lib/portal/training-form";
import { AthleteSearch } from "../../_ui/AthleteSearch";
import { AlertLine } from "@/app/_portal/ui/AuthBits";
import { DaySquares } from "@/app/_portal/ui/DaySquares";
import { Segmented } from "@/app/_portal/ui/Segmented";
import { SummaryBand } from "@/app/_portal/ui/SummaryBand";
import { CoachPicker } from "../prezenta/CoachPicker";

const DURATIONS = Array.from({ length: (240 - 15) / 5 + 1 }, (_, i) => 15 + i * 5);
const DURATION_OPTIONS = DURATIONS.map((m) => ({ value: String(m), label: `${m} min` }));
const REPEATS: { value: RepeatChoice; label: string }[] = [
  { value: "none", label: TRAINING.once }, { value: "weekly", label: TRAINING.weekly }, { value: "biweekly", label: TRAINING.biweekly }, { value: "monthly", label: TRAINING.monthly },
];
const UNTIL_OPTIONS = [{ value: "season", label: TRAINING.seasonEnd }, { value: "date", label: TRAINING.untilDate }];
const FORM =
  "flex flex-col gap-(--portal-form-gap) portal:border-card portal:border-card-line portal:bg-surface-raised portal:p-(--portal-login-pad) portal:shadow-retro";
const LABEL = "text-field-label text-label-ink block mb-(--field-gap)";

type TrainingFormProps = {
  mode: TrainingMode;
  today: string;
  me: CoachMe;
  /** Own Club groups (`GET /groups` mine with kind club). */
  groups: CoachGroupRow[];
  /** Starting kind for a new form (the `?tip=individual` link). */
  startKind?: TrainingKind;
  /** Runs the write. Resolves to the refusal text to show, or null when it went through (the page then moves on). */
  onSubmit: (value: TrainingValue) => Promise<string | null>;
};

/** One form for a new training (group or individual, once or repeating) and for editing a lesson. */
export function TrainingForm({ mode, today, me, groups, startKind, onSubmit }: TrainingFormProps) {
  const ids = { group: useId(), repeat: useId(), time: useId(), duration: useId(), until: useId() };
  const edit = mode.kind === "edit";
  const noGroups = groups.length === 0;
  const [v, setV] = useState<TrainingValue>(() => {
    const first = initialValue(mode, today, me.coachId);
    return { ...first, kind: noGroups || startKind === "individual" ? "individual" : first.kind };
  });
  const [daysTouched, setDaysTouched] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const set = (patch: Partial<TrainingValue>) => setV((cur) => ({ ...cur, ...patch }));
  const series = v.repeat !== "none";
  const summary = trainingSummary(v);

  async function submit() {
    if (busy || !ready(v)) return;
    setBusy(true);
    setMessage(null);
    const refusal = await onSubmit(v);
    // busy stays true on success: the button must not come back before the route changes.
    if (refusal !== null) {
      setBusy(false);
      setMessage(refusal);
    }
  }

  const timeField = (
    <div>
      <label htmlFor={ids.time} className={LABEL}>{TRAINING.time}</label>
      <Input id={ids.time} type="time" step={300} value={v.startTime} onChange={(e) => set({ startTime: e.target.value })} surface="card" />
    </div>
  );
  const durationField = (
    <div>
      <label htmlFor={ids.duration} className={LABEL}>{TRAINING.duration}</label>
      <Select id={ids.duration} value={String(v.durationMin)} onValueChange={(m) => set({ durationMin: Number(m) })} options={DURATION_OPTIONS} chevron="portal-chevron-down" contentClassName="z-popup" />
    </div>
  );
  const repeatField = (
    <div>
      <label htmlFor={ids.repeat} className={LABEL}>{TRAINING.repeat}</label>
      <Select id={ids.repeat} value={v.repeat} onValueChange={(r) => set({ repeat: r as RepeatChoice })} options={REPEATS} chevron="portal-chevron-down" contentClassName="z-popup" />
    </div>
  );

  return (
    <div data-training-form className={FORM}>
      {!edit && !noGroups && (
        <Segmented
          label={TRAINING.title}
          value={v.kind}
          onChange={(kind) => set({ kind })}
          options={[{ value: "grup", label: TRAINING.group }, { value: "individual", label: TRAINING.individual }]}
        />
      )}
      {v.kind === "grup" ? (
        <div>
          <label htmlFor={ids.group} className={LABEL}>{TRAINING.groupField}</label>
          <Select
            id={ids.group}
            value={v.groupId ?? ""}
            onValueChange={(groupId) => set({ groupId })}
            options={groups.map((g) => ({ value: g.groupId, label: g.name }))}
            chevron="portal-chevron-down"
            contentClassName="z-popup"
          />
        </div>
      ) : (
        <div>
          <span className={LABEL}>{TRAINING.athlete}</span>
          {v.athlete && <p className="mb-2 text-(length:--portal-text-15) font-bold">{v.athlete.name}</p>}
          {!edit && <AthleteSearch multiple={false} selected={v.athlete ? [v.athlete.athleteId] : []} onToggle={(row) => set({ athlete: { athleteId: row.athleteId, name: row.name } })} />}
        </div>
      )}
      {series ? (
        <>
          {repeatField}
          <DaySquares
            label={TRAINING.days}
            value={v.days}
            onChange={(days) => { setDaysTouched(true); set({ days }); }}
          />
          <div className="grid grid-cols-2 gap-3">{timeField}{durationField}</div>
          <div className="grid grid-cols-2 gap-3">
            <DatePickerField
              id="training-from"
              label={TRAINING.from}
              value={v.from}
              onChange={(from) => set({ from, ...(daysTouched || from === "" ? {} : { days: [dayKeyOf(from)] }) })}
              variant="card"
            />
            <div>
              <label htmlFor={ids.until} className={LABEL}>{TRAINING.until}</label>
              <Select
                id={ids.until}
                value={v.until === null ? "season" : "date"}
                onValueChange={(u) => set({ until: u === "season" ? null : "" })}
                options={UNTIL_OPTIONS}
                chevron="portal-chevron-down"
                contentClassName="z-popup"
              />
            </div>
          </div>
          {v.until !== null && <DatePickerField id="training-until" label={TRAINING.untilDateField} value={v.until} onChange={(until) => set({ until })} variant="card" />}
          {v.repeat === "monthly" && v.from !== "" && <p className="text-(length:--portal-sub-size) text-muted">{monthlyNote(v.from)}</p>}
        </>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3">
            <DatePickerField id="training-date" label={TRAINING.date} value={v.date} onChange={(date) => set({ date })} variant="card" />
            {timeField}
          </div>
          {durationField}
          {repeatField}
        </>
      )}
      {v.kind === "individual" && <CoachPicker me={me.coachId} options={me.coachOptions} value={v.coachIds} onChange={(coachIds) => set({ coachIds })} />}
      {summary && <SummaryBand>{summary}</SummaryBand>}
      <AlertLine message={message} />
      <Button onClick={() => void submit()} disabled={!ready(v) || busy} className="w-full">{edit ? TRAINING.save : TRAINING.submit}</Button>
    </div>
  );
}
