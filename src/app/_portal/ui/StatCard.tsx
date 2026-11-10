import { PortalCard } from "@/app/_portal/ui/PortalCard";

export function StatCard({ big, label, side }: { big: string; label: string; side?: { value: string; label: string }[] }) {
  return (
    <PortalCard as="section" tone="navy" pad="sheet" className="flex-wrap items-end justify-between gap-4 flex-row">
      <div className="flex flex-col gap-2">
        <span data-stat-num className="font-display font-extrabold text-(length:--portal-stat-num) leading-(--portal-leading-stat) text-ice">
          {big}
        </span>
        <span className="text-(length:--portal-text-14) text-secondary-on-dark">{label}</span>
      </div>
      {side && (
        <div className="flex flex-col items-start gap-(--portal-gap-6) text-left">
          {side.map((s) => (
            <span key={s.label} className="text-(length:--portal-text-14) text-nav-on-dark">
              <b className="text-(length:--portal-text-18) font-bold text-white">{s.value}</b> {s.label}
            </span>
          ))}
        </div>
      )}
    </PortalCard>
  );
}
