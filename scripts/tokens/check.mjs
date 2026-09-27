import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { PATTERNS, FROZEN, ALLOWLIST } from "./patterns.mjs";

// Strips // line comments, /* */ block comments (which also covers JSX
// {/* */} comments, since the braces themselves match no pattern) while
// leaving string contents alone, so a "//" inside a string like a URL is
// never mistaken for a line comment.
export function stripComments(source) {
  let out = "";
  let i = 0;
  const n = source.length;
  let inString = null; // one of ' " ` while inside a string/template literal
  while (i < n) {
    const c = source[i];
    const c2 = i + 1 < n ? source[i + 1] : "";
    if (inString) {
      if (c === "\\") {
        out += c + c2;
        i += 2;
        continue;
      }
      out += c;
      if (c === inString) inString = null;
      i++;
      continue;
    }
    if (c === "\"" || c === "'" || c === "`") {
      inString = c;
      out += c;
      i++;
      continue;
    }
    if (c === "/" && c2 === "/") {
      while (i < n && source[i] !== "\n") i++;
      continue;
    }
    if (c === "/" && c2 === "*") {
      i += 2;
      while (i < n && !(source[i] === "*" && source[i + 1] === "/")) i++;
      i += 2;
      continue;
    }
    out += c;
    i++;
  }
  return out;
}

export function countMatches(source) {
  const stripped = stripComments(source);
  const out = {};
  for (const p of PATTERNS) {
    const n = (stripped.match(p.regex) || []).length;
    if (n) out[p.id] = n;
  }
  return out;
}

function isAllowlisted(relPath, patternId) {
  return ALLOWLIST.some((entry) => entry.file === relPath && entry.id === patternId);
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
      if (isAllowlisted(rel, k)) continue;
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
