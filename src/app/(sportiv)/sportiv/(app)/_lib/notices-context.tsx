"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { NoticeDismissed, SportivNotice, SportivNotices } from "@/lib/portal/sportiv-types";
import { portalApi } from "@/app/_portal/lib/api";

type NoticesValue = {
  state: "loading" | "ready" | "error";
  notices: SportivNotice[];
  /** The account's open notices; 0 while loading or after a failed load. */
  count: number;
  /** Closes one for the account. true when the server accepted it (the card is gone and `count` is the server's); false keeps everything as it was. */
  dismiss: (id: string) => Promise<boolean>;
  reload: () => void;
  /** The panel or sheet opened: reads the list with `seen=1` (the server records the view) and takes its answer as the fresh list and count. */
  markSeen: () => void;
};

const NoticesContext = createContext<NoticesValue | null>(null);

type Loaded = { key: number; data: SportivNotices | null };

/** One `me/notices` load per shell mount; `reload` asks again after a failed load. */
export function NoticesProvider({ children }: { children: React.ReactNode }) {
  const [tick, setTick] = useState(0);
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const tickRef = useRef(0);
  tickRef.current = tick;

  useEffect(() => {
    let cancelled = false;
    void portalApi<SportivNotices>("GET", "sportiv/me/notices").then((r) => {
      if (!cancelled) setLoaded({ key: tick, data: r.ok ? r.data : null });
    });
    return () => {
      cancelled = true;
    };
  }, [tick]);

  const reload = useCallback(() => setTick((n) => n + 1), []);
  // A background read: a failure keeps what is shown.
  const refresh = useCallback(async(path: string) => {
    const r = await portalApi<SportivNotices>("GET", path);
    if (r.ok) setLoaded({ key: tickRef.current, data: r.data });
  }, []);
  const markSeen = useCallback(() => void refresh("sportiv/me/notices?seen=1"), [refresh]);
  const dismiss = useCallback(async(id: string) => {
    const r = await portalApi<NoticeDismissed>("POST", `sportiv/me/notices/${id}/dismiss`);
    // 404: the notice is no longer the account's (stopped, ended, passed). It is gone: drop the card and take the server's list.
    if (!r.ok && r.status === 404) {
      setLoaded((prev) => (prev?.data ? { ...prev, data: { count: Math.max(0, prev.data.count - 1), notices: prev.data.notices.filter((n) => n.id !== id) } } : prev));
      void refresh("sportiv/me/notices");
      return true;
    }
    if (!r.ok) return false;
    setLoaded((prev) => (prev?.data ? { ...prev, data: { count: r.data.count, notices: prev.data.notices.filter((n) => n.id !== id) } } : prev));
    return true;
  }, [refresh]);

  const value = useMemo<NoticesValue>(() => {
    const fresh = loaded !== null && loaded.key === tick;
    const data = fresh ? loaded.data : null;
    return {
      state: !fresh ? "loading" : data === null ? "error" : "ready",
      notices: data?.notices ?? [],
      count: data?.count ?? 0,
      dismiss,
      reload,
      markSeen,
    };
  }, [loaded, tick, dismiss, reload, markSeen]);
  return <NoticesContext.Provider value={value}>{children}</NoticesContext.Provider>;
}

export function useNotices(): NoticesValue {
  const value = useContext(NoticesContext);
  if (!value) throw new Error("useNotices outside NoticesProvider");
  return value;
}
