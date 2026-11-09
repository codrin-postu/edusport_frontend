"use client";

import { useRouter, useSearchParams } from "next/navigation";
import IconButton from "@/components/ui/icon-button";
import { A11Y, HISTORY } from "@/lib/portal/copy";
import { addMonths, dateTile, durationText, monthName } from "@/lib/portal/format";
import type { CoachHistory, CoachHistoryRow } from "@/lib/portal/api-types";
import { bucharestToday } from "../../_lib/today";
import { usePortal } from "../../_lib/use-portal";
import { ListCard } from "../../_ui/ListCard";
import { LoadError } from "@/app/_portal/ui/LoadError";
import { Row } from "../../_ui/Row";
import { Spinner } from "@/app/_portal/ui/Spinner";

function sub(r: CoachHistoryRow): string {
  if (r.kind === "individuala") return HISTORY.lesson(durationText(r.durationMin ?? 0));
  return r.kind === "inlocuitor" ? HISTORY.standIn(r.present ?? 0) : HISTORY.group(r.present ?? 0);
}

function href(r: CoachHistoryRow): string {
  if (r.kind === "individuala") return `/lectie/${encodeURIComponent(r.lessonId ?? "")}`;
  return `/prezenta?id=${encodeURIComponent(r.sessionId ?? "")}`;
}

export function HistoryView() {
  const router = useRouter();
  const raw = useSearchParams().get("luna");
  const month = raw !== null && /^\d{4}-(0[1-9]|1[0-2])$/.test(raw) ? raw : bucharestToday().slice(0, 7);
  const history = usePortal<CoachHistory>(`coach/history?month=${month}`);
  const go = (n: number) => router.replace(`/istoric?luna=${addMonths(month, n)}`);
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <IconButton icon="chevron-left" label={A11Y.prevMonth} onClick={() => go(-1)} />
        <h1 className="text-title text-primary">{monthName(month)}</h1>
        <IconButton icon="chevron-right" label={A11Y.nextMonth} onClick={() => go(1)} />
      </div>
      {history.state === "loading" && <div className="py-6 flex justify-center"><Spinner /></div>}
      {history.state === "error" && <LoadError />}
      {history.state === "ready" && history.data && (
        <>
          <p className="text-body-sm text-secondary mb-4">{HISTORY.summary(history.data.sessions, history.data.lessons, history.data.hours)}</p>
          <ListCard>
            {history.data.rows.map((r) => (
              <Row key={`${r.sessionId ?? r.lessonId}`} href={href(r)} tile={dateTile(r.date)} title={r.name} sub={sub(r)} />
            ))}
          </ListCard>
        </>
      )}
    </div>
  );
}
