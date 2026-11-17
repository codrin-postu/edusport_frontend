"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/button";
import { Dialog, DialogActions, DialogClose } from "@/components/ui/dialog";
import { Select } from "@/components/ui/select";
import { PATH } from "@/lib/portal/copy-sportiv";
import { STATES } from "@/lib/portal/copy-shared";
import { FRIENDSHIP_MESSAGES, friendPinId } from "@/lib/portal/parcurs";
import type { PinRecipient } from "@/lib/portal/sportiv-types";
import { portalApi } from "@/app/_portal/lib/api";

const G = PATH.give;
const DESIGNS = Array.from({ length: FRIENDSHIP_MESSAGES.length }, (_, i) => i + 1);

/** The server code of a refused give as the one short line the athlete reads; anything else is the portal's generic failure. */
function failureLine(message: string): string {
  return message === "NO_PINS_LEFT" ? G.noPinsLeft : STATES.loadFailed;
}

function DesignGrid({ design, onPick }: { design: number; onPick: (n: number) => void }) {
  return (
    <div className="mt-4 grid grid-cols-5 gap-2">
      {DESIGNS.map((n) => (
        <button
          key={n}
          type="button"
          aria-pressed={n === design}
          aria-label={G.design(n)}
          onClick={() => onPick(n)}
          className={`flex min-h-(--portal-tap) cursor-pointer items-center justify-center bg-transparent p-1 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus ${n === design ? "border-card border-line" : "border-card border-transparent"}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- a small static PNG; the button carries the label */}
          <img src={`/parcurs/${friendPinId(n)}.png`} alt="" className="h-12 w-full object-contain" />
        </button>
      ))}
    </div>
  );
}

/**
 * The give-a-pin dialog: one of the 15 designs, its fixed message, a friend, Trimite. The recipients load when it opens;
 * `onGiven` runs after a successful give (the page reloads the path so the count under the button is right).
 */
export function GiveDialog({ athleteId, open, onOpenChange, onGiven }: { athleteId: string; open: boolean; onOpenChange: (open: boolean) => void; onGiven: () => void }) {
  const [recipients, setRecipients] = useState<PinRecipient[]>([]);
  const [design, setDesign] = useState(1);
  const [to, setTo] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setDesign(1);
    setTo("");
    setError(null);
    void portalApi<PinRecipient[]>("GET", `sportiv/athletes/${athleteId}/pin-recipients`).then((r) => {
      if (cancelled) return;
      if (r.ok) setRecipients(r.data);
      else setError(STATES.loadFailed);
    });
    return () => { cancelled = true; };
  }, [open, athleteId]);

  const send = async() => {
    setSending(true);
    setError(null);
    const r = await portalApi("POST", `sportiv/athletes/${athleteId}/pins`, { recipientId: to, design });
    setSending(false);
    if (r.ok) onGiven();
    else setError(failureLine(r.message));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} title={G.title} closeLabel={PATH.dialog.close}>
      <DesignGrid design={design} onPick={setDesign} />
      <p className="mt-3 font-display font-extrabold text-(length:--portal-text-14)">{FRIENDSHIP_MESSAGES[design - 1]}</p>
      <div className="mt-3">
        <Select aria-label={G.to} value={to} onValueChange={setTo} options={recipients.map((r) => ({ value: r.id, label: r.name }))} placeholder={G.choose} contentClassName="z-popup" />
      </div>
      {error && <p role="alert" className="mt-3 text-(length:--portal-text-14) text-alert-ink">{error}</p>}
      <DialogActions>
        <DialogClose asChild><Button variant="secondary">{G.cancel}</Button></DialogClose>
        <Button disabled={to === "" || sending} onClick={() => void send()}>{G.send}</Button>
      </DialogActions>
    </Dialog>
  );
}
