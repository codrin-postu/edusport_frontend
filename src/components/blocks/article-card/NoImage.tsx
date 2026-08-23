import { Image as ImageIcon } from "lucide-react";
import React from "react";
import { cn } from "@/utils/cn";

/** Retro placeholder shown when an article/event has no cover image. */
export const NoImage: React.FC<{ className?: string; iconClassName?: string }> = ({
  className,
  iconClassName,
}) => (
  <div
    className={cn(
      "flex items-center justify-center border-[1.5px] border-navy bg-navy/[0.03]",
      className,
    )}
    aria-hidden
  >
    <ImageIcon className={cn("text-navy/25", iconClassName ?? "w-8 h-8")} strokeWidth={1.5} />
  </div>
);

export default NoImage;
