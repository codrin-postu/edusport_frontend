# Footer WhatsApp Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a dedicated WhatsApp 4th column to the footer, with a responsive layout (mobile: stacked with large QR; tablet/desktop: compact inline row), replacing the current embedded QR inside the Contact section.

**Architecture:** Two files change. `WhatsAppQR.tsx` is replaced with a simpler size-prop component. `Footer.tsx` restructures `FooterContent` — the left-group `contents` wrapper is removed, all 4 columns become direct children of a grid/flex container, and the WhatsApp column is added with two visibility-toggled DOM subtrees (one per breakpoint family).

**Tech Stack:** Next.js App Router, TypeScript, Tailwind CSS, `qrcode.react` (`QRCodeSVG`), `Link` component from `@/components/ui/link`, `LinkVariants` from `@/utils/constants`.

**Spec:** `docs/superpowers/specs/2026-03-22-footer-whatsapp-redesign.md`

---

## File Map

| File | What changes |
|------|-------------|
| `src/components/blocks/footer/WhatsAppQR.tsx` | **Replace** — simpler component, `size: number` prop, no accents/ring/shadow/text |
| `src/components/blocks/footer/Footer.tsx` | **Modify** — remove `contents` wrapper, restructure outer container, remove WA from `buildContactItems`, remove embedded `<WhatsAppQR />` from Contact section, add WhatsApp 4th column |

**Do not touch:** `FooterBrandName`, `FooterReveal`, `footerLeftSections`, the Contact section's phone/email/social items, `bg-edusport-blue`, `SiteContactInfo` interface.

---

## Task 1: Replace `WhatsAppQR.tsx`

**Files:**
- Modify: `src/components/blocks/footer/WhatsAppQR.tsx`

The current component has corner accents, a ring, a shadow, and instructional text. The new design strips all decoration — just a white rounded card wrapping the QR SVG, sized by prop.

- [ ] **Step 1.1: Replace the component**

Open `src/components/blocks/footer/WhatsAppQR.tsx` and replace its entire contents with:

```tsx
"use client";

import { QRCodeSVG } from "qrcode.react";
import React from "react";

const CHANNEL_URL = "https://whatsapp.com/channel/0029Vaqul3WC6ZvanAX0DY06";

interface WhatsAppQRProps {
  size: number;
}

export const WhatsAppQR: React.FC<WhatsAppQRProps> = ({ size }) => {
  return (
    <div className="bg-white rounded-lg p-[7px] inline-flex">
      <QRCodeSVG
        value={CHANNEL_URL}
        size={size}
        bgColor="#ffffff"
        fgColor="#7C3AED"
        level="M"
        marginSize={1}
      />
    </div>
  );
};
```

- [ ] **Step 1.2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors related to `WhatsAppQR`. (Ignore unrelated pre-existing errors if any.)

Note: `Footer.tsx` still calls `<WhatsAppQR />` with no props at this point — it will show a TypeScript error until Task 2 is complete. That's fine — the error will be resolved in the next task.

- [ ] **Step 1.3: Commit**

```bash
git add src/components/blocks/footer/WhatsAppQR.tsx
git commit -m "refactor(footer): simplify WhatsAppQR to size-prop component"
```

---

## Task 2: Restructure `FooterContent` and add WhatsApp column

**Files:**
- Modify: `src/components/blocks/footer/Footer.tsx`

This task does three things in one go (they are tightly coupled — changing the container structure, cleaning up the Contact section, and adding the new column all affect the same JSX tree):

1. Remove the `if (info.whatsappChannelUrl)` push in `buildContactItems`
2. Change the outer container classes on `FooterContent`'s root div
3. Remove the `contents` left-group wrapper div (promote its children directly)
4. Remove `<WhatsAppQR />` from inside the Contact section
5. Add the WhatsApp 4th column with both responsive subtrees

### Step 2.1 — Remove WhatsApp from `buildContactItems`

- [ ] In `buildContactItems` (around line 77), delete these lines:

```tsx
  if (info.whatsappChannelUrl) {
    items.push({ type: "social", label: "WhatsApp", href: info.whatsappChannelUrl, icon: "whatsapp" });
  }
```

### Step 2.2 — Rewrite `FooterContent`

- [ ] Replace the entire `FooterContent` component (the `const FooterContent` declaration through its closing `};`) with:

```tsx
const FooterContent: React.FC<{ contactInfo?: SiteContactInfo }> = ({ contactInfo }) => {
  const contactItems = buildContactItems(contactInfo ?? {});
  const waUrl = contactInfo?.whatsappChannelUrl ?? "https://whatsapp.com/channel/0029Vaqul3WC6ZvanAX0DY06";

  const WhatsAppIcon = () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="shrink-0"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:flex lg:flex-row max-footer-content lg:justify-between gap-8 md:gap-10 lg:gap-12 px-22 py-10 mx-auto">
      {/* Meniu */}
      {footerLeftSections.map((section, index) => (
        <div key={index} className="flex flex-col gap-3">
          <Text variant="heading" className="font-semibold text-lg lg:text-2xl text-white">
            {section.title}
          </Text>
          <div className="flex flex-col gap-3">
            {section.items.map((item, itemIndex) =>
              <FooterItem key={itemIndex} {...item} />,
            )}
          </div>
        </div>
      ))}

      {/* Contactează-ne */}
      <div className="flex flex-col gap-3">
        <Text variant="heading" className="font-semibold text-lg lg:text-2xl text-white">
          Contacteaza-ne
        </Text>
        <div className="flex flex-col gap-3">
          {contactItems.map((item, itemIndex) =>
            <FooterItem key={itemIndex} {...item} />,
          )}
        </div>
      </div>

      {/* WhatsApp — 4th column */}
      <div className="lg:flex-shrink-0 lg:min-w-[160px]">
        {/* Mobile: large QR → caption → link */}
        {/* Note: WhatsAppIcon renders outside <Link> so it isn't wrapped in the
            link-underline-animate span and doesn't get underlined. The ArrowUpRight
            from linkType="external" still appears on hover after the text. */}
        <div className="flex flex-col items-start gap-0 md:hidden">
          <p className="text-[10.5px] font-bold uppercase tracking-[1.2px] text-white mb-[10px]">
            WhatsApp
          </p>
          <WhatsAppQR size={84} />
          <p className="text-[12px] text-white/45 leading-[1.55] mt-[10px] mb-[12px]">
            Intră pentru a primi ultimele informații
          </p>
          <div className="flex items-center gap-[6px]">
            <WhatsAppIcon />
            <Link
              href={waUrl}
              variant={LinkVariants.FOOTER_ANIMATED}
              linkType="external"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm"
            >
              Intră în canal
            </Link>
          </div>
        </div>

        {/* Tablet + Desktop: caption → QR + divider + link row */}
        <div className="flex-col gap-0 hidden md:flex">
          <p className="text-[10.5px] font-bold uppercase tracking-[1.2px] text-white mb-[10px]">
            WhatsApp
          </p>
          <p className="text-[12px] text-white/45 leading-[1.55] mb-[12px]">
            Intră pentru a primi ultimele informații
          </p>
          <div className="flex items-center gap-[14px]">
            <WhatsAppQR size={52} />
            <div className="w-px h-[52px] bg-white/15 shrink-0" />
            <div className="flex items-center gap-[6px]">
              <WhatsAppIcon />
              <Link
                href={waUrl}
                variant={LinkVariants.FOOTER_ANIMATED}
                linkType="external"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm"
              >
                Intră în canal
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
```

### Step 2.3 — Verify

- [ ] Run TypeScript check:

```bash
npx tsc --noEmit
```

Expected: no new errors. The missing `size` prop error from Task 1 should now be resolved.

- [ ] Start the dev server and open the footer at multiple widths:

```bash
npm run dev
```

Check at:
- **375px** (mobile): 4 sections stacked, WhatsApp last — large QR, then caption text, then "Intră în canal" link
- **768px** (tablet): 2×2 grid — Meniu/Legal top row, Contact/WhatsApp bottom row — WhatsApp shows caption above, compact QR+divider+link row below
- **1200px** (desktop): 4-column row — WhatsApp is rightmost column, same caption+row layout as tablet

Verify the EDUSPORT brand text at the bottom is unchanged.

### Step 2.4 — Commit

- [ ] Commit:

```bash
git add src/components/blocks/footer/Footer.tsx
git commit -m "feat(footer): add WhatsApp as dedicated 4th column with responsive layout"
```

---

## Done

The footer now has 4 columns. WhatsApp is promoted from an embedded QR inside Contact to its own named column with a caption and a scannable/clickable link. The EDUSPORT brand text, blue background, and all other footer content are unchanged.
