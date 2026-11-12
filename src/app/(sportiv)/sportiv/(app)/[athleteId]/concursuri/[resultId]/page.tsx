"use client";

import { notFound, useParams } from "next/navigation";
import { COMP, COMP_DOWN, HOME } from "@/lib/portal/copy-sportiv";
import { KIT } from "@/lib/portal/copy-shared";
import { dayMonthYear, pointsText, shortDate } from "@/lib/portal/format";
import { safeOfficialUrl } from "@/lib/portal/sportiv-competitions";
import { bucharestDay } from "@/lib/portal/sportiv-format";
import type { Segment, SportivCompetition } from "@/lib/portal/sportiv-types";
import Link from "@/components/ui/link";
import { LoadError } from "@/app/_portal/ui/LoadError";
import { Column, Columns, PageBody } from "@/app/_portal/ui/PageBody";
import { PageHeader } from "@/app/_portal/ui/PageHeader";
import { PortalCard } from "@/app/_portal/ui/PortalCard";
import { Spinner } from "@/app/_portal/ui/Spinner";
import { useSportiv } from "../../../_lib/use-sportiv";
import { AccountButton } from "../../../_ui/AccountSheet";
import { PerformanceGate } from "../_parts/Gate";

const BACK = { href: "", label: COMP.detail.back.replace("‹ ", "") };
const num = (n: number | null) => (n === null ? "" : pointsText(n));

export default function CompetitionPage() {
  return (
    <PerformanceGate>
      <Competition />
    </PerformanceGate>
  );
}

function SegmentCard({ segment }: { segment: Segment }) {
  const T = COMP.detail.totals;
  const C = COMP.detail.columns;
  return (
    <PortalCard as="section" pad="card" className="gap-3">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="font-display font-extrabold text-(length:--portal-h2-size)">{segment.isShort ? COMP.detail.short : COMP.detail.free}</h2>
        {segment.score !== null && <span className="font-display font-extrabold text-(length:--portal-text-18)">{num(segment.score)}</span>}
      </div>
      <div className="flex flex-wrap gap-x-6 gap-y-1 text-(length:--portal-text-14)">
        {([[T.tes, segment.tes], [T.pcs, segment.pcs], [T.deductions, segment.deductions]] as const).map(([label, value]) => (
          <span key={label}><span className="text-muted">{label}</span> <b>{num(value)}</b></span>
        ))}
      </div>
      {segment.elements.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full min-w-72 border-collapse text-left text-(length:--portal-text-14)">
            <thead>
              <tr className="text-muted">
                <th scope="col" className="py-1 pr-3 font-bold">{C.element}</th>
                <th scope="col" className="px-3 py-1 text-right font-bold">{C.base}</th>
                <th scope="col" className="py-1 pl-3 text-right font-bold">{C.score}</th>
              </tr>
            </thead>
            <tbody>
              {segment.elements.map((e, i) => (
                <tr key={`${e.name}:${i}`} className="border-t border-line-subtle">
                  <td className="py-2 pr-3">{e.name}</td>
                  <td className="px-3 py-2 text-right">{num(e.base)}</td>
                  <td className="py-2 pl-3 text-right">{num(e.score)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </PortalCard>
  );
}

/** One competition of the athlete: placement, total, record and the two programs. A result id that is not the athlete's is the 404 page. */
function Competition() {
  const { athleteId, resultId } = useParams<{ athleteId: string; resultId: string }>();
  const result = useSportiv<SportivCompetition>(`athletes/${athleteId}/competitions/${encodeURIComponent(resultId)}`);
  if (result.state === "error" && result.status === 404) notFound();
  const data = result.data;
  const found = data?.available ? data : null;
  const back = { ...BACK, href: `/${athleteId}/concursuri` };
  const officialUrl = found ? safeOfficialUrl(found.officialUrl) : null;
  const sub = found ? [found.row.date ? dayMonthYear(found.row.date) : null, found.row.location, found.row.category].filter(Boolean).join(", ") : undefined;
  return (
    <>
      <PageHeader brand noTile title={found?.row.eventName ?? COMP.title} back={back} sub={sub} phoneEnd={<AccountButton />} />
      <PageBody>
        {result.state === "loading" && <div className="flex justify-center py-6"><Spinner /></div>}
        {result.state === "error" && <LoadError onRetry={result.reload} />}
        {data && !data.available && <p className="text-(length:--portal-text-14) text-muted">{COMP_DOWN}</p>}
        {found && (
          <>
            {found.stale && <p className="text-(length:--portal-sub-size) text-muted">{HOME.lastCompetition.stale(shortDate(bucharestDay(found.updatedAt)))}</p>}
            <Columns half>
              <Column grow={1} sticky>
                <PortalCard as="section" tone="navy" pad="sheet" className="gap-2">
                  {found.row.placement !== null && found.field !== null && (
                    <span className="font-display font-extrabold text-(length:--portal-h2-size) text-ice">{COMP.detail.place(found.row.placement, found.field)}</span>
                  )}
                  {found.row.total !== null && (
                    <span className="text-(length:--portal-text-14)">{COMP.detail.total(pointsText(found.row.total))} {KIT.points}</span>
                  )}
                  {found.best !== null && <span className="text-(length:--portal-text-14) text-secondary-on-dark">{COMP.detail.best(pointsText(found.best))}</span>}
                </PortalCard>
                {officialUrl && (
                  <Link href={officialUrl} external tone="plain" className="inline-flex min-h-(--portal-tap) items-center self-start text-(length:--portal-text-14) font-bold text-primary">
                    {COMP.detail.official}
                  </Link>
                )}
              </Column>
              <Column grow={2}>
                {found.segments.map((s, i) => <SegmentCard key={`${s.name}:${i}`} segment={s} />)}
              </Column>
            </Columns>
          </>
        )}
      </PageBody>
    </>
  );
}
