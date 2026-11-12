"use client";

import { SETARI } from "@/lib/portal/copy-sportiv";
import { DeviceList } from "@/app/_portal/ui/DeviceList";
import { PageBody } from "@/app/_portal/ui/PageBody";
import { PageHeader } from "@/app/_portal/ui/PageHeader";

export default function DevicesPage() {
  return (
    <>
      <PageHeader noTile back={{ href: "/setari", label: SETARI.back }} title={SETARI.security.devices.label} />
      <PageBody narrow>
        <DeviceList apiBase="sportiv/me" />
      </PageBody>
    </>
  );
}
