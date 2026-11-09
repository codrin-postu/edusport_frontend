/** Outer to inner, as in the admin login (src/admin/dashboard/loginBranding.ts). */
const COLORS = ["var(--color-mustard)", "var(--color-orange)", "var(--color-rust)", "var(--color-burgundy)"] as const;

// Desktop: the admin panel geometry, a 1000x600 box stretched over the page.
const DESKTOP = [
  "M-40,590 H430 A140,140 0 0 0 570,450 V-40",
  "M-40,560 H430 A110,110 0 0 0 540,450 V-40",
  "M-40,530 H430 A80,80 0 0 0 510,450 V-40",
  "M-40,500 H430 A50,50 0 0 0 480,450 V-40",
];

// Phone: the landing page's warm wave band (RegistrationWaveDivider) along the bottom edge, gold on
// top to burgundy, four touching 40-unit stripes in a 390x168 box stretched to the page width and to
// --auth-band high; the burgundy runs on past the bottom edge.
const wave = (b: number) => `M-40,${b} C60,${b + 12} 150,${b - 10} 230,${b + 2} C300,${b + 12} 350,${b - 8} 430,${b + 4}`;
const PHONE = [wave(30), wave(70), wave(110), wave(150)];

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
      <svg className="absolute inset-0 hidden h-full w-full overflow-visible portal:block" viewBox="0 0 1000 600" preserveAspectRatio="none" fill="none" aria-hidden="true">
        <Paths d={DESKTOP} width={33} />
      </svg>
      <svg className="absolute bottom-0 left-0 h-[var(--auth-band)] w-full portal:hidden" viewBox="0 0 390 168" preserveAspectRatio="none" fill="none" aria-hidden="true">
        <rect x={-40} y={150} width={470} height={80} fill={COLORS[3]} />
        <Paths d={PHONE} width={40} />
      </svg>
    </>
  );
}
