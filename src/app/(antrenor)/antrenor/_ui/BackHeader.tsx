import { A11Y } from "@/lib/portal/copy";
import IconButton from "@/components/ui/icon-button";

export function BackHeader({ href, title }: { href: string; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <IconButton href={href} icon="chevron-left" label={A11Y.back} className="-ml-3" />
      <h1 className="text-title text-primary">{title}</h1>
    </div>
  );
}
