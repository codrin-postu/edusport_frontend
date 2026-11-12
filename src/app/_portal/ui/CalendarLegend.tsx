import { KIT } from "@/lib/portal/copy-shared";

export type LegendItem = { bar: string; text: string };

const COACH_ITEMS: LegendItem[] = [
  { bar: "bg-surface-dark", text: KIT.legend.grup },
  { bar: "bg-ice-blue", text: KIT.legend.individual },
  { bar: "bg-cancelled", text: KIT.legend.anulata },
];

/** The coach legend unless a page passes its own items (the sportiv calendar adds "concurs" and says "grupă"). */
export function CalendarLegend({ items = COACH_ITEMS }: { items?: LegendItem[] }) {
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
