import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// Parallelogram clip - flat top + bottom, both side edges slanting right.
const PILL_CLIP_PATH =
  "polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)";

const pillVariants = cva(
  "inline-flex items-center font-medium leading-none whitespace-nowrap text-white",
  {
    variants: {
      variant: {
        success: "bg-emerald-500",
        error: "bg-red-500",
        info: "bg-sky-500",
        alert: "bg-amber-500",
        generic: "bg-gray-500",
      },
      size: {
        sm: "gap-1 py-0.5 text-[0.65rem]",
        md: "gap-1.5 py-1 text-xs",
        lg: "gap-2 py-1.5 text-sm",
      },
      shape: {
        // Classic rounded pill.
        pill: "rounded-full",
        // Right-leaning parallelogram (clip-path applied via inline style).
        slanted: "",
      },
    },
    compoundVariants: [
      // Tighter horizontal padding for the rounded pill.
      { shape: "pill", size: "sm", class: "px-2" },
      { shape: "pill", size: "md", class: "px-3" },
      { shape: "pill", size: "lg", class: "px-4" },
      // Extra horizontal padding for the slanted shape so text isn't
      // cramped against the angled tips.
      { shape: "slanted", size: "sm", class: "px-3" },
      { shape: "slanted", size: "md", class: "px-4" },
      { shape: "slanted", size: "lg", class: "px-5" },
    ],
    defaultVariants: { variant: "generic", size: "md", shape: "pill" },
  },
);

interface PillProps
  extends React.ComponentProps<"span">,
    VariantProps<typeof pillVariants> {
  /** Optional custom background colour (any CSS colour string). Overrides `variant`. */
  color?: string;
  asChild?: boolean;
}

function Pill({
  className,
  variant,
  size,
  shape = "pill",
  color,
  asChild = false,
  style,
  ...props
}: PillProps) {
  const Comp = asChild ? Slot : "span";
  const mergedStyle: React.CSSProperties = {
    ...(shape === "slanted" ? { clipPath: PILL_CLIP_PATH } : {}),
    ...(color ? { backgroundColor: color } : {}),
    ...style,
  };
  return (
    <Comp
      data-slot="pill"
      className={cn(
        pillVariants({
          variant: color ? undefined : variant,
          size,
          shape,
        }),
        className,
      )}
      style={mergedStyle}
      {...props}
    />
  );
}

export { Pill, pillVariants };
export type { PillProps };
