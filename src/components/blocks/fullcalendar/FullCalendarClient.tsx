"use client";

import dynamic from "next/dynamic";
import type { EventInput } from "@fullcalendar/core";
import React from "react";

const FullCalendarWrapper = dynamic(() => import("./FullCalendarWrapper"), {
  ssr: false,
  loading: () => (
    <div className="h-96 flex items-center justify-center bg-surface-subtle border border-line-subtle">
      <p className="text-sm text-secondary">Se încarcă calendarul...</p>
    </div>
  ),
});

interface FullCalendarClientProps {
  events: EventInput[];
  initialDate?: string;
  validRangeStart?: string;
  validRangeEnd?: string;
  viewModeControl?: React.ReactNode;
  onDatesChange?: (ymd: string) => void;
}

const FullCalendarClient: React.FC<FullCalendarClientProps> = (props) => {
  return <FullCalendarWrapper {...props} />;
};

export default FullCalendarClient;
