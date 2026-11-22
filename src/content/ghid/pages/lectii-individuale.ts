import type { GhidPage } from "@/lib/ghid/types";

export const lectiiIndividualePage: GhidPage = {
  slug: "lectii-individuale",
  title: "Lecții individuale",
  lead: "O lecție individuală e o ședință a unui sportiv cu un antrenor. O programezi și o completezi din Prezență.",
  blocks: [
    {
      t: "steps",
      steps: [
        {
          text: "În **Prezență**, deschide **Toate ședințele** și alege **Lecții individuale**. Lista arată lecțiile perioadei, cu **Ora**, **Sportiv**, **Antrenor** și **Stare**.",
          shot: "prezenta-lectii", marks: ["lectii"],
        },
        { text: "Apasă **+ Lecție individuală**, sus în dreapta.", shot: "prezenta-lectii", marks: ["lectie-noua"] },
        {
          text: "Caută **Sportiv**. Alege **Data** și **Ora**, obligatorii, apoi **Durată** și **Antrenor**. După ce alegi sportivul, apare antrenorul lui obișnuit, pe care îl poți schimba.",
          shot: "prezenta-lectie-noua", marks: ["sportiv", "data", "ora", "durata", "antrenor"],
        },
        { text: "Apasă **Salvează**. Mesajul de confirmare are **Anulează**.", shot: "prezenta-lectie-noua", marks: ["salveaza"] },
      ],
    },
    { t: "h2", text: "Completează sau schimbă o lecție" },
    {
      t: "steps",
      steps: [
        { text: "Apasă pe lecție în listă. Bifa de lângă numele sportivului spune dacă a venit.", shot: "prezenta-lectie-panou", marks: ["sportiv"] },
        { text: "Poți schimba **Antrenor** și **Durată**.", shot: "prezenta-lectie-panou", marks: ["antrenor", "durata"] },
        { text: "Apasă **Salvează**. Apare mesajul Salvat.", shot: "prezenta-lectie-panou", marks: ["salveaza"] },
        {
          text: "**Șterge lecția**, sub **Durată**, cere confirmarea. Apare doar cât nicio plată neanulată nu e legată de lecție. Mesajul de după are **Anulează**.",
          shot: "prezenta-lectie-panou", marks: ["sterge"],
        },
      ],
    },
    {
      t: "p",
      text: "**...** de lângă sportiv are **+ Plată**. După ce lecția e salvată cu sportivul prezent, plata se alege singură pe lecția aceasta.",
    },
    {
      t: "p",
      text: "O lecție anulată arată **Anulată** și motivul, și nu se mai schimbă.",
    },
    { t: "links", items: [{ slug: "completeaza-prezenta" }, { slug: "corecteaza-o-prezenta" }] },
  ],
};
