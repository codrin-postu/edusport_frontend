import type { JSX } from "react";
import { Spinner } from "../../../../_ui/Spinner";

/** Stub: T16 replaces the body. */
export function ProgramTab({ groupId, own }: { groupId: string; own: boolean }): JSX.Element {
  return <div data-group={groupId} data-own={own} className="py-6 flex justify-center"><Spinner /></div>;
}
