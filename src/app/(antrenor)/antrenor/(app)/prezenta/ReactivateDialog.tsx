"use client";

import Button from "@/components/ui/button";
import Dialog, { DialogActions } from "@/components/ui/dialog";
import { PRESENCE } from "@/lib/portal/copy";

type ReactivateDialogProps = {
  athlete: { id: string; name: string } | null;
  onKeep: () => void;
  onReactivate: () => void;
};

/** One inactive athlete at a time; closing it without an answer changes nothing. */
export function ReactivateDialog({ athlete, onKeep, onReactivate }: ReactivateDialogProps) {
  return (
    <Dialog open={athlete !== null} onOpenChange={() => {}} hideClose title={PRESENCE.reactivate.title} description={athlete ? PRESENCE.reactivate.text(athlete.name) : undefined}>
      <DialogActions>
        <Button variant="secondary" onClick={onKeep}>{PRESENCE.reactivate.keep}</Button>
        <Button onClick={onReactivate}>{PRESENCE.reactivate.reactivate}</Button>
      </DialogActions>
    </Dialog>
  );
}
