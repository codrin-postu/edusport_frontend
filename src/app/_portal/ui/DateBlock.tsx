import { cn } from "@/utils/cn";

/** Date or time block: ice square, 6px radius (a named round exception), optional red word above the number. */
export function DateBlock({ word, big, dim }: { word?: string; big: string; dim?: boolean }) {
  return (
    <span
      data-date-block
      className="flex h-(--portal-dateblock-h) w-(--portal-dateblock-w) shrink-0 flex-col items-center justify-center rounded-(--portal-dateblock-radius) bg-ice-light"
    >
      {word && (
        <span data-date-word className="text-(length:--portal-dateblock-word) font-bold uppercase text-accent">
          {word}
        </span>
      )}
      <span
        data-date-num
        className={cn(
          "font-display font-extrabold leading-none",
          word ? "text-(length:--portal-dateblock-num)" : "text-(length:--portal-dateblock-num-solo)",
          dim && "text-muted-on-dark",
        )}
      >
        {big}
      </span>
    </span>
  );
}
