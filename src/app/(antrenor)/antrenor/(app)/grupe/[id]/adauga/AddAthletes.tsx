"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button";
import { AlertLine } from "@/app/_portal/ui/AuthBits";
import DatePickerField from "@/components/ui/date-picker-field";
import { ADD_ATHLETE } from "@/lib/portal/copy";
import type { CoachGroupPage, CoachSearchRow, JoinResult } from "@/lib/portal/api-types";
import { portalApi } from "@/app/_portal/lib/api";
import { bucharestToday } from "../../../../_lib/today";
import { useNoAccess, usePortal } from "../../../../_lib/use-portal";
import { AthleteSearch } from "../../../../_ui/AthleteSearch";
import { ListRow } from "@/app/_portal/ui/ListRow";
import { LoadError } from "@/app/_portal/ui/LoadError";
import { PageBody } from "@/app/_portal/ui/PageBody";
import { PageHeader } from "@/app/_portal/ui/PageHeader";
import { ListCard } from "@/app/_portal/ui/PortalCard";
import { Spinner } from "@/app/_portal/ui/Spinner";

export function AddAthletes({ id }: { id: string }) {
  const router = useRouter();
  const noAccess = useNoAccess();
  const group = usePortal<CoachGroupPage>(`coach/groups/${encodeURIComponent(id)}`);
  const [picked, setPicked] = useState<CoachSearchRow[]>([]);
  const [from, setFrom] = useState(bucharestToday);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (group.state === "loading") return <PageBody><div className="flex justify-center py-6"><Spinner /></div></PageBody>;
  if (group.data === null) return <PageBody><LoadError onRetry={group.reload} /></PageBody>;
  const back = `/grupe/${encodeURIComponent(id)}`;

  const toggle = (row: CoachSearchRow) =>
    setPicked((p) => (p.some((x) => x.athleteId === row.athleteId) ? p.filter((x) => x.athleteId !== row.athleteId) : [...p, row]));

  async function submit() {
    setBusy(true);
    setMessage(null);
    const r = await portalApi<JoinResult>("POST", `coach/groups/${encodeURIComponent(id)}/members`, { athleteIds: picked.map((p) => p.athleteId), from });
    setBusy(false);
    if (noAccess(r)) return;
    if (!r.ok) {
      setMessage(r.message);
      return;
    }
    router.push(back);
  }

  return (
    <>
      <PageHeader back={{ href: back, label: group.data.name }} title={ADD_ATHLETE.title(group.data.name)} />
      <PageBody narrow={640}>
        <AthleteSearch group={id} multiple selected={picked.map((p) => p.athleteId)} onToggle={toggle} />
        <ListCard>
          <ListRow href={`${back}/sportiv-nou`} title={ADD_ATHLETE.notListed} />
        </ListCard>
        {picked.length > 0 && (
          <>
            <DatePickerField id="add-from" label={ADD_ATHLETE.from} value={from} onChange={setFrom} variant="card" />
            <AlertLine message={message} reserve />
            <Button onClick={() => void submit()} disabled={busy || from === ""} className="w-full">{ADD_ATHLETE.submit(picked.length)}</Button>
          </>
        )}
      </PageBody>
    </>
  );
}
