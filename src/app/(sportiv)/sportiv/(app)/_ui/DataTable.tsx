import { cn } from "@/utils/cn";
import { PortalCard } from "@/app/_portal/ui/PortalCard";

/** The desktop table card: a plain semantic table in the card look; shown from the portal breakpoint up, the phone keeps its list. */
export function DataTable({ columns, children, className }: { columns: string[]; children: React.ReactNode; className?: string }) {
  return (
    <PortalCard className={cn("hidden overflow-x-auto portal:block", className)}>
      <table className="w-full min-w-xl border-collapse text-left text-(length:--portal-text-14)">
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c} scope="col" className="whitespace-nowrap border-b border-line-subtle px-4 py-3 text-(length:--portal-text-12) font-bold uppercase text-muted">{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </PortalCard>
  );
}

export function Td({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <td className={cn("border-b border-line-subtle px-4 py-2.5 align-middle", className)}>{children}</td>;
}
