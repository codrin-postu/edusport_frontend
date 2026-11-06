import type { ReactNode } from "react";
import Card from "@/components/ui/card";
import { PROGRAM } from "@/lib/portal/copy";
import type { CoachProgram, Occurrence, ProgramRow } from "@/lib/portal/api-types";
import { DateRow } from "./DateRow";

type ProgramListProps = {
  data: CoachProgram;
  today: string;
  /** The "Schimbă" slot of a series row. */
  seriesActions?: (row: ProgramRow) => ReactNode;
  /** The slot of a date row's buttons. */
  dateActions?: (o: Occurrence) => ReactNode;
};

/** The series rows, then the month's dates. */
export function ProgramList({ data, today, seriesActions, dateActions }: ProgramListProps) {
  const series = data.program.series;
  return (
    <div className="flex flex-col gap-6">
      {series.length > 0 && (
        <Card surface="raised" shadow="sm" padding="none" className="divide-y divide-line-subtle">
          {series.map((row) => (
            <div key={row.eventId} className="flex items-center justify-between gap-4 p-4">
              <div className="min-w-0">
                <p className="text-body font-semibold text-primary">{row.text}</p>
                <p className="text-body-sm text-secondary">{row.fromText}</p>
              </div>
              {seriesActions?.(row)}
            </div>
          ))}
        </Card>
      )}
      {data.occurrences.length === 0 ? (
        <p className="text-body-sm text-secondary">{PROGRAM.nothingThisMonth}</p>
      ) : (
        <Card as="section" surface="raised" shadow="sm" padding="none">
          <ul className="divide-y divide-line-subtle">
            {data.occurrences.map((o) => (
              <DateRow key={`${o.documentId ?? o.eventId}:${o.date}:${o.startTime}`} occurrence={o} today={today} actions={dateActions?.(o)} />
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
