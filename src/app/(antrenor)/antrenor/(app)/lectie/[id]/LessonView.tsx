"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button";
import Checkbox from "@/components/ui/checkbox";
import { LESSON, NAV, PRESENCE, PROGRAM, TRAINING } from "@/lib/portal/copy";
import { capitalize, dayMonthLong, daysSpoken, longDay, shortDate } from "@/lib/portal/format";
import type { CoachLesson, LessonSaved } from "@/lib/portal/api-types";
import { portalApi } from "@/app/_portal/lib/api";
import { bucharestToday } from "../../../_lib/today";
import { useNoAccess } from "../../../_lib/use-portal";
import { AlertLine } from "@/app/_portal/ui/AuthBits";
import { KeyValueCard } from "@/app/_portal/ui/KeyValueCard";
import { LoadError } from "@/app/_portal/ui/LoadError";
import { PageBody } from "@/app/_portal/ui/PageBody";
import { PageHeader } from "@/app/_portal/ui/PageHeader";
import { PortalCard } from "@/app/_portal/ui/PortalCard";
import { PortalLink } from "@/app/_portal/ui/PortalLink";
import { Sheet } from "@/app/_portal/ui/Sheet";
import { Spinner } from "@/app/_portal/ui/Spinner";
import { useToast } from "@/app/_portal/ui/Toast";
import { SheetFooter } from "../../../_ui/SheetFooter";
import { ScopeSheet, type Scope } from "./ScopeSheet";

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
  const today = bucharestToday();
  const [present, setPresent] = useState(lesson.present === true);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [asking, setAsking] = useState(false);
  const readOnly = lesson.archived || !lesson.editable || lesson.date > today;
  const series = lesson.series;
  const coaches = lesson.coachOptions.filter((c) => lesson.coachIds.includes(c.id)).map((c) => c.name).join(", ");

  async function save() {
    setBusy(true);
    setMessage(null);
    const r = await portalApi<LessonSaved>("PUT", `coach/lessons/${encodeURIComponent(lesson.lessonId)}`, { present, durationMin: lesson.durationMin, coachIds: lesson.coachIds });
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

  /** The delete, for the plain confirm and for the scope sheet. Null when it went through. */
  async function remove(scope: Scope | null): Promise<string | null> {
    const query = scope ? `?scope=${scope}` : "";
    const r = await portalApi<{ toast: string }>("DELETE", `coach/lessons/${encodeURIComponent(lesson.lessonId)}${query}`);
    if (r.ok) {
      toast.show(r.data.toast);
      router.replace("/");
      return null;
    }
    if (noAccess(r)) return null;
    return r.message;
  }

  const sub = [lesson.savedLine, lesson.archived ? PRESENCE.archived : null].filter((p): p is string => Boolean(p)).join(" ");
  return (
    <>
      <PageHeader back={{ href: "/", label: NAV.today }} kicker={LESSON.title} title={lesson.athleteName} sub={sub || undefined} />
      <PageBody narrow={520}>
        <div data-lesson-form className="flex flex-col gap-(--portal-form-gap)">
          <KeyValueCard
            rows={[
              { key: LESSON.date, value: capitalize(longDay(lesson.date)) },
              { key: LESSON.time, value: LESSON.when(lesson.startTime, lesson.durationMin) },
              { key: LESSON.coach, value: coaches },
              { key: LESSON.repeat, value: series ? LESSON.seriesText(capitalize(PROGRAM.freqWord[series.freq]), daysSpoken(series.days), series.untilSeasonEnd ? null : dayMonthLong(series.to)) : LESSON.no },
            ]}
          />
          <PortalCard>
            <div className="flex min-h-(--portal-kv-min-h) items-center justify-between gap-3 px-(--portal-card-pad) py-2">
              <span className="text-(length:--portal-text-15) font-bold">{LESSON.present}</span>
              <Checkbox label={<span className="sr-only">{`${LESSON.present}, ${lesson.athleteName}`}</span>} checked={present} disabled={readOnly} onChange={(e) => setPresent(e.target.checked)} />
            </div>
          </PortalCard>
          <AlertLine message={message} />
          {!lesson.archived && <Button onClick={() => void save()} disabled={busy || readOnly} className="w-full">{LESSON.savePresence}</Button>}
          {lesson.planEditable && <Button variant="secondary" href={`/lectie/${encodeURIComponent(lesson.lessonId)}/modifica`} className="w-full">{LESSON.edit}</Button>}
          {lesson.deletable && <PortalLink center onClick={() => setAsking(true)}>{LESSON.delete}</PortalLink>}
        </div>
      </PageBody>
      {asking && series && <ScopeSheet title={TRAINING.scopeDeleteTitle} confirm={LESSON.delete} onClose={() => setAsking(false)} onConfirm={remove} />}
      {asking && !series && <PlainDelete date={shortDate(lesson.date)} onClose={() => setAsking(false)} onConfirm={() => remove(null)} />}
    </>
  );
}

function PlainDelete({ date, onClose, onConfirm }: { date: string; onClose: () => void; onConfirm: () => Promise<string | null> }) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  async function go() {
    setBusy(true);
    const refusal = await onConfirm();
    if (refusal !== null) {
      setBusy(false);
      setMessage(refusal);
    }
  }
  return (
    <Sheet
      open
      onOpenChange={(o) => { if (!o && !busy) onClose(); }}
      title={LESSON.deleteConfirm(date)}
      footer={<SheetFooter message={message} busy={busy} confirm={LESSON.delete} onClose={onClose} onConfirm={() => void go()} />}
    >
      {null}
    </Sheet>
  );
}
