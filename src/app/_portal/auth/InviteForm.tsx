"use client";

import { useState } from "react";
import Button from "@/components/ui/button";
import type { AuthCopy, PORTAL_LABEL } from "@/lib/portal/copy-shared";
import { portalApi } from "@/app/_portal/lib/api";
import { playEntryAndGo } from "@/app/_portal/lib/entry-transition";
import { AuthFrame } from "@/app/_portal/ui/AuthFrame";
import { AlertLine, GoogleBlock, useFlash } from "@/app/_portal/ui/AuthBits";
import { PasswordField } from "@/app/_portal/ui/PasswordField";

export function InviteForm({ copy, portal, homePath, email, google }: { copy: AuthCopy; homePath: string; email: string; google: boolean; portal?: keyof typeof PORTAL_LABEL }) {
  const INVITE = copy.invite;
  const [password, setPassword] = useState("");
  const [message, setMessage] = useFlash();
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setMessage(null);
    const r = await portalApi<{ ok: true; signedIn?: false }>("POST", "auth/invite/accept", { password }, { stay401: true });
    if (r.ok) {
      // Accepted, but this account has no session here: the login page takes over.
      if (r.data.signedIn === false) window.location.assign("/login");
      else playEntryAndGo(homePath);
      return;
    }
    setMessage(r.message);
    setPassword("");
    setBusy(false);
  }

  return (
    <AuthFrame portal={portal} title={INVITE.title}>
      <p className="text-body text-primary mb-4">{INVITE.account.replace("{email}", email)}</p>
      <form onSubmit={(e) => void submit(e)} className="flex flex-col gap-4">
        <input type="email" name="username" autoComplete="username" value={email} readOnly hidden />
        <PasswordField label={INVITE.newPassword} value={password} onChange={setPassword} autoComplete="new-password" />
        <AlertLine message={message} />
        <Button type="submit" disabled={busy || !password} className="w-full">{INVITE.save}</Button>
      </form>
      {google && <GoogleBlock href="/api/portal/google/start?invite=1" label={INVITE.google} or={INVITE.or} orFirst />}
    </AuthFrame>
  );
}
