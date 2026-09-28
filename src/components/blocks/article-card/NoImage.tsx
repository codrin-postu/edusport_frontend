import React from "react";
import Icon from "@/components/ui/icon";
import { cn } from "@/utils/cn";

/** Retro placeholder shown when an article/event has no cover image. */
export const NoImage: React.FC<{ className?: string; iconClassName?: string }> = ({
  className,
  iconClassName,
}) => (
  <div
    className={cn(
      "flex items-center justify-center border-retro border-line bg-surface-subtle",
      className,
    )}
    aria-hidden
  >
    <Icon name="image" size="md" className={cn("text-line-subtle", iconClassName)} />
  </div>
);

export default NoImage;
