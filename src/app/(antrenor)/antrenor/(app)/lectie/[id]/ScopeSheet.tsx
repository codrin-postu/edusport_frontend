"use client";

import { useState } from "react";
import { TRAINING } from "@/lib/portal/copy";
import { ChoiceRow } from "@/app/_portal/ui/ChoiceRow";
import { Sheet } from "@/app/_portal/ui/Sheet";
import { SheetFooter } from "../../../_ui/SheetFooter";

export type Scope = "one" | "following";
type Props = {
  title: string;
  confirm: string;
  onClose: () => void;
  /** Runs the write. Resolves to the refusal to show inside the sheet, or null when it went through. */
  onConfirm: (scope: Scope) => Promise<string | null>;
};

/** "Ce schimbi?" / "Ce ștergi?" on a repeating lesson: this one or the following ones. The choice applies on confirm only. */
export function ScopeSheet({ title, confirm, onClose, onConfirm }: Props) {
  const [scope, setScope] = useState<Scope>("one");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function submit() {
    setBusy(true);
    setMessage(null);
    const refusal = await onConfirm(scope);
    if (refusal !== null) {
      setBusy(false);
      setMessage(refusal);
    }
  }

  return (
    <Sheet
      open
      onOpenChange={(o) => { if (!o && !busy) onClose(); }}
      title={title}
      footer={<SheetFooter message={message} busy={busy} confirm={confirm} onClose={onClose} onConfirm={() => void submit()} />}
    >
      <div role="radiogroup" aria-label={title} className="flex flex-col gap-3">
        <ChoiceRow label={TRAINING.scopeOne} checked={scope === "one"} onSelect={() => setScope("one")} />
        <ChoiceRow label={TRAINING.scopeFollowing} checked={scope === "following"} onSelect={() => setScope("following")} />
      </div>
    </Sheet>
  );
}
