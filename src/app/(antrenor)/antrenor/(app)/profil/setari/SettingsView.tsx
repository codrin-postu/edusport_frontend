"use client";

import { useState } from "react";
import Button from "@/components/ui/button";
import { Field, Input } from "@/components/ui/form-field";
import Link from "@/components/ui/link";
import { NAV, PROFILE, SETTINGS } from "@/lib/portal/copy";
import type { CoachMe } from "@/lib/portal/api-types";
import { portalApi } from "@/app/_portal/lib/api";
import { usePortal } from "../../../_lib/use-portal";
import { AlertLine } from "@/app/_portal/ui/AuthBits";
import { KeyValueCard } from "@/app/_portal/ui/KeyValueCard";
import { LoadError } from "@/app/_portal/ui/LoadError";
import { Column, Columns, PageBody } from "@/app/_portal/ui/PageBody";
import { PageHeader } from "@/app/_portal/ui/PageHeader";
import { Section } from "@/app/_portal/ui/SectionHeading";
import { PasswordField } from "@/app/_portal/ui/PasswordField";
import { Spinner } from "@/app/_portal/ui/Spinner";
import { useToast } from "@/app/_portal/ui/Toast";

function PhoneForm({ phone }: { phone: string | null }) {
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
      <Field label={SETTINGS.phone}>
        <Input type="tel" inputMode="tel" autoComplete="tel" value={value} onChange={(e) => setValue(e.target.value)} />
      </Field>
      <AlertLine message={message} />
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
      <AlertLine message={message} />
      <Button type="submit" disabled={busy || current === "" || password === ""} className="w-full">{SETTINGS.save}</Button>
    </form>
  );
}

export function SettingsView() {
  const me = usePortal<CoachMe>("coach/me");
  if (me.state === "loading") return <PageBody><div className="flex justify-center py-6"><Spinner /></div></PageBody>;
  if (me.data === null) return <PageBody><LoadError onRetry={me.reload} /></PageBody>;
  return (
    <>
      <PageHeader back={{ href: "/profil", label: NAV.profile }} title={PROFILE.settings} />
      <PageBody>
        <Columns>
          <Column grow={1} basis={380}>
            <Section title={SETTINGS.account}>
              <KeyValueCard rows={[{ key: SETTINGS.name, value: me.data.name }, { key: SETTINGS.email, value: me.data.email }]} />
              <p className="text-(length:--portal-text-13) text-muted">{SETTINGS.adminNote}</p>
            </Section>
          </Column>
          <Column grow={1} basis={380}>
            <Section title={SETTINGS.phone}>
              <PhoneForm phone={me.data.phone} />
            </Section>
            <Section title={SETTINGS.changePassword}>
              {me.data.hasPassword ? <PasswordForm email={me.data.email} /> : <Link href="/forgot-password" className="text-body-sm">{SETTINGS.setPassword}</Link>}
            </Section>
          </Column>
        </Columns>
      </PageBody>
    </>
  );
}
