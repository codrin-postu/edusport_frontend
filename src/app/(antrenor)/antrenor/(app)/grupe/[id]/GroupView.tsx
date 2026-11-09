"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import { GROUP } from "@/lib/portal/copy";
import { dateTile } from "@/lib/portal/format";
import type { CoachGroupPage, CoachMember } from "@/lib/portal/api-types";
import { portalApi } from "../../../_lib/api";
import { useNoAccess } from "../../../_lib/use-portal";
import { bucharestToday } from "../../../_lib/today";
import { ListCard } from "../../../_ui/ListCard";
import { LoadError } from "@/app/_portal/ui/LoadError";
import { Row } from "../../../_ui/Row";
import { Segmented } from "../../../_ui/Segmented";
import { Sheet } from "@/app/_portal/ui/Sheet";
import { Spinner } from "@/app/_portal/ui/Spinner";
import { ProgramTab } from "./_program/ProgramTab";

type Loaded = { id: string; page: CoachGroupPage | null };
type Tab = "members" | "program";

const memberSub = (m: CoachMember): string =>
  [m.age === null ? null : GROUP.age(m.age), ...m.alsoIn.map(GROUP.alsoIn)].filter((p): p is string => p !== null).join(", ");

export function GroupView({ id }: { id: string }) {
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const noAccess = useNoAccess();

  useEffect(() => {
    let cancelled = false;
    void portalApi<CoachGroupPage>("GET", `coach/groups/${encodeURIComponent(id)}`).then((r) => {
      if (cancelled) return;
      if (noAccess(r)) return;
      setLoaded({ id, page: r.ok ? r.data : null });
    });
    return () => {
      cancelled = true;
    };
  }, [id, noAccess]);

  if (loaded === null || loaded.id !== id) return <div className="py-6 flex justify-center"><Spinner /></div>;
  if (loaded.page === null) return <LoadError />;
  return loaded.page.own ? <OwnGroup page={loaded.page} /> : <OtherGroup page={loaded.page} />;
}

function OwnGroup({ page }: { page: CoachGroupPage }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const tab: Tab = params.get("tab") === "program" ? "program" : "members";
  const members = page.members ?? [];
  const presence = page.todayKey
    ? `/prezenta?occurrence=${encodeURIComponent(page.todayKey)}`
    : `/prezenta?group=${encodeURIComponent(page.groupId)}&date=${bucharestToday()}`;
  const setTab = (t: Tab) => router.replace(t === "program" ? `${pathname}?tab=program` : pathname, { scroll: false });
  return (
    <div>
      <h1 className="text-title text-primary mb-4">{page.name}</h1>
      <Segmented<Tab>
        options={[{ value: "members", label: GROUP.members }, { value: "program", label: GROUP.program }]}
        value={tab}
        onChange={setTab}
      />
      {tab === "members" ? (
        <div className="mt-6">
          {page.coaches.length > 0 && <p className="text-body-sm text-secondary mb-4">{GROUP.coaches(page.coaches.join(", "))}</p>}
          <Button href={presence} className="w-full">{GROUP.doPresence}</Button>
          <h2 className="text-label text-secondary mt-6 mb-2">{GROUP.membersCount(members.length)}</h2>
          <ListCard>
            {members.map((m) => (
              <Row key={m.athleteId} href={`/sportiv/${encodeURIComponent(m.athleteId)}`} title={m.name} sub={memberSub(m)} label={m.isNew ? GROUP.isNew : undefined} />
            ))}
          </ListCard>
          <div className="mt-4">
            <Button variant="secondary" href={`/grupe/${encodeURIComponent(page.groupId)}/adauga`}>{GROUP.addAthlete}</Button>
          </div>
        </div>
      ) : (
        <div className="mt-6"><ProgramTab groupId={page.groupId} own /></div>
      )}
    </div>
  );
}

function OtherGroup({ page }: { page: CoachGroupPage }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <h1 className="text-title text-primary mb-4">{page.name}</h1>
      <Card surface="subtle" shadow="none" padding="sm" className="mb-4">
        <p className="text-label text-primary">{GROUP.otherCoach}</p>
      </Card>
      <p className="text-body-sm text-secondary">{GROUP.programLine(page.program.join(", "))}</p>
      {page.coaches.length > 0 && <p className="text-body-sm text-secondary mb-6">{GROUP.coaches(page.coaches.join(", "))}</p>}
      <div className="flex flex-col gap-4">
        {page.todayKey ? (
          <Button href={`/prezenta?occurrence=${encodeURIComponent(page.todayKey)}`} className="w-full">{GROUP.standIn}</Button>
        ) : page.standIn.length > 0 ? (
          <Button onClick={() => setOpen(true)} className="w-full">{GROUP.standInPresence}</Button>
        ) : null}
        <Button variant="secondary" href={`/grupe/${encodeURIComponent(page.groupId)}/sportiv-nou`}>{GROUP.addAthlete}</Button>
      </div>
      <Sheet open={open} onOpenChange={setOpen} title={GROUP.standInPresence}>
        <ListCard>
          {page.standIn.map((s) => (
            <Row key={s.occurrenceKey} href={`/prezenta?occurrence=${encodeURIComponent(s.occurrenceKey)}`} tile={dateTile(s.date)} title={s.startTime} />
          ))}
        </ListCard>
      </Sheet>
    </div>
  );
}
