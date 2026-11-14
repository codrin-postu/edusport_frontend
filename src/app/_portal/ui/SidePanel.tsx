"use client";

import * as Dialog from "@radix-ui/react-dialog";
import IconButton from "@/components/ui/icon-button";

/** A full-height panel anchored to the right edge (420px). Its shadow sits on the panel's left edge only; the body is flat, so cards inside keep their own shadow. */
export function SidePanel({ open, onOpenChange, title, closeLabel, children }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  closeLabel: string;
  children: React.ReactNode;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-dialog bg-overlay data-[state=open]:animate-(--motion-overlay-in) data-[state=closed]:animate-(--motion-overlay-out)" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed inset-y-0 right-0 z-dialog flex w-full max-w-(--portal-panel-w) flex-col border-l border-card-line bg-surface shadow-(--portal-panel-shadow) outline-none"
        >
          <div className="flex shrink-0 items-center justify-between gap-3 border-b border-line-subtle p-(--portal-sheet-pad)">
            <Dialog.Title className="font-display font-extrabold text-(length:--portal-h2-size)">{title}</Dialog.Title>
            <IconButton icon="close" label={closeLabel} onClick={() => onOpenChange(false)} />
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto p-(--portal-sheet-pad)">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
