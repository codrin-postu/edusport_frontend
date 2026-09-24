import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { FROZEN } from "../tokens/patterns.mjs";

export function applyMap(source, map) {
  let output = source;
  let changes = 0;
  const flagged = [];
  for (const rule of map.rules) {
    output = output.replace(rule.match, (...args) => {
      const whole = args[0];
      const groups = args.slice(1, -2);
      if (typeof rule.replace === "function") {
        const res = rule.replace(groups, whole);
        if (res === null) {
          flagged.push(whole.trim());
          return whole;
        }
        if (res !== whole) changes++;
        return res;
      }
      changes++;
      return rule.replace.replace(/\$(\d)/g, (_, i) => groups[Number(i) - 1] ?? "");
    });
  }
  return { output, changes, flagged };
}

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) yield* walk(full);
    else if (/\.(tsx?|css)$/.test(name)) yield full;
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [, , mapPath, ...flags] = process.argv;
  const map = (await import(pathToFileURL(resolve(mapPath)).href)).default;
  const write = flags.includes("--write");
  let total = 0;
  for (const file of walk("src")) {
    const rel = relative(process.cwd(), file);
    if (FROZEN.includes(rel) || (map.skip || []).some((s) => rel.startsWith(s))) continue;
    const src = readFileSync(file, "utf8");
    const { output, changes, flagged } = applyMap(src, map);
    if (changes) console.log(`${rel}: ${changes} change(s)`);
    for (const f of flagged) console.log(`${rel}: REVIEW ${f}`);
    total += changes;
    if (write && output !== src) writeFileSync(file, output);
  }
  console.log(`${write ? "applied" : "dry run"}: ${total} change(s)`);
}
