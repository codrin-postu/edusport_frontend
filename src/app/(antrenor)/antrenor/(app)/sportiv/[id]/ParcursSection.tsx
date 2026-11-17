"use client";

import { useState } from "react";
import Button from "@/components/ui/button";
import { PATH } from "@/lib/portal/copy-sportiv";
import { STATES } from "@/lib/portal/copy-shared";
import type { ParcursStaff } from "@/lib/portal/parcurs";
import { AwardDialog } from "@/components/portal/parcurs/AwardDialog";
import { ParcursView } from "@/components/portal/parcurs/ParcursView";
import { portalApi } from "@/app/_portal/lib/api";
import { CollapseHeader } from "@/app/_portal/ui/CollapseHeader";
import { LoadError } from "@/app/_portal/ui/LoadError";
import { PortalCard } from "@/app/_portal/ui/PortalCard";
import { SectionHeading } from "@/app/_portal/ui/SectionHeading";
import { Spinner } from "@/app/_portal/ui/Spinner";
import { usePortal } from "../../../_lib/use-portal";

const REMOVABLE = ["award"] as const;

function Body({ athletePath }: { athletePath: string }) {
  const parcurs = usePortal<ParcursStaff>(`${athletePath}/parcurs`);
  const [fresh, setFresh] = useState<ParcursStaff | null>(null);
  const [awarding, setAwarding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  if (parcurs.state === "loading") return <div className="flex justify-center py-6"><Spinner /></div>;
  const data = fresh ?? parcurs.data;
  if (data === null) return <LoadError onRetry={parcurs.reload} />;

  const remove = async(_kind: "award" | "pin", id: string) => {
    setError(null);
    const r = await portalApi<ParcursStaff>("DELETE", `${athletePath}/awards/${encodeURIComponent(id)}`);
    if (r.ok) setFresh(r.data);
    else setError(STATES.loadFailed);
  };

  return (
    <div className="flex flex-col gap-4 p-(--portal-card-pad)">
      <div className="flex justify-end"><Button onClick={() => setAwarding(true)}>{PATH.award.button}</Button></div>
      {error && <p role="alert" className="text-(length:--portal-text-14) text-alert-ink">{error}</p>}
      <ParcursView data={data} removable={REMOVABLE} onRemove={(k, id) => void remove(k, id)} />
      <AwardDialog athletePath={athletePath} open={awarding} onOpenChange={setAwarding} onAwarded={(f) => { setFresh(f); setAwarding(false); }} />
    </div>
  );
}

/** The athlete's Parcurs on the coach card: collapsed, fetched on the first open, with the award dialog and the remove buttons of awards. */
export function ParcursSection({ athleteId }: { athleteId: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col gap-3">
      <PortalCard>
        <CollapseHeader open={open} onToggle={() => setOpen((o) => !o)}>
          <span className="flex min-w-0 flex-1 items-center px-(--portal-row-pad-x)">
            <SectionHeading title={PATH.title} />
          </span>
        </CollapseHeader>
        {open && <Body athletePath={`coach/athletes/${encodeURIComponent(athleteId)}`} />}
      </PortalCard>
    </div>
  );
}
