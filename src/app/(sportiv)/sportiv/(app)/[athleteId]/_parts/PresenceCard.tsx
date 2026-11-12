import { HOME } from "@/lib/portal/copy-sportiv";
import { monthShort } from "@/lib/portal/format";
import { barLevel } from "@/lib/portal/sportiv-bars";
import type { MonthBar } from "@/lib/portal/sportiv-types";
import { StatCard } from "@/app/_portal/ui/StatCard";

const BAR = { past: "bg-white", current: "bg-ice", future: "bg-secondary-on-dark" } as const;

/** The season's presences: the total and one bar per month (a month to come has no count and a floor-high bar). */
export function PresenceCard({ total, months }: { total: number; months: MonthBar[] }) {
  const max = Math.max(0, ...months.map((m) => m.count ?? 0));
  return (
    <StatCard
      big={String(total)}
      label={HOME.presences}
      aside={
        <div aria-label={HOME.months} role="group" className="flex items-end gap-(--portal-bar-gap)">
          {months.map((m) => (
            <div key={m.month} className="flex w-(--portal-bar-col-w) flex-col items-center gap-(--portal-bar-gap)">
              <span className="min-h-3 text-(length:--portal-text-10) text-secondary-on-dark">{m.count ?? ""}</span>
              <div className="flex h-(--portal-bar-h) w-(--portal-bar-w) items-end">
                <span
                  className={`w-(--portal-bar-w) ${BAR[m.state]}`}
                  style={{ height: `max(var(--portal-bar-min), calc(var(--portal-bar-h) * ${barLevel(m.count, max)}))` }}
                />
              </div>
              <span className="text-(length:--portal-text-10) text-nav-on-dark">{monthShort(`${m.month}-01`).toLowerCase()}</span>
            </div>
          ))}
        </div>
      }
    />
  );
}
