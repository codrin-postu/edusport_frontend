import Icon from "@/components/ui/icon";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/utils/cn";

/** Same ice square with a muted calendar icon, for a row with no date to show (keeps list rows aligned). */
export function EmptyDateBlock({ label }: { label: string }) {
  return (
    <span
      data-date-block
      data-date-empty
      role="img"
      aria-label={label}
      className="flex h-(--portal-dateblock-h) w-(--portal-dateblock-w) shrink-0 items-center justify-center rounded-(--portal-dateblock-radius) bg-ice-light text-muted"
    >
      <Icon name="calendar" size="sm" />
    </span>
  );
}

/** Date or time block: ice square, 6px radius (a named round exception), optional red word above the number. */
export function DateBlock({ word, big, dim, tip }: { word?: string; big: string; dim?: boolean; tip?: string }) {
  const block = (
    <span
      data-date-block
      tabIndex={tip ? 0 : undefined}
      className="flex h-(--portal-dateblock-h) w-(--portal-dateblock-w) shrink-0 flex-col items-center justify-center rounded-(--portal-dateblock-radius) bg-ice-light outline-none focus-visible:outline-2 focus-visible:outline-offset-(--focus-offset) focus-visible:outline-focus"
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
  if (!tip) return block;
  return (
    <Tooltip>
      <TooltipTrigger asChild>{block}</TooltipTrigger>
      <TooltipContent
        side="top"
        className="bg-button-face text-button-face-text text-(length:--portal-text-14) font-bold [&>svg]:bg-button-face [&>svg]:fill-button-face"
      >
        {tip}
      </TooltipContent>
    </Tooltip>
  );
}
