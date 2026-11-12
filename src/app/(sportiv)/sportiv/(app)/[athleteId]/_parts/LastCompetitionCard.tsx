import { COMP_DOWN, HOME } from "@/lib/portal/copy-sportiv";
import { KIT } from "@/lib/portal/copy-shared";
import { pointsText, shortDate } from "@/lib/portal/format";
import { bucharestDay } from "@/lib/portal/sportiv-format";
import type { LastCompetition } from "@/lib/portal/sportiv-types";
import { PortalCard } from "@/app/_portal/ui/PortalCard";
import { SectionHeading } from "@/app/_portal/ui/SectionHeading";

/** The last competition of a performance athlete; `{ available: false }` (the results source is down) says so and nothing else. */
export function LastCompetitionCard({ last, allHref }: { last: LastCompetition; allHref: string }) {
  const L = HOME.lastCompetition;
  return (
    <PortalCard as="section" pad="card" className="gap-3">
      <SectionHeading title={L.title} link={last.available ? { href: allHref, label: L.all.replace(" ›", "") } : undefined} />
      {!last.available ? (
        <p className="text-(length:--portal-text-14) text-muted">{COMP_DOWN}</p>
      ) : (
        <>
          <div className="flex items-center gap-4">
            <div className="flex h-(--portal-place-box) w-(--portal-place-box) shrink-0 flex-col items-center justify-center bg-surface-dark text-ice">
              <span className="text-(length:--portal-text-11) font-semibold text-secondary-on-dark">{L.place}</span>
              <span className="font-display font-extrabold text-(length:--portal-text-36) leading-none">{last.row.placement ?? ""}</span>
            </div>
            <div className="flex min-w-0 flex-col gap-0.5">
              <span className="text-(length:--portal-row-title) font-bold">{last.row.eventName}</span>
              {last.row.placement !== null && last.field !== null ? (
                <span className="text-(length:--portal-sub-size) text-muted">{L.field(last.row.category, last.row.placement, last.field)}</span>
              ) : (
                <span className="text-(length:--portal-sub-size) text-muted">{last.row.category}</span>
              )}
              {last.row.total !== null && (
                <span className="text-(length:--portal-sub-size)">{L.total} <b>{pointsText(last.row.total)}</b> {KIT.points}</span>
              )}
            </div>
          </div>
          {last.stale && <p className="text-(length:--portal-sub-size) text-muted">{L.stale(shortDate(bucharestDay(last.updatedAt)))}</p>}
        </>
      )}
    </PortalCard>
  );
}
