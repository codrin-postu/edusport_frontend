import { BottomNav } from "@/app/_portal/ui/BottomNav";
import { Sidebar } from "@/app/_portal/ui/Sidebar";
import { EntryReveal } from "@/app/_portal/ui/EntryReveal";
import { ToastProvider } from "@/app/_portal/ui/Toast";
import type { NavItem } from "@/app/_portal/lib/nav";
import { cn } from "@/utils/cn";

const MENU = "Meniu";

/**
 * The portal frame. Phone: page, then the floating bottom nav. From the desktop breakpoint: navy sidebar
 * beside the page. Both navs render and CSS hides one; there is no width check in JS.
 */
export function PortalShell({
  nav,
  account,
  brandHref,
  phoneNav,
  children,
}: {
  nav: NavItem[];
  account: { label: string; href: string; ariaLabel?: string };
  brandHref: string;
  phoneNav?: boolean;
  children: React.ReactNode;
}) {
  const showPhoneNav = phoneNav !== false;
  return (
    <ToastProvider>
      <EntryReveal />
      <div className="min-h-svh bg-surface text-primary portal:flex">
        <Sidebar items={nav} account={account} label={MENU} brandHref={brandHref} />
        <div className={cn("min-w-0 flex-1", showPhoneNav && "pb-(--portal-nav-safe) portal:pb-0")}>{children}</div>
        {showPhoneNav && <BottomNav items={nav} label={MENU} />}
      </div>
    </ToastProvider>
  );
}
