import Link from "@/components/ui/link";
import { cn } from "@/utils/cn";

/** The shared Link at portal size: 14px, 44px tall. */
export function PortalLink({ href, children, center }: { href: string; children: React.ReactNode; center?: boolean }) {
  return (
    <Link href={href} className={cn("inline-flex min-h-(--portal-tap) items-center text-(length:--portal-text-14) font-bold", center && "self-center")}>
      {children}
    </Link>
  );
}
