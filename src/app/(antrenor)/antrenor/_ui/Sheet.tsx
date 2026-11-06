"use client";

import * as Dialog from "@radix-ui/react-dialog";

type SheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
};

/** Bottom sheet on phones, centred box from lg. */
export function Sheet({ open, onOpenChange, title, children }: SheetProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-dialog bg-overlay" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed z-dialog inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto bg-surface border-retro border-line p-4 pb-8 outline-none lg:inset-auto lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:w-full lg:max-w-md lg:border-retro lg:shadow-retro"
        >
          <div aria-hidden className="mx-auto mb-4 h-1 w-12 bg-line-subtle lg:hidden" />
          <Dialog.Title className="text-title text-primary mb-4">{title}</Dialog.Title>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
