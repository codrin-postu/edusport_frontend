import Button from "@/components/ui/button";
import { PAGER } from "@/lib/portal/copy-sportiv";
import { range } from "@/lib/portal/sportiv-format";

/** The page controls under a server paged list: "1 - 20 din 26" between "Înapoi" and "Înainte". */
export function Pager({ from, to, total, onPrev, onNext, prevDisabled, nextDisabled }: {
  from: number;
  to: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  prevDisabled?: boolean;
  nextDisabled?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <Button variant="secondary" onClick={onPrev} disabled={prevDisabled}>{PAGER.prev}</Button>
      <span className="text-(length:--portal-text-14) text-muted">{range(from, to, total)}</span>
      <Button variant="secondary" onClick={onNext} disabled={nextDisabled}>{PAGER.next}</Button>
    </div>
  );
}
