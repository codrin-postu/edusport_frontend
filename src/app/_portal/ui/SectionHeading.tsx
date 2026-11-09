import Link from "@/components/ui/link";

type LinkProp = { href: string; label: string };

export function SectionHeading({ title, link }: { title: string; link?: LinkProp }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
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
