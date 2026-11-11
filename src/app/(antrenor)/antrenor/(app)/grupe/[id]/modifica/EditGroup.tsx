"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button";
import { EDIT_GROUP } from "@/lib/portal/copy";
import { roCount } from "@/lib/ro-plural";
import type { CoachGroupPage, CoachGroups, CoachMember } from "@/lib/portal/api-types";
import { bucharestToday } from "../../../../_lib/today";
import { usePortal } from "../../../../_lib/use-portal";
import { ListRow } from "@/app/_portal/ui/ListRow";
import { SmallButton } from "@/app/_portal/ui/SmallButton";
import { LoadError } from "@/app/_portal/ui/LoadError";
import { PageBody } from "@/app/_portal/ui/PageBody";
import { PageHeader, PageSub } from "@/app/_portal/ui/PageHeader";
import { ListCard } from "@/app/_portal/ui/PortalCard";
import { Spinner } from "@/app/_portal/ui/Spinner";
import { memberSub } from "../memberSub";
import { MoveSheet } from "./MoveSheet";
import { RemoveSheet } from "./RemoveSheet";

type Open = { kind: "move" | "remove"; athlete: CoachMember } | null;

/** The roster editor of an own group: "Mută" and "Scoate" per child, each through a confirm sheet. */
export function EditGroup({ id }: { id: string }) {
  const router = useRouter();
  const page = usePortal<CoachGroupPage>(`coach/groups/${encodeURIComponent(id)}`);
  const groups = usePortal<CoachGroups>("coach/groups");
  const [open, setOpen] = useState<Open>(null);
  const opener = useRef<HTMLElement | null>(null);
  const focusRow = useRef<number | null>(null);
  const shown = page.data ?? page.previous;
  const own = shown?.own ?? true;
  const back = `/grupe/${encodeURIComponent(id)}`;

  useEffect(() => {
    if (page.state === "ready" && !own) router.replace(back);
  }, [page.state, own, router, back]);

  /** After a saved change the page reloads in place; the focus goes to the same row position (the next child when the row left). */
  useEffect(() => {
    if (page.state !== "ready" || focusRow.current === null) return;
    const buttons = document.querySelectorAll<HTMLElement>("[data-roster-move]");
    buttons[Math.min(focusRow.current, buttons.length - 1)]?.focus();
    focusRow.current = null;
  }, [page.state, page.data]);

  if (page.state === "loading" && !shown) return <PageBody><div className="flex justify-center py-6"><Spinner /></div></PageBody>;
  if (groups.state === "loading" || !own) return <PageBody><div className="flex justify-center py-6"><Spinner /></div></PageBody>;
  if (page.state === "error" || !shown || groups.state === "error" || !groups.data) return <PageBody><LoadError onRetry={() => { page.reload(); groups.reload(); }} /></PageBody>;
  const group = shown;
  const members = group.own ? group.members : [];
  const targets = groups.data.mine.filter((g) => g.groupId !== id).map((g) => ({ groupId: g.groupId, name: g.name }));
  const today = bucharestToday();
  const addHref = `/grupe/${encodeURIComponent(id)}/adauga`;
  const show = (kind: "move" | "remove", athlete: CoachMember, el: HTMLElement) => {
    opener.current = el;
    setOpen({ kind, athlete });
  };
  /** Closing without a change puts the focus back on the button that opened the sheet. */
  const close = () => {
    setOpen(null);
    const el = opener.current;
    setTimeout(() => el?.focus(), 0);
  };
  const done = () => {
    focusRow.current = open ? members.findIndex((m) => m.athleteId === open.athlete.athleteId) : null;
    setOpen(null);
    page.reload();
  };

  return (
    <>
      <PageHeader
        back={{ href: back, label: group.name }}
        title={EDIT_GROUP.title}
        sub={EDIT_GROUP.sub(group.name, roCount(members.length, "sportiv", "sportivi"))}
        actions={
          <>
            <Button variant="secondary" href={addHref}>{EDIT_GROUP.add}</Button>
            <Button href={back}>{EDIT_GROUP.done}</Button>
          </>
        }
      />
      <PageBody narrow>
        <PageSub>{EDIT_GROUP.sub(group.name, roCount(members.length, "sportiv", "sportivi"))}</PageSub>
        <Button variant="secondary" href={addHref} className="w-full portal:hidden">{EDIT_GROUP.add}</Button>
        <ListCard>
          {members.map((m) => (
            <ListRow
              key={m.athleteId}
              title={m.name}
              sub={memberSub(m)}
              end={
                <span className="flex flex-none items-center gap-(--portal-gap-6) pr-(--portal-row-pad-x)">
                  <SmallButton data-roster-move label={EDIT_GROUP.moveFor(m.name)} onClick={(e) => show("move", m, e.currentTarget)}>{EDIT_GROUP.move}</SmallButton>
                  <SmallButton label={EDIT_GROUP.removeFor(m.name)} onClick={(e) => show("remove", m, e.currentTarget)}>{EDIT_GROUP.remove}</SmallButton>
                </span>
              }
            />
          ))}
        </ListCard>
        <Button href={back} className="w-full portal:hidden">{EDIT_GROUP.done}</Button>
      </PageBody>
      {open?.kind === "move" && (
        <MoveSheet groupId={id} groupName={group.name} athlete={open.athlete} targets={targets} today={today} onClose={close} onDone={done} />
      )}
      {open?.kind === "remove" && <RemoveSheet groupId={id} athlete={open.athlete} today={today} onClose={close} onDone={done} />}
    </>
  );
}
