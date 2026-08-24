"use client";

import dynamic from "next/dynamic";
import type { EventInput } from "@fullcalendar/core";
import React from "react";

const FullCalendarWrapper = dynamic(() => import("./FullCalendarWrapper"), {
  ssr: false,
  loading: () => (
    <div className="h-96 flex items-center justify-center bg-navy/[0.04] border border-navy/15">
      <p className="text-sm text-navy/50">Se încarcă calendarul...</p>
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
