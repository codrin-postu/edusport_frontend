import Link from "@/components/ui/link";

/** Navy top bar. `children` is the search slot (right side, desktop). */
export function TopBar({ children }: { children?: React.ReactNode }) {
  return (
    <header className="sticky top-0 z-header flex h-(--ghid-bar-h) items-center gap-4 bg-surface-dark px-4 text-primary-on-dark portal:px-6">
      <Link href="/ghid" tone="plain" aria-label="Ghid EduSport" className="flex items-baseline gap-3 font-display text-(length:--portal-text-20) font-extrabold">
        EduSport
        <small className="font-sans text-(length:--portal-text-13) font-semibold text-nav-on-dark">Ghid</small>
      </Link>
      {children}
    </header>
  );
}
