"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { NAV, PROGRAM, TRAINING } from "@/lib/portal/copy";
import { dayMonth } from "@/lib/portal/format";
import { groupBody, lessonBody, type TrainingValue } from "@/lib/portal/training-form";
import type { CoachGroups, CoachLessonCreated, SessionCheck } from "@/lib/portal/api-types";
import { portalApi } from "@/app/_portal/lib/api";
import { useMe } from "../../../_lib/me-context";
import { bucharestToday } from "../../../_lib/today";
import { useNoAccess, usePortal } from "../../../_lib/use-portal";
import { LoadError } from "@/app/_portal/ui/LoadError";
import { PageBody } from "@/app/_portal/ui/PageBody";
import { PageHeader } from "@/app/_portal/ui/PageHeader";
import { Spinner } from "@/app/_portal/ui/Spinner";
import { useToast } from "@/app/_portal/ui/Toast";
import { TrainingForm } from "../TrainingForm";

const programHref = (groupId: string): string => `/grupe/${encodeURIComponent(groupId)}?tab=program`;

/** "Antrenament nou": group or individual, once or repeating. `?grupa=<id>` presets the group, `?tip=individual` the tab. */
export function NewTraining() {
  const me = useMe();
  const router = useRouter();
  const toast = useToast();
  const noAccess = useNoAccess();
  const params = useSearchParams();
  const groups = usePortal<CoachGroups>("coach/groups");
  const today = bucharestToday();
  const loading = <PageBody><div className="flex justify-center py-6"><Spinner /></div></PageBody>;
  if (groups.state === "error") return <PageBody><LoadError onRetry={groups.reload} /></PageBody>;
  if (groups.state === "loading" || !me || !groups.data) return loading;

  const club = groups.data.mine.filter((g) => g.kind === "club");
  const preset = club.find((g) => g.groupId === params.get("grupa")) ?? null;
  const back = preset ? { href: programHref(preset.groupId), label: preset.name } : { href: "/", label: NAV.today };

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
    <>
      <PageHeader back={back} title={TRAINING.title} />
      <PageBody narrow={560}>
        <TrainingForm
          mode={preset ? { kind: "preset", groupId: preset.groupId } : { kind: "new" }}
          today={today}
          me={me}
          groups={club}
          startKind={params.get("tip") === "individual" ? "individual" : undefined}
          onSubmit={submit}
        />
      </PageBody>
    </>
  );
}
