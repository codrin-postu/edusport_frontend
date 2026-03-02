"use client";

import dynamic from "next/dynamic";
import { EventInput } from "@fullcalendar/core";
import React from "react";

const FullCalendarWrapper = dynamic(() => import("./FullCalendarWrapper"), {
  ssr: false,
  loading: () => (
    <div className="h-96 flex items-center justify-center bg-gray-50 rounded-xl border border-gray-200">
      <p className="text-sm text-gray-400">Se încarcă calendarul...</p>
    </div>
  ),
});

interface FullCalendarClientProps {
  events: EventInput[];
  initialDate?: string;
  validRangeStart?: string;
  validRangeEnd?: string;
}

const FullCalendarClient: React.FC<FullCalendarClientProps> = (props) => {
  return <FullCalendarWrapper {...props} />;
};

export default FullCalendarClient;
