import Card from "@/components/ui/card";
import { cn } from "@/utils/cn";

const PAD = {
  none: "",
  card: "p-(--portal-card-pad)",
  sheet: "p-(--portal-sheet-pad)",
  login: "p-(--portal-login-pad)",
} as const;

const TONE = { raised: "raised", subtle: "subtle", navy: "dark" } as const;

type PortalCardProps = {
  children: React.ReactNode;
  pad?: keyof typeof PAD;
  tone?: keyof typeof TONE;
  as?: "div" | "section";
  className?: string;
};

/** The shared Card with the portal paddings: raised white, subtle (info card) or navy. */
export function PortalCard({ children, pad = "none", tone = "raised", as = "div", className }: PortalCardProps) {
  return (
    <Card surface={TONE[tone]} shadow="md" padding="none" as={as} className={cn("flex flex-col", PAD[pad], className)}>
      {children}
    </Card>
  );
}

/** Rows separated by a 1px subtle line. */
export function ListCard({ children }: { children: React.ReactNode }) {
  return <PortalCard className="divide-y divide-line-subtle">{children}</PortalCard>;
}
