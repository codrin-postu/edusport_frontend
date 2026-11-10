"use client";

import Button from "@/components/ui/button";
import { PROFILE } from "@/lib/portal/copy";
import { portalApi } from "@/app/_portal/lib/api";
import { ListRow } from "@/app/_portal/ui/ListRow";
import { PageBody } from "@/app/_portal/ui/PageBody";
import { PageHeader, PageSub } from "@/app/_portal/ui/PageHeader";
import { ListCard } from "@/app/_portal/ui/PortalCard";
import { Spinner } from "@/app/_portal/ui/Spinner";
import { useMe } from "../../_lib/me-context";

export function ProfileView() {
  const me = useMe();
  async function logout() {
    await portalApi("POST", "auth/logout");
    window.location.assign("/login");
  }
  if (me === null) return <PageBody><div className="flex justify-center py-6"><Spinner /></div></PageBody>;
  return (
    <>
      <PageHeader brand title={me.name} sub={PROFILE.role} />
      <PageBody narrow>
        <PageSub>{PROFILE.role}</PageSub>
        <ListCard>
          <ListRow href="/profil/setari" title={PROFILE.settings} sub={PROFILE.settingsSub} />
          <ListRow href="/profil/securitate" title={PROFILE.security} sub={PROFILE.securitySub} />
        </ListCard>
        <Button variant="secondary" onClick={() => void logout()} className="w-full">{PROFILE.logout}</Button>
      </PageBody>
    </>
  );
}
