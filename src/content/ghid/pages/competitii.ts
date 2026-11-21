import type { GhidPage } from "@/lib/ghid/types";

export const competitiiPage: GhidPage = {
  slug: "competitii",
  title: "Competiții",
  lead: "Un sportiv are competiții dintr-o singură sursă: skate-results, sau cele introduse de mână.",
  blocks: [
    { t: "h2", text: "Ce sursă se folosește" },
    {
      t: "list",
      items: [
        "Dacă profilul public al sportivului are legătură cu skate-results, se arată doar rezultatele de acolo.",
        "Dacă nu are, se arată competițiile introduse de mână în care e trecut.",
      ],
    },
    {
      t: "p",
      text: "Sursele nu se adună. Altfel același concurs ar apărea de două ori. Pagina **Realizări** de pe site citește doar skate-results.",
    },
    { t: "h2", text: "Importă din skate-results" },
    {
      t: "steps",
      steps: [
        { text: "În meniu deschide **Sportivi și echipă**, apoi **Competiții**." },
        {
          text: "La **Importă o competiție** scrie numele sau adresa rezultatelor și apasă **Caută competiție**. Alege competiția din listă cu **Importă**.",
          shot: "site-competitii", marks: ["m1", "m2"],
        },
        { text: "Competiția apare în **Competiții importate**. Un sportiv apare în rezultate după ce profilul lui are legătura cu skate-results, în editorul profilului, la cardul **Rezultate competiții**." },
      ],
    },
    { t: "h2", text: "Introdu de mână" },
    {
      t: "steps",
      steps: [
        { text: "Apasă **Comută la meniul Strapi** și alege **Editor competiție**." },
        {
          text: "Completează **Nume**, **Data** și **Sezon** (de exemplu 2024-2025), apoi **Locație** și **Nivel** (**Național** sau **Internațional**).",
          shot: "site-competitie-noua", marks: ["nume", "sezon"],
        },
        { text: "La **Sportivi participanți** caută și adaugă sportivii. La **Rezultate participanți** apasă **Adaugă rezultat** și completează **Sportiv**, **Loc** și **Punctaj**." },
        { text: "Apasă **Salvează**." },
      ],
    },
    {
      t: "p",
      text: "Competițiile introduse de mână se văd și în Content Manager, la **Club / Competiție**.",
    },
    { t: "warn", text: "La **Șterge**, din **Competiții importate**, rezultatele competiției din skate-results se elimină." },
    { t: "links", items: [{ slug: "pagini-site" }] },
  ],
};
