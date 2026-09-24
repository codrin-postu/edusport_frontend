import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { PATTERNS, FROZEN } from "./patterns.mjs";

export function countMatches(source) {
  const out = {};
  for (const p of PATTERNS) {
    const n = (source.match(p.regex) || []).length;
    if (n) out[p.id] = n;
  }
  return out;
}

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) yield* walk(full);
    else if (/\.(tsx?|css)$/.test(name)) yield full;
  }
}

export function scan(root = "src") {
  const totals = {};
  const perFile = {};
  for (const file of walk(root)) {
    const rel = relative(process.cwd(), file);
    if (FROZEN.includes(rel)) continue;
    const c = countMatches(readFileSync(file, "utf8"));
    for (const [k, v] of Object.entries(c)) {
      totals[k] = (totals[k] || 0) + v;
      (perFile[k] ||= []).push(`${rel} (${v})`);
    }
  }
  return { totals, perFile };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const BASE = "scripts/tokens/baseline.json";
  const { totals, perFile } = scan();
  if (process.argv.includes("--write-baseline")) {
    writeFileSync(BASE, JSON.stringify(totals, null, 2) + "\n");
    console.log("baseline written", totals);
    process.exit(0);
  }
  const baseline = JSON.parse(readFileSync(BASE, "utf8"));
  let failed = false;
  for (const p of PATTERNS) {
    const now = totals[p.id] || 0;
    const allowed = baseline[p.id] || 0;
    const mark = now > allowed ? "FAIL" : "ok";
    if (now > allowed) failed = true;
    console.log(`${mark.padEnd(4)} ${p.id.padEnd(18)} ${String(now).padStart(4)} (allowed ${allowed})  ${p.why}`);
    if (now > allowed && process.argv.includes("--verbose")) console.log("     " + perFile[p.id].join("\n     "));
  }
  process.exit(failed ? 1 : 0);
}
