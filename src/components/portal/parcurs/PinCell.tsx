import { dayMonthYear } from "@/lib/portal/format";
import { pinAria, showCount, type PinView } from "@/lib/portal/parcurs";
import { cn } from "@/utils/cn";

/** One pin of a grid: the felt pin (earned in colour with its date, unearned grey), the count when above one. Activating it opens the zoom. */
export function PinCell({ pin, onOpen }: { pin: PinView; onOpen: () => void }) {
  const earned = pin.earnedOn !== null;
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={pinAria(pin)}
      className="group flex min-h-(--portal-tap) min-w-0 cursor-pointer flex-col items-center gap-1.5 bg-transparent p-0 text-center text-primary outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus"
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- a small static PNG; the button carries the label */}
      <img
        src={`/parcurs/${pin.pin}.png`}
        alt=""
        className={cn("h-(--portal-pin-h) w-full max-w-(--portal-pin-w) object-contain transition-transform group-hover:-rotate-3 group-hover:scale-105 motion-reduce:transition-none", earned ? "drop-shadow-sm" : "grayscale-100 opacity-30")}
      />
      {showCount(pin) && <span className="font-display font-extrabold text-(length:--portal-h2-size) leading-none">{pin.count}</span>}
      <span className="min-h-[18px] text-(length:--portal-text-12) text-muted">{pin.earnedOn ? dayMonthYear(pin.earnedOn) : ""}</span>
    </button>
  );
}
