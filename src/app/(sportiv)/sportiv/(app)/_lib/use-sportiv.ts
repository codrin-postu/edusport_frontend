"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LOST_ATHLETE } from "@/lib/portal/copy-sportiv";
import { portalApi } from "@/app/_portal/lib/api";
import { useToast } from "@/app/_portal/ui/Toast";
import { useAthletes } from "./athletes-context";

type Loaded<T> = { key: string; data: T | null; status: number };

/**
 * GET of a sportiv BFF path (relative to `sportiv/`). The athlete id is part of the path, which comes from the URL.
 * An access that ended for this athlete ("lost-athlete", the 403 ClubAdminError) reloads the athletes, goes to `/` and
 * shows the toast; a cut account is a 401 from the BFF (cookies cleared), which the kit sends to `/login`.
 */
export function useSportiv<T>(path: string): { state: "loading" | "ready" | "error"; data: T | null; status: number; reload: () => void } {
  const router = useRouter();
  const toast = useToast();
  const { reload: reloadAthletes } = useAthletes();
  const [tick, setTick] = useState(0);
  const [loaded, setLoaded] = useState<Loaded<T> | null>(null);
  const key = `${tick}:${path}`;

  useEffect(() => {
    let cancelled = false;
    void portalApi<T>("GET", `sportiv/${path}`).then((r) => {
      if (cancelled) return;
      if (!r.ok && r.status === 403 && r.message === LOST_ATHLETE) {
        reloadAthletes();
        toast.show(LOST_ATHLETE);
        router.replace("/");
        return;
      }
      setLoaded({ key, data: r.ok ? r.data : null, status: r.ok ? 200 : r.status });
    });
    return () => {
      cancelled = true;
    };
  }, [path, key, reloadAthletes, toast, router]);

  const reload = useCallback(() => setTick((n) => n + 1), []);
  if (loaded === null || loaded.key !== key) return { state: "loading", data: null, status: 0, reload };
  return { state: loaded.data === null ? "error" : "ready", data: loaded.data, status: loaded.status, reload };
}
