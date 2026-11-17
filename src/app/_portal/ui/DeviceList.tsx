"use client";

import { useCallback, useEffect, useState } from "react";
import Button from "@/components/ui/button";
import { SECURITY } from "@/lib/portal/copy";
import { relativeDay } from "@/lib/portal/format";
import { bucharestDay } from "@/lib/portal/sportiv-format";
import type { PortalDevice } from "@/lib/portal/sportiv-types";
import { portalApi } from "@/app/_portal/lib/api";
import { AlertLine } from "@/app/_portal/ui/AuthBits";
import { ListRow } from "@/app/_portal/ui/ListRow";
import { LoadError } from "@/app/_portal/ui/LoadError";
import { ListCard } from "@/app/_portal/ui/PortalCard";
import { Spinner } from "@/app/_portal/ui/Spinner";

/** The devices signed in to the account, each with "Deconectează". Signing out the current one goes to `/login`. */
export function DeviceList({ apiBase }: { apiBase: "coach/me" | "sportiv/me" }) {
  const [tick, setTick] = useState(0);
  const [devices, setDevices] = useState<PortalDevice[] | null | undefined>(undefined);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState<string | null>(null);
  const reload = useCallback(() => setTick((n) => n + 1), []);

  useEffect(() => {
    let cancelled = false;
    void portalApi<PortalDevice[]>("GET", `${apiBase}/devices`).then((r) => {
      if (!cancelled) setDevices(r.ok ? r.data : null);
    });
    return () => {
      cancelled = true;
    };
  }, [apiBase, tick]);

  async function revoke(id: string) {
    setBusy(true);
    setFailed(null);
    const r = await portalApi<{ revokedCurrent: boolean }>("DELETE", `${apiBase}/devices/${encodeURIComponent(id)}`);
    if (!r.ok) {
      setBusy(false);
      setFailed(r.message);
      reload();
      return;
    }
    if (r.data.revokedCurrent) {
      window.location.assign("/login");
      return;
    }
    setBusy(false);
    reload();
  }

  if (devices === undefined) return <div className="flex justify-center py-6"><Spinner /></div>;
  if (devices === null) return <LoadError onRetry={() => { setDevices(undefined); reload(); }} />;
  const today = bucharestDay(new Date());
  return (
    <>
      <ListCard>
        {devices.map((d) => {
          const name = d.label.trim() === "" ? SECURITY.unknown : d.label;
          return (
            <div key={d.id} role="group" aria-label={name}>
              <ListRow
                end={null}
                title={
                  <>
                    {name}
                    {d.current && (
                      <span className="ml-2 bg-ice-light px-(--portal-tag-pad-x) py-(--portal-tag-pad-y) text-(length:--portal-text-11) font-bold">{SECURITY.current}</span>
                    )}
                  </>
                }
                sub={`${SECURITY.lastSeen}: ${relativeDay(d.lastSeenAt, today)}`}
                extra={
                  <span className="mt-2 inline-flex">
                    <Button variant="secondary" onClick={() => void revoke(d.id)} disabled={busy}>{SECURITY.signOut}</Button>
                  </span>
                }
              />
            </div>
          );
        })}
      </ListCard>
      <AlertLine message={failed} />
    </>
  );
}
