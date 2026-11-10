"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TRAINING } from "@/lib/portal/copy";
import { dayMonth } from "@/lib/portal/format";
import { planBody, type TrainingValue } from "@/lib/portal/training-form";
import type { CoachLesson, CoachLessonCreated } from "@/lib/portal/api-types";
import { portalApi } from "@/app/_portal/lib/api";
import { useMe } from "../../../../_lib/me-context";
import { bucharestToday } from "../../../../_lib/today";
import { useNoAccess, usePortal } from "../../../../_lib/use-portal";
import { LoadError } from "@/app/_portal/ui/LoadError";
import { PageBody } from "@/app/_portal/ui/PageBody";
import { PageHeader } from "@/app/_portal/ui/PageHeader";
import { Spinner } from "@/app/_portal/ui/Spinner";
import { useToast } from "@/app/_portal/ui/Toast";
import { TrainingForm } from "../../../antrenament/TrainingForm";
import { ScopeSheet, type Scope } from "../ScopeSheet";

/** "Modifică lecția": the training form prefilled from the lesson. A repeating lesson asks which lessons first. */
export function EditLesson({ id }: { id: string }) {
  const me = useMe();
  const router = useRouter();
  const toast = useToast();
  const noAccess = useNoAccess();
  const lesson = usePortal<CoachLesson>(`coach/lessons/${encodeURIComponent(id)}`);
  const [asking, setAsking] = useState<TrainingValue | null>(null);
  const today = bucharestToday();
  const data = lesson.data;
  const locked = data !== null && !data.planEditable;

  // A lesson that is held, past or not yours cannot be edited: back to its page.
  useEffect(() => { if (locked) router.replace(`/lectie/${encodeURIComponent(id)}`); }, [locked, router, id]);

  if (lesson.state === "error") return <PageBody><LoadError onRetry={lesson.reload} /></PageBody>;
  if (data === null || !me || locked) return <PageBody><div className="flex justify-center py-6"><Spinner /></div></PageBody>;

  /** `scope` "one" on a lesson of a series sends no `repeat` (the backend refuses it). Null when it went through. */
  async function write(v: TrainingValue, scope: Scope): Promise<string | null> {
    const body = planBody(v, scope);
    if (scope === "one" && data?.series) body.repeat = null;
    const r = await portalApi<CoachLessonCreated>("PUT", `coach/lessons/${encodeURIComponent(id)}/plan`, body);
    if (noAccess(r)) return null;
    if (!r.ok) return r.message;
    toast.show(r.data.toast);
    router.replace(`/lectie/${encodeURIComponent(r.data.lessonId)}`);
    return null;
  }

  async function submit(v: TrainingValue): Promise<string | null | false> {
    if (data?.series) {
      setAsking(v);
      return false;
    }
    return write(v, "one");
  }

  return (
    <>
      <PageHeader back={{ href: `/lectie/${encodeURIComponent(id)}`, label: data.athleteName }} title={TRAINING.editTitle} />
      <PageBody narrow={560}>
        <TrainingForm mode={{ kind: "edit", lesson: data }} today={today} me={me} groups={[]} onSubmit={submit} />
      </PageBody>
      {asking && <ScopeSheet title={TRAINING.scopeTitle} oneSub={TRAINING.scopeOneSub(dayMonth(data.date))} followingSub={asking.repeat === "none" ? TRAINING.scopeFollowingEndsSub(dayMonth(data.date)) : TRAINING.scopeFollowingSub(dayMonth(data.date))} confirm={TRAINING.save} onClose={() => setAsking(null)} onConfirm={(scope) => write(asking, scope)} />}
    </>
  );
}
