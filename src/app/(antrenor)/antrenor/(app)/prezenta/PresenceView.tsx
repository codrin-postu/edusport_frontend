"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/ui/button";
import { CALENDAR, NAV, PRESENCE } from "@/lib/portal/copy";
import { shortWhen } from "@/lib/portal/format";
import { fromOf, presentCount, saveBody, sessionQuery, withFrom } from "@/lib/portal/presence";
import type { CoachGroupPage, CoachSession, SessionSaved } from "@/lib/portal/api-types";
import { setSavedFlag } from "@/app/_portal/lib/saved-flag";
import { portalApi, type ApiResult } from "@/app/_portal/lib/api";
import { useMe } from "../../_lib/me-context";
import { useNoAccess } from "../../_lib/use-portal";
import { GroupInfoCard } from "../../_ui/GroupInfoCard";
import { AlertLine } from "@/app/_portal/ui/AuthBits";
import { LoadError } from "@/app/_portal/ui/LoadError";
import { Column, Columns, PageBody } from "@/app/_portal/ui/PageBody";
import { PageHeader, PageSub } from "@/app/_portal/ui/PageHeader";
import { SaveBar } from "@/app/_portal/ui/SaveBar";
import { Spinner } from "@/app/_portal/ui/Spinner";
import { useToast } from "@/app/_portal/ui/Toast";
import { CoachPicker } from "./CoachPicker";
import { PresenceTable, type TickMap } from "./PresenceTable";
import { ReactivateDialog } from "./ReactivateDialog";

type Inactive = { id: string; name: string };
type Loaded = { key: string; session: CoachSession | null };

function inactiveOf(r: ApiResult<unknown>): Inactive[] {
  if (r.ok || r.status !== 409) return [];
  const list = (r.body as { error?: { details?: { inactive?: unknown } } } | null)?.error?.details?.inactive;
  if (!Array.isArray(list)) return [];
  return list.filter((x): x is Inactive => typeof (x as Inactive)?.id === "string" && typeof (x as Inactive)?.name === "string");
}

export function PresenceView() {
  const params = useSearchParams();
  const query = sessionQuery(params);
  const [tick, setTick] = useState(0);
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const noAccess = useNoAccess();
  const key = query === null ? null : `${tick}:${query}`;

  useEffect(() => {
    if (query === null || key === null) return;
    let cancelled = false;
    void portalApi<CoachSession>("GET", `coach/session?${query}`).then((r) => {
      if (cancelled || noAccess(r)) return;
      setLoaded({ key, session: r.ok ? r.data : null });
    });
    return () => {
      cancelled = true;
    };
  }, [query, key, noAccess]);

  const reload = useCallback(() => setTick((n) => n + 1), []);
  if (query === null) return <PageBody><LoadError onRetry={reload} /></PageBody>;
  if (loaded === null || loaded.key !== key) return <PageBody><div className="flex justify-center py-6"><Spinner /></div></PageBody>;
  if (loaded.session === null) return <PageBody><LoadError onRetry={reload} /></PageBody>;
  return <PresenceBody key={key} session={loaded.session} query={query} reload={reload} />;
}

function initialTicks(s: CoachSession): TickMap {
  return new Map(s.rows.map((r) => [r.athleteId, { grup: r.grup, uscat: r.uscat }]));
}

function PresenceBody({ session, query, reload }: { session: CoachSession; query: string; reload: () => void }) {
  const router = useRouter();
  const from = fromOf(useSearchParams());
  const toast = useToast();
  const noAccess = useNoAccess();
  const me = useMe();
  const [ticks, setTicks] = useState<TickMap>(() => initialTicks(session));
  const [coachIds, setCoachIds] = useState<string[]>(session.coachIds);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [group, setGroup] = useState<CoachGroupPage | null>(null);
  const [queue, setQueue] = useState<Inactive[]>([]);
  const [answers, setAnswers] = useState<{ reactivate: string[]; keep: string[] }>({ reactivate: [], keep: [] });
  const readOnly = session.archived || !session.editable;
  const count = presentCount([...ticks.values()]);
  const meId = me?.coachId ?? "";

  // The group page gives the location and info card.
  useEffect(() => {
    let cancelled = false;
    void portalApi<CoachGroupPage>("GET", `coach/groups/${encodeURIComponent(session.groupId)}`).then((r) => {
      if (!cancelled && r.ok) setGroup(r.data);
    });
    return () => {
      cancelled = true;
    };
  }, [session.groupId]);

  const setTick = (athleteId: string, k: "grup" | "uscat", value: boolean) =>
    setTicks((prev) => new Map(prev).set(athleteId, { ...(prev.get(athleteId) ?? { grup: false, uscat: false }), [k]: value }));

  async function save(reactivate: string[], keep: string[]) {
    if (busy) return;
    setBusy(true);
    setMessage(null);
    const ids = meId && !coachIds.includes(meId) ? [meId, ...coachIds] : coachIds;
    const r = await portalApi<SessionSaved>("PUT", "coach/session", saveBody(session, ticks, ids, reactivate, keep));
    if (r.ok) {
      toast.show(r.data.toast);
      setSavedFlag(r.data.sessionId);
      const next = new URLSearchParams({ id: r.data.sessionId }).toString();
      if (next === query) {
        setBusy(false);
        reload();
      } else router.replace(withFrom(`/prezenta?${next}`, from)); // busy stays true until the route changes
      return;
    }
    setBusy(false);
    const inactive = inactiveOf(r);
    if (inactive.length > 0) {
      setAnswers({ reactivate: [], keep: [] });
      setQueue(inactive);
      return;
    }
    if (noAccess(r)) return;
    if (r.status === 403 && r.message === PRESENCE.archived) {
      reload();
      return;
    }
    setMessage(r.message);
  }

  function answer(reactivate: boolean) {
    const current = queue[0];
    if (!current) return;
    const next = {
      reactivate: reactivate ? [...answers.reactivate, current.id] : answers.reactivate,
      keep: reactivate ? answers.keep : [...answers.keep, current.id],
    };
    setAnswers(next);
    setQueue(queue.slice(1));
    if (queue.length === 1) void save(next.reactivate, next.keep);
  }

  const back =
    from === "istoric" ? { href: "/istoric", label: NAV.history }
    : from === "calendar" ? { href: "/calendar", label: CALENDAR.title }
    : from === "grupa" ? { href: `/grupe/${encodeURIComponent(session.groupId)}`, label: session.groupName }
    : { href: "/", label: NAV.today };
  const sub = [shortWhen(session.date), session.startTime, group?.location].filter((p): p is string => Boolean(p)).join(", ");
  return (
    <>
      <PageHeader
        back={back}
        title={session.groupName}
        sub={sub}
      />
      <PageBody>
        <PageSub>{sub}</PageSub>
        {(session.savedLine || session.outsideSchedule || session.archived) && (
          <div className="flex flex-col gap-1 text-(length:--portal-text-14) text-muted">
            {session.savedLine && <p>{session.savedLine}</p>}
            {session.outsideSchedule && <p>{PRESENCE.outside}</p>}
            {session.archived && <p>{PRESENCE.archived}</p>}
          </div>
        )}
        <Columns>
          <Column grow={1}>
            <div className="portal:border-card portal:border-card-line portal:bg-surface-raised portal:p-(--portal-card-pad) portal:shadow-retro">
              <CoachPicker me={meId} options={session.coachOptions} value={coachIds} onChange={setCoachIds} locked={readOnly} />
            </div>
            {session.standIn && <p className="text-(length:--portal-text-14) text-muted">{PRESENCE.willAppear}</p>}
            {group && <div className="hidden portal:block"><GroupInfoCard program={group.program} location={group.location} coaches={group.coaches} /></div>}
          </Column>
          <Column grow={2}>
            <PresenceTable rows={session.rows} kind={session.kind} groupId={session.groupId} ticks={ticks} disabled={readOnly} onChange={setTick} />
            <AlertLine message={message} />
            {!readOnly && (
              <>
                <div className="h-(--portal-savebar-safe) portal:hidden" aria-hidden />
                <div className="fixed inset-x-0 bottom-0 z-sticky portal:static portal:border-card portal:border-card-line portal:shadow-retro">
                  <SaveBar count={PRESENCE.presentCount(count)} action={<Button onClick={() => void save([], [])} disabled={busy}>{PRESENCE.save}</Button>} />
                </div>
              </>
            )}
          </Column>
        </Columns>
      </PageBody>
      <ReactivateDialog athlete={queue[0] ?? null} onKeep={() => answer(false)} onReactivate={() => answer(true)} />
    </>
  );
}
