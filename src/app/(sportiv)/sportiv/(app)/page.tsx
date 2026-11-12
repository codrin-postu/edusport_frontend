"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ACCOUNT } from "@/lib/portal/copy-sportiv";
import { logout } from "@/app/_portal/lib/logout";
import { LoadError } from "@/app/_portal/ui/LoadError";
import { ListRow } from "@/app/_portal/ui/ListRow";
import { PageBody } from "@/app/_portal/ui/PageBody";
import { PageHeader, PageSub } from "@/app/_portal/ui/PageHeader";
import { ListCard } from "@/app/_portal/ui/PortalCard";
import { Spinner } from "@/app/_portal/ui/Spinner";
import { useAthletes } from "./_lib/athletes-context";

/** `/`: the picker with two or more athletes; with exactly one it goes straight to that athlete. */
export default function PickerPage() {
  const router = useRouter();
  const { picker, state, reload } = useAthletes();
  const only = state === "ready" && picker.length === 1 ? picker[0].id : null;
  useEffect(() => {
    if (only !== null) router.replace(`/${only}`);
  }, [only, router]);

  if (state === "error") return <PageBody><LoadError onRetry={reload} /></PageBody>;
  if (state === "loading" || only !== null) return <PageBody><div className="flex justify-center py-6"><Spinner /></div></PageBody>;
  return (
    <>
      <PageHeader brand noTile title={ACCOUNT.picker.title} sub={ACCOUNT.picker.sub} />
      <PageBody narrow>
        <PageSub>{ACCOUNT.picker.sub}</PageSub>
        <ListCard>
          {picker.map((a) => (
            <ListRow key={a.id} href={`/${a.id}`} title={a.name} sub={ACCOUNT.row(a.groupName ?? "", a.age)} />
          ))}
        </ListCard>
        <ListCard>
          <ListRow href="/setari" title={ACCOUNT.sheet.settings} />
          <ListRow onClick={() => void logout()} title={ACCOUNT.sheet.logout} />
        </ListCard>
      </PageBody>
    </>
  );
}
