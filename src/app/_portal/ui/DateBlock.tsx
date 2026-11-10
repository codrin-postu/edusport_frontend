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

/** Date block, one size everywhere: red weekday word, day number and (when the row has one) the hour, stacked in an ice square with a 6px radius (a named round exception). */
export function DateBlock({ word, day, time, dim, tip }: { word: string; day: string; time?: string; dim?: boolean; tip?: string }) {
  const block = (
    <span
      data-date-block
      tabIndex={tip ? 0 : undefined}
      className="flex h-(--portal-dateblock-h) w-(--portal-dateblock-w) shrink-0 flex-col items-center justify-center rounded-(--portal-dateblock-radius) bg-ice-light outline-none focus-visible:outline-2 focus-visible:outline-offset-(--focus-offset) focus-visible:outline-focus"
    >
      <span data-date-word className="text-(length:--portal-dateblock-word) font-bold uppercase leading-tight text-accent">
        {word}
      </span>
      <span data-date-num className={cn("font-display text-(length:--portal-dateblock-num) font-extrabold leading-none", dim && "text-muted-on-dark")}>
        {day}
      </span>
      {time && (
        <span data-date-time className={cn("text-(length:--portal-dateblock-time) font-bold leading-tight", dim && "text-muted-on-dark")}>
          {time}
        </span>
      )}
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
