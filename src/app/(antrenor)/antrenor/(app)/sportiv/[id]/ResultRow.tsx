"use client";

import { useState } from "react";
import { COMPETITIONS } from "@/lib/portal/copy";
import { dayMonthYear, pointsText } from "@/lib/portal/format";
import { isExpandable } from "@/lib/portal/score-sheet";
import type { CoachProtocolRead } from "@/lib/portal/api-types";
import { CollapseHeader } from "@/app/_portal/ui/CollapseHeader";
import { ListRow } from "@/app/_portal/ui/ListRow";
import { LoadError } from "@/app/_portal/ui/LoadError";
import { PlaceBlock } from "@/app/_portal/ui/PlaceBlock";
import { PointsCell } from "@/app/_portal/ui/PointsCell";
import { ScoreSheet } from "@/app/_portal/ui/ScoreSheet";
import { Spinner } from "@/app/_portal/ui/Spinner";
import { usePortal } from "../../../_lib/use-portal";

type Row = { eventName: string; date: string | null; location: string | null; placement: number | null; total: number | null; resultId: string | null };

function Sheet({ athleteId, resultId }: { athleteId: string; resultId: string }) {
  const sheet = usePortal<CoachProtocolRead>(`coach/athletes/${encodeURIComponent(athleteId)}/competitions/${encodeURIComponent(resultId)}/protocol`);
  if (sheet.state === "loading") return <div className="flex justify-center py-6"><Spinner /></div>;
  if (sheet.state === "error" || !sheet.data) return <LoadError onRetry={sheet.reload} />;
  if (!sheet.data.available) return <p className="px-(--portal-row-pad-x) py-3 text-(length:--portal-text-14) text-muted">{COMPETITIONS.unavailable}</p>;
  return <ScoreSheet segments={sheet.data.segments} />;
}

/** One result of the athlete card. A result with a score sheet opens into it (fetched on the first open); one without stays a plain row. */
export function ResultRow({ athleteId, row }: { athleteId: string; row: Row }) {
  const [open, setOpen] = useState(false);
  const sub = [row.date ? dayMonthYear(row.date) : null, row.location].filter((p): p is string => !!p).join(", ");
  const end = row.total === null ? null : <PointsCell points={pointsText(row.total)} />;
  if (!isExpandable(row) || row.resultId === null) {
    return <ListRow lead={<PlaceBlock placement={row.placement} />} title={row.eventName} sub={sub} end={end} />;
  }
  return (
    <div data-result-row>
      <CollapseHeader open={open} onToggle={() => setOpen((o) => !o)}>
        <span className="flex min-w-0 flex-1 items-center gap-(--portal-row-gap) px-(--portal-row-pad-x) py-(--portal-row-pad-y)">
          <PlaceBlock placement={row.placement} />
          <span className="flex min-w-0 flex-col gap-0.5">
            <span className="text-(length:--portal-row-title) font-bold">{row.eventName}</span>
            {sub && <span className="text-(length:--portal-row-sub) text-muted">{sub}</span>}
          </span>
        </span>
        {end}
      </CollapseHeader>
      {open && <Sheet athleteId={athleteId} resultId={row.resultId} />}
    </div>
  );
}
