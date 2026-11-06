"use client";

import { useSelectedLayoutSegment } from "next/navigation";
import { GroupsList } from "./GroupsList";

/** Phone: the list or the group page. From lg: the list stays on the left, the selected group on the right. */
export default function GrupeLayout({ children }: { children: React.ReactNode }) {
  const selected = useSelectedLayoutSegment();
  return (
    <div className="lg:grid lg:grid-cols-3 lg:gap-8">
      <div className={selected ? "hidden lg:block" : ""}><GroupsList selected={selected} /></div>
      <div className={selected ? "lg:col-span-2" : "hidden lg:block lg:col-span-2"}>{children}</div>
    </div>
  );
}
