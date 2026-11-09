import { KIT } from "@/lib/portal/copy-shared";

const ITEMS = [
  { bar: "bg-surface-dark", text: KIT.legend.grup },
  { bar: "bg-ice-blue", text: KIT.legend.individual },
  { bar: "bg-cancelled", text: KIT.legend.anulata },
];

export function CalendarLegend() {
  return (
    <div className="flex flex-wrap gap-4">
      {ITEMS.map((i) => (
        <span key={i.text} className="flex items-center gap-(--portal-gap-6) text-(length:--portal-text-12) text-muted">
          <span aria-hidden className={`h-[3px] w-3 ${i.bar}`} />
          {i.text}
        </span>
      ))}
    </div>
  );
}
