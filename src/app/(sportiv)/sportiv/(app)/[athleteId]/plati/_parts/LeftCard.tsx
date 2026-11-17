"use client";

import { useRef, useState } from "react";
import { MONEY } from "@/lib/portal/copy-sportiv";
import { shortDate } from "@/lib/portal/format";
import { ron } from "@/lib/portal/sportiv-format";
import type { SportivMoney, SportivSubscriptions } from "@/lib/portal/sportiv-types";
import { PortalCard } from "@/app/_portal/ui/PortalCard";
import { TicketSheet } from "./TicketSheet";

type Subscriptions = { state: "loading" | "ready" | "error"; data: SportivSubscriptions | null; reload: () => void };

/**
 * What is owed and the running abonament. Every figure is printed as the backend sent it: `left` is the total,
 * the lines are only listed (with their amounts when there are several), nothing is added up here.
 */
export function LeftCard({ money, subscriptions }: { money: SportivMoney; subscriptions: Subscriptions }) {
  const [open, setOpen] = useState(false);
  const opener = useRef<HTMLButtonElement>(null);
  // The sheet has no trigger element, so focus goes back to "Vezi zilele" here once the dialog has closed.
  const onOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) window.setTimeout(() => opener.current?.focus(), 0);
  };
  const owes = money.left > 0;
  const ab = money.abonament;
  return (
    <>
      <PortalCard as="section" tone="navy" pad="card" className="gap-2">
        <h2 className="m-0 text-(length:--portal-text-14) font-normal text-secondary-on-dark">{MONEY.owed.label}</h2>
        <span className="font-display font-extrabold text-(length:--portal-text-36) leading-none text-ice">{ron(money.left)}</span>
        {owes ? (
          <>
            {money.lines.length > 0 && (
              <ul className="m-0 flex list-none flex-col gap-0.5 p-0 text-(length:--portal-text-14) text-secondary-on-dark">
                {money.lines.map((l, i) => (
                  <li key={`${l.text}:${i}`}>{money.lines.length > 1 ? `${l.text}, ${ron(l.amount)}` : l.text}</li>
                ))}
              </ul>
            )}
            <p className="m-0 text-(length:--portal-text-14) text-secondary-on-dark">{MONEY.owed.payAtClub}</p>
          </>
        ) : (
          <p className="m-0 text-(length:--portal-text-14) text-secondary-on-dark">{MONEY.owed.nothing}</p>
        )}
        {money.advance !== null && <p className="m-0 text-(length:--portal-text-14) font-bold text-white">{MONEY.owed.advance(ron(money.advance))}</p>}
      </PortalCard>
      {ab && (
        <PortalCard as="section" pad="card" className="gap-3">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="m-0 font-display font-extrabold text-(length:--portal-h2-size)">{MONEY.ticket.title}</h2>
            {ab.code && <span className="text-(length:--portal-text-14) text-muted">{ab.code}</span>}
          </div>
          <span className="text-(length:--portal-text-14) text-muted">{`${ab.itemName}, ${shortDate(ab.startsOn)} - ${shortDate(ab.validUntil)}`}</span>
          <div className="flex items-center justify-between gap-3">
            <span className="font-display font-extrabold text-(length:--portal-text-26) leading-none">{MONEY.ticket.slotsOf(ab.next, ab.slots)}</span>
            <button ref={opener} type="button" onClick={() => setOpen(true)} className="inline-flex min-h-(--portal-tap) cursor-pointer items-center border-0 bg-transparent px-1 text-(length:--portal-text-14) font-bold text-primary">
              {MONEY.ticket.seeDays}
            </button>
          </div>
        </PortalCard>
      )}
      <TicketSheet open={open} onOpenChange={onOpenChange} subscriptions={subscriptions} />
    </>
  );
}
