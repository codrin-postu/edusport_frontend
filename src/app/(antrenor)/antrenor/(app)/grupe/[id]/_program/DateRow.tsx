import type { ReactNode } from "react";
import { PROGRAM } from "@/lib/portal/copy";
import { dateTile, shortDate } from "@/lib/portal/format";
import { dateState } from "@/lib/portal/program";
import type { Occurrence } from "@/lib/portal/api-types";

/** The line under the time for a pause, cancelled or moved date. */
function noteText(o: Occurrence, state: ReturnType<typeof dateState>): string | null {
  if (state === "pause") return PROGRAM.breakNotice(o.note ?? "");
  if (state === "cancelled") return o.note ? `${PROGRAM.cancelled}: ${o.note}` : PROGRAM.cancelled;
  if (state === "moved") {
    const sameDay = !o.originalDate || o.originalDate === o.date;
    return PROGRAM.movedFrom(sameDay ? (o.originalStartTime ?? "") : shortDate(o.originalDate as string));
  }
  return null;
}

type DateRowProps = { occurrence: Occurrence; today: string; actions?: ReactNode };

/** One date of the group: tile, time and state; `actions` is the slot of the date buttons. */
export function DateRow({ occurrence: o, today, actions }: DateRowProps) {
  const tile = dateTile(o.date);
  const state = dateState(o, today);
  const note = noteText(o, state);
  return (
    <li className="p-4">
      <div className="flex items-center gap-4">
        <span className="w-12 shrink-0 border-retro border-line text-center py-1">
          <span className="text-label block text-secondary">{tile.weekday}</span>
          <span className="text-body font-semibold block text-primary">{tile.day}</span>
        </span>
        <span className="min-w-0 flex-1">
          <span className={state === "cancelled" ? "text-body font-semibold text-secondary block line-through" : "text-body font-semibold text-primary block"}>{o.startTime ?? ""}</span>
          {note && <span className="text-body-sm text-secondary block">{note}</span>}
        </span>
        {state === "past" && <span className="shrink-0 border-control border-line px-2 py-1 text-(length:--portal-text-12) font-bold text-primary">{PROGRAM.past}</span>}
      </div>
      {actions && <div className="flex flex-wrap gap-2 mt-4">{actions}</div>}
    </li>
  );
}
