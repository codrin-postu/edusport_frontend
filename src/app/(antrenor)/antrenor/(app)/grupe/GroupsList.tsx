"use client";

import { GRUPE } from "@/lib/portal/copy";
import { weekdayShort } from "@/lib/portal/format";
import { roCount } from "@/lib/ro-plural";
import type { CoachGroups, NextClass } from "@/lib/portal/api-types";
import { usePortal } from "../../_lib/use-portal";
import { DateBlock, EmptyDateBlock } from "@/app/_portal/ui/DateBlock";
import { ListRow } from "@/app/_portal/ui/ListRow";
import { LoadError } from "@/app/_portal/ui/LoadError";
import { Column, Columns, PageBody } from "@/app/_portal/ui/PageBody";
import { PageHeader } from "@/app/_portal/ui/PageHeader";
import { ListCard } from "@/app/_portal/ui/PortalCard";
import { Section } from "@/app/_portal/ui/SectionHeading";
import { Spinner } from "@/app/_portal/ui/Spinner";

const kids = (n: number): string => roCount(n, "copil", "copii");

const lead = (next: NextClass | null) => (next ? <DateBlock word={weekdayShort(next.date)} big={String(Number(next.date.slice(8)))} /> : <EmptyDateBlock label={GRUPE.noNext} />);

export function GroupsList() {
  const groups = usePortal<CoachGroups>("coach/groups");
  if (groups.state === "loading") return <PageBody><div className="flex justify-center py-6"><Spinner /></div></PageBody>;
  if (groups.state === "error" || !groups.data) return <PageBody><LoadError onRetry={groups.reload} /></PageBody>;
  const { mine, others } = groups.data;
  const total = mine.reduce((n, g) => n + g.children, 0);
  return (
    <>
      <PageHeader brand title={GRUPE.title} sub={GRUPE.sub(GRUPE.groupsCount(mine.length), kids(total))} />
      <PageBody>
        <Columns>
          <Column grow={1} basis={380}>
            <Section title={GRUPE.mine}>
              <ListCard>
                {mine.map((g) => (
                  <ListRow key={g.groupId} href={`/grupe/${encodeURIComponent(g.groupId)}`} lead={lead(g.next)} title={g.name} sub={GRUPE.line(g.program.join(", "), g.children)} />
                ))}
              </ListCard>
            </Section>
          </Column>
          {others.length > 0 && (
            <Column grow={1} basis={380}>
              <Section title={GRUPE.others}>
                <ListCard>
                  {others.map((g) => (
                    <ListRow
                      key={g.groupId}
                      href={`/grupe/${encodeURIComponent(g.groupId)}`}
                      lead={lead(g.next)}
                      title={g.name}
                      sub={GRUPE.line(g.program.join(", "), g.children)}
                      extra={g.coaches.length > 0 ? <span className="text-(length:--portal-row-sub) text-muted">{GRUPE.coaches(g.coaches.join(", "))}</span> : undefined}
                    />
                  ))}
                </ListCard>
              </Section>
            </Column>
          )}
        </Columns>
      </PageBody>
    </>
  );
}
