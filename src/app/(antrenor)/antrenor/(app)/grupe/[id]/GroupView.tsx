"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/ui/button";
import { GROUP, GRUPE, PROGRAM } from "@/lib/portal/copy";
import { shortWhen, weekdayShort } from "@/lib/portal/format";
import type { CoachGroupPage } from "@/lib/portal/api-types";
import { portalApi } from "@/app/_portal/lib/api";
import { useNoAccess } from "../../../_lib/use-portal";
import { GroupInfoCard } from "../../../_ui/GroupInfoCard";
import { DateBlock } from "@/app/_portal/ui/DateBlock";
import { ListRow } from "@/app/_portal/ui/ListRow";
import { LoadError } from "@/app/_portal/ui/LoadError";
import { Column, Columns, PageBody } from "@/app/_portal/ui/PageBody";
import { PageHeader } from "@/app/_portal/ui/PageHeader";
import { ListCard, PortalCard } from "@/app/_portal/ui/PortalCard";
import { Segmented } from "@/app/_portal/ui/Segmented";
import { Sheet } from "@/app/_portal/ui/Sheet";
import { Spinner } from "@/app/_portal/ui/Spinner";
import { NewTrainingPopup } from "../../antrenament/NewTrainingPopup";
import { ProgramTab } from "./_program/ProgramTab";
import { memberSub } from "./memberSub";

type Loaded = { key: string; page: CoachGroupPage | null };
type Tab = "members" | "program";

export function GroupView({ id }: { id: string }) {
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const noAccess = useNoAccess();
  const [tick, setTick] = useState(0);
  const key = `${tick}:${id}`;

  useEffect(() => {
    let cancelled = false;
    void portalApi<CoachGroupPage>("GET", `coach/groups/${encodeURIComponent(id)}`).then((r) => {
      if (cancelled) return;
      if (noAccess(r)) return;
      setLoaded({ key, page: r.ok ? r.data : null });
    });
    return () => {
      cancelled = true;
    };
  }, [id, key, noAccess]);

  if (loaded === null || loaded.key !== key) return <PageBody><div className="flex justify-center py-6"><Spinner /></div></PageBody>;
  if (loaded.page === null) return <PageBody><LoadError onRetry={() => setTick((n) => n + 1)} /></PageBody>;
  return loaded.page.own ? <OwnGroup page={loaded.page} /> : <OtherGroup page={loaded.page} />;
}

const BACK = { href: "/grupe", label: GRUPE.title };

function OwnGroup({ page }: { page: Extract<CoachGroupPage, { own: true }> }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const tab: Tab = params.get("tab") === "program" ? "program" : "members";
  const [rev, setRev] = useState(0);
  const members = page.members;
  const presence = page.todayKey ? `/prezenta?occurrence=${encodeURIComponent(page.todayKey)}&from=grupa` : null;
  const setTab = (t: Tab) => router.replace(t === "program" ? `${pathname}?tab=program` : pathname, { scroll: false });
  // One page for both tabs: the info card and the buttons above, then the tabs, then only the tab body changes (no layout jump). On a phone the tabs stick under the compact top bar.
  const tabs = (
    <div data-group-tabs className="sticky top-(--portal-tap) z-raised -mx-(--portal-page-x) bg-surface px-(--portal-page-x) py-2 portal:static portal:mx-0 portal:p-0">
      <Segmented<Tab>
        label={GROUP.members}
        options={[{ value: "members", label: GROUP.tabAthletes(members.length) }, { value: "program", label: GROUP.tabProgram }]}
        value={tab}
        onChange={setTab}
      />
    </div>
  );
  // Same header and side column on both tabs; "+ Adaugă program" lives under "Modifică grupa" (Club groups only: the admin changes Școala programs).
  const addProgram = page.kind === "club" ? `${pathname}?tab=program&nou=1` : null;
  return (
    <>
      <PageHeader back={BACK} title={page.name} />
      <PageBody>
        <Columns>
          <Column grow={1} sticky>
            <GroupInfoCard program={page.program} location={page.location} coaches={page.coaches} />
            <div className="flex flex-col gap-3">
              {presence && <Button href={presence} className="w-full">{GROUP.doPresence}</Button>}
              <Button variant="secondary" href={`/grupe/${encodeURIComponent(page.groupId)}/modifica`} className="w-full">{GROUP.edit}</Button>
              {addProgram && <Button variant="secondary" href={addProgram} className="w-full">{PROGRAM.add}</Button>}
            </div>
          </Column>
          <Column grow={2}>
            {tabs}
            {tab === "program" ? (
              <ProgramTab key={rev} groupId={page.groupId} own addHref={`${pathname}?tab=program&nou=1`} />
            ) : (
              <ListCard>
                {members.map((m) => (
                  <ListRow
                    key={m.athleteId}
                    href={`/sportiv/${encodeURIComponent(m.athleteId)}?grupa=${encodeURIComponent(page.groupId)}`}
                    title={m.name}
                    sub={memberSub(m)}
                  />
                ))}
              </ListCard>
            )}
          </Column>
        </Columns>
      </PageBody>
      {tab === "program" && params.get("nou") && page.kind === "club" && (
        <NewTrainingPopup group={page.groupId} individual={false} onClose={() => router.replace(`${pathname}?tab=program`)} onDone={() => setRev((n) => n + 1)} />
      )}
    </>
  );
}

function OtherGroup({ page }: { page: Extract<CoachGroupPage, { own: false }> }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <PageHeader back={BACK} title={page.name} />
      <PageBody narrow>
        <PortalCard tone="subtle" pad="card">
          <p className="text-(length:--portal-text-14) font-bold">{GROUP.otherCoach}</p>
        </PortalCard>
        <GroupInfoCard program={page.program} location={page.location} coaches={page.coaches} />
        <Segmented<"members">
          label={GROUP.members}
          options={[{ value: "members", label: GROUP.tabAthletes(page.members.length) }]}
          value="members"
          onChange={() => undefined}
        />
        <ListCard>
          {page.members.map((m, i) => (
            <ListRow key={`${i}:${m.name}`} title={m.name} sub={m.age === null ? undefined : GROUP.age(m.age)} end={null} />
          ))}
        </ListCard>
        <div className="flex flex-col gap-3">
          {page.todayKey ? (
            <Button href={`/prezenta?occurrence=${encodeURIComponent(page.todayKey)}&from=grupa`} className="w-full">{GROUP.standIn}</Button>
          ) : page.standIn.length > 0 ? (
            <Button onClick={() => setOpen(true)} className="w-full">{GROUP.standInPresence}</Button>
          ) : null}
          <Button variant="secondary" href={`/grupe/${encodeURIComponent(page.groupId)}/sportiv-nou`} className="w-full">{GROUP.addAthlete}</Button>
        </div>
      </PageBody>
      <Sheet open={open} onOpenChange={setOpen} title={GROUP.standInPresence}>
        <ListCard>
          {page.standIn.map((s) => (
            <ListRow key={s.occurrenceKey} lead={<DateBlock word={weekdayShort(s.date)} big={String(Number(s.date.slice(8)))} />} href={`/prezenta?occurrence=${encodeURIComponent(s.occurrenceKey)}&from=grupa`} title={shortWhen(s.date)} sub={s.startTime} />
          ))}
        </ListCard>
      </Sheet>
    </>
  );
}
