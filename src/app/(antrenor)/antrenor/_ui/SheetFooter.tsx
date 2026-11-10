import Button from "@/components/ui/button";
import { PROGRAM } from "@/lib/portal/copy";
import { AlertLine } from "@/app/_portal/ui/AuthBits";

type SheetFooterProps = { message: string | null; busy: boolean; disabled?: boolean; confirm: string; onClose: () => void; onConfirm: () => void };

/** The pinned actions of a program sheet: the refusal line, then "Renunță" and the confirm side by side. */
export function SheetFooter({ message, busy, disabled, confirm, onClose, onConfirm }: SheetFooterProps) {
  return (
    <div className="flex flex-col gap-3">
      <AlertLine message={message} />
      <div className="grid grid-cols-2 gap-3">
        <Button variant="secondary" onClick={onClose} disabled={busy} className="w-full">{PROGRAM.giveUp}</Button>
        <Button onClick={onConfirm} disabled={busy || disabled} className="w-full">{confirm}</Button>
      </div>
    </div>
  );
}
