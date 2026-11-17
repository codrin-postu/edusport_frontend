import { KIT } from "@/lib/portal/copy-shared";

const TAG =
  "mr-(--portal-tag-pad-x) inline-flex items-center bg-tag-ink px-(--portal-tag-pad-x) py-(--portal-tag-pad-y) text-(length:--portal-text-11) font-bold normal-case text-white";

export function IndividualTag() {
  return <span data-individual-tag className={TAG}>{KIT.individual}</span>;
}

/** Same tag for a Școala group. */
export function SchoolTag() {
  return <span data-school-tag className={TAG}>{KIT.school}</span>;
}

/** A group session where the coach stands in: same shape, ice blue. */
export function StandInTag() {
  return <span data-stand-in-tag className={TAG.replace("bg-tag-ink", "bg-ice-blue")}>{KIT.standIn}</span>;
}
