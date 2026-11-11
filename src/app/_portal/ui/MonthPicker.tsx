"use client";

const STEP =
  "flex size-(--portal-tap) items-center justify-center border-control border-line bg-surface-raised text-(length:--portal-text-18) font-bold text-primary outline-none focus-visible:outline-2 focus-visible:outline-offset-(--focus-offset) focus-visible:outline-focus";

export function MonthPicker({
  title,
  onPrev,
  onNext,
  prevLabel,
  nextLabel,
}: {
  title: string;
  onPrev: () => void;
  onNext: () => void;
  prevLabel: string;
  nextLabel: string;
}) {
  return (
    <div className="flex items-center gap-(--portal-gap-10)">
      <button type="button" aria-label={prevLabel} onClick={onPrev} className={STEP}>‹</button>
      <span className="min-w-(--portal-monthtitle-w) text-center font-display font-extrabold text-(length:--portal-text-20)">{title}</span>
      <button type="button" aria-label={nextLabel} onClick={onNext} className={STEP}>›</button>
    </div>
  );
}
