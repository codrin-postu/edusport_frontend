import { GROUP } from "@/lib/portal/copy";
import { PortalCard } from "@/app/_portal/ui/PortalCard";

type GroupInfoCardProps = { program: string[]; location: string | null; coaches: string[] };

/** The ice info card of a group: program, place, coaches, labels bold. */
export function GroupInfoCard({ program, location, coaches }: GroupInfoCardProps) {
  const line = (label: string, value: string) => (
    <span className="text-(length:--portal-text-14)">
      <b>{label}</b> {value}
    </span>
  );
  return (
    <div data-group-info>
      <PortalCard tone="subtle" pad="card" className="gap-(--portal-gap-6)">
        {program.length > 0 && line(GROUP.program, program.join(", "))}
        {location && line(GROUP.place, location)}
        {coaches.length > 0 && line(GROUP.coaches, coaches.join(", "))}
      </PortalCard>
    </div>
  );
}
