"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button";
import DatePickerField from "@/components/ui/date-picker-field";
import { Field, Input } from "@/components/ui/form-field";
import { LESSON, NAV } from "@/lib/portal/copy";
import type { CoachSearchRow, LessonSaved } from "@/lib/portal/api-types";
import { portalApi } from "@/app/_portal/lib/api";
import { useMe } from "../../../_lib/me-context";
import { bucharestToday } from "../../../_lib/today";
import { AthleteSearch } from "../../../_ui/AthleteSearch";
import { AlertLine } from "@/app/_portal/ui/AuthBits";
import { PageBody } from "@/app/_portal/ui/PageBody";
import { PageHeader } from "@/app/_portal/ui/PageHeader";
import { Spinner } from "@/app/_portal/ui/Spinner";
import { useToast } from "@/app/_portal/ui/Toast";
import { CoachPicker } from "../../prezenta/CoachPicker";
import { DurationPicker } from "../DurationPicker";
import { FORM } from "../form";

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

  if (!me) return <PageBody><div className="flex justify-center py-6"><Spinner /></div></PageBody>;
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
    <>
      <PageHeader back={{ href: "/", label: NAV.today }} title={LESSON.title} />
      <PageBody>
        <div data-lesson-form className={FORM}>
          <div>
            <span className="text-field-label text-label-ink block mb-(--field-gap)">{LESSON.athlete}</span>
            {athlete && <p className="mb-2 text-(length:--portal-text-15) font-bold">{athlete.name}</p>}
            <AthleteSearch multiple={false} selected={athlete ? [athlete.athleteId] : []} onToggle={setAthlete} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <DatePickerField id="lesson-date" label={LESSON.date} value={date} onChange={setDate} variant="card" />
            <Field label={LESSON.time} id={timeId}>
              <Input type="time" step={300} value={time} onChange={(e) => setTime(e.target.value)} surface="card" />
            </Field>
          </div>
          <DurationPicker value={duration} onChange={setDuration} />
          <CoachPicker me={me.coachId} options={me.coachOptions} value={ids} onChange={setCoachIds} />
          <AlertLine message={message} />
          <Button onClick={() => void save()} disabled={!ready} className="w-full">{LESSON.save}</Button>
        </div>
      </PageBody>
    </>
  );
}
