// Takes wiki screenshots (and optional recordings) from the local test environment.
//   node scripts/ghid/shots.mjs --base http://localhost:1340 --state <storageState.json> [--only id,id] [--video id]
// Writes content/ghid/img/<id>.jpg (quality 80) and merges { w, h, alt, marks } into src/content/ghid/shots.json.
// --video <id> records that entry's `act` as content/ghid/video-out/<id>.webm instead of taking a shot.
import { mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { markBox } from "./marks.mjs";
import { SHOTS } from "./shots.config.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const IMG_DIR = join(root, "content/ghid/img");
const VIDEO_DIR = join(root, "content/ghid/video-out");
const JSON_PATH = join(root, "src/content/ghid/shots.json");
const DEFAULT_VIEWPORT = { width: 1280, height: 760 };
const WAIT_MS = 10_000;

function args(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i += 2) {
    if (!argv[i].startsWith("--") || argv[i + 1] === undefined) throw new Error(`bad argument: ${argv[i]}`);
    out[argv[i].slice(2)] = argv[i + 1];
  }
  return out;
}

function fail(id, msg) {
  console.error(`shot ${id}: ${msg}`);
  process.exit(1);
}

async function open(browser, entry, state, base, video) {
  const viewport = entry.viewport ?? DEFAULT_VIEWPORT;
  const context = await browser.newContext({
    viewport,
    storageState: state,
    deviceScaleFactor: 1,
    ...(video ? { recordVideo: { dir: VIDEO_DIR, size: viewport } } : {}),
  });
  const page = await context.newPage();
  await page.goto(new URL(entry.path, base).toString(), { waitUntil: "networkidle" });
  return { context, page, viewport };
}

async function shoot(browser, entry, state, base) {
  const { context, page, viewport } = await open(browser, entry, state, base, false);
  try {
    if (entry.act) await entry.act(page);
    const marks = [];
    for (const m of entry.marks ?? []) {
      const el = page.locator(m.selector).first();
      try {
        await el.waitFor({ state: "visible", timeout: WAIT_MS });
      } catch {
        fail(entry.id, `selector not found: ${m.selector}`);
      }
      const box = await el.boundingBox();
      if (!box) fail(entry.id, `selector has no box: ${m.selector}`);
      marks.push({ n: m.n, box: markBox(box, viewport) });
    }
    await mkdir(IMG_DIR, { recursive: true });
    await page.screenshot({ path: join(IMG_DIR, `${entry.id}.jpg`), type: "jpeg", quality: 80 });
    return { w: viewport.width, h: viewport.height, alt: entry.alt, marks };
  } finally {
    await context.close();
  }
}

async function record(browser, entry, state, base) {
  await mkdir(VIDEO_DIR, { recursive: true });
  const { context, page } = await open(browser, entry, state, base, true);
  const file = await page.video().path();
  try {
    if (entry.act) await entry.act(page);
  } finally {
    await context.close();
  }
  const target = join(VIDEO_DIR, `${entry.id}.webm`);
  await rm(target, { force: true });
  await rename(file, target);
  console.log(`recorded ${target}`);
}

async function main() {
  const a = args(process.argv.slice(2));
  if (!a.base || !a.state) {
    console.error("usage: node scripts/ghid/shots.mjs --base <url> --state <storageState.json> [--only id,id] [--video id]");
    process.exit(2);
  }
  const ids = new Set();
  for (const e of SHOTS) {
    if (ids.has(e.id)) fail(e.id, "duplicate id in shots.config.mjs");
    ids.add(e.id);
  }
  const browser = await chromium.launch();
  try {
    if (a.video) {
      const entry = SHOTS.find((e) => e.id === a.video);
      if (!entry) fail(a.video, "no such entry in shots.config.mjs");
      await record(browser, entry, a.state, a.base);
      return;
    }
    const only = a.only ? a.only.split(",") : null;
    for (const id of only ?? []) if (!ids.has(id)) fail(id, "no such entry in shots.config.mjs");
    const entries = SHOTS.filter((e) => !only || only.includes(e.id));
    const data = JSON.parse(await readFile(JSON_PATH, "utf8"));
    for (const entry of entries) {
      data[entry.id] = await shoot(browser, entry, a.state, a.base);
      console.log(`shot ${entry.id}`);
    }
    await writeFile(JSON_PATH, `${JSON.stringify(data, null, 2)}\n`);
  } finally {
    await browser.close();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
