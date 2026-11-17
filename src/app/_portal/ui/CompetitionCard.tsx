"use client";

import { useState } from "react";
import NextLink from "next/link";
import { CollapseHeader } from "@/app/_portal/ui/CollapseHeader";
import { DateBlock } from "@/app/_portal/ui/DateBlock";
import { PlaceBlock } from "@/app/_portal/ui/PlaceBlock";

type Member = { href: string; name: string; category: string; placement: number | null; points: string };

/** One competition: a collapsible header with date and name, the club's athletes below. */
export function CompetitionCard({
  month,
  day,
  name,
  place,
  count,
  countLabel,
  members,
  defaultOpen,
}: {
  month: string;
  day: string;
  name: string;
  place: string;
  count: number;
  countLabel: string;
  members: Member[];
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(Boolean(defaultOpen));
  return (
    <div data-comp-card className="border-card border-card-line bg-surface-raised shadow-retro">
      <CollapseHeader open={open} onToggle={() => setOpen((o) => !o)} moreRow>
        <span className="flex min-w-0 flex-1 items-center gap-(--portal-row-gap) px-(--portal-row-pad-x) py-(--portal-row-pad-y)">
          <DateBlock word={month} day={day} />
          <span className="flex flex-col gap-0.5">
            <span className="text-(length:--portal-row-title) font-bold">{name}</span>
            <span className="text-(length:--portal-row-sub) text-muted">{place}</span>
          </span>
        </span>
        <span data-comp-count className="flex w-(--portal-endblock-w) shrink-0 flex-col items-center justify-center bg-surface-dark text-white">
          <span className="font-display font-extrabold text-(length:--portal-text-22) leading-none">{count}</span>
          <span className="text-(length:--portal-text-11) font-bold">{countLabel}</span>
        </span>
      </CollapseHeader>
      {open && members.map((m) => (
        <NextLink
          key={m.href + m.name}
          href={m.href}
          data-comp-member
          className="flex min-h-(--portal-member-min-h) items-center gap-3 border-t border-line-subtle px-(--portal-row-pad-x) py-2 text-primary no-underline outline-none hover:no-underline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus"
        >
          <PlaceBlock placement={m.placement} />
          <span className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="text-(length:--portal-row-title) font-bold">{m.name}</span>
            <span className="text-(length:--portal-row-sub) text-muted">{m.category}</span>
          </span>
          <span className="font-display font-extrabold text-(length:--portal-text-16)">{m.points}</span>
        </NextLink>
      ))}
    </div>
  );
}
