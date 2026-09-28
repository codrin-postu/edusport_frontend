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
        "text-subtitle",
        "text-body-lg",
        "text-body",
        "text-body-sm",
        "text-caption",
        "text-label",
        "text-button",
        "text-athlete-name",
        "text-athlete-watermark",
        "text-athlete-stat",
        "text-branding-xl",
      ],
      // The brand wordmark font class (a plain class in globals.css). Its
      // `text-` prefix would otherwise make tailwind-merge read it as a text
      // colour and drop it next to a real colour class, which turned the
      // footer wordmark into plain Inter.
      "font-family": ["text-branding-font"],
      // Section vertical-rhythm utilities (defined via @utility in
      // globals.css). Registered in their own group so they never get
      // folded into an unrelated conflict group (e.g. a background color)
      // and silently dropped when merged together with other classes.
      "section-py": ["section-compact", "section", "section-feature"],
      // Gutter side-padding utility (defined via @utility in globals.css).
      // Registered in its own group so it conflicts only with itself and
      // survives alongside width/background classes.
      "gutter": ["gutter"],
      // Link utilities (defined via @utility in globals.css). Each gets its
      // own conflict group so `link` and `link-on-dark` can be combined on
      // the same element (`className="link link-on-dark"`), and so neither
      // is folded into an unrelated group (e.g. text color) and dropped.
      "link": ["link"],
      "link-on-dark": ["link-on-dark"],
      "link-footer": ["link-footer"],
      // Layer z-index utilities (defined via @utility in globals.css).
      // tailwind-merge's default `z` group only recognizes numeric/arbitrary
      // z-index values, so an unknown `z-header` etc. falls outside every
      // conflict group and survives alongside a numeric `z-*` class instead
      // of replacing it. Registering them under the real `z` group makes
      // them conflict with `z-10` and each other, the way `z-[100]` used to.
      "z": ["z-base", "z-raised", "z-sticky", "z-header", "z-menu", "z-dialog", "z-popup"],
      // Motion duration utilities (defined via @utility in globals.css).
      // Same problem as `z` above: tailwind-merge's `duration` group only
      // knows numeric/arbitrary values, so `duration-fast` would not
      // conflict with `duration-200` and both would survive a merge.
      "duration": ["duration-fast", "duration-base", "duration-slow", "duration-long"],
    },
  },
};
