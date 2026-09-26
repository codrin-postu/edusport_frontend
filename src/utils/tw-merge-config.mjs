// Shared tailwind-merge config used by cn.tsx, and imported directly by the
// plain-.mjs test suite (scripts/tokens/cn-merge.test.mjs) since a .tsx file
// cannot be imported by `node --test` without a TS loader.
export const twMergeConfig = {
  extend: {
    classGroups: {
      // tailwind-merge doesn't recognize the custom `border-*-retro`
      // border-width utilities (defined via @utility in globals.css), so by
      // default it folds them into the same conflict group as
      // `border-{color}` classes and silently drops one of the two when
      // they're merged together, leaving the element with no border at all.
      // Registering them under the real border-width groups keeps them
      // conflicting only with other width utilities, the way `border-[1.5px]`
      // used to behave before the shape/border token migration.
      "border-w": ["border-retro"],
      "border-w-t": ["border-t-retro"],
      "border-w-b": ["border-b-retro"],
      "border-w-l": ["border-l-retro"],
      "border-w-r": ["border-r-retro"],
      "border-w-x": ["border-x-retro"],
      "border-w-y": ["border-y-retro"],
      // Type role utilities (defined via @utility in globals.css) set font
      // size among other things. tailwind-merge doesn't know them, and its
      // default heuristic treats an unknown `text-*` class as a text COLOR,
      // not a size, which puts them in the wrong conflict group: `text-body
      // text-secondary` would then be seen as two colors and one would be
      // silently dropped. Registering them under the real font-size group
      // keeps them conflicting only with other type roles / font sizes, and
      // lets a color class like `text-secondary` coexist alongside them.
      "font-size": [
        "text-display-lg",
        "text-display",
        "text-heading",
        "text-title",
        "text-body",
        "text-body-sm",
        "text-caption",
        "text-label",
        "text-button",
        "text-athlete-name",
      ],
    },
  },
};
