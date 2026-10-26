"use client";

import React from "react";
import { format } from "date-fns";
import { ro } from "date-fns/locale";
import Button from "@/components/ui/button";
import { formatRon, type PriceBox, type Upsell } from "@/lib/club-public";
import ItemTooltip from "@/app/cursuri/blocks/ItemTooltip";
import WeekendRow from "@/app/cursuri/blocks/WeekendRow";
import { getNextActiveWeekend, type WeekendDate } from "@/utils/date";
import { groupByMonth, type ScheduleWeekend } from "./_schedule";

// The blocks of the Abonament step (mockup form-3steps-v1 option B, step 2):
// the next month's schedule, the price box per audience and the upsell for
// non-members. Prices and the fee come from GET /api/club/public.

const BOX = "border-retro border-line bg-surface-raised px-4 py-3";
const LINK = "text-body-sm link text-accent";

const toWeekendDate = (w: ScheduleWeekend): WeekendDate => ({
  startDate: new Date(`${w.startDate}T00:00:00`),
  endDate: new Date(`${w.endDate}T00:00:00`),
  displayText: "",
  description: w.description,
});

/** "Programul pe următoarea lună", drawn with the rows of the Weekenduri list. Nothing when empty. */
export const ScheduleBox: React.FC<{ weekends: ScheduleWeekend[] }> = ({ weekends }) => {
  if (!weekends.length) return null;
  // Same "next weekend" as the Weekenduri list: the first Curs weekend from today.
  const next = getNextActiveWeekend(weekends.filter((w) => w.state === "curs").map(toWeekendDate));
  return (
    <div>
      <p className="text-label block mb-2 text-secondary">Programul pe următoarea lună</p>
      <div className="border-retro border-line bg-surface">
        {groupByMonth(weekends).map((m) => (
          <div key={m.month}>
            <div className="px-4 py-3 border-b-retro border-line">
              <span className="text-label uppercase text-primary capitalize">
                {format(new Date(`${m.month}-01T00:00:00`), "LLLL yyyy", { locale: ro })}
              </span>
            </div>
            {m.weekends.map((w) => (
              <WeekendRow key={w.startDate + w.state} card={{ weekend: toWeekendDate(w), type: w.state }} nextActiveWeekend={next} />
            ))}
          </div>
        ))}
      </div>
      <a href="/cursuri/program" target="_blank" rel="noopener noreferrer" className={`${LINK} inline-block mt-3`}>
        Calendar complet
      </a>
    </div>
  );
};

/** The member or non-member prices; the member box ends with the annual fee. */
export const PriceBoxView: React.FC<{ box: PriceBox }> = ({ box }) => (
  <div className={BOX}>
    <p className="text-body-sm font-bold text-primary mb-2">{box.title}</p>
    {box.rows.map((row) => (
      <div key={row.label} className="flex items-start justify-between gap-3 py-1 text-body-sm text-primary">
        <span>
          {row.label}
          {row.tooltip && (
            <span className="inline-flex items-center ml-1 translate-y-[2px]">
              <ItemTooltip text={row.tooltip} />
            </span>
          )}
        </span>
        <b className="whitespace-nowrap">{row.price}</b>
      </div>
    ))}
    <a href="/cursuri#preturi" target="_blank" rel="noopener noreferrer" className={`${LINK} inline-block mt-3`}>
      Vezi toate tarifele
    </a>
  </div>
);

/** Non-members: what members pay less, computed from the same prices; the button flips the answer to Da. */
export const UpsellBox: React.FC<{ upsell: Upsell; onBecomeMember: () => void }> = ({ upsell, onBecomeMember }) => (
  <div className={BOX}>
    <p className="text-body-sm font-bold text-primary mb-2">Ca membru plătești mai puțin</p>
    {upsell.rows.map((row) => (
      <div key={row.label} className="flex items-start justify-between gap-3 py-1 text-body-sm text-primary">
        <span>{row.label}</span>
        <span className="whitespace-nowrap">
          <s className="text-secondary">
            {row.nonMemberPrice}
            <span className="sr-only"> RON</span>
          </s> <b>{formatRon(row.memberPrice)}</b>
        </span>
      </div>
    ))}
    {upsell.text && <p className="text-caption text-secondary mt-2 mb-3">{upsell.text}</p>}
    <Button variant="secondary" onClick={onBecomeMember} className="w-full">
      Vreau să devin membru
    </Button>
  </div>
);
