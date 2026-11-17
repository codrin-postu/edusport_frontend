"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/button";
import { Dialog, DialogActions, DialogClose } from "@/components/ui/dialog";
import { Select } from "@/components/ui/select";
import { PATH } from "@/lib/portal/copy-sportiv";
import { STATES } from "@/lib/portal/copy-shared";
import type { JumpCode, JumpLevel, ParcursStaff } from "@/lib/portal/parcurs";
import { portalApi } from "@/app/_portal/lib/api";

const A = PATH.award;

type Kind = "steaua" | "test" | "jump";
type Body = { kind: Kind; jump?: JumpCode; level?: JumpLevel };

/** The award body to send, or null while the picks are not complete. */
function bodyOf(kind: string, jump: string, level: string): Body | null {
  if (kind === "steaua" || kind === "test") return { kind };
  if (kind === "jump" && jump !== "" && level !== "") return { kind, jump: jump as JumpCode, level: Number(level) as JumpLevel };
  return null;
}

function Pick({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: readonly { value: string; label: string }[] }) {
  return (
    <div className="mt-3">
      <Select aria-label={label} value={value} onValueChange={onChange} options={[...options]} placeholder={A.choose} contentClassName="z-popup" />
    </div>
  );
}

/**
 * The award dialog of the coach: Steaua antrenorului, Test promovat, or a jump with its level. `athletePath` is the BFF path of the athlete;
 * `onAwarded` receives the fresh Parcurs the server answers with.
 */
export function AwardDialog({ athletePath, open, onOpenChange, onAwarded }: { athletePath: string; open: boolean; onOpenChange: (open: boolean) => void; onAwarded: (fresh: ParcursStaff) => void }) {
  const [kind, setKind] = useState("");
  const [jump, setJump] = useState("");
  const [level, setLevel] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const body = bodyOf(kind, jump, level);

  useEffect(() => {
    if (!open) return;
    setKind("");
    setJump("");
    setLevel("");
    setError(null);
  }, [open]);

  const send = async() => {
    if (body === null) return;
    setSending(true);
    setError(null);
    const r = await portalApi<ParcursStaff>("POST", `${athletePath}/awards`, body);
    setSending(false);
    if (r.ok) onAwarded(r.data);
    else setError(STATES.loadFailed);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} title={A.title} closeLabel={PATH.dialog.close}>
      <Pick label={A.kind} value={kind} onChange={setKind} options={A.kinds} />
      {kind === "jump" && <Pick label={A.jump} value={jump} onChange={setJump} options={A.jumps} />}
      {kind === "jump" && <Pick label={A.level} value={level} onChange={setLevel} options={A.levels} />}
      {error && <p role="alert" className="mt-3 text-(length:--portal-text-14) text-alert-ink">{error}</p>}
      <DialogActions>
        <DialogClose asChild><Button variant="secondary">{A.cancel}</Button></DialogClose>
        <Button disabled={body === null || sending} onClick={() => void send()}>{A.confirm}</Button>
      </DialogActions>
    </Dialog>
  );
}
