"use client";

import { useState } from "react";
import Link from "next/link";
import Icon from "@/components/ui/icon";
import { ACCOUNT } from "@/lib/portal/copy-sportiv";
import { logout } from "@/app/_portal/lib/logout";
import { Sheet } from "@/app/_portal/ui/Sheet";
import { ListCard } from "@/app/_portal/ui/PortalCard";
import { cn } from "@/utils/cn";
import { useAthletes } from "../_lib/athletes-context";

const FOCUS = "outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus";
const LINE = "flex min-h-12 w-full items-center text-left text-(length:--portal-text-15) font-semibold text-primary no-underline hover:no-underline";

/** Phone: who is signed in as whom. The account's athletes (the current one marked), then Setări and Ieșire (board Cont). */
export function AccountSheet({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { picker, current } = useAthletes();
  return (
    <Sheet open={open} onOpenChange={onOpenChange} title={ACCOUNT.sheet.title}>
      <h3 className="text-(length:--portal-text-14) font-bold text-muted">{ACCOUNT.sheet.list}</h3>
      <ListCard>
        {picker.map((a) => (
          <Link
            key={a.id}
            href={`/${a.id}`}
            aria-current={a.id === current?.id ? "true" : undefined}
            onClick={() => onOpenChange(false)}
            className={cn("flex items-center justify-between gap-3 px-4 py-3 text-primary no-underline hover:no-underline", FOCUS, a.id === current?.id && "bg-ice-light")}
          >
            <span className="flex min-w-0 flex-col gap-0.5">
              <b className="text-(length:--portal-text-15)">{a.name}</b>
              <span className="text-(length:--portal-text-13) text-secondary">{ACCOUNT.row(a.groupName ?? "", a.age)}</span>
            </span>
            {a.id === current?.id && <Icon name="check" size="18" />}
          </Link>
        ))}
      </ListCard>
      <div className="flex flex-col divide-y divide-line-subtle border-t border-line-subtle">
        <Link href="/setari" onClick={() => onOpenChange(false)} className={cn(LINE, FOCUS)}>{ACCOUNT.sheet.settings}</Link>
        <button type="button" onClick={() => void logout()} className={cn(LINE, "cursor-pointer", FOCUS)}>{ACCOUNT.sheet.logout}</button>
      </div>
    </Sheet>
  );
}

/** The phone header's account button (board Main): the athlete's first name and a chevron; it opens the sheet. */
export function AccountButton() {
  const [open, setOpen] = useState(false);
  const { current } = useAthletes();
  return (
    <>
      <button
        type="button"
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
        className="flex min-h-(--portal-tap) cursor-pointer items-center gap-2 bg-surface-dark px-3 text-(length:--portal-text-14) font-bold text-surface-raised outline-none focus-visible:outline-2 focus-visible:outline-offset-(--focus-offset) focus-visible:outline-focus"
      >
        {current?.firstName ?? ACCOUNT.sheet.settings}
        <Icon name="chevron-down" size="sm" />
      </button>
      <AccountSheet open={open} onOpenChange={setOpen} />
    </>
  );
}
