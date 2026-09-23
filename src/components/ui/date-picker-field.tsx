"use client";

import * as React from "react";
import {
  Button,
  Calendar,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
  DateInput,
  DatePicker,
  DateSegment,
  Dialog,
  Group,
  I18nProvider,
  Label,
  Popover,
} from "react-aria-components";
import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { CalendarDate, parseDate } from "@internationalized/date";
import { cn } from "@/utils/cn";

/**
 * Date field for the public forms, replacing <input type="date">.
 *
 * The native input renders differently on every browser, has no styling hooks,
 * and reaches a birth year only by paging one month at a time. This keeps the
 * two ways people actually enter a date: type six digits into the segments, or
 * open the calendar and pick. The heading toggles a grid of sixteen years,
 * which is the part that matters for a date of birth.
 *
 * Built on React Aria Components so the keyboard handling, screen-reader
 * announcements and locale-aware segment order come from the library rather
 * than from us. The value stays a plain "YYYY-MM-DD" string on the way in and
 * out, so the forms that own it do not learn a new date type.
 */

export type DateFieldVariant = "card" | "navy";

interface DatePickerFieldProps {
  id: string;
  name?: string;
  /**
   * The visible label. Rendered by the picker itself rather than by a sibling
   * FieldLabel: a segmented date input has no single focusable element for
   * `htmlFor` to point at, so React Aria has to own the association.
   */
  label: React.ReactNode;
  /** "YYYY-MM-DD", or "" when empty. */
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  required?: boolean;
  invalid?: boolean;
  variant?: DateFieldVariant;
  className?: string;
  /** Helper line, rendered between the label and the field as in the other inputs. */
  help?: React.ReactNode;
  helpClassName?: string;
}

/** Years per page in the year grid, matching the 4x4 layout. */
const YEARS_PER_PAGE = 16;

const V = {
  card: {
    group:
      "flex items-stretch w-full bg-white border-[1.5px] border-navy text-navy transition-[box-shadow,border-color] data-[focus-within]:border-rust data-[focus-within]:ring-2 data-[focus-within]:ring-rust/25",
    groupInvalid: "border-rust",
    segment: "text-navy data-[placeholder]:text-navy/40 data-[focused]:bg-navy data-[focused]:text-retro-cream",
    literal: "text-navy/35",
    trigger: "border-l-[1.5px] border-navy bg-retro-cream text-navy hover:text-rust",
    popover: "bg-white border-[1.5px] border-navy shadow-[4px_4px_0_rgb(14_26_60_/_0.16)]",
    heading: "text-navy hover:text-rust",
    nav: "text-navy hover:text-rust",
    weekday: "text-navy/45",
    cell:
      "text-navy data-[outside-month]:text-navy/25 data-[hovered]:bg-navy/[0.07] data-[selected]:bg-rust data-[selected]:text-white data-[selected]:font-extrabold data-[today]:shadow-[inset_0_0_0_1.5px_var(--color-mustard)] data-[disabled]:text-navy/20",
    year: "text-navy hover:bg-navy/[0.07]",
    yearOn: "bg-navy text-retro-cream font-extrabold hover:bg-navy",
  },
  navy: {
    group:
      "flex items-stretch w-full bg-white/[0.06] border-[1.5px] border-retro-cream/35 text-retro-cream transition-[box-shadow,border-color] data-[focus-within]:border-mustard data-[focus-within]:ring-2 data-[focus-within]:ring-mustard/25",
    groupInvalid: "border-danger",
    segment:
      "text-retro-cream data-[placeholder]:text-retro-cream/40 data-[focused]:bg-mustard data-[focused]:text-navy",
    literal: "text-retro-cream/35",
    trigger: "border-l-[1.5px] border-retro-cream/35 bg-white/[0.06] text-retro-cream hover:text-mustard",
    popover: "bg-navy border-[1.5px] border-retro-cream/35 shadow-[4px_4px_0_rgb(0_0_0_/_0.3)]",
    heading: "text-retro-cream hover:text-mustard",
    nav: "text-retro-cream hover:text-mustard",
    weekday: "text-retro-cream/45",
    cell:
      "text-retro-cream data-[outside-month]:text-retro-cream/25 data-[hovered]:bg-white/[0.08] data-[selected]:bg-mustard data-[selected]:text-navy data-[selected]:font-extrabold data-[today]:shadow-[inset_0_0_0_1.5px_var(--color-mustard)] data-[disabled]:text-retro-cream/20",
    year: "text-retro-cream hover:bg-white/[0.08]",
    yearOn: "bg-mustard text-navy font-extrabold hover:bg-mustard",
  },
} as const;

/** "YYYY-MM-DD" to a CalendarDate, or null when absent or unparseable. */
function toCalendarDate(value: string): CalendarDate | null {
  if (!value) return null;
  try {
    return parseDate(value.slice(0, 10));
  } catch {
    // A half-typed or malformed stored value must not crash the form.
    return null;
  }
}

/** First year of the page containing `year`, anchored so pages are stable. */
function pageStart(year: number): number {
  return Math.floor(year / YEARS_PER_PAGE) * YEARS_PER_PAGE;
}

export const DatePickerField: React.FC<DatePickerFieldProps> = ({
  id,
  name,
  label,
  value,
  onChange,
  onBlur,
  required,
  invalid,
  variant = "card",
  className,
  help,
  helpClassName,
}) => {
  const v = V[variant];
  const selected = toCalendarDate(value);

  // The calendar's visible month. Owned here because the year grid moves it.
  const [focused, setFocused] = React.useState<CalendarDate | null>(null);
  const [showYears, setShowYears] = React.useState(false);

  const visible = focused ?? selected ?? todayDate();
  const [yearPage, setYearPage] = React.useState(() => pageStart(visible.year));

  // Reopening on a different value should start from that value's year.
  React.useEffect(() => {
    if (showYears) setYearPage(pageStart(visible.year));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showYears]);

  const pickYear = (year: number) => {
    setFocused(visible.set({ year }));
    setShowYears(false);
  };

  return (
    <I18nProvider locale="ro-RO">
      <DatePicker
        value={selected}
        onChange={(d) => onChange(d ? d.toString() : "")}
        onOpenChange={(open) => {
          if (!open) {
            setShowYears(false);
            onBlur?.();
          }
        }}
        isRequired={required}
        isInvalid={invalid}
        shouldCloseOnSelect
        className={cn("w-full", className)}
      >
        <Label
          className={cn(
            "block text-[11px] font-bold uppercase tracking-[0.08em] mb-1.5",
            variant === "navy" ? "text-retro-cream/60" : "text-navy/55",
          )}
        >
          {label}
        </Label>
        {help && <p className={helpClassName}>{help}</p>}
        <Group className={cn(v.group, invalid && v.groupInvalid)}>
          <DateInput
            className="flex flex-1 items-center px-4 py-3 text-sm tabular-nums"
          >
            {(segment) => (
              <DateSegment
                segment={segment}
                className={cn(
                  "rounded-none py-px outline-none",
                  // The dot needs no padding of its own; with it the field
                  // reads as "zz . ll . aaaa" instead of "zz.ll.aaaa".
                  segment.type === "literal" ? cn("px-0", v.literal) : cn("px-[2px]", v.segment),
                )}
              />
            )}
          </DateInput>
          <Button
            // The trigger keeps its dividing border: that line separates the
            // button from the input, it is not decoration on the button.
            className={cn(
              "flex w-[42px] shrink-0 items-center justify-center outline-none transition-colors",
              v.trigger,
            )}
          >
            <CalendarDays className="size-[17px]" aria-hidden />
          </Button>
        </Group>

        <Popover placement="bottom start" offset={6} className={cn("p-3 w-[268px]", v.popover)}>
          <Dialog className="outline-none">
            <Calendar
              focusedValue={visible}
              onFocusChange={setFocused}
              className="w-full"
            >
              <header className="mb-2.5 flex items-center justify-between">
                <Button
                  slot={null}
                  onPress={() => setShowYears((s) => !s)}
                  className={cn(
                    "flex items-center gap-1.5 text-[12.5px] font-extrabold capitalize outline-none transition-colors",
                    v.heading,
                  )}
                >
                  {showYears
                    ? `${yearPage} - ${yearPage + YEARS_PER_PAGE - 1}`
                    : formatMonthYear(visible)}
                  <ChevronDown
                    className={cn("size-3 opacity-55 transition-transform", showYears && "rotate-180")}
                    aria-hidden
                  />
                </Button>
                {/* Borderless navigation: no box, no hover fill, the chevron
                    itself takes the accent colour. The 26px hit area stays. */}
                <div className="flex gap-0.5">
                  {showYears ? (
                    <>
                      <NavButton label="Anii anteriori" tone={v.nav} onPress={() => setYearPage((y) => y - YEARS_PER_PAGE)}>
                        <ChevronLeft className="size-[18px]" aria-hidden />
                      </NavButton>
                      <NavButton label="Anii următori" tone={v.nav} onPress={() => setYearPage((y) => y + YEARS_PER_PAGE)}>
                        <ChevronRight className="size-[18px]" aria-hidden />
                      </NavButton>
                    </>
                  ) : (
                    <>
                      <Button
                        slot="previous"
                        aria-label="Luna anterioară"
                        className={cn(
                          "flex size-[26px] items-center justify-center outline-none transition-colors",
                          v.nav,
                        )}
                      >
                        <ChevronLeft className="size-[18px]" aria-hidden />
                      </Button>
                      <Button
                        slot="next"
                        aria-label="Luna următoare"
                        className={cn(
                          "flex size-[26px] items-center justify-center outline-none transition-colors",
                          v.nav,
                        )}
                      >
                        <ChevronRight className="size-[18px]" aria-hidden />
                      </Button>
                    </>
                  )}
                </div>
              </header>

              {showYears ? (
                <div className="grid grid-cols-4 gap-1">
                  {Array.from({ length: YEARS_PER_PAGE }, (_, i) => yearPage + i).map((year) => (
                    <Button
                      key={year}
                      slot={null}
                      onPress={() => pickYear(year)}
                      className={cn(
                        "py-2.5 text-center text-xs tabular-nums outline-none transition-colors",
                        year === visible.year ? v.yearOn : v.year,
                      )}
                    >
                      {year}
                    </Button>
                  ))}
                </div>
              ) : (
                <CalendarGrid
                  // "short", not the default "narrow": narrow renders Romanian
                  // weekdays as L M M J V S D, where marți and miercuri collide.
                  weekdayStyle="short"
                  className="w-full border-collapse"
                >
                  <CalendarGridHeader>
                    {(day) => (
                      <CalendarHeaderCell
                        className={cn(
                          "pb-1 text-[9.5px] font-extrabold uppercase tracking-wide",
                          v.weekday,
                        )}
                      >
                        {/* ro-RO short weekdays come with a trailing dot. */}
                        {day.replace(/\.$/, "")}
                      </CalendarHeaderCell>
                    )}
                  </CalendarGridHeader>
                  <CalendarGridBody>
                    {(date) => (
                      <CalendarCell
                        date={date}
                        className={cn(
                          "flex aspect-square cursor-pointer items-center justify-center text-xs tabular-nums outline-none transition-colors",
                          v.cell,
                        )}
                      />
                    )}
                  </CalendarGridBody>
                </CalendarGrid>
              )}
            </Calendar>
          </Dialog>
        </Popover>
        {name && <input type="hidden" name={name} value={value} />}
      </DatePicker>
    </I18nProvider>
  );
};

function NavButton({
  label,
  tone,
  onPress,
  children,
}: {
  label: string;
  tone: string;
  onPress: () => void;
  children: React.ReactNode;
}) {
  return (
    <Button
      slot={null}
      aria-label={label}
      onPress={onPress}
      className={cn("flex size-[26px] items-center justify-center outline-none transition-colors", tone)}
    >
      {children}
    </Button>
  );
}

function todayDate(): CalendarDate {
  const d = new Date();
  return new CalendarDate(d.getFullYear(), d.getMonth() + 1, d.getDate());
}

function formatMonthYear(date: CalendarDate): string {
  return new Date(date.year, date.month - 1, 1).toLocaleDateString("ro-RO", {
    month: "long",
    year: "numeric",
  });
}

export default DatePickerField;
