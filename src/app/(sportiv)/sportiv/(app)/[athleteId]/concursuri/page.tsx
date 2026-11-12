"use client";

import { useEffect, useRef, useState } from "react";
import NextLink from "next/link";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import { COMP, COMP_DOWN, HOME } from "@/lib/portal/copy-sportiv";
import { dayMonthYear, pointsText, shortDate } from "@/lib/portal/format";
import { competitionQuery, readQuery, type CompetitionState } from "@/lib/portal/sportiv-competitions";
import { bucharestDay } from "@/lib/portal/sportiv-format";
import { roCount } from "@/lib/ro-plural";
import type { CompetitionSort, SportivCompetitions } from "@/lib/portal/sportiv-types";
import { LoadError } from "@/app/_portal/ui/LoadError";
import { Column, Columns, PageBody } from "@/app/_portal/ui/PageBody";
import { PageHeader } from "@/app/_portal/ui/PageHeader";
import { Pager } from "@/app/_portal/ui/Pager";
import { ListCard, PortalCard } from "@/app/_portal/ui/PortalCard";
import { PlaceBlock } from "@/app/_portal/ui/PlaceBlock";
import { PointsCell } from "@/app/_portal/ui/PointsCell";
import { Spinner } from "@/app/_portal/ui/Spinner";
import { StatCard } from "@/app/_portal/ui/StatCard";
import { useAthletes } from "../../_lib/athletes-context";
import { useSportiv } from "../../_lib/use-sportiv";
import { AccountButton } from "../../_ui/AccountSheet";
import { PerformanceGate } from "./_parts/Gate";

const DEBOUNCE_MS = 300;
const CONTROL = "min-h-11 border border-input-line bg-surface-raised px-3 text-(length:--portal-text-14) text-primary";
const LABEL = "flex flex-col gap-(--portal-gap-6) text-(length:--portal-text-12) font-bold text-muted";

export default function CompetitionsPage() {
  return (
    <PerformanceGate>
      <Competitions />
    </PerformanceGate>
  );
}

/** Concursuri: the category, the records and the paged, searchable list; the filters live in the URL so a reload keeps them. */
function Competitions() {
  const { athleteId } = useParams<{ athleteId: string }>();
  const { current } = useAthletes();
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();
  const state = readQuery(new URLSearchParams(search.toString()));
  const qs = competitionQuery(state);
  const result = useSportiv<SportivCompetitions>(`athletes/${athleteId}/competitions${qs ? `?${qs}` : ""}`);
  const data = result.data;

  const go = (next: CompetitionState) => {
    const q = competitionQuery(next);
    router.replace(q ? `${pathname}?${q}` : pathname, { scroll: false });
  };

  // The search box is local until the typing pauses, then it writes the URL (one request).
  const [text, setText] = useState(state.q);
  const latest = useRef({ state, go });
  latest.current = { state, go };
  useEffect(() => {
    if (text === latest.current.state.q) return;
    const t = setTimeout(() => latest.current.go({ ...latest.current.state, q: text, page: 1 }), DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [text]);

  // The filters stay on screen while a new answer loads, so they use the last seasons seen.
  const [seasons, setSeasons] = useState<string[] | null>(null);
  useEffect(() => {
    if (data?.available) setSeasons(data.seasons);
  }, [data]);

  const sub = current && data?.available ? COMP.sub(current.name, roCount(data.total, "concurs", "concursuri")) : undefined;
  const available = data?.available ? data : null;
  const from = available ? (available.page - 1) * available.pageSize + 1 : 0;
  const to = available ? from + available.rows.length - 1 : 0;

  return (
    <>
      <PageHeader brand noTile title={COMP.title} sub={sub} phoneEnd={<AccountButton />} />
      <PageBody>
        {result.state === "loading" && seasons === null && <div className="flex justify-center py-6"><Spinner /></div>}
        {result.state === "error" && <LoadError onRetry={result.reload} />}
        {result.state === "ready" && data && !data.available && <p className="text-(length:--portal-text-14) text-muted">{COMP_DOWN}</p>}
        {available?.stale && <p className="text-(length:--portal-sub-size) text-muted">{HOME.lastCompetition.stale(shortDate(bucharestDay(available.updatedAt)))}</p>}
        {(available || (seasons !== null && result.state !== "error")) && (
          <Columns half>
            <Column grow={1} sticky>
              {available?.category && (
                <PortalCard as="section" tone="subtle" pad="sheet" className="flex-row flex-wrap items-end justify-between gap-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-(length:--portal-text-12) font-bold text-muted">{COMP.category.title(available.category.seasonLabel)}</span>
                    <span className="font-display font-extrabold text-(length:--portal-h2-size)">{available.category.current}</span>
                  </div>
                  {available.category.previous && (
                    <div className="flex flex-col text-right text-(length:--portal-text-12) text-muted">
                      <span>{COMP.category.since(available.category.previous.sinceYear)}</span>
                      <span>{COMP.category.before(available.category.previous.short)}</span>
                    </div>
                  )}
                </PortalCard>
              )}
              {available && available.records.best !== null && (
                <StatCard
                  big={pointsText(available.records.best)}
                  label={COMP.records.best}
                  side={[
                    { value: String(available.records.podiums), label: COMP.records.podiums },
                    { value: String(available.records.wins), label: COMP.records.wins },
                  ]}
                />
              )}
            </Column>
            <Column grow={2}>
              <div className="flex flex-col gap-3 portal:flex-row portal:flex-wrap portal:items-end">
                <label className={`${LABEL} portal:flex-[2_1_260px]`}>
                  {COMP.search.label}
                  <input
                    type="search"
                    className={CONTROL}
                    placeholder={COMP.search.placeholder}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                  />
                </label>
                <label className={`${LABEL} portal:flex-[1_1_180px]`}>
                  {COMP.seasonLabel}
                  <select className={CONTROL} value={state.season ?? ""} onChange={(e) => go({ ...state, season: e.target.value || null, page: 1 })}>
                    <option value="">{COMP.seasons}</option>
                    {(seasons ?? []).map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </label>
                <label className={`${LABEL} portal:flex-[1_1_180px]`}>
                  {COMP.sortLabel}
                  <select className={CONTROL} value={state.sort} onChange={(e) => go({ ...state, sort: e.target.value as CompetitionSort, page: 1 })}>
                    {(Object.keys(COMP.sort) as CompetitionSort[]).map((k) => <option key={k} value={k}>{COMP.sort[k]}</option>)}
                  </select>
                </label>
              </div>
              {result.state === "loading" && <div className="flex justify-center py-6"><Spinner /></div>}
              {available && (available.rows.length === 0 ? (
                <p className="text-(length:--portal-text-14) text-muted">{COMP.empty}</p>
              ) : (
                <>
                  <ListCard>
                    {available.rows.map((r) => (
                      <NextLink
                        key={r.resultId}
                        href={`/${athleteId}/concursuri/${r.resultId}`}
                        data-comp-row
                        className="flex min-h-(--portal-row-min-h) items-center gap-(--portal-row-gap) py-(--portal-row-pad-y) pl-(--portal-row-pad-x) text-primary no-underline outline-none hover:bg-row-hover hover:no-underline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus"
                      >
                        <PlaceBlock placement={r.placement} />
                        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                          <span className="text-(length:--portal-row-title) font-bold">{r.eventName}</span>
                          <span className="text-(length:--portal-row-sub) text-muted">
                            {[r.date ? dayMonthYear(r.date) : null, r.location, r.categoryShort].filter(Boolean).join(", ")}
                          </span>
                        </span>
                        {r.total !== null && <PointsCell points={pointsText(r.total)} />}
                      </NextLink>
                    ))}
                  </ListCard>
                  <Pager
                    from={from}
                    to={to}
                    total={available.filtered}
                    onPrev={() => go({ ...state, page: state.page - 1 })}
                    onNext={() => go({ ...state, page: state.page + 1 })}
                    prevDisabled={available.page <= 1}
                    nextDisabled={to >= available.filtered}
                  />
                </>
              ))}
            </Column>
          </Columns>
        )}
      </PageBody>
    </>
  );
}
