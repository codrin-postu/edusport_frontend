// Builds index.html for the click-through renders: node scripts/portal/clickthrough-index.mjs <out dir>
// Reads <out dir>/steps.json (written by clickthrough.mjs) and docs/portal/mockups/companion-light.html (prepended).
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const out = process.argv[2];
const steps = JSON.parse(readFileSync(join(out, "steps.json"), "utf8"));
const light = readFileSync(new URL("../../docs/portal/mockups/companion-light.html", import.meta.url), "utf8");
const found = [
  "Sportiv nou: backend citește data nașterii doar ca ZZ.LL.AAAA, selectorul trimitea AAAA-LL-ZZ și serverul răspundea \"Alegeți data nașterii.\". Reparat în NewAthlete, mock-ul are aceeași regulă.",
  "Grupe și grupa altui antrenor: o grupă fără antrenor ieșea cu rândul gol \"Antrenor:\". Rândul se ascunde acum.",
  "Resetare parolă: fără cheie de e-mail serverul răspunde 503 \"Nu am putut trimite e-mailul. Încearcă din nou.\" (pasul 2 se vede din mock).",
  "Textul \"Salvată de\": serverul scrie \"Salvată de Antrenor <nume>, data\", mock-ul scria doar numele. Textul vine de la backend, deschis pentru decizie.",
  "Fereastra de 7 zile: ședințele arhivate și ziua liberă nu se pot crea pe serverul real, de aceea imaginile marcate \"mock\".",
];
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
const body = steps.map((s) => `
<section id="s${s.nn}">
  <h2><span class="n">${Number(s.nn)}</span> ${esc(s.caption)}</h2>
  <div class="pair">
    ${s.files.phone ? `<figure class="phone"><img src="${s.files.phone}" alt="${esc(s.caption)}, telefon" loading="lazy"><figcaption>telefon 390 x 844</figcaption></figure>` : ""}
    ${s.files.desktop ? `<figure class="desktop"><img src="${s.files.desktop}" alt="${esc(s.caption)}, desktop" loading="lazy"><figcaption>desktop 1280 x 900</figcaption></figure>` : ""}
  </div>
  ${s.note ? `<p class="note">${esc(s.note)}</p>` : ""}
</section>`).join("\n");
writeFileSync(join(out, "index.html"), `<!doctype html>
<html lang="ro"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Faza 6, aplicația antrenorului: parcurgere</title>
${light}
<style>
body{font-family:system-ui,sans-serif;margin:0;padding:24px;background:#f5f5f7;color:#1d1d1f}
h1{font-size:22px;margin:0 0 8px} h2{font-size:16px;margin:0 0 12px} .n{display:inline-block;min-width:28px;padding:2px 6px;background:#1d1d1f;color:#fff;text-align:center;margin-right:6px}
section{background:#fff;border:1px solid #d1d1d6;padding:16px;margin:0 0 20px}
.pair{display:flex;gap:16px;align-items:flex-start;flex-wrap:wrap}
figure{margin:0} img{display:block;border:1px solid #d1d1d6;max-width:100%;height:auto}
.phone img{width:390px} .desktop img{width:760px} figcaption{font-size:12px;color:#86868b;margin-top:4px}
.note{font-size:13px;color:#8a6d00;margin:10px 0 0} ul{font-size:14px;line-height:1.5}
</style></head><body>
<h1>Aplicația antrenorului, faza 6: parcurgere pe serverul real</h1>
<p>Imagini în mod luminos, pe un Strapi și un Postgres de unică folosință, cu date inventate. Imaginile marcate \"mock\" vin din serverul fals.</p>
<h2>Găsit față de serverul real</h2>
<ul>${found.map((f) => `<li>${esc(f)}</li>`).join("")}</ul>
${body}
</body></html>`);
