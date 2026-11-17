"use client";

import { useState } from "react";
import { portalApi } from "@/app/_portal/lib/api";
import { useToast } from "@/app/_portal/ui/Toast";
import { useNoAccess } from "../../../../_lib/use-portal";

/** One write of a program sheet: a refusal stays in `message` (the sheet stays open); success toasts and calls `onDone`. */
export function useSend(onDone: () => void) {
  const toast = useToast();
  const noAccess = useNoAccess();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function send(method: "PUT" | "POST" | "DELETE", url: string, body: unknown, done: string) {
    setBusy(true);
    setMessage(null);
    const r = await portalApi<unknown>(method, url, body);
    setBusy(false);
    if (noAccess(r)) return;
    if (!r.ok) {
      setMessage(r.message);
      return;
    }
    toast.show(done);
    onDone();
  }
  return { busy, message, send };
}
