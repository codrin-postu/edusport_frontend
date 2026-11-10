import { AZI, PROGRAM, TRAINING } from "@/lib/portal/copy";
import { capitalize, dayMonthLong, shortDate, weekdayOfDay, weekdayShort } from "@/lib/portal/format";
import type { CoachProgramRule } from "@/lib/portal/api-types";
import { DateBlock, EmptyDateBlock } from "@/app/_portal/ui/DateBlock";
import { ListRow } from "@/app/_portal/ui/ListRow";
import { SmallButton } from "@/app/_portal/ui/SmallButton";

type RulesCardProps = {
  rule: CoachProgramRule;
  /** The row starts after today (a weekday that was split): its start reads "din 19 noi". */
  later?: boolean;
  /** Own Club group: "Schimbă" and "Șterge" show. A Școala group reads only. */
  editable: boolean;
  onChange: (rule: CoachProgramRule) => void;
  onEnd: (rule: CoachProgramRule) => void;
};

/** One weekday of the weekly program: "Marți, 17:30", its line, and the two buttons under the text (so the title and the line keep the row's width at phone size). */
export function RulesCard({ rule, later, editable, onChange, onEnd }: RulesCardProps) {
  const weekday = weekdayOfDay(rule.day);
  const next = rule.nextDate;
  const freq = rule.freq === "monthly" && rule.weekOfMonth ? PROGRAM.monthlyRule(TRAINING.weekWord[rule.weekOfMonth], weekday) : PROGRAM.freqWord[rule.freq];
  return (
    <ListRow
      lead={next ? <DateBlock word={weekdayShort(next)} day={String(Number(next.slice(8)))} time={rule.startTime} /> : <EmptyDateBlock label={AZI.none} />}
      title={PROGRAM.ruleTitle(capitalize(weekday), rule.startTime)}
      sub={PROGRAM.ruleSub(rule.durationMin, freq, later ? shortDate(rule.from) : dayMonthLong(rule.from), rule.untilSeasonEnd ? null : dayMonthLong(rule.to))}
      end={null}
      extra={editable ? (
        <span className="mt-1 flex items-center gap-(--portal-gap-6)">
          <SmallButton label={PROGRAM.changeLabel(weekday)} onClick={() => onChange(rule)}>{PROGRAM.change}</SmallButton>
          <SmallButton label={PROGRAM.endLabel(weekday)} onClick={() => onEnd(rule)}>{PROGRAM.remove}</SmallButton>
        </span>
      ) : undefined}
    />
  );
}
