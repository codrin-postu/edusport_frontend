import type { GhidPage } from "@/lib/ghid/types";

export const competitiiPage: GhidPage = {
  slug: "competitii-si-rezultate",
  title: "Competiții și rezultate",
  lead: "Competițiile unui sportiv provin dintr-o singură sursă: skate-results sau introducerea manuală.",
  blocks: [
    { t: "h2", text: "Ce sursă se folosește" },
    {
      t: "list",
      items: [
        "Dacă profilul public al sportivului are legătură cu skate-results, se arată doar rezultatele de acolo.",
        "Altfel, se arată competițiile introduse manual la care este trecut.",
      ],
    },
    {
      t: "p",
      text: "skate-results este serviciul care păstrează rezultatele competițiilor importate. Legătura cu un sportiv se face din profilul lui public.",
    },
    {
      t: "p",
      text: "Sursele nu se combină, ca aceeași competiție să nu apară de două ori. Pagina **Realizări** de pe site citește doar skate-results.",
    },
    { t: "h2", text: "Importă din skate-results" },
    {
      t: "steps",
      steps: [
        { text: "În meniu deschide **Sportivi și echipă**, apoi **Competiții**." },
        {
          text: "La **Importă o competiție** (1) scrie numele și apasă **Caută competiție** (2). Alege-o din listă cu **Importă**.",
          shot: "site-competitii",
          marks: ["nume-competitie", "cauta-competitie"], numbered: true,
        },
        { text: "Competiția apare în **Competiții importate**." },
        { text: "Un sportiv apare în rezultate după ce profilul lui este legat de skate-results, din cardul **Rezultate competiții** al profilului." },
      ],
    },
    { t: "h2", text: "Adaugă manual" },
    {
      t: "steps",
      steps: [
        { text: "Apasă **Comută la meniul Strapi** și alege **Editor competiție**." },
        {
          text: "Completează **Nume**, **Data** și **Sezon** (de exemplu 2024-2025), apoi **Locație** și **Nivel** (**Național** sau **Internațional**).",
          shot: "site-competitie-noua",
          marks: ["nume", "data", "sezon", "locatie", "nivel"],
        },
        { text: "La **Sportivi participanți** caută și adaugă sportivii. La **Rezultate participanți** apasă **Adaugă rezultat** și completează **Sportiv**, **Loc** și **Punctaj**." },
        { text: "Apasă **Salvează**." },
      ],
    },
    {
      t: "p",
      text: "Competițiile introduse manual se văd și în Content Manager, la **Club / Competiție**.",
    },
    { t: "warn", text: "**Șterge**, din **Competiții importate**, elimină rezultatele competiției preluate din skate-results." },
    { t: "links", items: [{ slug: "profil-public-si-rezultate" }, { slug: "paginile-site-ului" }] },
  ],
};
