import { KIT } from "@/lib/portal/copy-shared";

export function IndividualTag() {
  return (
    <span
      data-individual-tag
      className="mr-(--portal-tag-pad-x) inline-flex items-center bg-tag-ink px-(--portal-tag-pad-x) py-(--portal-tag-pad-y) text-(length:--portal-text-11) font-bold normal-case text-white"
    >
      {KIT.individual}
    </span>
  );
}
