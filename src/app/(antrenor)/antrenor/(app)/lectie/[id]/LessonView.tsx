"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button";
import Checkbox from "@/components/ui/checkbox";
import Dialog, { DialogActions, DialogClose } from "@/components/ui/dialog";
import { LESSON, NAV, PRESENCE } from "@/lib/portal/copy";
import { dayTile, durationText, shortDate } from "@/lib/portal/format";
import type { CoachLesson, LessonSaved } from "@/lib/portal/api-types";
import { portalApi } from "@/app/_portal/lib/api";
import { useMe } from "../../../_lib/me-context";
import { useNoAccess } from "../../../_lib/use-portal";
import { AlertLine } from "@/app/_portal/ui/AuthBits";
import { LoadError } from "@/app/_portal/ui/LoadError";
import { PageBody } from "@/app/_portal/ui/PageBody";
import { PageHeader } from "@/app/_portal/ui/PageHeader";
import { Spinner } from "@/app/_portal/ui/Spinner";
import { useToast } from "@/app/_portal/ui/Toast";
import { CoachPicker } from "../../prezenta/CoachPicker";
import { DurationPicker } from "../DurationPicker";
import { FORM } from "../form";

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
  if (loaded === null || loaded.key !== key) return <PageBody><div className="flex justify-center py-6"><Spinner /></div></PageBody>;
  if (loaded.lesson === null) return <PageBody><LoadError onRetry={reload} /></PageBody>;
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

  const sub = [lesson.savedLine, lesson.archived ? PRESENCE.archived : null].filter((p): p is string => Boolean(p)).join(" ");
  return (
    <>
      <PageHeader
        back={{ href: "/", label: NAV.today }}
        title={LESSON.title}
        sub={sub || undefined}
        aside={<p className="flex min-h-(--portal-tap) shrink-0 items-center border-control border-line bg-surface-raised px-4 text-(length:--portal-text-14) font-bold">{dayTile(lesson.date)}</p>}
      />
      <PageBody>
        <div data-lesson-form className={FORM}>
          <div>
            <span className="text-field-label text-label-ink block mb-(--field-gap)">{LESSON.athlete}</span>
            <p className="text-(length:--portal-text-15) font-bold">{lesson.athleteName}</p>
            <p className="text-(length:--portal-text-13) text-muted">{`${lesson.startTime}, ${durationText(duration)}`}</p>
          </div>
          <DurationPicker value={duration} onChange={setDuration} disabled={readOnly} />
          <CoachPicker me={me?.coachId ?? ""} options={lesson.coachOptions} value={coachIds} onChange={setCoachIds} locked={readOnly} />
          <div className="flex min-h-(--portal-kv-min-h) items-center justify-between gap-3">
            <span className="text-(length:--portal-text-15) font-bold">{LESSON.present}</span>
            <Checkbox label={<span className="sr-only">{`${LESSON.present}, ${lesson.athleteName}`}</span>} checked={present} disabled={readOnly} onChange={(e) => setPresent(e.target.checked)} />
          </div>
          <AlertLine message={message} />
          {!readOnly && <Button onClick={() => void save()} disabled={busy} className="w-full">{LESSON.savePresence}</Button>}
          {lesson.deletable && <Button variant="secondary" onClick={() => setConfirm(true)} className="w-full">{LESSON.delete}</Button>}
        </div>
      </PageBody>
      <Dialog open={confirm} onOpenChange={setConfirm} title={LESSON.deleteConfirm(shortDate(lesson.date))} hideClose>
        <DialogActions>
          <DialogClose asChild><Button variant="secondary">{LESSON.giveUp}</Button></DialogClose>
          <Button onClick={() => void remove()} disabled={busy}>{LESSON.delete}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
