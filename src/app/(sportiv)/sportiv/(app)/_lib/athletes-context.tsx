"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import type { SportivAthleteRow, SportivAthletes } from "@/lib/portal/sportiv-types";
import { portalApi } from "@/app/_portal/lib/api";

type Loaded = { key: number; athletes: SportivAthleteRow[] | null };

type AthletesValue = {
  /** Every athlete the account holds, `inPicker: false` ones too (they stay reachable by URL). */
  athletes: SportivAthleteRow[];
  /** The ones the picker and the menus list. */
  picker: SportivAthleteRow[];
  /** The athlete of the URL's first segment; null on `/`, `/setari` and for an id the account does not list. */
  current: SportivAthleteRow | null;
  /** "loading" while a (re)load runs, so a screen never acts on a stale list. */
  state: "loading" | "ready" | "error";
  reload: () => void;
};

const AthletesContext = createContext<AthletesValue | null>(null);

const NOT_ATHLETE = new Set(["", "setari", "login", "invite", "forgot-password"]);

/** The athlete id a path belongs to: its first segment, except for the pages that have no athlete. Never read from a cookie. */
export function athleteIdOf(pathname: string): string | null {
  const first = pathname.split("/")[1] ?? "";
  return NOT_ATHLETE.has(first) ? null : first;
}

/** One `athletes` load per shell mount; `reload` asks again (after access was lost). */
export function AthletesProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [tick, setTick] = useState(0);
  const [loaded, setLoaded] = useState<Loaded | null>(null);

  useEffect(() => {
    let cancelled = false;
    void portalApi<SportivAthletes>("GET", "sportiv/athletes").then((r) => {
      if (!cancelled) setLoaded({ key: tick, athletes: r.ok ? r.data.athletes : null });
    });
    return () => {
      cancelled = true;
    };
  }, [tick]);

  const reload = useCallback(() => setTick((n) => n + 1), []);
  const value = useMemo<AthletesValue>(() => {
    const fresh = loaded !== null && loaded.key === tick;
    const athletes = loaded?.athletes ?? [];
    const id = athleteIdOf(pathname);
    return {
      athletes,
      picker: athletes.filter((a) => a.inPicker),
      current: athletes.find((a) => a.id === id) ?? null,
      state: !fresh ? "loading" : loaded.athletes === null ? "error" : "ready",
      reload,
    };
  }, [loaded, tick, pathname, reload]);
  return <AthletesContext.Provider value={value}>{children}</AthletesContext.Provider>;
}

export function useAthletes(): AthletesValue {
  const value = useContext(AthletesContext);
  if (!value) throw new Error("useAthletes outside AthletesProvider");
  return value;
}
