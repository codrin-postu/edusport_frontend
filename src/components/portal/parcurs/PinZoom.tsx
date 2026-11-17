"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Button from "@/components/ui/button";
import { PATH } from "@/lib/portal/copy-sportiv";

/** What the zoom dialog shows: the pin, its title, the count (only above one) and a line of text under it (the date, or "from, date"). `note` is the friendship message. */
export type ZoomItem = { image: string; title: string; count: number | null; line: string | null; note?: string };

/** The big pin in a dialog. Esc, the backdrop and Închide close it; the focus goes back to `returnTo` (the pin that opened it; Radix cannot, there is no Trigger). */
export function PinZoom({ item, onClose, returnTo }: { item: ZoomItem | null; onClose: () => void; returnTo: React.RefObject<HTMLElement | null> }) {
  return (
    <Dialog.Root open={item !== null} onOpenChange={(open) => { if (!open) onClose(); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-dialog bg-overlay animate-(--motion-dim)" />
        <Dialog.Content
          aria-describedby={undefined}
          onCloseAutoFocus={(e) => { e.preventDefault(); returnTo.current?.focus(); }}
          className="fixed top-1/2 left-1/2 z-dialog flex w-(--portal-zoom-w) max-w-[calc(100vw-2*var(--portal-page-x))] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-3 border-card border-card-line bg-surface-raised p-(--portal-sheet-pad) text-center shadow-retro outline-none"
        >
          {item && (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element -- a small static PNG, the dialog title names it */}
              <img src={`/parcurs/${item.image}.png`} alt="" className="h-(--portal-pin-zoom-h) w-(--portal-pin-zoom-w) animate-(--motion-zoom) object-contain drop-shadow-md" />
              <Dialog.Title className="font-display font-extrabold text-(length:--portal-h2-size)">{item.note ?? item.title}</Dialog.Title>
              {item.count !== null && <span className="font-display font-extrabold text-(length:--portal-h2-size)">{item.count}</span>}
              {item.line && <span className="text-(length:--portal-text-14) text-muted">{item.line}</span>}
              <Button onClick={onClose}>{PATH.dialog.close}</Button>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
