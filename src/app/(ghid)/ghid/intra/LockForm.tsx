"use client";

import { useActionState, useState } from "react";
import Button from "@/components/ui/button";
import { AlertLine } from "@/app/_portal/ui/AuthBits";
import { PasswordField } from "@/app/_portal/ui/PasswordField";
import { enterGhid, type EnterState } from "./actions";

export function LockForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState<EnterState, FormData>(enterGhid, {});
  const [password, setPassword] = useState("");
  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="next" value={next} />
      <PasswordField label="Parolă" name="password" value={password} onChange={setPassword} autoComplete="current-password" />
      <AlertLine message={state.error ?? null} />
      <Button type="submit" disabled={pending || password === ""} className="w-full">Intră</Button>
    </form>
  );
}
