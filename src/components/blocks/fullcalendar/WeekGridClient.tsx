"use client";

import dynamic from "next/dynamic";
import type { EventInput } from "@fullcalendar/core";
import React from "react";

const WeekGridWrapper = dynamic(() => import("./WeekGridWrapper"), {
  ssr: false,
  loading: () => (
    <div className="h-96 flex items-center justify-center bg-surface-subtle">
      <p className="text-body-sm text-secondary">Se încarcă orarul...</p>
    </div>
  ),
});

interface WeekGridClientProps {
  events: EventInput[];
  initialDate?: string;
  validRangeStart?: string;
  validRangeEnd?: string;
  viewModeControl?: React.ReactNode;
  onDatesChange?: (ymd: string) => void;
}

const WeekGridClient: React.FC<WeekGridClientProps> = (props) => {
  return <WeekGridWrapper {...props} />;
};

export default WeekGridClient;
