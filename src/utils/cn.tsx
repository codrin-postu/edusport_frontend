import clsx, { ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";
import { twMergeConfig } from "./tw-merge-config.mjs";

// The tailwind-merge config lives in tw-merge-config.mjs (a plain module) so
// it can also be imported directly by scripts/tokens/cn-merge.test.mjs,
// which runs under `node --test` and cannot import this .tsx file.
const twMerge = extendTailwindMerge(twMergeConfig);

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};
