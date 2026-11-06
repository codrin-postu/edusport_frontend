"use client";

import { useState } from "react";
import Button from "@/components/ui/button";
import { PROFILE, SECURITY } from "@/lib/portal/copy";
import { relativeDay } from "@/lib/portal/format";
import type { CoachDevice } from "@/lib/portal/api-types";
import { portalApi } from "../../../_lib/api";
import { bucharestToday } from "../../../_lib/today";
import { usePortal } from "../../../_lib/use-portal";
import { BackHeader } from "../../../_ui/BackHeader";
import { ListCard } from "../../../_ui/ListCard";
import { LoadError } from "../../../_ui/LoadError";
import { SquareLabel } from "../../../_ui/SquareLabel";
import { Spinner } from "../../../_ui/Spinner";

export function SecurityView() {
  const devices = usePortal<CoachDevice[]>("coach/me/devices");
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState<string | null>(null);

  async function revoke(id: string) {
    setBusy(true);
    setFailed(null);
    const r = await portalApi<{ revokedCurrent: boolean }>("DELETE", `coach/me/devices/${encodeURIComponent(id)}`);
    if (!r.ok) {
      setBusy(false);
      setFailed(r.message);
      return;
    }
    if (r.data.revokedCurrent) {
      window.location.assign("/intrare");
      return;
    }
    setBusy(false);
    devices.reload();
  }

  const today = bucharestToday();
  return (
    <div>
      <BackHeader href="/profil" title={PROFILE.security} />
      {devices.state === "loading" && <div className="py-6 flex justify-center"><Spinner /></div>}
      {devices.state === "error" && <LoadError />}
      {devices.state === "ready" && devices.data && (
        <>
          <div className="flex justify-between text-label text-secondary mb-2">
            <span>{SECURITY.device}</span>
            <span>{SECURITY.lastSeen}</span>
          </div>
          <ListCard>
            {devices.data.map((d) => (
              <div key={d.id} role="group" aria-label={d.label} className="p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between gap-4">
                  <span className="min-w-0 flex-1 flex flex-wrap items-center gap-2">
                    <span className="text-body font-semibold text-primary">{d.label.trim() === "" ? SECURITY.unknown : d.label}</span>
                    {d.current && <SquareLabel>{SECURITY.current}</SquareLabel>}
                  </span>
                  <span className="text-body-sm text-secondary shrink-0">{relativeDay(d.lastSeenAt, today)}</span>
                </div>
                <div>
                  <Button variant="secondary" onClick={() => void revoke(d.id)} disabled={busy}>{SECURITY.signOut}</Button>
                </div>
              </div>
            ))}
          </ListCard>
          <p role="alert" className="text-body-sm text-accent mt-4 empty:hidden">{failed}</p>
        </>
      )}
    </div>
  );
}
