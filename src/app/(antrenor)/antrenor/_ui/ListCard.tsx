import Card from "@/components/ui/card";

/** One card; its rows are split by solid hairlines. */
export function ListCard({ children }: { children: React.ReactNode }) {
  return (
    <Card padding="none" shadow="sm" surface="raised" className="divide-y divide-line-subtle">
      {children}
    </Card>
  );
}
