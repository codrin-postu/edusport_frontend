import Button from "@/components/ui/button";
import { NAV, NOT_FOUND } from "@/lib/portal/copy";
import { PageBody } from "@/app/_portal/ui/PageBody";
import { PageHeader } from "@/app/_portal/ui/PageHeader";
import { PortalShell } from "@/app/_portal/ui/PortalShell";
import { coachNav } from "./_lib/nav";

/** The coach host's 404 in the portal frame: sidebar and bottom nav, the page header and one button back to Azi. */
export default function AntrenorNotFound() {
  return (
    <PortalShell nav={coachNav()} account={{ label: NAV.profile, href: "/profil", ariaLabel: NAV.profile }} brandHref="/">
      <PageHeader brand title={NOT_FOUND.title} />
      <PageBody narrow>
        <p className="text-(length:--portal-text-15) text-secondary">{NOT_FOUND.text}</p>
        <Button href="/" className="w-full">{NOT_FOUND.back}</Button>
      </PageBody>
    </PortalShell>
  );
}
