"use client";

import { useState } from "react";
import { PRESENCE, LESSON, EDIT_GROUP } from "@/lib/portal/copy";
import Button from "@/components/ui/button";
import Checkbox from "@/components/ui/checkbox";
import IconButton from "@/components/ui/icon-button";
import { PortalLink } from "@/app/_portal/ui/PortalLink";
import { Sheet } from "@/app/_portal/ui/Sheet";

type CoachPickerProps = {
  /** The signed in coach's id: always listed, shown as "<name> (tu)", never removable. */
  me: string;
  options: { id: string; name: string }[];
  value: string[];
  onChange: (ids: string[]) => void;
  /** Read only: nothing to add or remove. */
  locked?: boolean;
};

export function CoachPicker({ me, options, value, onChange, locked }: CoachPickerProps) {
  const [open, setOpen] = useState(false);
  // The sheet edits a draft; OK applies it, Renunță or closing drops it.
  const [draft, setDraft] = useState<string[]>([]);
  const name = (id: string): string => options.find((o) => o.id === id)?.name ?? "";
  const known = (id: string): boolean => id === me || options.some((o) => o.id === id);
  // Nothing is listed until the coach is known; an id with no name is not shown.
  const ids = me === "" ? [] : (value.includes(me) ? [me, ...value.filter((id) => id !== me)] : [me, ...value]).filter(known);
  return (
    <div className="flex flex-col gap-(--portal-gap-6)">
      <span className="text-(length:--portal-text-14) font-bold">{PRESENCE.coach}</span>
      <ul className="flex flex-col">
        {ids.map((id) => (
          <li key={id} className="flex min-h-(--checkbox-size) items-center justify-between gap-4">
            <span className="text-(length:--portal-text-15)">{id === me ? PRESENCE.coachSelf(name(id)) : name(id)}</span>
            {id !== me && !locked && (
              <IconButton icon="close" label={PRESENCE.removeCoach(name(id))} onClick={() => onChange(value.filter((v) => v !== id))} />
            )}
          </li>
        ))}
      </ul>
      {!locked && <PortalLink onClick={() => { setDraft(ids); setOpen(true); }}>{PRESENCE.addCoaches}</PortalLink>}
      <Sheet
        open={open}
        onOpenChange={setOpen}
        title={PRESENCE.coach}
        footer={
          <div className="grid grid-cols-2 gap-(--portal-gap-12)">
            <Button variant="secondary" onClick={() => setOpen(false)} className="w-full">{EDIT_GROUP.cancel}</Button>
            <Button onClick={() => { onChange(draft); setOpen(false); }} className="w-full">{LESSON.ok}</Button>
          </div>
        }
      >
        <ul className="flex flex-col gap-4">
          {options.map((o) => (
            <li key={o.id}>
              <Checkbox
                label={o.id === me ? PRESENCE.coachSelf(o.name) : o.name}
                checked={draft.includes(o.id)}
                disabled={o.id === me}
                onChange={(e) => setDraft(e.target.checked ? [...draft, o.id] : draft.filter((v) => v !== o.id))}
              />
            </li>
          ))}
        </ul>
      </Sheet>
    </div>
  );
}
