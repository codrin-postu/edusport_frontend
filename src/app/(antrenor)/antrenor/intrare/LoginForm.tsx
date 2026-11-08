"use client";

import { useState } from "react";
import Button from "@/components/ui/button";
import { Field, Input } from "@/components/ui/form-field";
import { LOGIN } from "@/lib/portal/copy";
import { portalApi } from "../_lib/api";
import { playEntryAndGo } from "../_lib/entry-transition";
import { AuthFrame } from "../_ui/AuthFrame";
import { AlertLine, GoogleBlock, useFlash } from "../_ui/AuthBits";
import { PasswordField } from "../_ui/PasswordField";
import Link from "@/components/ui/link";

export function LoginForm({ google }: { google: boolean }) {
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
      playEntryAndGo("/");
      return;
    }
    setMessage(r.message);
    setPassword("");
    setBusy(false);
  }

  return (
    <AuthFrame title={LOGIN.title}>
      {google && <GoogleBlock href="/api/portal/google/start" label={LOGIN.google} or={LOGIN.or} />}
      <form onSubmit={(e) => void submit(e)} className="flex flex-col gap-4">
        <Field label={LOGIN.email}>
          <Input type="email" name="email" value={email} autoComplete="email" autoCapitalize="none" spellCheck={false} onChange={(e) => setEmail(e.target.value)} />
        </Field>
        <PasswordField label={LOGIN.password} value={password} onChange={setPassword} autoComplete="current-password" />
        <AlertLine message={message} />
        <Button type="submit" disabled={busy || !email || !password} className="w-full">{LOGIN.submit}</Button>
      </form>
      <p className="mt-4 text-center"><Link href="/am-uitat-parola" className="text-body-sm">{LOGIN.forgot}</Link></p>
    </AuthFrame>
  );
}
