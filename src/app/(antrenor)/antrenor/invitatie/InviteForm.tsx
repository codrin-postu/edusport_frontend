"use client";

import { useState } from "react";
import Button from "@/components/ui/button";
import { INVITE } from "@/lib/portal/copy";
import { portalApi } from "../_lib/api";
import { AuthFrame } from "../_ui/AuthFrame";
import { AlertLine, GoogleBlock, useFlash } from "../_ui/AuthBits";
import { PasswordField } from "../_ui/PasswordField";

export function InviteForm({ email, google }: { email: string; google: boolean }) {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useFlash();
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setMessage(null);
    const r = await portalApi<{ ok: true }>("POST", "auth/invite/accept", { password }, { stay401: true });
    if (r.ok) {
      window.location.assign("/");
      return;
    }
    setMessage(r.message);
    setPassword("");
    setBusy(false);
  }

  return (
    <AuthFrame title={INVITE.title}>
      <p className="text-body text-primary mb-4">{INVITE.account(email)}</p>
      <form onSubmit={(e) => void submit(e)} className="flex flex-col gap-4">
        <PasswordField label={INVITE.newPassword} value={password} onChange={setPassword} autoComplete="new-password" />
        <AlertLine message={message} />
        <Button type="submit" disabled={busy || !password} className="w-full">{INVITE.save}</Button>
      </form>
      {google && <GoogleBlock href="/api/portal/google/start?invite=1" label={INVITE.google} or={INVITE.or} orFirst />}
    </AuthFrame>
  );
}
