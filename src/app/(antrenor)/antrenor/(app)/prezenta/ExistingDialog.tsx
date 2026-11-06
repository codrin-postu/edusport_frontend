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
  /** A stand-in cannot add a session on another coach's group. */
  standIn: boolean;
};

export function ExistingDialog({ open, onOpenChange, saved, openHref, addHref, standIn }: ExistingDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange} title={PRESENCE.existing.title}>
      <ul className="mt-4 flex flex-col gap-4">
        {saved.map((s) => (
          <li key={s.sessionId} className="flex flex-col gap-2">
            <p className="text-body text-primary">{`${s.startTime}, ${PRESENCE.presentCount(s.present)}, ${PRESENCE.existing.savedBy(s.savedBy)}`}</p>
            {s.listed && <Button variant="secondary" href={openHref(s.sessionId)}>{PRESENCE.existing.open}</Button>}
          </li>
        ))}
      </ul>
      {!standIn && (
        <DialogActions>
          <Button href={addHref}>{PRESENCE.existing.addAnother}</Button>
        </DialogActions>
      )}
    </Dialog>
  );
}
