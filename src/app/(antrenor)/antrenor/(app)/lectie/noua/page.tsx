"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button";
import DatePickerField from "@/components/ui/date-picker-field";
import { Input } from "@/components/ui/form-field";
import { LESSON } from "@/lib/portal/copy";
import type { CoachSearchRow, LessonSaved } from "@/lib/portal/api-types";
import { portalApi } from "../../../_lib/api";
import { useMe } from "../../../_lib/me-context";
import { bucharestToday } from "../../../_lib/today";
import { AthleteSearch } from "../../../_ui/AthleteSearch";
import { Spinner } from "@/app/_portal/ui/Spinner";
import { useToast } from "@/app/_portal/ui/Toast";
import { CoachPicker } from "../../prezenta/CoachPicker";
import { DurationPicker } from "../DurationPicker";

export default function NewLessonPage() {
  const me = useMe();
  const router = useRouter();
  const toast = useToast();
  const timeId = useId();
  const [athlete, setAthlete] = useState<CoachSearchRow | null>(null);
  const [date, setDate] = useState(bucharestToday);
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState(50);
  const [coachIds, setCoachIds] = useState<string[] | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!me) return <div className="py-6 flex justify-center"><Spinner /></div>;
  const ids = coachIds ?? [me.coachId];
  const ready = athlete !== null && date !== "" && time !== "" && !busy;

  async function save() {
    if (!athlete || !me || busy) return;
    setBusy(true);
    setMessage(null);
    const r = await portalApi<LessonSaved>("POST", "coach/lessons", {
      athleteId: athlete.athleteId, date, startTime: time, durationMin: duration, coachIds: ids.includes(me.coachId) ? ids : [me.coachId, ...ids],
    });
    if (!r.ok) {
      setBusy(false);
      setMessage(r.message);
      return;
    }
    // busy stays true on success: the button must not come back before the route changes.
    toast.show(r.data.toast);
    router.replace(`/lectie/${encodeURIComponent(r.data.lessonId)}`);
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-title text-primary">{LESSON.title}</h1>
      <div>
        <p className="text-label text-secondary mb-2">{LESSON.athlete}</p>
        {athlete && <p className="text-body text-primary mb-2">{athlete.name}</p>}
        <AthleteSearch multiple={false} selected={athlete ? [athlete.athleteId] : []} onToggle={setAthlete} />
      </div>
      <DatePickerField id="lesson-date" label={LESSON.date} value={date} onChange={setDate} variant="card" />
      <div>
        <label htmlFor={timeId} className="text-label text-secondary block mb-2">{LESSON.time}</label>
        <Input id={timeId} type="time" step={300} value={time} onChange={(e) => setTime(e.target.value)} surface="card" />
      </div>
      <DurationPicker value={duration} onChange={setDuration} />
      <CoachPicker me={me.coachId} options={me.coachOptions} value={ids} onChange={setCoachIds} />
      <p role="alert" className="text-body-sm text-accent min-h-6">{message}</p>
      <Button onClick={() => void save()} disabled={!ready} className="w-full">{LESSON.save}</Button>
    </div>
  );
}
