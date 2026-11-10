"use client";

import { AZI } from "@/lib/portal/copy";
import { longDay, monthShort, weekdayShort } from "@/lib/portal/format";
import { useNow } from "@/app/_portal/lib/use-now";
import { cn } from "@/utils/cn";

/** The live day and time tile (Bucharest). Reads its own clock; shown by the page header. */
export function NowTile({ className }: { className?: string }) {
  const now = useNow();
  const month = now ? monthShort(now.date) : "";
  const day = now ? String(Number(now.date.slice(8))) : "0";
  const time = now?.time ?? "00:00";
  const weekday = now ? weekdayShort(now.date) : "";
  return (
    <div
      role="group"
      aria-label={now ? AZI.nowLabel(longDay(now.date), now.time) : undefined}
      aria-hidden={now ? undefined : true}
      className={cn("flex shrink-0 items-stretch", !now && "invisible", className)}
    >
      <span className="flex w-(--portal-typeblock-w) flex-col items-center justify-center gap-0.5 bg-surface-dark py-2">
        <span className="text-(length:--portal-text-11) font-bold uppercase tracking-(--portal-tracking-month) text-ice">{month || "Noi"}</span>
        <span className="font-display font-extrabold text-(length:--portal-nowtile-day) leading-none text-white">{day}</span>
      </span>
      <span className="flex flex-col justify-center gap-1 border-card border-l-0 border-card-line bg-surface-raised px-(--portal-row-pad-x) py-2">
        <span className="font-display font-extrabold text-(length:--portal-nowtile-time) leading-none">{time}</span>
        <span className="text-(length:--portal-text-13) text-muted">{weekday || "Mar"}</span>
      </span>
    </div>
  );
}
