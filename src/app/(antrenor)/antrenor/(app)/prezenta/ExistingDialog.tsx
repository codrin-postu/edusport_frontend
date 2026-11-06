"use client";

import Button from "@/components/ui/button";
import Dialog, { DialogActions } from "@/components/ui/dialog";
import { PRESENCE } from "@/lib/portal/copy";
import type { SavedOnDay } from "@/lib/portal/api-types";

type ExistingDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  saved: SavedOnDay[];
  openHref: (sessionId: string) => string;
  addHref: string;
};

export function ExistingDialog({ open, onOpenChange, saved, openHref, addHref }: ExistingDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange} title={PRESENCE.existing.title}>
      <ul className="mt-4 flex flex-col gap-4">
        {saved.map((s) => (
          <li key={s.sessionId} className="flex flex-col gap-2">
            <p className="text-body text-primary">{`${s.startTime}, ${PRESENCE.presentCount(s.present)}, ${PRESENCE.existing.savedBy(s.savedBy)}`}</p>
            <Button variant="secondary" href={openHref(s.sessionId)}>{PRESENCE.existing.open}</Button>
          </li>
        ))}
      </ul>
      <DialogActions>
        <Button href={addHref}>{PRESENCE.existing.addAnother}</Button>
      </DialogActions>
    </Dialog>
  );
}
