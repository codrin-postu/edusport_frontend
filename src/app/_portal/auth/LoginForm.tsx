"use client";

import { useState } from "react";
import Button from "@/components/ui/button";
import { Field, Input } from "@/components/ui/form-field";
import type { AuthCopy, PORTAL_LABEL } from "@/lib/portal/copy-shared";
import { portalApi } from "@/app/_portal/lib/api";
import { playEntryAndGo } from "@/app/_portal/lib/entry-transition";
import { AuthFrame } from "@/app/_portal/ui/AuthFrame";
import { AlertLine, GoogleBlock, useFlash } from "@/app/_portal/ui/AuthBits";
import { PasswordField } from "@/app/_portal/ui/PasswordField";
import { PortalLink } from "@/app/_portal/ui/PortalLink";

export function LoginForm({ copy, portal, homePath, google }: { copy: AuthCopy; homePath: string; google: boolean; portal?: keyof typeof PORTAL_LABEL }) {
  const LOGIN = copy.login;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useFlash();
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setMessage(null);
    const r = await portalApi<{ ok: true }>("POST", "auth/login", { email, password }, { stay401: true });
    if (r.ok) {
      playEntryAndGo(homePath);
      return;
    }
    setMessage(r.message);
    setPassword("");
    setBusy(false);
  }

  return (
    <AuthFrame portal={portal} title={LOGIN.title}>
      {google && <GoogleBlock href="/api/portal/google/start" label={LOGIN.google} or={LOGIN.or} />}
      <form onSubmit={(e) => void submit(e)} className="flex flex-col gap-4">
        <Field label={LOGIN.email}>
          <Input type="email" name="email" value={email} autoComplete="email" autoCapitalize="none" spellCheck={false} onChange={(e) => setEmail(e.target.value)} />
        </Field>
        <PasswordField label={LOGIN.password} value={password} onChange={setPassword} autoComplete="current-password" />
        <AlertLine message={message} />
        <Button type="submit" disabled={busy || !email || !password} className="w-full">{LOGIN.submit}</Button>
      </form>
      <p className="-mb-2 text-center"><PortalLink href="/forgot-password">{LOGIN.forgot}</PortalLink></p>
    </AuthFrame>
  );
}
