"use client";

import { NAV, PROFILE } from "@/lib/portal/copy";
import { DeviceList } from "@/app/_portal/ui/DeviceList";
import { PageBody } from "@/app/_portal/ui/PageBody";
import { PageHeader } from "@/app/_portal/ui/PageHeader";

export function SecurityView() {
  return (
    <>
      <PageHeader back={{ href: "/profil", label: NAV.profile }} title={PROFILE.security} />
      <PageBody narrow>
        <DeviceList apiBase="coach/me" />
      </PageBody>
    </>
  );
}
