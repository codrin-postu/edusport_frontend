"use client";

import React, { useEffect, useRef } from "react";

// ── Geometry type ──────────────────────────────────────────
interface RinkGeometry {
  x: number;
  y: number;
  w: number;
  h: number;
  rx: number;
  cx: number;
  cy: number;
}

// ── Scratch data ───────────────────────────────────────────
interface Scratch {
  x: number;
  y: number;
  len: number;
  angle: number;
  curve: number;
  thick: number;
  alpha: number;
  at: number;
}

// ── Easing helpers ─────────────────────────────────────────
function easeOut(t: number): number {
  return 1 - (1 - t) * (1 - t) * (1 - t);
}

function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

// ── Seeded RNG ─────────────────────────────────────────────
function seeded(seed: number) {
  let s = seed | 0;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

// ── Rounded-rect path ──────────────────────────────────────
function rrPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  rx: number,
): void {
  ctx.beginPath();
  ctx.moveTo(x + rx, y);
  ctx.lineTo(x + w - rx, y);
  ctx.arcTo(x + w, y, x + w, y + rx, rx);
  ctx.lineTo(x + w, y + h - rx);
  ctx.arcTo(x + w, y + h, x + w - rx, y + h, rx);
  ctx.lineTo(x + rx, y + h);
  ctx.arcTo(x, y + h, x, y + h - rx, rx);
  ctx.lineTo(x, y + rx);
  ctx.arcTo(x, y, x + rx, y, rx);
  ctx.closePath();
}

// ── Phase helpers ─────────────────────────────────────────
function rv(p: number, s: number, e: number): number {
  return Math.max(0, Math.min(1, (p - s) / (e - s)));
}
function rpPhase(p: number): number {
  return Math.max(0, Math.min(1, p / 0.3));
}
function spPhase(p: number): number {
  return Math.max(0, Math.min(1, (p - 0.3) / 0.22));
}
function zpPhase(p: number): number {
  return Math.max(0, Math.min(1, (p - 0.62) / 0.3));
}

// ── Build scratches ─────────────────────────────────────────
function buildScratches(rk: RinkGeometry): Scratch[] {
  const rng = seeded(99);
  const result: Scratch[] = [];
  for (let i = 0; i < 200; i++) {
    const fx = rng();
    const fy = rng();
    result.push({
      x: rk.x + fx * rk.w,
      y: rk.y + fy * rk.h,
      len: 8 + rng() * 44,
      angle: (rng() - 0.5) * Math.PI,
      curve: (rng() - 0.5) * 1.1,
      thick: 0.4 + rng() * 1.3,
      alpha: 0.06 + rng() * 0.18,
      at: rng(),
    });
  }
  return result;
}

// ── drawRink: arena, stands, spectators, rubber, ice ───────
function drawRink(
  ctx: CanvasRenderingContext2D,
  rk: RinkGeometry,
  W: number,
  H: number,
  r: number,
): void {
  const BLU: [number, number, number] = [26, 86, 219];
  const RED: [number, number, number] = [210, 40, 60];

  // Arena background
  ctx.fillStyle = "#06090e";
  ctx.fillRect(0, 0, W, H);

  // Radial spotlight
  const grd = ctx.createRadialGradient(W / 2, H / 2, rk.w * 0.15, W / 2, H / 2, W * 0.65);
  grd.addColorStop(0, "rgba(20,40,90,0.55)");
  grd.addColorStop(0.5, "rgba(10,18,40,0.40)");
  grd.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, W, H);

  // Stands
  const standRows = [
    { expand: 0.28, color: "#0d1220" },
    { expand: 0.22, color: "#101828" },
    { expand: 0.17, color: "#131e30" },
    { expand: 0.13, color: "#162038" },
    { expand: 0.09, color: "#192440" },
  ];
  for (const row of standRows) {
    const ex = row.expand;
    rrPath(
      ctx,
      rk.x - rk.w * ex,
      rk.y - rk.h * ex,
      rk.w * (1 + ex * 2),
      rk.h * (1 + ex * 2),
      rk.rx + rk.w * ex * 0.3,
    );
    ctx.fillStyle = row.color;
    ctx.fill();
  }

  // Tier divider lines
  for (const ex of [0.1, 0.14, 0.18, 0.22, 0.26]) {
    rrPath(
      ctx,
      rk.x - rk.w * ex,
      rk.y - rk.h * ex,
      rk.w * (1 + ex * 2),
      rk.h * (1 + ex * 2),
      rk.rx + rk.w * ex * 0.3,
    );
    ctx.strokeStyle = "rgba(255,255,255,0.04)";
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // Spectators in stands
  drawSpectators(ctx, rk);

  // Rubber area
  const rubberExpand = 0.055;
  rrPath(
    ctx,
    rk.x - rk.w * rubberExpand,
    rk.y - rk.h * rubberExpand,
    rk.w * (1 + rubberExpand * 2),
    rk.h * (1 + rubberExpand * 2),
    rk.rx + rk.w * rubberExpand * 0.3,
  );
  ctx.fillStyle = "#1a1a1a";
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.03)";
  ctx.lineWidth = 1;
  ctx.stroke();

  // Rinkside figures and judges
  drawRinkside(ctx, rk);

  // Ice surface
  rrPath(ctx, rk.x, rk.y, rk.w, rk.h, rk.rx);
  ctx.fillStyle = "#ddeeff";
  ctx.fill();

  const iceGrd = ctx.createRadialGradient(rk.cx, rk.cy, 0, rk.cx, rk.cy, rk.w * 0.6);
  iceGrd.addColorStop(0, "rgba(255,255,255,0.5)");
  iceGrd.addColorStop(0.7, "rgba(210,235,255,0.2)");
  iceGrd.addColorStop(1, "rgba(180,215,245,0.0)");
  ctx.fillStyle = iceGrd;
  rrPath(ctx, rk.x, rk.y, rk.w, rk.h, rk.rx);
  ctx.fill();

  rrPath(ctx, rk.x, rk.y, rk.w, rk.h, rk.rx);
  ctx.strokeStyle = "rgba(255,255,255,0.9)";
  ctx.lineWidth = 3;
  ctx.stroke();

  // Ice markings (clipped to rink)
  ctx.save();
  rrPath(ctx, rk.x, rk.y, rk.w, rk.h, rk.rx);
  ctx.clip();
  drawMarkings(ctx, rk, r, BLU, RED);
  ctx.restore();

  // Boards glow
  rrPath(ctx, rk.x, rk.y, rk.w, rk.h, rk.rx);
  ctx.strokeStyle = "rgba(255,255,255,0.85)";
  ctx.lineWidth = 2.5;
  ctx.stroke();
  ctx.strokeStyle = "rgba(180,220,255,0.12)";
  ctx.lineWidth = 10;
  ctx.stroke();
}

// ── drawSpectators ─────────────────────────────────────────
function drawSpectators(ctx: CanvasRenderingContext2D, rk: RinkGeometry): void {
  const rng = seeded(42);
  const JACKETS: [number, number, number][] = [
    [18, 25, 42], [12, 18, 30], [20, 28, 50], [15, 22, 38], [10, 15, 28],
    [22, 32, 60], [28, 40, 70], [18, 28, 52],
    [180, 30, 40], [26, 86, 219], [200, 160, 20], [200, 200, 200], [50, 140, 80],
  ];
  const tierExpands = [0.1, 0.135, 0.165, 0.195, 0.225, 0.255];

  for (let ti = 0; ti < tierExpands.length; ti++) {
    const ex = tierExpands[ti];
    const erx = rk.w / 2 + rk.w * ex;
    const ery = rk.h / 2 + rk.h * ex;
    const circumApprox =
      Math.PI * (3 * (erx + ery) - Math.sqrt((3 * erx + ery) * (erx + 3 * ery)));
    const personCount = Math.floor(circumApprox / 14);

    for (let i = 0; i < personCount; i++) {
      const angle = (i / personCount) * Math.PI * 2;
      const jx = (rng() - 0.5) * 6;
      const jy = (rng() - 0.5) * 5;
      const px = rk.cx + erx * Math.cos(angle) + jx;
      const py = rk.cy + ery * Math.sin(angle) + jy;
      if (px < 2 || px > rk.cx * 2 - 2 || py < 2 || py > rk.cy * 2 - 2) continue;

      const colIdx = rng() < 0.12 ? 8 + Math.floor(rng() * 5) : Math.floor(rng() * 8);
      const col = JACKETS[Math.min(colIdx, JACKETS.length - 1)];
      const rowBright = 0.55 + ti * 0.06;
      const headR = 2.2 + rng() * 0.8;

      ctx.beginPath();
      ctx.ellipse(px, py + headR * 0.9, headR * 1.1, headR * 0.7, 0, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${Math.floor(col[0] * rowBright * 0.7)},${Math.floor(col[1] * rowBright * 0.7)},${Math.floor(col[2] * rowBright * 0.7)},0.82)`;
      ctx.fill();

      ctx.beginPath();
      ctx.ellipse(px, py - headR * 0.1, headR * 0.72, headR * 0.78, 0, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${Math.floor(col[0] * rowBright)},${Math.floor(col[1] * rowBright)},${Math.floor(col[2] * rowBright)},0.90)`;
      ctx.fill();
    }
  }
}

// ── drawRinkside: judges + coaches ─────────────────────────
function drawRinkside(ctx: CanvasRenderingContext2D, rk: RinkGeometry): void {
  const rng2 = seeded(77);
  const rubberH = rk.h * 0.056;

  function person(
    px: number,
    py: number,
    r: number,
    col: [number, number, number],
    alpha: number,
  ) {
    const bright = 0.6 + rng2() * 0.35;
    ctx.beginPath();
    ctx.ellipse(px, py + r * 0.85, r, r * 0.65, 0, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${Math.floor(col[0] * bright * 0.7)},${Math.floor(col[1] * bright * 0.7)},${Math.floor(col[2] * bright * 0.7)},${alpha * 0.85})`;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(px, py, r * 0.75, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${Math.floor(col[0] * bright)},${Math.floor(col[1] * bright)},${Math.floor(col[2] * bright)},${alpha})`;
    ctx.fill();
  }

  const judgeTableW = rk.w * 0.62;
  const judgeTableH = rk.h * 0.072;
  const judgeTableX = rk.cx - judgeTableW / 2;
  const judgeTableY = rk.y + rk.h + rubberH * 1.1;

  ctx.fillStyle = "#1c1c2a";
  ctx.fillRect(judgeTableX, judgeTableY, judgeTableW, judgeTableH);
  ctx.strokeStyle = "rgba(26,86,219,0.35)";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(judgeTableX, judgeTableY, judgeTableW, judgeTableH);

  const judgeCount = 9;
  for (let i = 1; i < judgeCount; i++) {
    const dx = judgeTableX + (i / judgeCount) * judgeTableW;
    ctx.strokeStyle = "rgba(255,255,255,0.06)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(dx, judgeTableY);
    ctx.lineTo(dx, judgeTableY + judgeTableH);
    ctx.stroke();
  }

  for (let i = 0; i < judgeCount; i++) {
    const dx = judgeTableX + (i + 0.5) * (judgeTableW / judgeCount);
    const screenW = (judgeTableW / judgeCount) * 0.5;
    const screenH = judgeTableH * 0.28;
    ctx.fillStyle = "rgba(26,86,219,0.25)";
    ctx.fillRect(dx - screenW / 2, judgeTableY + judgeTableH * 0.28, screenW, screenH);
    ctx.strokeStyle = "rgba(26,86,219,0.5)";
    ctx.lineWidth = 0.5;
    ctx.strokeRect(dx - screenW / 2, judgeTableY + judgeTableH * 0.28, screenW, screenH);
  }

  for (let i = 0; i < judgeCount; i++) {
    const px = judgeTableX + (i + 0.5) * (judgeTableW / judgeCount);
    const py = judgeTableY + judgeTableH + 5;
    person(px, py, 2.8, [160, 140, 200], 0.88);
  }

  ctx.fillStyle = "rgba(26,86,219,0.18)";
  ctx.fillRect(judgeTableX, judgeTableY, judgeTableW, judgeTableH * 0.22);

  const coachSpots: Array<{ t: number; side: "top" | "bottom" | "left" | "right" }> = [
    { t: 0.25, side: "top" }, { t: 0.75, side: "top" },
    { t: 0.30, side: "bottom" }, { t: 0.72, side: "bottom" },
    { t: 0.15, side: "left" }, { t: 0.85, side: "left" },
    { t: 0.15, side: "right" }, { t: 0.85, side: "right" },
  ];
  for (const spot of coachSpots) {
    const offset = rubberH * 0.5;
    let px = 0;
    let py = 0;
    if (spot.side === "top") { px = rk.x + spot.t * rk.w; py = rk.y - offset; }
    if (spot.side === "bottom") { px = rk.x + spot.t * rk.w; py = rk.y + rk.h + offset; }
    if (spot.side === "left") { px = rk.x - offset; py = rk.y + spot.t * rk.h; }
    if (spot.side === "right") { px = rk.x + rk.w + offset; py = rk.y + spot.t * rk.h; }
    person(px, py, 2.4, [100, 120, 180], 0.7);
  }
}

// ── drawMarkings: no-op - hockey lines removed, clean ice ──
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function drawMarkings(
  _ctx: CanvasRenderingContext2D,
  _rk: RinkGeometry,
  _r: number,
  _BLU: [number, number, number],
  _RED: [number, number, number],
): void {}

// ── drawScratches ──────────────────────────────────────────
function drawScratches(
  ctx: CanvasRenderingContext2D,
  scratches: Scratch[],
  s: number,
  BLU: [number, number, number],
): void {
  if (s <= 0) return;
  for (const sc of scratches) {
    const lt = Math.max(0, Math.min(1, (s - sc.at * 0.92) / 0.06));
    if (lt <= 0) continue;
    const ex = sc.x + Math.cos(sc.angle) * sc.len;
    const ey = sc.y + Math.sin(sc.angle) * sc.len;
    const px = -Math.sin(sc.angle) * sc.len * sc.curve * 0.5;
    const py = Math.cos(sc.angle) * sc.len * sc.curve * 0.5;
    ctx.beginPath();
    ctx.moveTo(sc.x, sc.y);
    ctx.quadraticCurveTo((sc.x + ex) / 2 + px, (sc.y + ey) / 2 + py, ex, ey);
    ctx.strokeStyle = `rgba(${BLU[0]},${BLU[1]},${BLU[2]},${sc.alpha * Math.min(1, lt * 4)})`;
    ctx.lineWidth = sc.thick;
    ctx.lineCap = "butt";
    ctx.stroke();
  }
}

// ── drawZamboni: body, strip, animations ───────────────────
interface ZamboniState {
  x: number;
  y: number;
  w: number;
  h: number;
  startX: number;
  stopX: number;
}

function drawZamboni(
  octx: CanvasRenderingContext2D,
  zb: ZamboniState,
  _rk: RinkGeometry,
  now: number,
): void {
  // Fresh-ice strip
  const stripW = zb.x - zb.startX;
  if (stripW > 0) {
    octx.fillStyle = "rgba(235,250,255,0.28)";
    octx.fillRect(zb.startX, zb.y - (zb.h * 1.05) / 2, stripW, zb.h * 1.05);
    octx.strokeStyle = "rgba(200,230,250,0.10)";
    octx.lineWidth = 1;
    octx.lineCap = "butt";
    for (let gv = -2; gv <= 2; gv++) {
      const gy = zb.y + gv * zb.h * 0.18;
      octx.beginPath();
      octx.moveTo(zb.startX, gy);
      octx.lineTo(zb.x - zb.w * 0.5, gy);
      octx.stroke();
    }
  }

  const zx = zb.x - zb.w / 2;
  const zy = zb.y - zb.h / 2;

  // Shadow
  octx.fillStyle = "rgba(0,0,0,0.18)";
  octx.beginPath();
  octx.ellipse(zb.x, zb.y + zb.h * 0.46, zb.w * 0.46, zb.h * 0.14, 0, 0, Math.PI * 2);
  octx.fill();

  // Chassis
  octx.fillStyle = "#d97010";
  octx.beginPath();
  octx.roundRect(zx, zy, zb.w, zb.h, 4);
  octx.fill();
  octx.fillStyle = "#b85c08";
  octx.fillRect(zx + zb.w * 0.12, zy + zb.h * 0.62, zb.w * 0.76, zb.h * 0.18);

  // Rear blade + water drips
  const bladeW = zb.w * 0.12;
  octx.fillStyle = "#888";
  octx.fillRect(zx, zy + zb.h * 0.78, bladeW, zb.h * 0.14);
  octx.fillStyle = "rgba(180,225,255,0.55)";
  for (let d = 0; d < 4; d++) {
    octx.beginPath();
    octx.ellipse(zx + bladeW * 0.2 + d * bladeW * 0.2, zy + zb.h * 0.97, 1.2, 2.5, 0, 0, Math.PI * 2);
    octx.fill();
  }

  // Cab
  const cabW = zb.w * 0.38;
  const cabX = zx + zb.w - cabW;
  octx.fillStyle = "#9e4608";
  octx.beginPath();
  octx.roundRect(cabX, zy, cabW, zb.h * 0.72, 4);
  octx.fill();
  octx.fillStyle = "rgba(185,232,255,0.72)";
  octx.beginPath();
  octx.roundRect(cabX + cabW * 0.12, zy + zb.h * 0.08, cabW * 0.76, zb.h * 0.36, 2);
  octx.fill();
  octx.fillStyle = "rgba(255,255,255,0.35)";
  octx.fillRect(cabX + cabW * 0.14, zy + zb.h * 0.1, cabW * 0.22, zb.h * 0.14);

  // Headlights
  octx.fillStyle = "rgba(255,245,160,0.95)";
  octx.beginPath();
  octx.ellipse(cabX + cabW - 3, zy + zb.h * 0.18, 3, 2.5, 0, 0, Math.PI * 2);
  octx.fill();
  octx.beginPath();
  octx.ellipse(cabX + cabW - 3, zy + zb.h * 0.56, 3, 2.5, 0, 0, Math.PI * 2);
  octx.fill();

  const hlGrd = octx.createRadialGradient(cabX + cabW - 1, zb.y, 1, cabX + cabW + 10, zb.y, 16);
  hlGrd.addColorStop(0, "rgba(255,248,180,0.35)");
  hlGrd.addColorStop(1, "rgba(255,248,180,0)");
  octx.fillStyle = hlGrd;
  octx.fillRect(cabX + cabW - 2, zy, 22, zb.h);

  // Tail light
  octx.fillStyle = "rgba(255,40,40,0.75)";
  octx.fillRect(zx + 1, zy + zb.h * 0.22, 3, zb.h * 0.5);

  // Beacon
  if (Math.sin(now / 600) > 0) {
    octx.fillStyle = "rgba(255,180,0,0.9)";
    octx.beginPath();
    octx.ellipse(cabX + cabW * 0.5, zy - 4, 4, 3, 0, 0, Math.PI * 2);
    octx.fill();
    octx.fillStyle = "rgba(255,180,0,0.18)";
    octx.beginPath();
    octx.ellipse(cabX + cabW * 0.5, zy - 4, 10, 8, 0, 0, Math.PI * 2);
    octx.fill();
  }

  // Exhaust puff
  const pipeX = zx + zb.w * 0.55;
  const pipeY = zy - 2;
  octx.fillStyle = "#555";
  octx.fillRect(pipeX, pipeY - 6, 3, 6);
  const puffT = ((now / 2200) % 1);
  octx.fillStyle = `rgba(220,220,220,${0.25 * (1 - puffT)})`;
  octx.beginPath();
  octx.ellipse(pipeX + 1.5, pipeY - 6 - puffT * 16, 4 + puffT * 4, 3 + puffT * 3, 0, 0, Math.PI * 2);
  octx.fill();

  // Wheels
  const wheelR = zb.h * 0.11;
  const wheelY = zy + zb.h;
  for (const wx of [zx + zb.w * 0.18, zx + zb.w * 0.82]) {
    octx.fillStyle = "rgba(0,0,0,0.35)";
    octx.beginPath();
    octx.arc(wx, wheelY, wheelR, Math.PI, 0);
    octx.fill();
    octx.strokeStyle = "#333";
    octx.lineWidth = 2;
    octx.beginPath();
    octx.arc(wx, wheelY, wheelR, Math.PI, 0);
    octx.stroke();
    octx.fillStyle = "#aaa";
    octx.beginPath();
    octx.arc(wx, wheelY, wheelR * 0.38, 0, Math.PI * 2);
    octx.fill();
  }

}

// ── RinkTransition component ───────────────────────────────
interface RinkTransitionProps {
  children?: React.ReactNode;
}

export default function RinkTransition({ children }: RinkTransitionProps): React.ReactElement {
  const lingerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const articlesRef = useRef<HTMLDivElement>(null);

  // Shared refs replacing window globals
  const rkRef = useRef<RinkGeometry | null>(null);
  const zpRef = useRef<number>(0);

  useEffect(() => {
    const lingerEl = lingerRef.current;
    const canvas = canvasRef.current;
    const overlay = overlayRef.current;
    const articlesEl = articlesRef.current;
    if (!lingerEl || !canvas || !overlay || !articlesEl) return;

    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D | null;
    const octx = overlay.getContext("2d") as CanvasRenderingContext2D | null;
    if (!ctx || !octx) return;

    // Capture non-null refs as consts for closure use
    const lingerNode = lingerEl;
    const mainCanvas = canvas;
    const overlayCanvas = overlay;
    const articlesNode = articlesEl;
    const mainCtx = ctx;
    const overCtx = octx;

    let W = 0;
    let H = 0;
    let scratches: Scratch[] = [];

    function computeRK(w: number, h: number): RinkGeometry {
      const rw = w * 0.58;
      const rh = rw * 0.46;
      const rxPos = (w - rw) / 2;
      const ryPos = (h - rh) / 2;
      const cornerR = rh * 0.22;
      return { x: rxPos, y: ryPos, w: rw, h: rh, rx: cornerR, cx: w / 2, cy: h / 2 };
    }

    function resize() {
      W = lingerNode.offsetWidth;
      H = window.innerHeight;
      mainCanvas.width = W;
      mainCanvas.height = H;
      const rk = computeRK(W, H);
      rkRef.current = rk;
      scratches = buildScratches(rk);
    }

    function getP(): number {
      const rect = lingerNode.getBoundingClientRect();
      return Math.max(0, Math.min(1, -rect.top / (lingerNode.offsetHeight - window.innerHeight)));
    }

    function draw(p: number) {
      if (!rkRef.current) return;
      mainCtx.clearRect(0, 0, W, H);

      const r = rpPhase(p);
      const s = spPhase(p);
      const z = zpPhase(p);

      zpRef.current = z;

      if (z >= 0.88) return;

      const rk = rkRef.current;
      const BLU: [number, number, number] = [26, 86, 219];
      const zoom = 1 + easeInOut(z) * 1.6;

      mainCtx.save();
      mainCtx.translate(rk.cx, rk.cy);
      mainCtx.scale(zoom, zoom);
      mainCtx.translate(-rk.cx, -rk.cy);

      drawRink(mainCtx, rk, W, H, r);

      // Draw scratches inside clipped rink
      mainCtx.save();
      rrPath(mainCtx, rk.x, rk.y, rk.w, rk.h, rk.rx);
      mainCtx.clip();
      drawScratches(mainCtx, scratches, s, BLU);
      mainCtx.restore();

      mainCtx.restore(); // end zoom transform

      // White bleach overlay (at canvas scale)
      if (z > 0) {
        mainCtx.fillStyle = `rgba(255,255,255,${easeInOut(z)})`;
        mainCtx.fillRect(0, 0, W, H);
      }
    }

    // ── Zamboni RAF loop ───────────────────────────────────
    const STOP_FRAC = 2 / 3;
    const TRAVEL_MS = 55000;
    const zb: ZamboniState = { x: 0, y: 0, w: 0, h: 0, startX: 0, stopX: 0 };
    let rafId = 0;
    let startTime: number | null = null;
    let lastT: number | null = null;

    function initZamboni() {
      const rk = rkRef.current;
      if (!rk) return;
      zb.w = rk.w * 0.072;
      zb.h = rk.h * 0.115;
      zb.startX = rk.x + zb.w * 0.7;
      zb.stopX = rk.x + rk.w * STOP_FRAC;
      zb.y = rk.cy;
      zb.x = zb.startX;
    }

    function resizeOverlay() {
      overlayCanvas.width = lingerNode.offsetWidth;
      overlayCanvas.height = window.innerHeight;
      initZamboni();
    }

    function loop(now: number) {
      if (!startTime) startTime = now;
      if (!lastT) lastT = now;
      lastT = now;

      const rk = rkRef.current;
      const zv = zpRef.current;
      overCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);

      if (rk) {
        const elapsed = now - startTime;
        const zbRawT = Math.min(1, elapsed / TRAVEL_MS);
        const zbEased = easeInOut(zbRawT);
        zb.x = zb.startX + (zb.stopX - zb.startX) * zbEased;

        const zoom = 1 + easeInOut(zv) * 1.6;
        overCtx.save();
        overCtx.translate(rk.cx, rk.cy);
        overCtx.scale(zoom, zoom);
        overCtx.translate(-rk.cx, -rk.cy);

        // Clip to rink
        overCtx.beginPath();
        rrPath(overCtx, rk.x, rk.y, rk.w, rk.h, rk.rx);
        overCtx.clip();

        drawZamboni(overCtx, zb, rk, now);

        overCtx.restore();

        // White curtain mirroring main bleach
        if (zv > 0) {
          overCtx.fillStyle = `rgba(255,255,255,${easeInOut(zv)})`;
          overCtx.fillRect(0, 0, overlayCanvas.width, overlayCanvas.height);
        }
      }

      rafId = requestAnimationFrame(loop);
    }

    // ── Scroll handler ─────────────────────────────────────
    function onScroll() {
      requestAnimationFrame(() => {
        const p = getP();
        draw(p);
        const z = zpRef.current;
        const canvFade = z >= 0.88 ? 0 : 1;
        mainCanvas.style.opacity = String(canvFade);
        overlayCanvas.style.opacity = String(canvFade);

        const ao = Math.max(0, Math.min(1, (z - 0.8) / 0.2));
        articlesNode.style.opacity = String(ao);
        articlesNode.style.pointerEvents = ao > 0.5 ? "auto" : "none";
      });
    }

    // ── ResizeObserver ──────────────────────────────────────
    const resizeObserver = new ResizeObserver(() => {
      resize();
      resizeOverlay();
      draw(getP());
    });
    resizeObserver.observe(lingerNode);

    // Initial setup
    resize();
    resizeOverlay();
    draw(0);
    window.addEventListener("scroll", onScroll, { passive: true });

    const zbTimeout = setTimeout(() => {
      rafId = requestAnimationFrame(loop);
    }, 120);

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
      clearTimeout(zbTimeout);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div ref={lingerRef} className="relative" style={{ height: "250vh" }}>
      <div className="sticky top-0 h-screen bg-white overflow-hidden">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
        />
        <canvas
          ref={overlayRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
        />
        <div
          ref={articlesRef}
          className="absolute inset-0 z-10 bg-white opacity-0 pointer-events-none overflow-y-auto"
        >
          {children}
        </div>
      </div>
    </div>
  );
}
