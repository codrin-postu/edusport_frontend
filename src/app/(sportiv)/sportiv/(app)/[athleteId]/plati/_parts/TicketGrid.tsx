import { MONEY } from "@/lib/portal/copy-sportiv";
import { shortDate } from "@/lib/portal/format";
import type { Ticket } from "@/lib/portal/sportiv-types";
import { cn } from "@/utils/cn";

/** Option A "Grilă curată": one box per session, the date in the used ones, the next one marked. */
export function TicketGrid({ ticket }: { ticket: Ticket }) {
  return (
    <ol className="m-0 grid list-none grid-cols-4 gap-2 p-0">
      {Array.from({ length: ticket.slots }, (_, i) => {
        const used = i < ticket.used.length;
        const next = i === ticket.used.length;
        return (
          <li
            key={i}
            className={cn(
              "flex min-h-(--portal-row-min-h) flex-col justify-between border-2 px-2 py-1 text-(length:--portal-text-11) font-bold",
              used ? "border-surface-dark bg-surface-dark text-surface-raised" : next ? "border-primary text-primary" : "border-card-line text-muted",
            )}
          >
            <span>{i + 1}</span>
            <span className="font-semibold">{used ? shortDate(ticket.used[i]) : next ? MONEY.ticket.next : ""}</span>
          </li>
        );
      })}
    </ol>
  );
}
