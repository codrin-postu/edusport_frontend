/** Outer to inner, as in the admin login (src/admin/dashboard/loginBranding.ts). */
const COLORS = ["#efb22b", "#ea7233", "#be3330", "#6e4256"] as const;

// Desktop: the admin panel geometry, a 1000x600 box stretched over the page.
const DESKTOP = [
  "M-40,590 H430 A140,140 0 0 0 570,450 V-40",
  "M-40,560 H430 A110,110 0 0 0 540,450 V-40",
  "M-40,530 H430 A80,80 0 0 0 510,450 V-40",
  "M-40,500 H430 A50,50 0 0 0 480,450 V-40",
];

// Phone: pixels measured from the page's right edge and the navy block's bottom (the svg is 240x310,
// pinned right with its bottom 30px below the block, so the block's edge sits at x=160 and its corner
// centre at 90,210). Not stretched, so the arcs stay
// circular at any width; the long lead-in runs off the left edge of any phone or tablet.
const PHONE = [
  "M-900,298 H90 A88,88 0 0 0 178,210 V-600",
  "M-900,286 H90 A76,76 0 0 0 166,210 V-600",
  "M-900,274 H90 A64,64 0 0 0 154,210 V-600",
  "M-900,262 H90 A52,52 0 0 0 142,210 V-600",
];

function Paths({ d, width }: { d: string[]; width: number }) {
  return (
    <g strokeWidth={width}>
      {d.map((path, i) => (
        <path key={path} className="auth-rib-path" pathLength={100} d={path} stroke={COLORS[i]} />
      ))}
    </g>
  );
}

/** The four-colour ribbon of the branded auth frame; the paths carry `.auth-rib-path` for the entry transition. */
export function AuthRibbon() {
  return (
    <>
      <svg className="absolute inset-0 hidden h-full w-full overflow-visible min-[900px]:block" viewBox="0 0 1000 600" preserveAspectRatio="none" fill="none" aria-hidden="true">
        <Paths d={DESKTOP} width={33} />
      </svg>
      <svg className="absolute right-0 top-[calc(var(--auth-navy)-280px)] h-[310px] w-[240px] overflow-visible min-[900px]:hidden" fill="none" aria-hidden="true">
        <Paths d={PHONE} width={12} />
      </svg>
    </>
  );
}
