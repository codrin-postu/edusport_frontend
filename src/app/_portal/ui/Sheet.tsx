"use client";

import * as Dialog from "@radix-ui/react-dialog";
import IconButton from "@/components/ui/icon-button";
import { cn } from "@/utils/cn";

type SheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  /** Actions pinned under the scrolling body (OK, Renunță), always in view. */
  footer?: React.ReactNode;
  /** A form popup: 560px wide on the desktop, up to 92% of the height on a phone, with a close button beside the title. */
  popup?: { closeLabel: string };
};

/** Bottom sheet on phones, centred box from the desktop breakpoint. The body scrolls; the footer stays put. */
export function Sheet({ open, onOpenChange, title, description, children, footer, popup }: SheetProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-dialog bg-overlay data-[state=open]:animate-(--motion-overlay-in) data-[state=closed]:animate-(--motion-overlay-out)" />
        <Dialog.Content
          {...(!description && { "aria-describedby": undefined })}
          className={cn(
            "fixed inset-x-0 bottom-0 z-dialog flex flex-col border-card border-card-line bg-surface-raised shadow-retro outline-none data-[state=open]:animate-(--motion-sheet-in) data-[state=closed]:animate-(--motion-sheet-out) portal:inset-auto portal:top-1/2 portal:left-1/2 portal:-translate-x-1/2 portal:-translate-y-1/2",
            popup ? "max-h-(--portal-popup-max-h) portal:w-(--portal-popup-w)" : "max-h-[85vh] portal:w-(--portal-sheet-w)",
          )}
        >
          <div className="flex min-h-0 flex-1 flex-col gap-(--portal-sheet-gap) overflow-y-auto p-(--portal-sheet-pad)">
            {popup ? (
              <div className="flex items-center justify-between gap-3">
                <Dialog.Title className="font-display font-extrabold text-(length:--portal-h2-size)">{title}</Dialog.Title>
                <IconButton icon="close" label={popup.closeLabel} onClick={() => onOpenChange(false)} />
              </div>
            ) : (
              <Dialog.Title className="font-display font-extrabold text-(length:--portal-h2-size)">{title}</Dialog.Title>
            )}
            {description && <Dialog.Description className="text-(length:--portal-text-14) text-muted">{description}</Dialog.Description>}
            {children}
          </div>
          {footer && <div data-sheet-footer className="shrink-0 border-t border-card-line p-(--portal-sheet-pad)">{footer}</div>}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
