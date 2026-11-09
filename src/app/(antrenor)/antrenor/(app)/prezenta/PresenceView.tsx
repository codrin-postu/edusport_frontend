"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/ui/button";
import { PRESENCE } from "@/lib/portal/copy";
import { dayTile } from "@/lib/portal/format";
import { presentCount, saveBody, sessionQuery } from "@/lib/portal/presence";
import type { CoachGroupPage, CoachSession, SessionSaved } from "@/lib/portal/api-types";
import { portalApi, type ApiResult } from "../../_lib/api";
import { useMe } from "../../_lib/me-context";
import { useNoAccess } from "../../_lib/use-portal";
import { LoadError } from "@/app/_portal/ui/LoadError";
import { Spinner } from "@/app/_portal/ui/Spinner";
import { useToast } from "@/app/_portal/ui/Toast";
import { CoachPicker } from "./CoachPicker";
import { DaySheet } from "./DaySheet";
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
  if (query === null) return <LoadError />;
  if (loaded === null || loaded.key !== key) return <div className="py-6 flex justify-center"><Spinner /></div>;
  if (loaded.session === null) return <LoadError />;
  return <PresenceBody key={key} session={loaded.session} query={query} reload={reload} />;
}

function initialTicks(s: CoachSession): TickMap {
  return new Map(s.rows.map((r) => [r.athleteId, { grup: r.grup, uscat: r.uscat }]));
}

function PresenceBody({ session, query, reload }: { session: CoachSession; query: string; reload: () => void }) {
  const router = useRouter();
  const toast = useToast();
  const noAccess = useNoAccess();
  const me = useMe();
  const [ticks, setTicks] = useState<TickMap>(() => initialTicks(session));
  const [coachIds, setCoachIds] = useState<string[]>(session.coachIds);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [dayOpen, setDayOpen] = useState(false);
  const [allowed, setAllowed] = useState<string[] | null>(null);
  const [queue, setQueue] = useState<Inactive[]>([]);
  const [answers, setAnswers] = useState<{ reactivate: string[]; keep: string[] }>({ reactivate: [], keep: [] });
  const readOnly = session.archived || !session.editable;
  const count = presentCount([...ticks.values()]);
  const meId = me?.coachId ?? "";

  // Stand-in: only the group's own recent slots may be picked.
  useEffect(() => {
    if (!session.standIn) return;
    let cancelled = false;
    void portalApi<CoachGroupPage>("GET", `coach/groups/${encodeURIComponent(session.groupId)}`).then((r) => {
      if (!cancelled && r.ok) setAllowed(r.data.standIn.map((s) => s.date));
    });
    return () => {
      cancelled = true;
    };
  }, [session.standIn, session.groupId]);

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
      const next = new URLSearchParams({ id: r.data.sessionId }).toString();
      if (next === query) {
        setBusy(false);
        reload();
      } else router.replace(`/prezenta?${next}`); // busy stays true until the route changes
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

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-title text-primary">{session.groupName}</h1>
          <button
            type="button"
            onClick={() => setDayOpen(true)}
            className="text-label text-primary border-retro border-line px-3 h-10 shrink-0 outline-none focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-primary"
          >
            {dayTile(session.date)}
          </button>
        </div>
        {session.savedLine && <p className="text-body-sm text-secondary mt-2">{session.savedLine}</p>}
        {session.outsideSchedule && <p className="text-body-sm text-secondary mt-2">{PRESENCE.outside}</p>}
        {session.archived && <p className="text-body-sm text-secondary mt-2">{PRESENCE.archived}</p>}
      </div>
      <CoachPicker me={meId} options={session.coachOptions} value={coachIds} onChange={setCoachIds} locked={readOnly} />
      {session.standIn && <p className="text-body-sm text-secondary">{PRESENCE.willAppear}</p>}
      <PresenceTable rows={session.rows} kind={session.kind} ticks={ticks} disabled={readOnly} onChange={setTick} />
      <p role="alert" className="text-body-sm text-accent min-h-6">{message}</p>
      {!readOnly && (
        <div className="flex items-center justify-between gap-4">
          <p className="text-body text-primary">{PRESENCE.presentCount(count)}</p>
          <Button onClick={() => void save([], [])} disabled={busy}>{PRESENCE.save}</Button>
        </div>
      )}
      <DaySheet key={session.date} open={dayOpen} onOpenChange={setDayOpen} session={session} allowed={session.standIn ? allowed ?? [] : null} />
      <ReactivateDialog athlete={queue[0] ?? null} onKeep={() => answer(false)} onReactivate={() => answer(true)} />
    </div>
  );
}
