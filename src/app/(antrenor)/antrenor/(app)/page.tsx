"use client";

import Button from "@/components/ui/button";
import { AZI } from "@/lib/portal/copy";
import { dateTile, dayTile, durationText, shortDate } from "@/lib/portal/format";
import type { CoachClassRow, CoachToday } from "@/lib/portal/api-types";
import { usePortal } from "../_lib/use-portal";
import { useMe } from "../_lib/me-context";
import { ListCard } from "../_ui/ListCard";
import { LoadError } from "@/app/_portal/ui/LoadError";
import { Row } from "../_ui/Row";
import { Spinner } from "@/app/_portal/ui/Spinner";

const classHref = (c: CoachClassRow): string =>
  c.sessionId ? `/prezenta?id=${encodeURIComponent(c.sessionId)}` : `/prezenta?occurrence=${encodeURIComponent(c.occurrenceKey ?? "")}`;

function Heading({ children }: { children: string }) {
  return <h2 className="text-label text-secondary mt-6 mb-2">{children}</h2>;
}

export default function AziPage() {
  const me = useMe();
  const today = usePortal<CoachToday>("coach/today");
  if (today.state === "loading") return <div className="py-6 flex justify-center"><Spinner /></div>;
  if (today.state === "error" || !today.data) return <LoadError />;
  const { data } = today;
  const empty = data.groups.length === 0 && data.lessons.length === 0;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <h1 className="text-title text-primary">{AZI.greeting(me?.firstName ?? "")}</h1>
        <p className="text-label text-secondary">{dayTile(data.today)}</p>
      </div>
      {empty ? (
        <p className="text-body text-secondary mt-6">{AZI.none}</p>
      ) : (
        <>
          {data.groups.length > 0 && (
            <>
              <Heading>{AZI.groups}</Heading>
              <ListCard>
                {data.groups.map((c) => (
                  <Row key={c.occurrenceKey ?? c.sessionId ?? c.groupId} href={classHref(c)} time={c.startTime} title={c.groupName} sub={AZI.groupLine(c.children)} label={c.done ? AZI.done : undefined} />
                ))}
              </ListCard>
            </>
          )}
          {data.lessons.length > 0 && (
            <>
              <Heading>{AZI.lessons}</Heading>
              <ListCard>
                {data.lessons.map((l) => (
                  <Row key={l.lessonId} href={`/lectie/${encodeURIComponent(l.lessonId)}`} time={l.startTime} title={l.athleteName} sub={AZI.lessonLine(durationText(l.durationMin))} label={l.done ? AZI.done : undefined} />
                ))}
              </ListCard>
            </>
          )}
        </>
      )}
      <div className="mt-4">
        <Button variant="secondary" href="/lectie/noua">{AZI.addLesson}</Button>
      </div>
      {data.todo.length > 0 && (
        <>
          <Heading>{AZI.todo}</Heading>
          <ListCard>
            {data.todo.map((c) => (
              <Row key={c.occurrenceKey ?? c.groupId + c.date} href={classHref(c)} tile={dateTile(c.date)} title={c.groupName} sub={AZI.todoLine(shortDate(c.date))} />
            ))}
          </ListCard>
        </>
      )}
    </div>
  );
}
