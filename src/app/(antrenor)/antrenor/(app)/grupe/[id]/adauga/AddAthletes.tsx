"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button";
import DatePickerField from "@/components/ui/date-picker-field";
import { ADD_ATHLETE } from "@/lib/portal/copy";
import type { CoachGroupPage, CoachSearchRow, JoinResult } from "@/lib/portal/api-types";
import { portalApi } from "../../../../_lib/api";
import { bucharestToday } from "../../../../_lib/today";
import { useNoAccess, usePortal } from "../../../../_lib/use-portal";
import { AthleteSearch } from "../../../../_ui/AthleteSearch";
import { BackHeader } from "../../../../_ui/BackHeader";
import { ListCard } from "../../../../_ui/ListCard";
import { LoadError } from "../../../../_ui/LoadError";
import { Row } from "../../../../_ui/Row";
import { Spinner } from "../../../../_ui/Spinner";

export function AddAthletes({ id }: { id: string }) {
  const router = useRouter();
  const noAccess = useNoAccess();
  const group = usePortal<CoachGroupPage>(`coach/groups/${encodeURIComponent(id)}`);
  const [picked, setPicked] = useState<CoachSearchRow[]>([]);
  const [from, setFrom] = useState(bucharestToday);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (group.state === "loading") return <div className="py-6 flex justify-center"><Spinner /></div>;
  if (group.data === null) return <LoadError />;
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
    <div className="flex flex-col gap-6">
      <BackHeader href={back} title={ADD_ATHLETE.title(group.data.name)} />
      <AthleteSearch group={id} multiple selected={picked.map((p) => p.athleteId)} onToggle={toggle} />
      <ListCard>
        <Row href={`${back}/sportiv-nou`} title={ADD_ATHLETE.notListed} />
      </ListCard>
      {picked.length > 0 && (
        <>
          <DatePickerField id="add-from" label={ADD_ATHLETE.from} value={from} onChange={setFrom} variant="card" />
          <p role="alert" className="text-body-sm text-accent min-h-6">{message}</p>
          <Button onClick={() => void submit()} disabled={busy || from === ""} className="w-full">{ADD_ATHLETE.submit(picked.length)}</Button>
        </>
      )}
    </div>
  );
}
