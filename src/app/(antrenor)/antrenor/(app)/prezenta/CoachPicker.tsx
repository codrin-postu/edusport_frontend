"use client";

import { useState } from "react";
import { PRESENCE, LESSON } from "@/lib/portal/copy";
import Button from "@/components/ui/button";
import Checkbox from "@/components/ui/checkbox";
import IconButton from "@/components/ui/icon-button";
import { Sheet } from "../../_ui/Sheet";

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
  const name = (id: string): string => options.find((o) => o.id === id)?.name ?? "";
  const ids = value.includes(me) ? [me, ...value.filter((id) => id !== me)] : [me, ...value];
  return (
    <div>
      <p className="text-label text-secondary mb-2">{PRESENCE.coach}</p>
      <ul className="border-retro border-line bg-surface-raised divide-y divide-line-subtle">
        {ids.map((id) => (
          <li key={id} className="flex items-center justify-between gap-4 pl-4 min-h-12">
            <span className="text-body text-primary">{id === me ? PRESENCE.coachSelf(name(id)) : name(id)}</span>
            {id !== me && !locked && (
              <IconButton icon="close" label={PRESENCE.removeCoach} onClick={() => onChange(value.filter((v) => v !== id))} />
            )}
          </li>
        ))}
      </ul>
      {!locked && (
        <div className="mt-2">
          <Button variant="secondary" onClick={() => setOpen(true)}>{PRESENCE.addCoaches}</Button>
        </div>
      )}
      <Sheet open={open} onOpenChange={setOpen} title={PRESENCE.coach}>
        <ul className="flex flex-col gap-4 mb-6">
          {options.map((o) => (
            <li key={o.id}>
              <Checkbox
                label={o.id === me ? PRESENCE.coachSelf(o.name) : o.name}
                checked={ids.includes(o.id)}
                disabled={o.id === me}
                onChange={(e) => onChange(e.target.checked ? [...ids, o.id] : ids.filter((v) => v !== o.id))}
              />
            </li>
          ))}
        </ul>
        <Button onClick={() => setOpen(false)} className="w-full">{LESSON.ok}</Button>
      </Sheet>
    </div>
  );
}
