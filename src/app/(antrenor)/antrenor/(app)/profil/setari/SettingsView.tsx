"use client";

import { useId, useState } from "react";
import Button from "@/components/ui/button";
import { Input } from "@/components/ui/form-field";
import Link from "@/components/ui/link";
import { PROFILE, SETTINGS } from "@/lib/portal/copy";
import type { CoachMe } from "@/lib/portal/api-types";
import { portalApi } from "../../../_lib/api";
import { usePortal } from "../../../_lib/use-portal";
import { BackHeader } from "../../../_ui/BackHeader";
import { LoadError } from "@/app/_portal/ui/LoadError";
import { PasswordField } from "@/app/_portal/ui/PasswordField";
import { Spinner } from "@/app/_portal/ui/Spinner";
import { useToast } from "@/app/_portal/ui/Toast";

function ReadOnly({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-label text-secondary mb-2">{label}</p>
      <p className="text-body text-primary">{value}</p>
    </div>
  );
}

function PhoneForm({ phone }: { phone: string | null }) {
  const id = useId();
  const toast = useToast();
  const [value, setValue] = useState(phone ?? "");
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setMessage(null);
    const trimmed = value.trim();
    const r = await portalApi<{ toast: string }>("PUT", "coach/me", { phone: trimmed === "" ? null : trimmed });
    setBusy(false);
    if (!r.ok) setMessage(r.message);
    else toast.show(r.data.toast);
  }
  return (
    <form onSubmit={(e) => void save(e)} className="flex flex-col gap-4">
      <div>
        <label htmlFor={id} className="text-label text-secondary block mb-2">{SETTINGS.phone}</label>
        <Input id={id} type="tel" inputMode="tel" autoComplete="tel" value={value} onChange={(e) => setValue(e.target.value)} surface="card" />
      </div>
      <p role="alert" className="text-body-sm text-accent empty:hidden">{message}</p>
      <Button type="submit" disabled={busy} className="w-full">{SETTINGS.save}</Button>
    </form>
  );
}

function PasswordForm({ email }: { email: string }) {
  const toast = useToast();
  const [current, setCurrent] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setMessage(null);
    const r = await portalApi<{ toast: string }>("POST", "coach/me/password", { current, password });
    setBusy(false);
    if (!r.ok) {
      setMessage(r.message);
      return;
    }
    setCurrent("");
    setPassword("");
    toast.show(r.data.toast);
  }
  return (
    <form onSubmit={(e) => void save(e)} className="flex flex-col gap-4">
      <input type="email" name="username" autoComplete="username" value={email} readOnly hidden />
      <PasswordField label={SETTINGS.currentPassword} value={current} onChange={setCurrent} autoComplete="current-password" />
      <PasswordField label={SETTINGS.newPassword} value={password} onChange={setPassword} autoComplete="new-password" />
      <p role="alert" className="text-body-sm text-accent empty:hidden">{message}</p>
      <Button type="submit" disabled={busy || current === "" || password === ""} className="w-full">{SETTINGS.save}</Button>
    </form>
  );
}

export function SettingsView() {
  const me = usePortal<CoachMe>("coach/me");
  if (me.state === "loading") return <div className="py-6 flex justify-center"><Spinner /></div>;
  if (me.data === null) return <LoadError />;
  return (
    <div className="flex flex-col gap-6">
      <BackHeader href="/profil" title={PROFILE.settings} />
      <ReadOnly label={SETTINGS.name} value={me.data.name} />
      <ReadOnly label={SETTINGS.email} value={me.data.email} />
      <p className="text-body-sm text-secondary">{SETTINGS.adminNote}</p>
      <PhoneForm phone={me.data.phone} />
      <h2 className="text-subtitle text-primary">{SETTINGS.changePassword}</h2>
      {me.data.hasPassword ? <PasswordForm email={me.data.email} /> : <Link href="/forgot-password" className="text-body-sm">{SETTINGS.setPassword}</Link>}
    </div>
  );
}
