"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button";
import Checkbox from "@/components/ui/checkbox";
import Dialog, { DialogActions, DialogClose } from "@/components/ui/dialog";
import { LESSON, PRESENCE } from "@/lib/portal/copy";
import { dayTile, durationText, shortDate } from "@/lib/portal/format";
import type { CoachLesson, LessonSaved } from "@/lib/portal/api-types";
import { portalApi } from "@/app/_portal/lib/api";
import { useMe } from "../../../_lib/me-context";
import { useNoAccess } from "../../../_lib/use-portal";
import { LoadError } from "@/app/_portal/ui/LoadError";
import { Spinner } from "@/app/_portal/ui/Spinner";
import { useToast } from "@/app/_portal/ui/Toast";
import { CoachPicker } from "../../prezenta/CoachPicker";
import { DurationPicker } from "../DurationPicker";

type Loaded = { key: string; lesson: CoachLesson | null };

export function LessonView({ id }: { id: string }) {
  const [tick, setTick] = useState(0);
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const noAccess = useNoAccess();
  const key = `${tick}:${id}`;

  useEffect(() => {
    let cancelled = false;
    void portalApi<CoachLesson>("GET", `coach/lessons/${encodeURIComponent(id)}`).then((r) => {
      if (cancelled || noAccess(r)) return;
      setLoaded({ key, lesson: r.ok ? r.data : null });
    });
    return () => {
      cancelled = true;
    };
  }, [id, key, noAccess]);

  const reload = useCallback(() => setTick((n) => n + 1), []);
  if (loaded === null || loaded.key !== key) return <div className="py-6 flex justify-center"><Spinner /></div>;
  if (loaded.lesson === null) return <LoadError />;
  return <LessonBody key={key} lesson={loaded.lesson} reload={reload} />;
}

function LessonBody({ lesson, reload }: { lesson: CoachLesson; reload: () => void }) {
  const router = useRouter();
  const toast = useToast();
  const noAccess = useNoAccess();
  const me = useMe();
  const [present, setPresent] = useState(lesson.present === true);
  const [duration, setDuration] = useState(lesson.durationMin);
  const [coachIds, setCoachIds] = useState(lesson.coachIds);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const readOnly = lesson.archived || !lesson.editable;

  async function save() {
    setBusy(true);
    setMessage(null);
    const r = await portalApi<LessonSaved>("PUT", `coach/lessons/${encodeURIComponent(lesson.lessonId)}`, { present, durationMin: duration, coachIds });
    setBusy(false);
    if (r.ok) {
      toast.show(r.data.toast);
      reload();
      return;
    }
    if (noAccess(r)) return;
    if (r.status === 403 && r.message === PRESENCE.archived) {
      reload();
      return;
    }
    setMessage(r.message);
  }

  async function remove() {
    setBusy(true);
    const r = await portalApi<{ toast: string }>("DELETE", `coach/lessons/${encodeURIComponent(lesson.lessonId)}`);
    setBusy(false);
    setConfirm(false);
    if (r.ok) {
      toast.show(r.data.toast);
      router.replace("/");
      return;
    }
    if (noAccess(r)) return;
    setMessage(r.message);
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-title text-primary">{LESSON.title}</h1>
          <p className="text-label text-primary border-retro border-line px-3 h-10 flex items-center shrink-0">{dayTile(lesson.date)}</p>
        </div>
        {lesson.savedLine && <p className="text-body-sm text-secondary mt-2">{lesson.savedLine}</p>}
        {lesson.archived && <p className="text-body-sm text-secondary mt-2">{PRESENCE.archived}</p>}
      </div>
      <CoachPicker me={me?.coachId ?? ""} options={lesson.coachOptions} value={coachIds} onChange={setCoachIds} locked={readOnly} />
      <div className="border-retro border-line bg-surface-raised">
        <div className="flex items-center justify-between px-4 h-12 border-b border-line text-label text-secondary">
          <span>{LESSON.athlete}</span>
          <span>{LESSON.present}</span>
        </div>
        <div className="flex items-center justify-between gap-4 px-4 py-3">
          <span className="min-w-0">
            <span className="text-body text-primary block">{lesson.athleteName}</span>
            <span className="text-body-sm text-secondary block">{`${lesson.startTime}, ${durationText(duration)}`}</span>
          </span>
          <Checkbox label={<span className="sr-only">{`${lesson.athleteName}, ${LESSON.present}`}</span>} checked={present} disabled={readOnly} onChange={(e) => setPresent(e.target.checked)} />
        </div>
      </div>
      <DurationPicker value={duration} onChange={setDuration} disabled={readOnly} />
      <p role="alert" className="text-body-sm text-accent min-h-6">{message}</p>
      {!readOnly && <Button onClick={() => void save()} disabled={busy} className="w-full">{LESSON.savePresence}</Button>}
      {lesson.deletable && <Button variant="secondary" onClick={() => setConfirm(true)} className="w-full">{LESSON.delete}</Button>}
      <Dialog open={confirm} onOpenChange={setConfirm} title={LESSON.deleteConfirm(shortDate(lesson.date))} hideClose>
        <DialogActions>
          <DialogClose asChild><Button variant="secondary">{LESSON.giveUp}</Button></DialogClose>
          <Button onClick={() => void remove()} disabled={busy}>{LESSON.delete}</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
