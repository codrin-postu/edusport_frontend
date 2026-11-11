import { KIT } from "@/lib/portal/copy-shared";

export function PointsCell({ points }: { points: string }) {
  return (
    <span className="flex w-(--portal-points-w) shrink-0 flex-col items-end justify-center pr-(--portal-row-pad-x)">
      <span className="font-display font-extrabold text-(length:--portal-text-18)">{points}</span>
      <span className="text-(length:--portal-text-11) text-muted">{KIT.points}</span>
    </span>
  );
}
