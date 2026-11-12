"use client";

import { useState } from "react";
import Button from "@/components/ui/button";
import { Field, Input } from "@/components/ui/form-field";
import { SETTINGS } from "@/lib/portal/copy";
import { SETARI } from "@/lib/portal/copy-sportiv";
import type { SportivMe } from "@/lib/portal/sportiv-types";
import { portalApi } from "@/app/_portal/lib/api";
import { AlertLine } from "@/app/_portal/ui/AuthBits";
import { ListRow } from "@/app/_portal/ui/ListRow";
import { ListCard } from "@/app/_portal/ui/PortalCard";
import { Sheet } from "@/app/_portal/ui/Sheet";
import { useToast } from "@/app/_portal/ui/Toast";

const orNull = (v: string): string | null => (v.trim() === "" ? null : v.trim());

/** Contul meu: Nume and Telefon open one sheet to edit; the e-mail is read only (the club changes it). */
export function AccountRows({ me, onSaved }: { me: SportivMe; onSaved: (next: Pick<SportivMe, "name" | "phone">) => void }) {
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function edit() {
    setName(me.name ?? "");
    setPhone(me.phone ?? "");
    setMessage(null);
    setOpen(true);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setMessage(null);
    const body = { name: orNull(name), phone: orNull(phone) };
    const r = await portalApi<{ toast: string }>("PUT", "sportiv/me", body);
    setBusy(false);
    if (!r.ok) {
      setMessage(r.message);
      return;
    }
    onSaved(body);
    setOpen(false);
    toast.show(r.data.toast);
  }

  return (
    <>
      <ListCard>
        <ListRow onClick={edit} title={SETARI.me.name} sub={me.name ?? ""} />
        <ListRow title={SETARI.me.email} sub={me.email} extra={<span className="text-(length:--portal-row-sub) text-muted">{SETARI.me.emailNote}</span>} end={null} />
        <ListRow onClick={edit} title={SETARI.me.phone} sub={me.phone ?? ""} />
      </ListCard>
      <Sheet open={open} onOpenChange={setOpen} title={SETARI.me.title}>
        <form onSubmit={(e) => void save(e)} className="flex flex-col gap-4">
          <Field label={SETARI.me.name}>
            <Input autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
          <Field label={SETARI.me.phone}>
            <Input type="tel" inputMode="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </Field>
          <AlertLine message={message} />
          <Button type="submit" disabled={busy} className="w-full">{SETTINGS.save}</Button>
        </form>
      </Sheet>
    </>
  );
}
