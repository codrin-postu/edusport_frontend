"use client";

// ─────────────────────────────────────────────────────────────────────────────
// HeroWordmarkMorph — WebGL "liquid dilation" hover effect on the EDUSPORT
// wordmark. The word is drawn to an offscreen 2D canvas with the project's
// Climate Crisis font (per-variant letter fills + matching variable-font axis)
// and used as a texture. A fragment shader dilates the glyph coverage around
// the cursor so strokes only bulge OUTWARD (never thin), rounded (disk kernel),
// with a red→yellow chromatic bleed at the growing edge (identical on every
// letter colour) and a gold tint+glow inside the hover circle.
//
// It becomes the visible wordmark on hover-capable / WebGL / motion-OK devices;
// the static <Wordmark> stays as the invisible layout/a11y/SEO source (and the
// visible fallback everywhere else).
//
// Performance: the dilation runs ONLY inside the hover circle (early-out
// elsewhere) and in a single sunflower-disk pass that derives all three colour
// rings at once. Add ?morphtune to the URL for live sliders.
//
// Two selectable presets (PRESETS.A = subtle, PRESETS.B = bold); DEFAULT_PRESET
// ships. A: r.35 t.045 bleed.45 mix1 wob.05 tint.10 glow.20 · B: r.60 t.058
// bleed.57 mix1 wob.05 tint.10 glow.15 · gradient gold, mode tint+glow.
// ─────────────────────────────────────────────────────────────────────────────

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import * as THREE from "three";
import type { HeroVariant as Variant } from "./HeroVariant";

const WORDMARK = "EDUSPORT";
const CREAM = "#F2EBDD";
const NAVY = "#0e1a3c";

function letterColor(variant: Variant, index: number): string {
  if (variant === "G") return CREAM;
  if (variant === "B") return NAVY;
  return index < 4 ? NAVY : CREAM; // E: 0-3 navy, 4-7 cream
}

const GRAD_COLOR: [number, number, number] = [0.98, 0.75, 0.14]; // gold

type MorphParams = {
  radius: number;
  thicken: number;
  bleed: number;
  bleedMix: number;
  wobble: number;
  tint: number;
  glow: number;
};

// Selectable presets — switch live in the ?morphtune panel; DEFAULT_PRESET is
// what ships. Params can still be nudged per-slider after picking a preset.
const PRESETS: Record<string, MorphParams> = {
  A: { radius: 0.35, thicken: 0.045, bleed: 0.45, bleedMix: 1.0, wobble: 0.05, tint: 0.1, glow: 0.2 }, // subtle
  B: { radius: 0.6, thicken: 0.058, bleed: 0.57, bleedMix: 1.0, wobble: 0.05, tint: 0.1, glow: 0.15 }, // bold
};
const DEFAULT_PRESET = "B";

// Auto-play sweep state (drives a virtual cursor across the wordmark — used for
// the mobile/no-hover auto animation and the ?morph demo button).
type SweepRef = React.MutableRefObject<{ requested: boolean; startT: number }>;
const SWEEP_DURATION = 2.73; // seconds for one left→right pass

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

const FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uTex;
  uniform vec2 uMouse, uVel;
  uniform float uHover, uRadius, uThick, uChroma, uBleed, uWobble, uTint, uGlow, uAspect, uTime, uComp, uOnText;
  uniform vec3 uGradColor;
  // Letter ink colour, cross-faded navy↔cream with the hero video/cream cycle.
  uniform vec3 uInk;

  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
  float noise(vec2 p){
    vec2 i=floor(p), f=fract(p);
    float a=hash(i), b=hash(i+vec2(1,0)), c=hash(i+vec2(0,1)), d=hash(i+vec2(1,1));
    vec2 u=f*f*(3.0-2.0*f);
    return mix(mix(a,b,u.x), mix(c,d,u.x), u.y);
  }

  void main(){
    vec2 uv = vUv;
    vec2 dd = (uv - uMouse) * vec2(uAspect, 1.0);
    float dist = length(dd);
    // uComp scales the effect to the wordmark box (not the canvas), so canvas
    // headroom can grow freely without changing the tuned size.
    float rEff = uRadius * uComp;
    float fall = smoothstep(rEff, 0.0, dist) * uHover;
    vec4 base0 = texture2D(uTex, uv);
    // Only the hover circle does the expensive dilation; everywhere else is one
    // texture read → the whole idle wordmark is nearly free. Colour comes from
    // uInk (the texture only supplies the letter alpha / shapes).
    if (fall < 0.001) { gl_FragColor = vec4(uInk, base0.a); return; }

    vec2 vel = uVel * uThick * 9.0 * fall * uComp;
    float grow = uThick * fall * uComp;
    float gr = grow * (1.0 + uChroma*0.5);           // widest reach (red ring)
    float gRatio = 1.0 / (1.0 + uChroma*0.5);         // grow  / gr
    float bRatio = (1.0 - uChroma*0.35) / (1.0 + uChroma*0.5);

    // ONE sunflower-disk pass → rounded dilation + all three ring radii at once.
    float aR=base0.a, aG=base0.a, aB=base0.a, bestA=base0.a;
    vec3 letter = base0.a > 0.001 ? base0.rgb : vec3(0.0);
    for(int i=0;i<20;i++){
      float fi=float(i);
      float rr=sqrt((fi+0.5)/20.0);                   // disk-filling radial fraction
      float ang=fi*2.3999632;                          // golden angle
      vec2 dir=vec2(cos(ang), sin(ang)*uAspect);       // aspect-correct → round in px
      float wf=1.0 - uWobble + uWobble*1.6*noise(uv*9.0 + vec2(fi*1.7, uTime*0.8));
      float rn=wf*rr;
      vec4 s=texture2D(uTex, uv + dir*gr*rn + vel);
      aR=max(aR,s.a);
      if(rn<=gRatio) aG=max(aG,s.a);
      if(rn<=bRatio) aB=max(aB,s.a);
      if(s.a>bestA){ bestA=s.a; letter=s.rgb; }
    }
    float r=aR, g=aG, b=aB, a=r;

    // Red→yellow bleed at the growing edge; bleedMix=1 → identical on any colour.
    vec3 red=vec3(0.95,0.16,0.10), yellow=vec3(0.99,0.82,0.16);
    vec3 col=uInk;
    col=mix(col, yellow, clamp(g-b,0.0,1.0)*uBleed);
    col=mix(col, red,    clamp(r-g,0.0,1.0)*uBleed);

    // Gradient inside the circle: tint the letters + a soft glow halo (mode 4).
    // rf is a plain radial falloff around the cursor → the glow is a normal
    // CIRCLE, not letter-shaped.
    float rf=clamp(1.0 - dist/max(rEff,0.001), 0.0, 1.0) * uHover;

    // uOnText: eased 0→1 gate for "cursor over the wordmark" (computed on the
    // CPU against the text box, lerped there) → the glow fades in/out instead of
    // popping. The glow stays a round radial circle (rf); uOnText only scales it.
    vec3 tCol=mix(col, uGradColor, rf*uTint);
    vec3 outCol=mix(uGradColor, tCol, a);
    float outA=max(a, rf*uGlow*0.7*uOnText);

    gl_FragColor=vec4(outCol, outA);
  }
`;

// Ink colours the letters cross-fade between (navy = cream-hero, cream = video).
const INK_NAVY: [number, number, number] = [0.055, 0.102, 0.235];
const INK_CREAM: [number, number, number] = [0.984, 0.973, 0.945];

function MorphPlane({
  variant,
  hoverRef,
  paramsRef,
  sweepRef,
  videoOn,
  onReady,
}: {
  variant: Variant;
  hoverRef: React.MutableRefObject<number>;
  paramsRef: React.MutableRefObject<MorphParams>;
  sweepRef: SweepRef;
  videoOn?: boolean;
  onReady?: () => void;
}) {
  const { size, gl } = useThree();
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const inkRef = useRef(videoOn ? 1 : 0); // 0 = navy, 1 = cream — start at phase
  const [fontReady, setFontReady] = useState(false);
  const onReadyRef = useRef(onReady);
  onReadyRef.current = onReady;

  useEffect(() => {
    let alive = true;
    document.fonts.ready.then(() => alive && setFontReady(true));
    return () => {
      alive = false;
    };
  }, []);

  // Draw EDUSPORT to a texture that matches the real static <h1> exactly: same
  // font + variable axis + font-size, per-letter fills, pinned to the h1's
  // measured box (left edge + width) so it can't drift.
  const texture = useMemo(() => {
    if (!fontReady || size.width === 0) return null;
    const dpr = Math.min(gl.getPixelRatio(), 2);
    const w = Math.max(2, Math.floor(size.width * dpr));
    const h = Math.max(2, Math.floor(size.height * dpr));
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    const ctx = c.getContext("2d");
    if (!ctx) return null;

    const el = (gl.domElement
      .closest("[data-morph-root]")
      ?.parentElement?.querySelector("h1") ?? null) as HTMLElement | null;
    const cs = el ? getComputedStyle(el) : null;
    const fam =
      cs?.fontFamily ||
      getComputedStyle(document.documentElement).getPropertyValue("--font-climate-crisis").trim() ||
      "sans-serif";
    const weight = cs?.fontWeight || "400";
    const ls = (cs ? parseFloat(cs.letterSpacing) || 0 : 0) * dpr;
    const fs = cs ? parseFloat(cs.fontSize) * dpr : Math.floor(h * 0.62);

    ctx.font = `${weight} ${fs}px ${fam}`;
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    const fvs = cs?.fontVariationSettings;
    if (fvs && fvs !== "normal" && "fontVariationSettings" in ctx) {
      (ctx as unknown as { fontVariationSettings: string }).fontVariationSettings = fvs;
    }

    const chars = [...WORDMARK];
    const widths = chars.map((ch) => ctx.measureText(ch).width);
    const total = widths.reduce((a, b) => a + b, 0) + ls * (chars.length - 1);

    const m = ctx.measureText(WORDMARK);
    const fbAsc = m.fontBoundingBoxAscent || m.actualBoundingBoxAscent || fs * 0.8;
    const fbDesc = m.fontBoundingBoxDescent || m.actualBoundingBoxDescent || fs * 0.2;

    let baselineY = h / 2 + (fbAsc - fbDesc) / 2;
    let targetLeft = (w - total) / 2;
    let scaleX = 1;
    if (el) {
      const cbox = gl.domElement.getBoundingClientRect();
      const range = document.createRange();
      range.selectNodeContents(el);
      const rr = range.getBoundingClientRect();
      const lineH = rr.height * dpr;
      baselineY = (rr.top - cbox.top) * dpr + (lineH - (fbAsc + fbDesc)) / 2 + fbAsc;
      targetLeft = (rr.left - cbox.left) * dpr;
      const targetWidth = rr.width * dpr;
      if (total > 0 && targetWidth > 0) scaleX = targetWidth / total;
    }

    ctx.save();
    ctx.translate(targetLeft, 0);
    ctx.scale(scaleX, 1);
    let x = 0;
    chars.forEach((ch, i) => {
      ctx.fillStyle = letterColor(variant, i);
      ctx.fillText(ch, x, baselineY);
      x += widths[i] + ls;
    });
    ctx.restore();

    const tex = new THREE.CanvasTexture(c);
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.needsUpdate = true;
    return tex;
  }, [fontReady, size.width, size.height, variant, gl]);

  const uniforms = useMemo(
    () => ({
      uTex: { value: null as THREE.Texture | null },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uVel: { value: new THREE.Vector2(0, 0) },
      uHover: { value: 0 },
      uRadius: { value: PRESETS[DEFAULT_PRESET].radius },
      uThick: { value: PRESETS[DEFAULT_PRESET].thicken },
      uChroma: { value: PRESETS[DEFAULT_PRESET].bleed },
      uBleed: { value: PRESETS[DEFAULT_PRESET].bleedMix },
      uWobble: { value: PRESETS[DEFAULT_PRESET].wobble },
      uTint: { value: PRESETS[DEFAULT_PRESET].tint },
      uGlow: { value: PRESETS[DEFAULT_PRESET].glow },
      uGradColor: { value: new THREE.Vector3(...GRAD_COLOR) },
      uAspect: { value: 1 },
      uTime: { value: 0 },
      uComp: { value: 1 },
      uOnText: { value: 0 },
      uInk: { value: new THREE.Vector3(...(videoOn ? INK_CREAM : INK_NAVY)) },
    }),
    [],
  );

  // The wordmark's ink box in uv (y-up, matching uMouse) — used to fade the glow
  // in when the cursor is over the text.
  const textBoxRef = useRef<{ x0: number; x1: number; y0: number; y1: number } | null>(null);
  const onTextRef = useRef(0);
  useMemo(() => {
    const el = (gl.domElement
      .closest("[data-morph-root]")
      ?.parentElement?.querySelector("h1") ?? null) as HTMLElement | null;
    const cbox = gl.domElement.getBoundingClientRect();
    if (!el || cbox.width === 0 || cbox.height === 0) {
      textBoxRef.current = null;
      return;
    }
    const range = document.createRange();
    range.selectNodeContents(el); // text ink extent, not the full-width h1
    const rr = range.getBoundingClientRect();
    textBoxRef.current = {
      x0: (rr.left - cbox.left) / cbox.width,
      x1: (rr.right - cbox.left) / cbox.width,
      y0: 1 - (rr.bottom - cbox.top) / cbox.height,
      y1: 1 - (rr.top - cbox.top) / cbox.height,
    };
  }, [size.width, size.height, texture, gl]);

  // Effect-size compensation: keep the tuned size (originally set at a 1.8×-box
  // canvas) constant no matter how tall the canvas is. uComp = 1.8 / (canvas
  // height ÷ box height). Recomputed with the texture (both on resize).
  const compRef = useRef(1);
  compRef.current = useMemo(() => {
    const el = (gl.domElement
      .closest("[data-morph-root]")
      ?.parentElement?.querySelector("h1") ?? null) as HTMLElement | null;
    const boxH = el ? el.getBoundingClientRect().height : size.height;
    return size.height > 0 && boxH > 0 ? (1.8 * boxH) / size.height : 1;
  }, [size.height, texture, gl]);

  useEffect(() => {
    if (texture && matRef.current) matRef.current.uniforms.uTex.value = texture;
    let id = 0;
    if (texture) id = requestAnimationFrame(() => onReadyRef.current?.());
    return () => {
      if (id) cancelAnimationFrame(id);
      texture?.dispose();
    };
  }, [texture]);

  const target = useRef(new THREE.Vector2(0.5, 0.5));
  const prev = useRef(new THREE.Vector2(0.5, 0.5));

  useFrame((state) => {
    const u = matRef.current?.uniforms;
    if (!u) return;

    // Ease the letter ink toward cream (video phase) or navy (cream phase).
    inkRef.current += ((videoOn ? 1 : 0) - inkRef.current) * 0.06;
    const t = inkRef.current;
    (u.uInk.value as THREE.Vector3).set(
      INK_NAVY[0] + (INK_CREAM[0] - INK_NAVY[0]) * t,
      INK_NAVY[1] + (INK_CREAM[1] - INK_NAVY[1]) * t,
      INK_NAVY[2] + (INK_CREAM[2] - INK_NAVY[2]) * t,
    );

    const p = paramsRef.current;
    u.uRadius.value = p.radius;
    u.uThick.value = p.thicken;
    u.uChroma.value = p.bleed;
    u.uBleed.value = p.bleedMix;
    u.uWobble.value = p.wobble;
    u.uTint.value = p.tint;
    u.uGlow.value = p.glow;
    const box = textBoxRef.current;

    // ── Auto-play sweep — a self-driven virtual cursor crosses the wordmark.
    // Computed FIRST so it can seed `target` before the shared pointer pipeline
    // (lerp / velocity / hover-ease / onText) runs. That pipeline then produces
    // the exact same effect as a real hover — the sweep just supplies the
    // cursor. When idle it seeds nothing and the pointer path is untouched.
    const sw = sweepRef.current;
    if (sw.requested) {
      sw.requested = false;
      sw.startT = state.clock.elapsedTime;
      // Snap the cursor to the sweep's start point so it doesn't lerp in from
      // wherever it was — otherwise the morph visibly jumps left on the first
      // frames instead of simply beginning at the left overshoot.
      if (box) {
        const sx = box.x0 - 0.18 * (box.x1 - box.x0);
        const sy = (box.y0 + box.y1) / 2 - 0.4 * (box.y1 - box.y0); // arc(0)=0
        (u.uMouse.value as THREE.Vector2).set(sx, sy);
        prev.current.set(sx, sy);
        target.current.set(sx, sy);
      }
    }
    let sweepHover: number | null = null;
    if (sw.startT >= 0) {
      const t = (state.clock.elapsedTime - sw.startT) / SWEEP_DURATION;
      if (t >= 1) {
        sw.startT = -1; // done — pointer/hover logic takes back over
        // Snap the cursor to the real pointer so the effect doesn't visibly
        // travel back across the word after the pass finishes.
        const px = state.pointer.x * 0.5 + 0.5;
        const py = state.pointer.y * 0.5 + 0.5;
        (u.uMouse.value as THREE.Vector2).set(px, py);
        prev.current.set(px, py);
        target.current.set(px, py);
      } else if (box) {
        // Speed-modulated time: slow at the edges, fast through the centre
        // (single sine hump). speed = 1 − a·cos(2π t): minimum (1−a) at the ends,
        // maximum (1+a) at the centre. `a` is the strength (0 = constant speed).
        const a = 0.7;
        const te = t - (a * Math.sin(2 * Math.PI * t)) / (2 * Math.PI);
        // Overshoot the ink box on both sides so the pass starts left of the
        // first letter and finishes right of the last one.
        const padX = 0.18 * (box.x1 - box.x0);
        const x = box.x0 - padX + (box.x1 - box.x0 + 2 * padX) * te;
        // Arc the path: start low on the left, rise toward the letters at the
        // centre, drop low again on the right (bottom → top → bottom).
        const h = box.y1 - box.y0;
        const arc = Math.sin(Math.PI * te) * 0.45 * h;
        const y = (box.y0 + box.y1) / 2 - 0.4 * h + arc;
        target.current.set(x, y); // seed the shared pipeline below
        // Fade hover in over the first `edgeIn`, and OUT over the last `edgeOut`
        // — a longer out-fade so the effect is fully gone before the cursor
        // reaches the right end, hiding the tail of the motion.
        const edgeIn = 0.14;
        const edgeOut = 0.28;
        sweepHover =
          t < edgeIn ? t / edgeIn : t > 1 - edgeOut ? (1 - t) / edgeOut : 1;
      }
    }

    // Pointer drives the target unless the sweep seeded it this frame. Below is
    // the single shared effect pipeline — identical for hover and sweep.
    if (sweepHover === null) {
      target.current.set(state.pointer.x * 0.5 + 0.5, state.pointer.y * 0.5 + 0.5);
    }
    (u.uMouse.value as THREE.Vector2).lerp(target.current, 0.15);
    const nv = target.current.clone().sub(prev.current).multiplyScalar(0.6);
    (u.uVel.value as THREE.Vector2).multiplyScalar(0.4).add(nv);
    prev.current.copy(u.uMouse.value as THREE.Vector2);
    u.uHover.value += ((sweepHover ?? hoverRef.current) - u.uHover.value) * 0.08;
    u.uTime.value = state.clock.elapsedTime;
    u.uAspect.value = size.height > 0 ? size.width / size.height : 1;
    u.uComp.value = compRef.current;

    // Fade the glow in/out based on whether the (eased) cursor is over the text
    // box — with a small margin. Same for pointer and sweep since both feed uMouse.
    const mouse = u.uMouse.value as THREE.Vector2;
    let onTarget = 0;
    if (box) {
      const mx = 0.01;
      const my = 0.12;
      if (
        mouse.x > box.x0 - mx &&
        mouse.x < box.x1 + mx &&
        mouse.y > box.y0 - my &&
        mouse.y < box.y1 + my
      ) {
        onTarget = 1;
      }
    }
    onTextRef.current += (onTarget - onTextRef.current) * 0.12;
    u.uOnText.value = onTextRef.current;
  });

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial ref={matRef} transparent vertexShader={VERT} fragmentShader={FRAG} uniforms={uniforms} />
    </mesh>
  );
}

export default function HeroWordmarkMorph({
  variant,
  videoOn,
  onReady,
}: {
  variant: Variant;
  videoOn?: boolean;
  onReady?: () => void;
}) {
  const hoverRef = useRef(0);
  const paramsRef = useRef<MorphParams>({ ...PRESETS[DEFAULT_PRESET] });
  const sweepRef = useRef({ requested: false, startT: -1 });
  const [tune, setTune] = useState(false);
  const [showPlay, setShowPlay] = useState(false);
  const [, bump] = useState(0);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setTune(params.has("morphtune"));
    setShowPlay(params.has("morph"));
  }, []);

  return (
    <>
      <div
        data-morph-root
        className="absolute inset-0 z-20"
        onPointerEnter={() => (hoverRef.current = 1)}
        onPointerLeave={() => (hoverRef.current = 0)}
        aria-hidden
      >
        <Canvas
          gl={{ antialias: true, alpha: true }}
          dpr={[1, 2]}
          orthographic
          camera={{ position: [0, 0, 1] }}
          // Generous margin on all sides so the glow halo + outward morph never
          // clip at the texture edge. uComp keeps the effect size constant
          // regardless of this height, so the margin is free to be large. Text
          // is positioned by measuring against this box, so it doesn't move.
          style={{ position: "absolute", left: "-25%", top: "-130%", width: "150%", height: "360%" }}
        >
          <MorphPlane
            variant={variant}
            hoverRef={hoverRef}
            paramsRef={paramsRef}
            sweepRef={sweepRef}
            videoOn={videoOn}
            onReady={onReady}
          />
        </Canvas>
      </div>
      {tune && <TuningPanel paramsRef={paramsRef} onChange={() => bump((n) => n + 1)} />}
      {showPlay &&
        typeof document !== "undefined" &&
        createPortal(
          <button
            onClick={() => (sweepRef.current.requested = true)}
            style={{
              position: "fixed",
              right: 16,
              bottom: 16,
              zIndex: 100000,
              padding: "10px 16px",
              borderRadius: 999,
              border: "none",
              background: "#2138b8",
              color: "#fff",
              fontFamily: "system-ui, sans-serif",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 10px 30px rgba(0,0,0,.35)",
            }}
          >
            ▶ Play morph
          </button>,
          document.body,
        )}
    </>
  );
}

function TuningPanel({
  paramsRef,
  onChange,
}: {
  paramsRef: React.MutableRefObject<MorphParams>;
  onChange: () => void;
}) {
  const p = paramsRef.current;
  const panelRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null);
  const dragRef = useRef<{ dx: number; dy: number } | null>(null);
  // rev remounts the slider rows so they pick up new defaultValues on preset change.
  const [rev, setRev] = useState(0);
  const applyPreset = (key: string) => {
    Object.assign(paramsRef.current, PRESETS[key]);
    setRev((r) => r + 1);
    onChange();
  };

  const startDrag = (e: React.PointerEvent) => {
    const rect = panelRef.current?.getBoundingClientRect();
    if (!rect) return;
    dragRef.current = { dx: e.clientX - rect.left, dy: e.clientY - rect.top };
    const move = (ev: PointerEvent) => {
      if (!dragRef.current) return;
      setPos({ left: ev.clientX - dragRef.current.dx, top: ev.clientY - dragRef.current.dy });
    };
    const up = () => {
      dragRef.current = null;
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  const row = (
    key: keyof MorphParams,
    label: string,
    min: number,
    max: number,
    step: number,
  ) => (
    <label style={{ display: "flex", gap: 8, alignItems: "center", justifyContent: "space-between" }}>
      <span style={{ width: 62 }}>{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        defaultValue={p[key]}
        onInput={(e) => {
          paramsRef.current[key] = parseFloat((e.target as HTMLInputElement).value);
          onChange();
        }}
      />
      <b style={{ width: 46, textAlign: "right", fontFamily: "ui-monospace, monospace" }}>
        {p[key].toFixed(3)}
      </b>
    </label>
  );
  if (typeof document === "undefined") return null;

  // Portalled to <body> so it escapes the hero's translateX transform — a CSS
  // transform makes position:fixed resolve against that ancestor, which was
  // mispositioning the panel and trapping its stacking context.
  return createPortal(
    <div
      ref={panelRef}
      style={{
        position: "fixed",
        ...(pos ? { left: pos.left, top: pos.top } : { left: 16, bottom: 16 }),
        zIndex: 100000,
        background: "rgba(11,16,32,.92)",
        color: "#fff",
        padding: "12px 14px",
        borderRadius: 10,
        fontFamily: "system-ui, sans-serif",
        fontSize: 12,
        display: "grid",
        gap: 8,
        width: 250,
        boxShadow: "0 10px 30px rgba(0,0,0,.4)",
      }}
    >
      <div
        onPointerDown={startDrag}
        style={{
          fontWeight: 700,
          marginBottom: 2,
          cursor: "move",
          userSelect: "none",
          padding: "2px 0",
        }}
      >
        Wordmark morph — tuning
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        {Object.keys(PRESETS).map((k) => (
          <button
            key={k}
            onClick={() => applyPreset(k)}
            style={{
              flex: 1,
              padding: "5px 0",
              borderRadius: 6,
              border: "1px solid rgba(255,255,255,.2)",
              background: "rgba(255,255,255,.06)",
              color: "#fff",
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            Preset {k}
          </button>
        ))}
      </div>
      <div key={rev} style={{ display: "grid", gap: 8 }}>
        {row("radius", "radius", 0.05, 1.2, 0.01)}
        {row("thicken", "thicken", 0, 0.3, 0.002)}
        {row("bleed", "bleed", 0, 2, 0.01)}
        {row("bleedMix", "bleed mix", 0, 1, 0.01)}
        {row("wobble", "wobble", 0, 1, 0.01)}
        {row("tint", "tint", 0, 2, 0.01)}
        {row("glow", "glow", 0, 2, 0.01)}
      </div>
      <div style={{ opacity: 0.6, marginTop: 2 }}>
        Preset A = subtle · B = bold. Drag the title to move.
      </div>
    </div>,
    document.body,
  );
}
