import { cn } from "@/utils/cn";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React from "react";

interface ScheduleGroup {
  timeSlot: string;
  schedule: string;
  duration: string;
  courses: string[];
}

interface ScheduleSectionProps {
  scheduleGroups: ScheduleGroup[];
}

const ScheduleSection: React.FC<ScheduleSectionProps> = ({
  scheduleGroups,
}) => {
  return (
    <section className={cn("py-16", "bg-gray-50")}>
      <div
        className={cn(
          "w-full",
          "max-w-content",
          "mx-auto",
          "px-4",
          "md:px-8",
          "lg:px-12",
        )}
      >
        <div className={cn("max-w-6xl", "mx-auto")}>
          <h2
            className={cn(
              "text-3xl",
              "font-bold",
              "text-gray-800",
              "mb-8",
              "text-center",
              "font-['League_Spartan']",
            )}
          >
            Programul Cursurilor
          </h2>
          <div className={cn("space-y-8", "mb-12")}>
            {scheduleGroups.map((group, groupIndex) => (
              <div
                key={groupIndex}
                className={cn(
                  "bg-white",
                  "rounded-lg",
                  "shadow-md",
                  "overflow-hidden",
                )}
              >
                <div
                  className={cn(
                    "bg-edusport-blue",
                    "text-white",
                    "px-6",
                    "py-4",
                  )}
                >
                  <h3 className={cn("text-lg", "font-semibold")}>
                    {group.timeSlot} - {group.schedule}
                  </h3>
                  <p className={cn("text-sm", "text-white/80")}>
                    Durată: {group.duration}
                  </p>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow className={cn("bg-gray-50")}>
                      <TableHead
                        className={cn("font-semibold", "text-gray-700")}
                      >
                        Nivel Grup
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {group.courses.map((course, courseIndex) => (
                      <TableRow
                        key={courseIndex}
                        className={cn(
                          "hover:bg-edusport-blue/5",
                          "transition-colors",
                        )}
                      >
                        <TableCell
                          className={cn("font-medium", "text-edusport-blue")}
                        >
                          {course}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScheduleSection;
