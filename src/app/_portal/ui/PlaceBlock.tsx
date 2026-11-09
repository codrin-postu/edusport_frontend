import { KIT } from "@/lib/portal/copy-shared";

/** Placement block: same size and radius as the date block, word "Loc" in muted grey. */
export function PlaceBlock({ placement }: { placement: number | null }) {
  return (
    <span
      data-date-block
      className="flex h-(--portal-dateblock-h) w-(--portal-dateblock-w) shrink-0 flex-col items-center justify-center rounded-(--portal-dateblock-radius) bg-ice-light"
    >
      <span className="text-(length:--portal-text-10) font-bold uppercase tracking-(--portal-tracking-place) text-muted">{KIT.place}</span>
      {placement !== null && (
        <span className="font-display font-extrabold text-(length:--portal-dateblock-num) leading-none">{placement}</span>
      )}
    </span>
  );
}
