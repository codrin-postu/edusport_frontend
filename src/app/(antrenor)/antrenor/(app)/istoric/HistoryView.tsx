"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { AZI, CALENDAR, HISTORY } from "@/lib/portal/copy";
import { addMonths, monthName, weekdayShort } from "@/lib/portal/format";
import { monthTitle } from "@/lib/portal/month-grid";
import type { CoachHistory, CoachHistoryRow } from "@/lib/portal/api-types";
import { DateBlock } from "@/app/_portal/ui/DateBlock";
import { IndividualTag } from "@/app/_portal/ui/IndividualTag";
import { ListRow } from "@/app/_portal/ui/ListRow";
import { LoadError } from "@/app/_portal/ui/LoadError";
import { MonthPicker } from "@/app/_portal/ui/MonthPicker";
import { Column, Columns, PageBody } from "@/app/_portal/ui/PageBody";
import { PageHeader } from "@/app/_portal/ui/PageHeader";
import { ListCard } from "@/app/_portal/ui/PortalCard";
import { Spinner } from "@/app/_portal/ui/Spinner";
import { StatCard } from "@/app/_portal/ui/StatCard";
import { StatusBlock } from "@/app/_portal/ui/StatusBlock";
import { bucharestToday } from "../../_lib/today";
import { ShowMoreButton, useShowMore } from "../../_lib/show-more";
import { usePortal } from "../../_lib/use-portal";
import { presenceHref } from "../../_ui/SessionRow";

function sub(r: CoachHistoryRow): React.ReactNode {
  if (r.kind === "individuala") return <><IndividualTag />{AZI.minutes(r.durationMin ?? 0)}</>;
  if (!r.done) return HISTORY.notDoneSub;
  return r.kind === "inlocuitor" ? HISTORY.standInSub(r.present ?? 0) : HISTORY.presentSub(r.present ?? 0);
}

const href = (r: CoachHistoryRow): string =>
  r.kind === "individuala" ? `/lectie/${encodeURIComponent(r.lessonId ?? "")}` : presenceHref(r, "istoric");

export function HistoryView() {
  const router = useRouter();
  const raw = useSearchParams().get("luna");
  const current = bucharestToday().slice(0, 7);
  // History has no future: a later month in the address falls back to the current one.
  const month = raw !== null && /^\d{4}-(0[1-9]|1[0-2])$/.test(raw) && raw <= current ? raw : current;
  const history = usePortal<CoachHistory>(`coach/history?month=${month}`);
  const go = (n: number) => router.replace(`/istoric?luna=${addMonths(month, n)}`);
  const picker = (
    <MonthPicker title={monthTitle(month)} onPrev={() => go(-1)} onNext={() => go(1)} nextDisabled={month >= current} prevLabel={CALENDAR.prev} nextLabel={CALENDAR.next} />
  );
  const data = history.data;
  const more = useShowMore(month, data?.rows.length ?? 0);
  return (
    <>
      <PageHeader brand title={HISTORY.title} />
      <PageBody>
        <div className="portal:hidden">{picker}</div>
        {history.state === "loading" && <div className="flex justify-center py-6"><Spinner /></div>}
        {history.state === "error" && <LoadError onRetry={history.reload} />}
        {history.state === "ready" && data && (
          <Columns half>
            <Column grow={1} sticky>
              <StatCard
                big={String(data.sessions)}
                label={HISTORY.statLabel(data.sessions, monthName(month).toLowerCase())}
                side={[{ value: String(data.lessons), label: HISTORY.lessons(data.lessons) }, { value: data.hours, label: HISTORY.hours(data.hours) }]}
              />
            </Column>
            <Column grow={2}>
              {/* Desktop: the month picker heads the list it controls, not the page header. */}
              <div className="hidden portal:block">{picker}</div>
              <div ref={more.box} className="flex flex-col gap-3">
              <ListCard>
                {data.rows.slice(0, more.n).map((r) => (
                  <ListRow
                    focusable
                    key={`${r.sessionId ?? r.lessonId ?? r.occurrenceKey}`}
                    href={href(r)}
                    lead={<DateBlock word={weekdayShort(r.date)} day={String(Number(r.date.slice(8)))} time={r.startTime} />}
                    title={r.name}
                    sub={sub(r)}
                    end={<StatusBlock kind={r.kind === "individuala" ? "Individual" : "Grup"} done={r.done} popId={r.sessionId} />}
                  />
                ))}
              </ListCard>
              {more.hasMore && <ShowMoreButton onClick={more.more} />}
              </div>
            </Column>
          </Columns>
        )}
      </PageBody>
    </>
  );
}
