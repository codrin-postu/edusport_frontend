"use client";

import Icon from "@/components/ui/icon";
import { PROFILE } from "@/lib/portal/copy";
import { portalApi } from "../../_lib/api";
import { useMe } from "../../_lib/me-context";
import { ListCard } from "../../_ui/ListCard";
import { Row } from "../../_ui/Row";
import { Spinner } from "@/app/_portal/ui/Spinner";

export function ProfileView() {
  const me = useMe();
  async function logout() {
    await portalApi("POST", "auth/logout");
    window.location.assign("/login");
  }
  if (me === null) return <div className="py-6 flex justify-center"><Spinner /></div>;
  return (
    <div>
      <h1 className="text-title text-primary">{me.name}</h1>
      <p className="text-body-sm text-secondary mb-6">{PROFILE.role}</p>
      <ListCard>
        <Row href="/profil/setari" title={PROFILE.settings} />
        <Row href="/profil/securitate" title={PROFILE.security} />
        <button
          type="button"
          onClick={() => void logout()}
          className="w-full flex items-center gap-4 p-4 text-left outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary"
        >
          <span className="min-w-0 flex-1 text-body font-semibold text-primary">{PROFILE.logout}</span>
          <Icon name="chevron-right" />
        </button>
      </ListCard>
    </div>
  );
}
