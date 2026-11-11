"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TRAINING } from "@/lib/portal/copy";
import { dayMonth } from "@/lib/portal/format";
import { planBody, type TrainingValue } from "@/lib/portal/training-form";
import type { CoachLesson, CoachLessonCreated } from "@/lib/portal/api-types";
import { portalApi } from "@/app/_portal/lib/api";
import { useMe } from "../../../_lib/me-context";
import { bucharestToday } from "../../../_lib/today";
import { useNoAccess } from "../../../_lib/use-portal";
import { useToast } from "@/app/_portal/ui/Toast";
import { TrainingForm } from "../../antrenament/TrainingForm";
import { ScopeSheet, type Scope } from "./ScopeSheet";

/** "Modifică lecția" as a popup over the lesson page: the training form prefilled from the lesson. A repeating lesson asks which lessons first. */
export function EditLessonPopup({ lesson, onClose, onSaved }: { lesson: CoachLesson; onClose: () => void; onSaved: () => void }) {
  const me = useMe();
  const router = useRouter();
  const toast = useToast();
  const noAccess = useNoAccess();
  const [asking, setAsking] = useState<TrainingValue | null>(null);
  const today = bucharestToday();
  if (!me) return null;

  /** `scope` "one" on a lesson of a series sends no `repeat` (the backend refuses it). Null when it went through. */
  async function write(v: TrainingValue, scope: Scope): Promise<string | null> {
    const body = planBody(v, scope);
    if (scope === "one" && lesson.series) body.repeat = null;
    const r = await portalApi<CoachLessonCreated>("PUT", `coach/lessons/${encodeURIComponent(lesson.lessonId)}/plan`, body);
    if (noAccess(r)) return null;
    if (!r.ok) return r.message;
    toast.show(r.data.toast);
    onSaved();
    router.replace(`/lectie/${encodeURIComponent(r.data.lessonId)}`);
    return null;
  }

  async function submit(v: TrainingValue): Promise<string | null | false> {
    if (lesson.series) {
      setAsking(v);
      return false;
    }
    return write(v, "one");
  }

  return (
    <>
      <TrainingForm mode={{ kind: "edit", lesson }} title={TRAINING.editTitle} onClose={onClose} today={today} me={me} groups={[]} onSubmit={submit} />
      {asking && (
        <ScopeSheet
          title={TRAINING.scopeTitle}
          oneSub={TRAINING.scopeOneSub(dayMonth(lesson.date))}
          followingSub={asking.repeat === "none" ? TRAINING.scopeFollowingEndsSub(dayMonth(lesson.date)) : TRAINING.scopeFollowingSub(dayMonth(lesson.date))}
          confirm={TRAINING.save}
          onClose={() => setAsking(null)}
          onConfirm={(scope) => write(asking, scope)}
        />
      )}
    </>
  );
}
