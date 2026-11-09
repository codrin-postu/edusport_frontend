import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const THEME = "src/styles/portal-theme.css";
const css = readFileSync(THEME, "utf8");

function decls(block) {
  const out = {};
  for (const m of block.matchAll(/^\s*(--[a-z0-9-]+):\s*([^;]+);(.*)$/gm)) out[m[1]] = { value: m[2].trim(), rest: m[3] };
  return out;
}

const mediaStart = css.indexOf("@media (width >= 56.25rem)");
const base = css.slice(0, mediaStart);
const media = css.slice(mediaStart);
const themeBlock = base.match(/@theme\s*\{([\s\S]*?)\n\}/)?.[1] ?? "";
const scopedBase = base.match(/\[data-theme="portal"\]\s*\{([\s\S]*?)\n\}/)?.[1] ?? "";
const scopedMedia = media.match(/\[data-theme="portal"\]\s*\{([\s\S]*?)\n\s*\}/)?.[1] ?? "";

const THEME_TOKENS = [
  ["--color-ice", "#8fb8f5"], ["--color-ice-light", "#e1ecfb"], ["--color-ice-blue", "#4a7bd0"],
  ["--color-nav-on-dark", "#c9d6ee"], ["--color-tag-ink", "#111111"], ["--color-cancelled", "#c0c0c4"],
  ["--breakpoint-portal", "56.25rem"],
];

// Spec 4.1 portal column.
const COMPONENT = [
  ["--color-surface", "#f6f9fd"], ["--color-surface-subtle", "#e1ecfb"], ["--color-line-subtle", "#dde6f3"],
  ["--color-overlay", "rgb(14 26 60 / 0.45)"], ["--color-card-line", "#dde6f3"], ["--card-border-width", "1px"],
  ["--color-input-line", "#b9c6da"], ["--input-border-width", "1px"], ["--input-pad-x", "14px"],
  ["--color-input-bg", "#ffffff"], ["--text-input-size", "15px"], ["--text-input-leading", "1.3"],
  ["--field-label-weight", "700"], ["--field-label-size", "14px"], ["--field-label-tracking", "0"],
  ["--field-label-case", "none"], ["--field-label-leading", "1.3"], ["--color-label-ink", "#0e1a3c"],
  ["--field-hint-size", "13px"], ["--field-hint-leading", "1.4"], ["--color-hint-ink", "#5f657a"],
  ["--field-gap", "6px"], ["--text-button-weight", "700"], ["--text-button-size", "15px"],
  ["--text-button-tracking", "0"], ["--text-button-case", "none"], ["--color-button-secondary-bg", "#ffffff"],
  ["--button-pad-x", "20px"], ["--control-border-width", "2px"], ["--color-button-face", "#0e1a3c"],
  ["--color-button-face-text", "#ffffff"], ["--button-layers", "none"],
  ["--button-face-shadow", "8px 8px 0 rgb(14 26 60 / 0.16)"], ["--button-press-shift", "0px"],
  ["--checkbox-size", "44px"], ["--checkbox-border-width", "2px"], ["--color-checkbox-line", "#b9c6da"],
  ["--color-checkbox-on", "#0e1a3c"], ["--color-checkbox-mark", "#ffffff"], ["--checkbox-mark-size", "20px"],
  ["--color-focus", "#4a7bd0"], ["--focus-offset", "2px"], ["--link-weight", "700"],
  ["--color-link-bar", "transparent"], ["--link-bar-size", "0px"], ["--color-link-hover", "#0e1a3c"],
  ["--link-hover-decoration", "underline"], ["--link-hover-animation", "none"],
  ["--dialog-title-size", "22px"], ["--dialog-title-leading", "1.2"], ["--dialog-title-tracking", "0"],
  ["--color-dialog-bg", "#ffffff"], ["--dialog-pad", "20px"], ["--dialog-max-w", "460px"],
];

// Spec 4.2 layout sizes, phone column.
const LAYOUT_PHONE = [
  ["--portal-h1-size", "30px"], ["--portal-h2-size", "22px"], ["--portal-kicker-size", "14px"],
  ["--portal-sub-size", "13px"], ["--portal-row-min-h", "76px"], ["--portal-row-pad-y", "12px"],
  ["--portal-row-pad-x", "14px"], ["--portal-row-gap", "14px"], ["--portal-row-title", "15px"],
  ["--portal-row-sub", "13px"], ["--portal-trail-w", "44px"], ["--portal-dateblock-w", "52px"],
  ["--portal-dateblock-h", "52px"], ["--portal-dateblock-radius", "6px"], ["--portal-dateblock-num", "22px"],
  ["--portal-dateblock-num-solo", "17px"], ["--portal-dateblock-word", "11px"], ["--portal-endblock-w", "96px"],
  ["--portal-typeblock-w", "64px"], ["--portal-typeblock-icon", "26px"], ["--portal-stat-num", "88px"],
  ["--portal-tap", "44px"], ["--portal-kv-min-h", "56px"], ["--portal-card-pad", "16px"],
  ["--portal-sheet-pad", "20px"], ["--portal-login-pad", "24px"], ["--portal-login-title", "28px"],
  ["--portal-page-x", "20px"], ["--portal-section-gap", "26px"], ["--portal-cols-gap", "24px"],
  ["--portal-container", "none"], ["--portal-nav-radius", "18px"], ["--portal-nav-item-radius", "13px"],
  ["--portal-nav-margin", "16px"], ["--portal-nav-pad", "6px"], ["--portal-nav-item-h", "52px"],
  ["--portal-nav-label", "11px"], ["--portal-brand-kicker", "12px"], ["--portal-brand-word", "22px"],
  ["--portal-band-on-dark-line", "rgb(246 249 253 / 0.35)"],
];

// Spec 4.2 desktop column (values that differ plus the desktop-only sidebar).
const LAYOUT_DESKTOP = [
  ["--portal-h1-size", "40px"], ["--portal-sub-size", "14px"], ["--portal-page-x", "32px"],
  ["--portal-section-gap", "32px"], ["--portal-cols-gap", "32px"], ["--portal-container", "1200px"],
  ["--portal-sidebar-w", "240px"], ["--portal-sidebar-link-h", "48px"], ["--portal-sidebar-link-size", "15px"],
];

test("one scoped block outside and one inside the desktop media query", () => {
  assert.equal(css.match(/\[data-theme="portal"\]\s*\{/g)?.length, 2);
  assert.ok(scopedBase.length > 0 && scopedMedia.length > 0);
  assert.match(css, /@media \(width >= 56\.25rem\)/);
});

function check(block, pairs) {
  const d = decls(block);
  for (const [name, value] of pairs) {
    assert.ok(d[name], `${name} missing`);
    assert.equal(d[name].value, value, `${name}`);
  }
}

test("@theme palette", () => check(themeBlock, THEME_TOKENS));
test("component tokens (spec 4.1 portal column)", () => check(scopedBase, COMPONENT));
test("layout tokens, phone (spec 4.2)", () => check(scopedBase, LAYOUT_PHONE));
test("layout tokens, desktop (spec 4.2)", () => check(scopedMedia, LAYOUT_DESKTOP));

test("every scoped declaration names its audit row or layout", () => {
  for (const block of [scopedBase, scopedMedia]) {
    for (const [name, { rest }] of Object.entries(decls(block))) {
      assert.match(rest, /\/\*\s*(?:\d+|layout)\b/, `${name} has no row comment`);
    }
  }
});

const CANVAS_HEX = /#(?:f6f9fd|dde6f3|b9c6da|8fb8f5|e1ecfb|4a7bd0|c9d6ee|111111)\b/i;
function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) yield* walk(full);
    else if (/\.(tsx?|css)$/.test(name)) yield full;
  }
}

test("no canvas hex and no data-theme outside the allowed files", () => {
  const layouts = ["src/app/(antrenor)/layout.tsx", "src/app/(sportiv)/layout.tsx"];
  for (const file of walk("src")) {
    const rel = relative(process.cwd(), file);
    if (rel === THEME) continue;
    const src = readFileSync(file, "utf8");
    assert.ok(!CANVAS_HEX.test(src), `${rel} holds a canvas hex`);
    if (rel.endsWith(".tsx") && !layouts.includes(rel)) assert.ok(!src.includes("data-theme"), `${rel} reads data-theme`);
  }
});
