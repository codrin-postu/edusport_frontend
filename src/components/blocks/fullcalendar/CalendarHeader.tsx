import React from "react";
import IconButton from "@/components/ui/icon-button";

interface CalendarHeaderProps {
  title: string;
  todayNum: number;
  isCurrentMonth: boolean;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  canPrev: boolean;
  canNext: boolean;
  viewModeControl?: React.ReactNode;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  title,
  todayNum,
  isCurrentMonth,
  onPrev,
  onNext,
  onToday,
  canPrev,
  canNext,
  viewModeControl,
}) => (
  <div className="fc-custom-header">
    <div className="fc-custom-header-title">{title}</div>
    <div className="fc-custom-header-nav">
      {viewModeControl}
      <div className="fc-custom-header-navbtns">
        <button
          className="fc-custom-today-btn"
          onClick={onToday}
          disabled={isCurrentMonth}
          aria-label="Azi"
        >
          <span className="fc-custom-today-badge">{todayNum}</span>
          <span className="fc-custom-today-label">Azi</span>
        </button>
        <IconButton
          icon="chevron-left"
          onClick={onPrev}
          disabled={!canPrev}
          label="Luna anterioară"
        />
        <IconButton
          icon="chevron-right"
          onClick={onNext}
          disabled={!canNext}
          label="Luna următoare"
        />
      </div>
    </div>
  </div>
);

export default CalendarHeader;
