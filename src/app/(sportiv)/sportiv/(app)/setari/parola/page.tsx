"use client";

import { useEffect, useState } from "react";
import { SETARI } from "@/lib/portal/copy-sportiv";
import type { SportivMe } from "@/lib/portal/sportiv-types";
import { portalApi } from "@/app/_portal/lib/api";
import { LoadError } from "@/app/_portal/ui/LoadError";
import { PageBody } from "@/app/_portal/ui/PageBody";
import { PageHeader } from "@/app/_portal/ui/PageHeader";
import { PasswordForm } from "@/app/_portal/ui/PasswordForm";
import { Spinner } from "@/app/_portal/ui/Spinner";

/** Parolă: the change form (current and new). A Google only account has no password to change: it is sent to `/forgot-password`. */
export default function PasswordPage() {
  const [me, setMe] = useState<SportivMe | null | undefined>(undefined);
  const [tick, setTick] = useState(0);
  useEffect(() => {
    let cancelled = false;
    void portalApi<SportivMe>("GET", "sportiv/me").then((r) => {
      if (cancelled) return;
      if (r.ok && !r.data.hasPassword) window.location.replace("/forgot-password");
      else setMe(r.ok ? r.data : null);
    });
    return () => {
      cancelled = true;
    };
  }, [tick]);
  return (
    <>
      <PageHeader noTile back={{ href: "/setari", label: SETARI.back }} title={SETARI.security.password.label} />
      <PageBody narrow>
        {me === undefined && <div className="flex justify-center py-6"><Spinner /></div>}
        {me === null && <LoadError onRetry={() => { setMe(undefined); setTick((n) => n + 1); }} />}
        {me && <PasswordForm apiPath="sportiv/me/password" email={me.email} />}
      </PageBody>
    </>
  );
}
