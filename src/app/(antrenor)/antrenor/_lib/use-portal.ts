"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { STATES } from "@/lib/portal/copy";
import { useToast } from "@/app/_portal/ui/Toast";
import { portalApi, type ApiResult } from "@/app/_portal/lib/api";

type Loaded<T> = { key: string; ok: boolean; data: T | null };

/** GET of a BFF path. A null path is idle (stays "loading", no request). `previous` is the last good answer, kept while a reload runs so a screen can stay on it. */
export function usePortal<T>(path: string | null): { state: "loading" | "error" | "ready"; data: T | null; previous: T | null; reload: () => void } {
  const [tick, setTick] = useState(0);
  const [loaded, setLoaded] = useState<Loaded<T> | null>(null);
  const key = path === null ? null : `${tick}:${path}`;

  useEffect(() => {
    if (path === null || key === null) return;
    let cancelled = false;
    void portalApi<T>("GET", path).then((r) => {
      if (!cancelled) setLoaded({ key, ok: r.ok, data: r.ok ? r.data : null });
    });
    return () => {
      cancelled = true;
    };
  }, [path, key]);

  const reload = useCallback(() => setTick((n) => n + 1), []);
  const previous = loaded?.data ?? null;
  if (key === null || loaded === null || loaded.key !== key) return { state: "loading", data: null, previous, reload };
  return { state: loaded.ok ? "ready" : "error", data: loaded.data, previous, reload };
}

/** True (after a toast and a move to Grupe) when the answer says the coach lost access to the group. */
export function useNoAccess(): (r: ApiResult<unknown>) => boolean {
  const router = useRouter();
  const toast = useToast();
  return useCallback((r) => {
    if (r.ok || r.status !== 403 || r.message !== STATES.noAccess) return false;
    toast.show(r.message);
    router.replace("/grupe");
    return true;
  }, [router, toast]);
}
