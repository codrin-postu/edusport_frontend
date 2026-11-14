"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
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
};

const NoticesContext = createContext<NoticesValue | null>(null);

type Loaded = { key: number; data: SportivNotices | null };

/** One `me/notices` load per shell mount; `reload` asks again after a failed load. */
export function NoticesProvider({ children }: { children: React.ReactNode }) {
  const [tick, setTick] = useState(0);
  const [loaded, setLoaded] = useState<Loaded | null>(null);

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
  const dismiss = useCallback(async(id: string) => {
    const r = await portalApi<NoticeDismissed>("POST", `sportiv/me/notices/${id}/dismiss`);
    if (!r.ok) return false;
    setLoaded((prev) => (prev?.data ? { ...prev, data: { count: r.data.count, notices: prev.data.notices.filter((n) => n.id !== id) } } : prev));
    return true;
  }, []);

  const value = useMemo<NoticesValue>(() => {
    const fresh = loaded !== null && loaded.key === tick;
    const data = fresh ? loaded.data : null;
    return {
      state: !fresh ? "loading" : data === null ? "error" : "ready",
      notices: data?.notices ?? [],
      count: data?.count ?? 0,
      dismiss,
      reload,
    };
  }, [loaded, tick, dismiss, reload]);
  return <NoticesContext.Provider value={value}>{children}</NoticesContext.Provider>;
}

export function useNotices(): NoticesValue {
  const value = useContext(NoticesContext);
  if (!value) throw new Error("useNotices outside NoticesProvider");
  return value;
}
