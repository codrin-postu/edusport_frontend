"use client";

import { useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import Button from "@/components/ui/button";
import { HOME } from "@/lib/portal/copy-sportiv";

const reducedMotion = (): boolean => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * The moment an athlete moves up a level. Reduced motion (or a slow phone that never gets to the animation) shows the new
 * level at once: the old level is only mounted when motion is allowed. Escape and "Mai departe" both end it through `onDone`,
 * which runs once.
 */
export function PromotionDialog({ from, to, firstName, onDone }: { from: string; to: string; firstName: string; onDone: () => void }) {
  const [still] = useState(reducedMotion);
  const finished = useRef(false);
  const action = useRef<HTMLDivElement>(null);
  const finish = () => {
    if (finished.current) return;
    finished.current = true;
    onDone();
  };
  return (
    <Dialog.Root open onOpenChange={(open) => { if (!open) finish(); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-dialog bg-overlay data-[state=open]:animate-(--motion-overlay-in)" />
        <Dialog.Content
          onOpenAutoFocus={(e) => { e.preventDefault(); action.current?.querySelector("button")?.focus(); }}
          onInteractOutside={(e) => e.preventDefault()}
          className="fixed top-1/2 left-1/2 z-dialog flex w-(--portal-promo-w) max-w-[calc(100vw-2*var(--portal-page-x))] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-3 border-card border-card-line bg-surface-raised p-(--portal-sheet-pad) text-center shadow-retro outline-none animate-(--motion-promo-card)"
        >
          <Dialog.Title className="text-(length:--portal-text-12) font-bold uppercase tracking-(--portal-tracking-month) text-muted">{HOME.promotion.title}</Dialog.Title>
          <div className="relative h-(--portal-promo-h) w-full">
            {!still && (
              <span aria-hidden="true" data-promo-old className="absolute inset-0 font-display font-extrabold text-(length:--portal-text-26) leading-(--portal-promo-h) text-muted animate-(--motion-promo-old)">{from}</span>
            )}
            <span data-promo-new className="absolute inset-0 font-display font-extrabold text-(length:--portal-text-26) leading-(--portal-promo-h) animate-(--motion-promo-new)">{to}</span>
          </div>
          <span aria-hidden="true" className="h-1 w-(--portal-promo-line) bg-ice animate-(--motion-promo-line)" />
          <Dialog.Description className="text-(length:--portal-text-14) text-muted">{HOME.promotion.text(firstName)}</Dialog.Description>
          <div ref={action}>
            <Button onClick={finish}>{HOME.promotion.done}</Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
