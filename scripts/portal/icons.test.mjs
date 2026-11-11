import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

// name -> [stroke-width, stroke-linecap]
const ICONS = {
  "portal-azi": ["2", "round"],
  "portal-grupe": ["2", "round"],
  "portal-concursuri": ["2", "round"],
  "portal-istoric": ["2", "round"],
  "portal-profil": ["2", "round"],
  "portal-chevron-right": ["2.5", "square"],
  "portal-chevron-down": ["2.5", "square"],
  "portal-check": ["3", "square"],
  "portal-status-done": ["2.4", "square"],
  "portal-status-todo": ["2.4", "square"],
  "portal-phone": ["2", "round"],
  "portal-whatsapp": ["2", "round"],
  "portal-copy": ["2", "round"],
};

const names = readFileSync("src/components/ui/icon-names.ts", "utf8");

for (const [name, [width, cap]] of Object.entries(ICONS)) {
  test(`${name} is a canvas icon symbol`, () => {
    const file = `public/icons/${name}.svg`;
    assert.ok(existsSync(file), `${file} missing`);
    const svg = readFileSync(file, "utf8");
    assert.match(svg, /<symbol id="icon" viewBox="0 0 24 24"/);
    assert.match(svg, /stroke="currentColor"/);
    assert.match(svg, new RegExp(`stroke-width="${width.replace(".", "\\.")}"`));
    assert.match(svg, new RegExp(`stroke-linecap="${cap}"`));
    assert.ok(names.includes(`"${name}"`), `${name} not in icon-names.ts`);
  });
}

test("icon sizes 18, 20 and 26 map to tokens", () => {
  const icon = readFileSync("src/components/ui/icon.tsx", "utf8");
  for (const n of ["18", "20", "26"]) assert.ok(icon.includes(`size-(--icon-${n})`), `size ${n}`);
  const css = readFileSync("src/app/globals.css", "utf8");
  for (const [n, px] of [["18", "18px"], ["20", "20px"], ["26", "26px"]]) assert.ok(css.includes(`--icon-${n}: ${px};`));
});
