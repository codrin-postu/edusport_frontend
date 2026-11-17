// Compares the form's offline config (src/app/(site)/inscrieri/_types.ts) with the
// live public config of a running backend: GET <STRAPI>/api/forms/inscriere/config.
// Usage: STRAPI_URL=http://localhost:1338 npm run check:inscriere-config
// The live config includes admin overlay edits (renamed labels), so run it
// against a backend whose `inscriere` overlay is empty, e.g. the 2A boot check.
import assert from "node:assert/strict";

const base = process.env.STRAPI_URL ?? "http://localhost:1337";
const { FALLBACK_CONFIG } = await import("../../src/app/(site)/inscrieri/_types.ts");

// `display` is backend-only (the frontend draws consents its own way).
const strip = (config) => ({
  type: config.type,
  steps: config.steps.map((s) => ({
    key: s.key,
    title: s.title,
    questions: s.questions.map((q) => {
      const out = { ...q };
      delete out.display;
      return out;
    }),
  })),
});

const res = await fetch(`${base}/api/forms/inscriere/config`);
if (!res.ok) throw new Error(`GET ${base}/api/forms/inscriere/config: ${res.status}`);
assert.deepEqual(strip(await res.json()), strip(FALLBACK_CONFIG));
console.log("FALLBACK_CONFIG matches the live inscriere config.");
