"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import IconButton from "@/components/ui/icon-button";

/** Phone only: the "Cuprins" button opens the contents (passed as children) as a full-height layer. Closes on navigation. */
export function PhoneContents({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  useEffect(() => setOpen(false), [pathname]);
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger className="inline-flex h-(--portal-tap) items-center border-input border-input-line bg-surface-raised px-3 text-(length:--portal-text-14) font-bold text-primary portal:hidden">
        Cuprins
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Content aria-describedby={undefined} className="fixed inset-0 z-dialog flex flex-col bg-surface-raised outline-none portal:hidden">
          <div className="flex h-(--ghid-bar-h) shrink-0 items-center justify-between bg-surface-dark pr-2 pl-4 text-primary-on-dark">
            <Dialog.Title className="font-display text-(length:--portal-text-20) font-extrabold">Cuprins</Dialog.Title>
            <IconButton icon="close" label="Închide" onDark onClick={() => setOpen(false)} />
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto p-3">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
