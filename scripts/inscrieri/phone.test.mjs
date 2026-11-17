// Loads the TypeScript source directly (node >= 22.18 strips types natively).
import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

// CI runs Node 20, which cannot import .ts files: skip there instead of failing.
const canStripTypes = Boolean(process.features?.typescript);
const phone = canStripTypes ? await import("../../src/app/(site)/inscrieri/_phone.ts") : {};
const it = canStripTypes ? test : (name) => test.skip(name);

const ERROR = "Numărul de telefon nu este valid.";

it("phoneError accepts empty and valid numbers", () => {
  for (const v of ["0722 123 456", "+40722123456", "+44 20 7946 0958", "", undefined]) {
    assert.equal(phone.phoneError(v), undefined, String(v));
  }
});

it("phoneError rejects invalid numbers with the shared message", () => {
  assert.equal(phone.PHONE_ERROR, ERROR);
  for (const v of ["12345", "abc", "+40 12"]) assert.equal(phone.phoneError(v), ERROR, v);
});

const walk = (dir) =>
  readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });

it("loads libphonenumber only in the registration form", () => {
  const importers = walk("src")
    .filter((f) => /\.(ts|tsx)$/.test(f))
    .filter((f) => readFileSync(f, "utf8").includes("libphonenumber-js"));
  assert.deepEqual(importers, ["src/app/(site)/inscrieri/_phone.ts"]);
  assert.match(readFileSync("src/app/(site)/inscrieri/_RegistrationForm.tsx", "utf8"), /from "\.\/_phone"/);
  assert.doesNotMatch(readFileSync("src/lib/strapi-forms.ts", "utf8"), /_phone|libphonenumber/);
});
