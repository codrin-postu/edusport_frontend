import { CountSwap } from "./CountSwap";

export function SaveBar({ count, action }: { count: string; action: React.ReactNode }) {
  return (
    <div
      data-save-bar
      className="flex items-center justify-between gap-3 border-t border-line-subtle bg-surface-raised px-(--portal-savebar-pad-x) py-(--portal-savebar-pad-y)"
    >
      <CountSwap data-save-count className="font-display font-extrabold text-(length:--portal-text-20)">{count}</CountSwap>
      {action}
    </div>
  );
}
