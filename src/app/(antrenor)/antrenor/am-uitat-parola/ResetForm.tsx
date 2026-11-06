"use client";

import { useState } from "react";
import Button from "@/components/ui/button";
import { Field, Input } from "@/components/ui/form-field";
import { RESET } from "@/lib/portal/copy";
import { portalApi } from "../_lib/api";
import { AuthFrame } from "../_ui/AuthFrame";
import { AlertLine, BackLink } from "../_ui/AuthBits";
import { PasswordField } from "../_ui/PasswordField";

export function ResetForm() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [sent, setSent] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function request(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setMessage(null);
    const r = await portalApi<{ message: string }>("POST", "auth/reset/request", { email }, { stay401: true });
    setBusy(false);
    if (r.ok) setSent(r.data.message);
    else setMessage(r.message);
  }

  async function confirm(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setMessage(null);
    const r = await portalApi<{ ok: true }>("POST", "auth/reset/confirm", { email, code, password }, { stay401: true });
    if (r.ok) {
      window.location.assign("/");
      return;
    }
    setMessage(r.message);
    setPassword("");
    setBusy(false);
  }

  return (
    <AuthFrame title={RESET.title}>
      {sent === null ? (
        <form onSubmit={(e) => void request(e)} className="flex flex-col gap-4">
          <Field label={RESET.email}>
            <Input type="email" name="email" value={email} autoComplete="email" autoCapitalize="none" spellCheck={false} onChange={(e) => setEmail(e.target.value)} />
          </Field>
          <AlertLine message={message} />
          <Button type="submit" disabled={busy || !email} className="w-full">{RESET.sendCode}</Button>
        </form>
      ) : (
        <form onSubmit={(e) => void confirm(e)} className="flex flex-col gap-4">
          <p className="text-body-sm text-secondary">{sent}</p>
          <Field label={RESET.code}>
            <Input name="code" value={code} autoComplete="one-time-code" inputMode="numeric" onChange={(e) => setCode(e.target.value)} />
          </Field>
          <PasswordField label={RESET.newPassword} value={password} onChange={setPassword} autoComplete="new-password" />
          <AlertLine message={message} />
          <Button type="submit" disabled={busy || !code || !password} className="w-full">{RESET.save}</Button>
        </form>
      )}
      <p className="mt-4 text-center"><BackLink href="/intrare">{RESET.back}</BackLink></p>
    </AuthFrame>
  );
}
