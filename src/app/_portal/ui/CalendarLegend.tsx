import { KIT } from "@/lib/portal/copy-shared";
import { CAL } from "@/lib/portal/copy-sportiv";

const GRUP = { bar: "bg-surface-dark", text: KIT.legend.grup };
const GRUPA = { bar: "bg-surface-dark", text: CAL.legend.grup };
const INDIVIDUAL = { bar: "bg-ice-blue", text: KIT.legend.individual };
const CONCURS = { bar: "bg-ice", text: KIT.legend.concurs };
const ANULATA = { bar: "bg-cancelled", text: KIT.legend.anulata };

/** `withCompetition` is the sportiv calendar: "grupă" (its own copy) and "concurs" added. */
export function CalendarLegend({ withCompetition }: { withCompetition?: boolean }) {
  const items = withCompetition ? [GRUPA, INDIVIDUAL, CONCURS, ANULATA] : [GRUP, INDIVIDUAL, ANULATA];
  return (
    <div className="flex flex-wrap gap-4">
      {items.map((i) => (
        <span key={i.text} className="flex items-center gap-(--portal-gap-6) text-(length:--portal-text-12) text-muted">
          <span aria-hidden className={`h-(--portal-mark-h) w-3 ${i.bar}`} />
          {i.text}
        </span>
      ))}
    </div>
  );
}
