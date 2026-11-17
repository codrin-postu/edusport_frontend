"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Button from "@/components/ui/button";
import { PATH } from "@/lib/portal/copy-sportiv";
import { monthYear, monthYearShort } from "@/lib/portal/sportiv-format";
import type { SportivHome, SportivPath } from "@/lib/portal/sportiv-types";
import { ListCard, PortalCard } from "@/app/_portal/ui/PortalCard";
import { LoadError } from "@/app/_portal/ui/LoadError";
import { Column, Columns, PageBody } from "@/app/_portal/ui/PageBody";
import { PageHeader } from "@/app/_portal/ui/PageHeader";
import { Section } from "@/app/_portal/ui/SectionHeading";
import { GiveDialog } from "@/components/portal/parcurs/GiveDialog";
import { ParcursView } from "@/components/portal/parcurs/ParcursView";
import { Spinner } from "@/app/_portal/ui/Spinner";
import { useAthletes } from "../../_lib/athletes-context";
import { useSportiv } from "../../_lib/use-sportiv";
import { AccountButton } from "../../_ui/AccountSheet";

/** Parcurs: the level now, the next one, the earlier ones and the pins (all time). */
export default function PathPage() {
  const { athleteId } = useParams<{ athleteId: string }>();
  const { current } = useAthletes();
  const path = useSportiv<SportivPath>(`athletes/${athleteId}/path`);
  // The school name is not in the path answer; it is the same Acasă the athlete opens first. Without it the sub line is just absent.
  const home = useSportiv<SportivHome>(`athletes/${athleteId}/home`);
  const school = home.data?.level?.sectionName;
  const data = path.data;
  const [giving, setGiving] = useState(false);
  const pinsLeft = data?.parcurs.pinsLeft ?? 0;
  const given = () => { setGiving(false); path.reload(); };
  return (
    <>
      <PageHeader brand noTile title={PATH.title} sub={current && school ? PATH.sub(current.name, school) : undefined} phoneEnd={<AccountButton />} />
      <PageBody>
        {path.state === "loading" && <div className="flex justify-center py-6"><Spinner /></div>}
        {path.state === "error" && <LoadError onRetry={path.reload} />}
        {data && (
          <>
            {(data.now || data.next) && (
              <Columns half>
                {data.now && (
                  <PortalCard as="section" tone="navy" pad="sheet" className="gap-2">
                    <span className="text-(length:--portal-sub-size) text-secondary-on-dark">{PATH.now.title}</span>
                    <span className="font-display font-extrabold text-(length:--portal-h2-size) text-ice">{data.now.groupName}</span>
                    <span className="text-(length:--portal-text-14) text-secondary-on-dark">
                      {PATH.now.since(monthYear(data.now.since), data.now.location)}
                    </span>
                    {data.now.program && <span className="text-(length:--portal-text-14)">{data.now.program}</span>}
                  </PortalCard>
                )}
                {data.next && (
                  <PortalCard as="section" pad="sheet" className="gap-1">
                    <span className="text-(length:--portal-sub-size) text-muted">{PATH.next.title}</span>
                    <span className="font-display font-extrabold text-(length:--portal-h2-size)">{data.next.groupName}</span>
                    <span className="text-(length:--portal-text-14) text-muted">{PATH.next.hint}</span>
                  </PortalCard>
                )}
              </Columns>
            )}
            <Columns>
              {data.before.length > 0 && (
                <Column>
                  <Section title={PATH.before.title}>
                    <ListCard>
                      {data.before.map((b) => (
                        <div key={`${b.groupName}:${b.from}`} className="flex min-h-(--portal-tap) items-center justify-between gap-3 px-(--portal-card-pad) py-2">
                          <b className="text-(length:--portal-row-title)">{b.groupName}</b>
                          <span className="text-(length:--portal-sub-size) text-muted">{PATH.before.range(monthYearShort(b.from), monthYearShort(b.to))}</span>
                        </div>
                      ))}
                    </ListCard>
                  </Section>
                </Column>
              )}
            </Columns>
            <ParcursView data={data.parcurs} actions={pinsLeft > 0 ? <Button onClick={() => setGiving(true)}>{PATH.give.button(pinsLeft)}</Button> : undefined} />
            <GiveDialog athleteId={athleteId} open={giving} onOpenChange={setGiving} onGiven={given} />
          </>
        )}
      </PageBody>
    </>
  );
}
