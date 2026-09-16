// ---------------------------------------------------------------------------
// Merging CMS promo overrides into the static menu.
//
// The menu STRUCTURE (labels, hrefs, order, dropdowns) lives in navItems.ts and
// is never editable from the CMS. Only two decorative fields of the dropdown
// promo card are: its description and its image. This file does the merge, and
// nothing else, so it stays pure and trivially checkable.
//
// The static values are the fallback, always. An override only ever replaces a
// value when it actually carries one: a missing, null or blank field leaves the
// static value in place rather than blanking the menu, and an override whose
// key matches no menu item is ignored.
// ---------------------------------------------------------------------------

import type { NavItem } from "./navItems";

/**
 * One CMS entry, already flattened from the Strapi payload. `image` is the
 * resolved image URL (see src/lib/strapi-navigation.ts), not the raw media
 * object, so this function stays free of Strapi shapes.
 */
export interface NavPromoOverride {
  key: string;
  description?: string | null;
  image?: string | null;
}

/** Trimmed value, or undefined when there is nothing usable. */
function usable(value: string | null | undefined): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed === "" ? undefined : trimmed;
}

/**
 * Return the menu with CMS promo overrides applied.
 *
 * Never mutates the input. Items with no matching override, and items whose
 * override carries nothing usable, are returned as they are.
 *
 * A description only lands on an item that already has a promo card, because
 * the card's title comes from the static definition; an item without one has
 * no card to describe.
 */
export function mergeNavOverrides(
  items: NavItem[],
  overrides: NavPromoOverride[] | null | undefined,
): NavItem[] {
  if (!Array.isArray(overrides) || overrides.length === 0) return items;

  const byKey = new Map<string, NavPromoOverride>();
  for (const override of overrides) {
    if (override && typeof override.key === "string" && override.key !== "") {
      byKey.set(override.key, override);
    }
  }
  if (byKey.size === 0) return items;

  return items.map((item) => {
    const override = byKey.get(item.key);
    if (!override) return item;

    const description = usable(override.description);
    const image = usable(override.image);
    if (!description && !image) return item;

    return {
      ...item,
      ...(image ? { image } : {}),
      ...(description && item.promo
        ? { promo: { ...item.promo, description } }
        : {}),
    };
  });
}
