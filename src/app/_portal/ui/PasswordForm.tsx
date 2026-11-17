"use client";

import { useState } from "react";
import Button from "@/components/ui/button";
import { SETTINGS } from "@/lib/portal/copy";
import { portalApi } from "@/app/_portal/lib/api";
import { AlertLine } from "@/app/_portal/ui/AuthBits";
import { PasswordField } from "@/app/_portal/ui/PasswordField";
import { useToast } from "@/app/_portal/ui/Toast";

/** Change of the signed-in account's password: current and new; the e-mail rides along hidden for password managers. */
export function PasswordForm({ apiPath, email }: { apiPath: "coach/me/password" | "sportiv/me/password"; email: string }) {
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
    const r = await portalApi<{ toast: string }>("POST", apiPath, { current, password });
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
