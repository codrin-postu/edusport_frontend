// Adds lucide icons to public/icons as standalone SVG files.
//
//   node scripts/icons/add-lucide.mjs map-pin phone chevron-down
//
// Each file holds one <symbol id="icon"> so <Icon name="..."> can point at it
// with <use>. The drawing is lucide's own; the stroke follows the text colour.
// After adding, run `node scripts/icons/build.mjs` (dev and build do it).
import { writeFileSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const lucide = require("lucide-react");

const pascal = (name) => name.split("-").map((p) => p[0].toUpperCase() + p.slice(1)).join("");

for (const name of process.argv.slice(2)) {
  const component = lucide[pascal(name)];
  if (!component) {
    console.error(`no lucide icon named "${name}" (${pascal(name)})`);
    process.exitCode = 1;
    continue;
  }
  const svg = renderToStaticMarkup(React.createElement(component));
  const inner = svg.replace(/^<svg[^>]*>/, "").replace(/<\/svg>$/, "");
  const file =
    "<svg xmlns=\"http://www.w3.org/2000/svg\"><symbol id=\"icon\" viewBox=\"0 0 24 24\" fill=\"none\" " +
    "stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\">" +
    `${inner}</symbol></svg>\n`;
  writeFileSync(`public/icons/${name}.svg`, file);
  console.log(`public/icons/${name}.svg`);
}
