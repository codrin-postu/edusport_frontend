"use client";

import * as Dialog from "@radix-ui/react-dialog";

type SheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
};

/** Bottom sheet on phones, centred box from the desktop breakpoint. */
export function Sheet({ open, onOpenChange, title, description, children }: SheetProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-dialog bg-overlay" />
        <Dialog.Content
          {...(!description && { "aria-describedby": undefined })}
          className="fixed inset-x-0 bottom-0 z-dialog flex max-h-[85vh] flex-col gap-(--portal-sheet-gap) overflow-y-auto border-card border-card-line bg-surface-raised p-(--portal-sheet-pad) shadow-retro outline-none portal:inset-auto portal:top-1/2 portal:left-1/2 portal:w-(--portal-sheet-w) portal:-translate-x-1/2 portal:-translate-y-1/2"
        >
          <Dialog.Title className="font-display font-extrabold text-(length:--portal-h2-size)">{title}</Dialog.Title>
          {description && <Dialog.Description className="text-(length:--portal-text-14) text-muted">{description}</Dialog.Description>}
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
