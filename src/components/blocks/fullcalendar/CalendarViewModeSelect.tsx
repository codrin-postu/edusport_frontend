"use client";

import React from "react";
import { Select } from "@/components/ui/select";
import type { CalendarMode } from "./types";

const OPTIONS = [
  { value: "month", label: "Lunar" },
  { value: "week", label: "Săptămânal" },
];

/**
 * Lunar / Săptămânal picker for the calendar header, on the shared Select.
 * Fixed compact width (not full-bleed) so it sits inline with the nav buttons.
 */
export const CalendarViewModeSelect: React.FC<{
  value: CalendarMode;
  onChange: (v: CalendarMode) => void;
}> = ({ value, onChange }) => (
  <Select
    value={value}
    onValueChange={(v) => onChange(v as CalendarMode)}
    options={OPTIONS}
    size="sm"
    className="w-auto min-w-[150px]"
  />
);
