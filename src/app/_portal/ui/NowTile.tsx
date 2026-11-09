export function NowTile({ month, day, time, weekday, label }: { month: string; day: string; time: string; weekday: string; label: string }) {
  return (
    <div role="group" aria-label={label} className="flex shrink-0 items-stretch shadow-retro">
      <span className="flex w-(--portal-typeblock-w) flex-col items-center justify-center gap-0.5 bg-surface-dark py-2">
        <span className="text-(length:--portal-text-11) font-bold uppercase tracking-(--portal-tracking-month) text-ice">{month}</span>
        <span className="font-display font-extrabold text-(length:--portal-nowtile-day) leading-none text-white">{day}</span>
      </span>
      <span className="flex flex-col justify-center gap-1 border-card border-l-0 border-card-line bg-surface-raised px-(--portal-row-pad-x) py-2">
        <span className="font-display font-extrabold text-(length:--portal-nowtile-time) leading-none">{time}</span>
        <span className="text-(length:--portal-text-13) text-muted">{weekday}</span>
      </span>
    </div>
  );
}
