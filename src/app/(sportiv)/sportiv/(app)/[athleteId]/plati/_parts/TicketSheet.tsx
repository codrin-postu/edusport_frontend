"use client";

import { MONEY } from "@/lib/portal/copy-sportiv";
import { shortDate } from "@/lib/portal/format";
import type { SportivSubscriptions } from "@/lib/portal/sportiv-types";
import { LoadError } from "@/app/_portal/ui/LoadError";
import { Sheet } from "@/app/_portal/ui/Sheet";
import { Spinner } from "@/app/_portal/ui/Spinner";
import { TicketGrid } from "./TicketGrid";

type Subscriptions = { state: "loading" | "ready" | "error"; data: SportivSubscriptions | null; reload: () => void };

/** The days sheet: the running abonament's boxes with its last day and what is left, then the earlier abonamente. */
export function TicketSheet({ open, onOpenChange, subscriptions }: { open: boolean; onOpenChange: (open: boolean) => void; subscriptions: Subscriptions }) {
  const { state, data } = subscriptions;
  const active = data?.active ?? null;
  return (
    <Sheet open={open} onOpenChange={onOpenChange} title={MONEY.ticket.title}>
      {state === "loading" && <div className="flex justify-center py-6"><Spinner /></div>}
      {state === "error" && <LoadError onRetry={subscriptions.reload} />}
      {state === "ready" && data && (
        <>
          {active && (
            <div className="flex flex-col gap-3">
              <TicketGrid ticket={active} />
              <p className="m-0 text-(length:--portal-text-14) font-bold">{`${MONEY.sheet.validUntil(shortDate(active.validUntil))}, ${MONEY.ticket.left(active.left)}`}</p>
              <p className="m-0 text-(length:--portal-text-14) text-muted">{MONEY.sheet.mayExtend}</p>
            </div>
          )}
          {data.earlier.length > 0 && (
            <div className="flex flex-col gap-2">
              <h3 className="m-0 font-display font-extrabold text-(length:--portal-h2-size)">{MONEY.sheet.others}</h3>
              <ul className="m-0 flex list-none flex-col gap-2 p-0">
                {data.earlier.map((e, i) => (
                  <li key={`${e.itemName}:${e.validUntil}:${i}`} className="text-(length:--portal-text-14) text-muted">
                    {MONEY.sheet.earlier(e.itemName, e.used, e.slots, shortDate(e.validUntil))}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </Sheet>
  );
}
