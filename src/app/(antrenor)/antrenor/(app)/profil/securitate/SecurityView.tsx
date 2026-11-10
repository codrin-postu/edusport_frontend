"use client";

import { useState } from "react";
import Button from "@/components/ui/button";
import { NAV, PROFILE, SECURITY } from "@/lib/portal/copy";
import { relativeDay } from "@/lib/portal/format";
import type { CoachDevice } from "@/lib/portal/api-types";
import { portalApi } from "@/app/_portal/lib/api";
import { AlertLine } from "@/app/_portal/ui/AuthBits";
import { ListRow } from "@/app/_portal/ui/ListRow";
import { LoadError } from "@/app/_portal/ui/LoadError";
import { PageBody } from "@/app/_portal/ui/PageBody";
import { PageHeader } from "@/app/_portal/ui/PageHeader";
import { ListCard } from "@/app/_portal/ui/PortalCard";
import { Spinner } from "@/app/_portal/ui/Spinner";
import { bucharestToday } from "../../../_lib/today";
import { usePortal } from "../../../_lib/use-portal";

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
      devices.reload();
      return;
    }
    if (r.data.revokedCurrent) {
      window.location.assign("/login");
      return;
    }
    setBusy(false);
    devices.reload();
  }

  const today = bucharestToday();
  return (
    <>
      <PageHeader back={{ href: "/profil", label: NAV.profile }} title={PROFILE.security} />
      <PageBody narrow={640}>
        {devices.state === "loading" && <div className="flex justify-center py-6"><Spinner /></div>}
        {devices.state === "error" && <LoadError onRetry={devices.reload} />}
        {devices.state === "ready" && devices.data && (
          <>
            <ListCard>
              {devices.data.map((d) => {
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
        )}
      </PageBody>
    </>
  );
}
