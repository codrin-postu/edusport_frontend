import Link from "@/components/ui/link";
import { cn } from "@/utils/cn";

type LinkProp = { href: string; label: string };

/** The "Vezi toate (n) ›" link under a list cut short. */
export function SeeAllLink({ href, label }: LinkProp) {
  return (
    <Link href={href} tone="plain" className="inline-flex min-h-(--portal-tap) items-center self-start text-(length:--portal-text-14) font-bold text-primary no-underline">
      {label} ›
    </Link>
  );
}

/** `className` lets a page give two side by side headings the same box (Azi: both `portal:min-h-(--portal-tap) portal:items-center`). */
export function SectionHeading({ title, link, className }: { title: string; link?: LinkProp; className?: string }) {
  return (
    <div className={cn("flex items-baseline justify-between gap-3", className)}>
      <h2 className="font-display font-extrabold text-(length:--portal-h2-size)">{title}</h2>
      {link && (
        <Link href={link.href} tone="plain" className="inline-flex min-h-(--portal-tap) items-center text-(length:--portal-text-14) font-bold text-primary no-underline">
          {link.label} ›
        </Link>
      )}
    </div>
  );
}

export function Section({ title, link, children }: { title: string; link?: LinkProp; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <SectionHeading title={title} link={link} />
      {children}
    </div>
  );
}
