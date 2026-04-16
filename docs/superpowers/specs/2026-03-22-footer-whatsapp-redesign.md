# Footer WhatsApp Redesign — Design Spec

**Date:** 2026-03-22
**Status:** Approved

---

## Overview

Reorganise the footer's `FooterContent` area to promote WhatsApp to a dedicated 4th column alongside the existing Meniu, Informații legale, and Contactează-ne columns. The `FooterBrandName` (EDUSPORT text, Climate Crisis font, absolute positioning), `FooterReveal` wrapper, and all existing nav/contact link data are out of scope and must not be modified.

---

## Layout

### Desktop (≥ 1024px) — 4-column flex row

| Meniu | Informații legale | Contactează-ne | WhatsApp |

### Tablet (768px–1023px) — 2×2 grid

```
Meniu            | Informații legale
Contactează-ne   | WhatsApp
```

### Mobile (< 768px) — single column stack

All 4 sections stack vertically in order: Meniu → Informații legale → Contactează-ne → WhatsApp.

---

## FooterContent — Structural Change

The current `FooterContent` outer div is `flex flex-col md:flex-row`. The current left-group wrapper uses `contents md:contents lg:flex lg:flex-row lg:gap-12` to dissolve Meniu and Informații legale into the parent flow.

With 4 columns, this structure must change:

**New outer div:** `grid grid-cols-1 md:grid-cols-2 lg:flex lg:flex-row`

**Remove the left-group wrapper div entirely.** Render each section (Meniu, Informații legale, Contactează-ne, WhatsApp) as direct children of the outer grid/flex container. At `lg`, add `lg:gap-12` and `lg:justify-between` on the outer container to space all 4 columns.

The WhatsApp column should use `lg:flex-shrink-0` with a fixed min-width so it doesn't expand to fill equal flex space like the text columns.

---

## WhatsApp Column — `buildContactItems` and Contact section

**Remove** the WhatsApp entry from `buildContactItems`. The `if (info.whatsappChannelUrl)` block that pushes `{ type: "social", label: "WhatsApp", ... }` should be deleted. WhatsApp is now handled exclusively by the dedicated 4th column.

**Remove** the existing `<WhatsAppQR />` render from inside the Contact section div in `FooterContent` (currently at line 165–167). The Contact section should only render `contactItems` going forward.

The `contactInfo.whatsappChannelUrl` field is the source for the new column's "Intră în canal" link href.

---

## WhatsApp Column — Responsive Layout

Because the caption appears **after** the QR on mobile but **before** the QR row on tablet/desktop, use two separate DOM subtrees toggled by visibility — not CSS `order`. This avoids flex ordering complexity and is explicit.

### Mobile subtree (`block md:hidden`)

```
WHATSAPP                    ← col-label
[84×84 QR card]             ← align-self: start (prevents card stretching full width)
Intră pentru a primi...     ← caption (mt-[10px] mb-[12px])
[WA icon] Intră în canal    ← link
```

The mobile wrapper must have `items-start` (or `align-items: flex-start`) so the white QR card does not stretch to full column width.

### Tablet + Desktop subtree (`hidden md:flex md:flex-col`)

```
WHATSAPP                                      ← col-label
Intră pentru a primi ultimele informații      ← caption (mb-[12px])
[52×52 QR] | [hairline divider] | [WA icon] Intră în canal   ← inline row
```

The inline row: `flex items-center gap-[14px]`. Divider: `w-px h-[52px] bg-white/15`.

---

## WhatsApp Column — Text & Link

**Section label:** `WHATSAPP`
Style: `text-[10.5px] font-bold uppercase tracking-[1.2px] text-white mb-[10px]` — same as all other section headings.

**Caption:** `Intră pentru a primi ultimele informații`
Style: `text-[12px] text-white/45 leading-[1.55]`

**CTA link:** `Intră în canal`
- `href`: `contactInfo.whatsappChannelUrl` (fall back to the hardcoded `CHANNEL_URL` constant if not provided)
- Icon: inline WhatsApp SVG — the brand icon does not exist in the codebase yet and must be added. Use this filled `<path>` with `viewBox="0 0 24 24"` and `fill="currentColor"`:
  ```
  M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z
  ```
  Do **not** use Lucide `MessageCircle`.
- Use the existing `Link` component with `variant={LinkVariants.FOOTER_ANIMATED}` and `linkType="external"` for consistency with the rest of the footer

---

## `WhatsAppQR.tsx` Redesign

Replace the existing component with a size-prop variant. Remove all corner accents, the ring, shadow, and instructional text — they are replaced by the new column layout.

```tsx
interface WhatsAppQRProps {
  size: number   // pixel size passed directly to QRCodeSVG
}
```

- Container: `bg-white rounded-lg p-[7px] inline-flex` — no ring, no shadow, no accents
- `QRCodeSVG` props: `value={CHANNEL_URL}`, `bgColor="#ffffff"`, `fgColor="#7C3AED"`, `level="M"`, `marginSize={1}`
- Keep the existing `CHANNEL_URL` constant
- Mobile call site: `size={84}`, tablet/desktop call site: `size={52}`

---

## Files Changed

| File | Change |
|------|--------|
| `src/components/blocks/footer/Footer.tsx` | Restructure `FooterContent` outer container; remove left-group `contents` wrapper; remove `<WhatsAppQR />` from Contact section; remove WhatsApp from `buildContactItems`; add WhatsApp column |
| `src/components/blocks/footer/WhatsAppQR.tsx` | Replace with size-prop component; remove corner accents, ring, shadow, and instructional text |

---

## Constraints

- `FooterBrandName` — must not be touched
- `FooterReveal` wrapper — must not be touched
- Blue background (`bg-edusport-blue`) — unchanged
- All existing nav/contact link data (`footerLeftSections`, phone, email, Facebook, Instagram) — unchanged
- Icons outside the WhatsApp column use the existing project icon system unchanged
- `fgColor` stays `#7C3AED` (violet-600) — the existing value in `WhatsAppQR.tsx`
