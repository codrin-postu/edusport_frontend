"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import Button from "@/components/ui/button";
import { PATH } from "@/lib/portal/copy-sportiv";
import { dayMonthYear } from "@/lib/portal/format";
import { badgeProgress, tierWord } from "@/lib/portal/sportiv-badges";
import type { Badge } from "@/lib/portal/sportiv-types";
import { bucharestDay } from "@/lib/portal/sportiv-format";

/** Wraps the badge button (`children`) and opens its zoom: the big badge, its name, every tier with the day it was reached or "încă nu", and the way to the next one. Radix returns the focus to the badge on close. */
export function BadgeZoom({ badge, mark, children }: { badge: Badge; mark: React.ReactNode; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const progress = badgeProgress(badge);
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-dialog bg-overlay animate-(--motion-dim)" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed top-1/2 left-1/2 z-dialog flex w-(--portal-zoom-w) max-w-[calc(100vw-2*var(--portal-page-x))] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-3 border-card border-card-line bg-surface-raised p-(--portal-sheet-pad) text-center shadow-retro outline-none"
        >
          <div className="animate-(--motion-zoom)">{mark}</div>
          <Dialog.Title className="font-display font-extrabold text-(length:--portal-h2-size)">{badge.label}</Dialog.Title>
          <ul className="flex w-full flex-col divide-y divide-line-subtle border-y border-card-line text-left">
            {badge.tiers.map((t) => (
              <li key={t.threshold} className="flex min-h-(--portal-tap) items-center justify-between gap-3">
                <span className="flex items-baseline gap-2">
                  <b className="text-(length:--portal-row-title)">{t.threshold}</b>
                  <span className="text-(length:--portal-sub-size) text-muted">{tierWord(t.tier)}</span>
                </span>
                <span className="text-(length:--portal-sub-size)">{t.reachedOn ? dayMonthYear(bucharestDay(t.reachedOn)) : PATH.dialog.notYet}</span>
              </li>
            ))}
          </ul>
          {progress && <p className="text-(length:--portal-text-14) text-muted">{progress}</p>}
          <Button onClick={() => setOpen(false)}>{PATH.dialog.close}</Button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
