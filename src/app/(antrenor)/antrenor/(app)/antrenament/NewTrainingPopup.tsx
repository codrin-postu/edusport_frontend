"use client";

import { useRouter } from "next/navigation";
import { PROGRAM, TRAINING } from "@/lib/portal/copy";
import { dayMonth } from "@/lib/portal/format";
import { groupBody, lessonBody, type TrainingValue } from "@/lib/portal/training-form";
import type { CoachGroups, CoachLessonCreated, SessionCheck } from "@/lib/portal/api-types";
import { portalApi } from "@/app/_portal/lib/api";
import { useMe } from "../../_lib/me-context";
import { bucharestToday } from "../../_lib/today";
import { useNoAccess, usePortal } from "../../_lib/use-portal";
import { Sheet } from "@/app/_portal/ui/Sheet";
import { LoadError } from "@/app/_portal/ui/LoadError";
import { useToast } from "@/app/_portal/ui/Toast";
import { TrainingForm } from "./TrainingForm";

const programHref = (groupId: string): string => `/grupe/${encodeURIComponent(groupId)}?tab=program`;

/** "Antrenament nou" as a popup over its opener: group or individual, once or repeating. `group` presets the group (from "+ Adaugă program"), `individual` the tab. */
export function NewTrainingPopup({ group, individual, onClose, onDone }: { group: string | null; individual: boolean; onClose: () => void; onDone?: () => void }) {
  const me = useMe();
  const router = useRouter();
  const toast = useToast();
  const noAccess = useNoAccess();
  const groups = usePortal<CoachGroups>("coach/groups");
  const today = bucharestToday();
  if (groups.state === "error") return <Sheet open onOpenChange={(o) => { if (!o) onClose(); }} title={TRAINING.title} popup={{ closeLabel: TRAINING.close }}><LoadError onRetry={groups.reload} /></Sheet>;
  if (groups.state === "loading" || !me || !groups.data) return null;

  const club = groups.data.mine.filter((g) => g.kind === "club" || g.groupId === group);
  const preset = club.find((g) => g.groupId === group) ?? null;

  async function submit(v: TrainingValue): Promise<string | null> {
    if (v.kind === "individual") {
      const body = lessonBody(v);
      const coachIds = body.coachIds.includes(me!.coachId) ? body.coachIds : [me!.coachId, ...body.coachIds];
      const r = await portalApi<CoachLessonCreated>("POST", "coach/lessons", { ...body, coachIds });
      if (!r.ok) return r.message;
      toast.show(r.data.toast);
      router.replace(`/lectie/${encodeURIComponent(r.data.lessonId)}`);
      return null;
    }
    const groupId = v.groupId ?? "";
    const r = await portalApi<{ eventId: string; date: string | null }>("POST", `coach/groups/${encodeURIComponent(groupId)}/program`, groupBody(v));
    if (noAccess(r)) return null;
    if (!r.ok) return r.message;
    onDone?.();
    toast.show(r.data.date ? PROGRAM.toasts.classAdded(dayMonth(r.data.date)) : PROGRAM.toasts.programAdded);
    // A one-off class already held (today or the last 7 days): go straight to its Prezență (decided by Claude, user ruling 2026-11-10).
    if (v.repeat === "none" && v.date <= today) {
      const c = await portalApi<SessionCheck>("POST", "coach/session/check", { groupId, date: v.date, startTime: v.startTime });
      if (c.ok && c.data.kind === "occurrence") return go(`/prezenta?${new URLSearchParams({ occurrence: c.data.occurrenceKey }).toString()}`);
      if (c.ok && c.data.kind === "free") return go(`/prezenta?${new URLSearchParams({ group: groupId, date: v.date, time: v.startTime, duration: String(v.durationMin) }).toString()}`);
    }
    return go(programHref(groupId));
  }
  function go(href: string): null {
    router.replace(href);
    return null;
  }

  return (
    <TrainingForm
      mode={preset ? { kind: "preset", groupId: preset.groupId } : { kind: "new" }}
      title={TRAINING.title}
      onClose={onClose}
      today={today}
      me={me}
      groups={club}
      startKind={individual ? "individual" : undefined}
      onSubmit={submit}
    />
  );
}
