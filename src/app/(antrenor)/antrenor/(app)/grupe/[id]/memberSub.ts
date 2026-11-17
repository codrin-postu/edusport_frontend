import { GROUP } from "@/lib/portal/copy";
import { dayMonthShort } from "@/lib/portal/format";
import type { CoachMember } from "@/lib/portal/api-types";

/** "11 ani", then "nou", "și în <groups>" and, for a scheduled move or removal, "până pe 12 noi". */
export const memberSub = (m: CoachMember): string =>
  [
    m.age === null ? null : GROUP.age(m.age),
    m.isNew ? GROUP.isNew : null,
    m.alsoIn.length > 0 ? GROUP.alsoIn(m.alsoIn.join(", ")) : null,
    m.leavesOn ? GROUP.until(dayMonthShort(m.leavesOn)) : null,
  ].filter((p): p is string => p !== null).join(", ");
