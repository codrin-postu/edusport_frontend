"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/button";
import { NAV, NOT_FOUND } from "@/lib/portal/copy";
import type { CoachMe } from "@/lib/portal/api-types";
import { portalFeatures } from "@/lib/portal/features";
import { PageBody } from "@/app/_portal/ui/PageBody";
import { PageHeader } from "@/app/_portal/ui/PageHeader";
import { PortalShell } from "@/app/_portal/ui/PortalShell";
import { coachNav } from "./_lib/nav";
import { portalApi } from "@/app/_portal/lib/api";

/** The coach host's 404 in the portal frame: sidebar and bottom nav (without the pages of a switched-off feature), the page header and one button back to Azi. */
export default function AntrenorNotFound() {
  const [me, setMe] = useState<CoachMe | null>(null);
  // No redirect on a 401 here: a signed-out visitor of a wrong address just sees the default nav.
  useEffect(() => {
    void portalApi<CoachMe>("GET", "coach/me", undefined, { stay401: true }).then((r) => {
      if (r.ok) setMe(r.data);
    });
  }, []);
  return (
    <PortalShell nav={coachNav(portalFeatures(me))} account={{ label: NAV.profile, href: "/profil", ariaLabel: NAV.profile }} brandHref="/">
      <PageHeader brand title={NOT_FOUND.title} />
      <PageBody narrow>
        <Button href="/" className="w-full">{NOT_FOUND.back}</Button>
      </PageBody>
    </PortalShell>
  );
}
