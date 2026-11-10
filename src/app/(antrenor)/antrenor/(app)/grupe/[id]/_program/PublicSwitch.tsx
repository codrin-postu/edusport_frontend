import Checkbox from "@/components/ui/checkbox";
import { PROGRAM } from "@/lib/portal/copy";

type PublicSwitchProps = { value: boolean; busy: boolean; onChange: (value: boolean) => void };

/** "Arată programul pe site": bold label, muted hint, the square checkbox on the right. */
export function PublicSwitch({ value, busy, onChange }: PublicSwitchProps) {
  return (
    <div className="flex min-h-(--portal-kv-min-h) items-center justify-between gap-3">
      <span className="flex min-w-0 flex-col gap-1">
        <span className="text-(length:--portal-row-title) font-bold">{PROGRAM.publicLabel}</span>
        <span className="text-(length:--portal-row-sub) text-muted">{PROGRAM.publicHint}</span>
      </span>
      <Checkbox label={<span className="sr-only">{PROGRAM.publicLabel}</span>} checked={value} disabled={busy} onChange={(e) => onChange(e.target.checked)} />
    </div>
  );
}
