"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { HISTORY } from "@/lib/portal/copy-sportiv";
import { historyWhen } from "@/lib/portal/sportiv-format";
import type { HistoryRow, SportivHistory } from "@/lib/portal/sportiv-types";
import { EndBlock } from "@/app/_portal/ui/EndBlock";
import { ListRow } from "@/app/_portal/ui/ListRow";
import { LoadError } from "@/app/_portal/ui/LoadError";
import { Column, Columns, PageBody } from "@/app/_portal/ui/PageBody";
import { PageHeader } from "@/app/_portal/ui/PageHeader";
import { Pager } from "@/app/_portal/ui/Pager";
import { ListCard } from "@/app/_portal/ui/PortalCard";
import { Spinner } from "@/app/_portal/ui/Spinner";
import { StatCard } from "@/app/_portal/ui/StatCard";
import { useAthletes } from "../../_lib/athletes-context";
import { useSportiv } from "../../_lib/use-sportiv";
import { AccountButton } from "../../_ui/AccountSheet";

const PRESENCES = (n: number) => (n === 1 ? "prezență" : "prezențe");

function subOf(r: HistoryRow): string {
  const what = r.kind === "Individual" ? HISTORY.lesson : r.groupName;
  return [what, HISTORY.coachedBy(r.coaches.join(", "))].filter(Boolean).join(", ");
}

/** Istoric prezență: the season's presences, 20 to a page (the backend pages). */
export default function HistoryPage() {
  const { athleteId } = useParams<{ athleteId: string }>();
  const { current } = useAthletes();
  const [page, setPage] = useState(1);
  const history = useSportiv<SportivHistory>(`athletes/${athleteId}/history?page=${page}`);
  const data = history.data;
  const sub = current && data?.seasonLabel ? HISTORY.sub(current.name, data.seasonLabel) : undefined;
  const from = data ? (data.page - 1) * data.pageSize + 1 : 0;
  const to = data ? from + data.rows.length - 1 : 0;
  return (
    <>
      <PageHeader brand noTile title={HISTORY.title} sub={sub} phoneEnd={<AccountButton />} />
      <PageBody>
        {history.state === "loading" && data === null && <div className="flex justify-center py-6"><Spinner /></div>}
        {history.state === "error" && <LoadError onRetry={history.reload} />}
        {history.state === "ready" && data && (
          <Columns half>
            <Column grow={1} sticky>
              <StatCard
                big={String(data.total)}
                label={PRESENCES(data.total)}
                side={[{ value: String(data.group), label: HISTORY.group }, { value: String(data.individual), label: HISTORY.individual }]}
              />
            </Column>
            <Column grow={2}>
              {data.rows.length === 0 ? (
                <p className="text-(length:--portal-text-14) text-muted">{HISTORY.empty}</p>
              ) : (
                <>
                  <ListCard>
                    {data.rows.map((r, i) => (
                      <ListRow
                        key={`${r.date}:${r.startTime}:${i}`}
                        title={historyWhen(r.date, r.startTime)}
                        sub={subOf(r)}
                        end={<EndBlock kind={r.kind === "Individual" ? "lesson" : "group"}>{r.kind === "Individual" ? HISTORY.kindLesson : HISTORY.kindGroup}</EndBlock>}
                      />
                    ))}
                  </ListCard>
                  <Pager
                    from={from}
                    to={to}
                    total={data.total}
                    onPrev={() => setPage((p) => p - 1)}
                    onNext={() => setPage((p) => p + 1)}
                    prevDisabled={data.page <= 1}
                    nextDisabled={to >= data.total}
                  />
                </>
              )}
            </Column>
          </Columns>
        )}
      </PageBody>
    </>
  );
}
