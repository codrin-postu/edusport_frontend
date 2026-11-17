"use client";

import { cn } from "@/utils/cn";
import React from "react";
import { WeekendDate, isWeekendInPast, isNextWeekend } from "@/utils/date";
import {
  CALENDAR_GROUP,
  type CalendarGroup,
} from "@/components/blocks/fullcalendar/calendar-colors";
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { renderMarkdown } from "@/utils/markdown";
import { format } from "date-fns";
import { ro } from "date-fns/locale";

// One row of the "Weekenduri Școala Patinaj" list: status square, dates and
// state (Curs / Liber / Curs anulat), the next weekend highlighted, cancelled
// ones struck through with their reason in a tooltip. Lifted out of
// SeasonCalendarViewV2 so the registration form shows the same rows.

export type WeekendKind = "curs" | "liber" | "anulat";

export interface WeekendCardData {
  weekend: WeekendDate;
  type: WeekendKind;
}

const STATE_LABEL: Record<WeekendKind, string> = {
  curs: "Curs",
  liber: "Liber",
  anulat: "Curs anulat",
};

// Same colours as the grid tiles and the legend.
const STATE_GROUP: Record<WeekendKind, CalendarGroup> = {
  curs: "scoala",
  liber: "liber",
  anulat: "anulat",
};

export const WeekendRow: React.FC<{
  card: WeekendCardData;
  nextActiveWeekend: WeekendDate | null;
}> = ({ card, nextActiveWeekend }) => {
  const isPast = isWeekendInPast(card.weekend);
  const isCancelled = card.type === "anulat";
  const isNext = !isCancelled && isNextWeekend(card.weekend, nextActiveWeekend);

  const startLabel = format(card.weekend.startDate, "d MMM", { locale: ro });
  const endLabel =
    card.weekend.startDate.getTime() !== card.weekend.endDate.getTime()
      ? format(card.weekend.endDate, "d MMM", { locale: ro })
      : null;

  const stateLabel = isNext ? "Curs" : STATE_LABEL[card.type];
  const description = card.weekend.description ?? null;
  const hasDescription =
    isCancelled && !!description && description.trim().length > 0;

  const squareColor = CALENDAR_GROUP[STATE_GROUP[card.type]].bg;
  const stateColor = isPast
    ? "text-disabled"
    : isNext
    ? "text-primary font-bold"
    : isCancelled
      ? "text-accent font-medium"
      : card.type === "curs"
        ? "text-secondary"
        : "text-secondary";

  const row = (
    <div
      className={cn(
        "flex items-center px-4 py-3 text-sm border-t border-line-subtle first:border-t-0 transition-colors",
        isNext && "bg-surface-highlight",
        hasDescription && "cursor-help",
      )}
    >
      {/* Status square */}
      <span
        className="w-2.5 h-2.5 flex-shrink-0 mr-3"
        style={{ backgroundColor: squareColor }}
      />

      {/* Date */}
      <span
        className={cn(
          "flex-1 tabular-nums whitespace-nowrap text-primary",
          isCancelled && "line-through text-secondary",
          isPast && "text-disabled",
        )}
      >
        {startLabel}
        {endLabel ? ` - ${endLabel}` : ""}
      </span>

      {/* Status label */}
      <span className={cn("text-xs", stateColor)}>{stateLabel}</span>
    </div>
  );

  if (!hasDescription) return row;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{row}</TooltipTrigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          side="top"
          align="center"
          sideOffset={2}
          collisionPadding={12}
          className="text-caption z-sticky max-w-[320px] bg-surface text-secondary border-retro border-line shadow-retro px-3 py-3 space-y-2 animate-in fade-in-0 zoom-in-95"
        >
          <p className="text-label uppercase text-primary">
            {stateLabel}
          </p>
          <div className="space-y-2 [&_p]:m-0 [&_p]:text-inherit [&_strong]:font-semibold [&_strong]:text-primary">
            {renderMarkdown(description)}
          </div>
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </Tooltip>
  );
};

export default WeekendRow;
