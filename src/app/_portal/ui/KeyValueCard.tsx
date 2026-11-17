import { PortalCard } from "@/app/_portal/ui/PortalCard";

export function KeyValueCard({ rows }: { rows: { key: string; value: React.ReactNode }[] }) {
  return (
    <PortalCard className="divide-y divide-line-subtle">
      {rows.map((r) => (
        <div key={r.key} className="flex min-h-(--portal-kv-min-h) items-center justify-between gap-3 px-(--portal-card-pad) py-2">
          <span className="text-(length:--portal-text-14) text-muted">{r.key}</span>
          <span className="text-right text-(length:--portal-text-15) font-bold">{r.value}</span>
        </div>
      ))}
    </PortalCard>
  );
}
