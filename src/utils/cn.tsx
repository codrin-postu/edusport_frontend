import clsx, { ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// tailwind-merge doesn't recognize the custom `border-*-retro` border-width
// utilities (defined via @utility in globals.css), so by default it folds
// them into the same conflict group as `border-{color}` classes and silently
// drops one of the two when they're merged together, leaving the element
// with no border at all. Registering them under the real border-width
// groups keeps them conflicting only with other width utilities, the way
// `border-[1.5px]` used to behave before the shape/border token migration.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "border-w": ["border-retro"],
      "border-w-t": ["border-t-retro"],
      "border-w-b": ["border-b-retro"],
      "border-w-l": ["border-l-retro"],
      "border-w-r": ["border-r-retro"],
      "border-w-x": ["border-x-retro"],
      "border-w-y": ["border-y-retro"],
    },
  },
});

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};
