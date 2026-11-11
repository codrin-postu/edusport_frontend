import Link from "@/components/ui/link";
import { cn } from "@/utils/cn";

const SIZE = "inline-flex min-h-(--portal-tap) items-center text-(length:--portal-text-14) font-bold";

/** The shared Link at portal size: 14px, 44px tall. With `onClick` and no `href` it is a button that looks the same. */
export function PortalLink({ href, onClick, children, center }: { href?: string; onClick?: () => void; children: React.ReactNode; center?: boolean }) {
  if (href === undefined) {
    return (
      <button type="button" onClick={onClick} className={cn("link cursor-pointer self-start outline-none focus-visible:outline-2 focus-visible:outline-offset-(--focus-offset) focus-visible:outline-focus", SIZE, center && "self-center")}>
        {children}
      </button>
    );
  }
  return (
    <Link href={href} className={cn(SIZE, center && "self-center")}>
      {children}
    </Link>
  );
}
