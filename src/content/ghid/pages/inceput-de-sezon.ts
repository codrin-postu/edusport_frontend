import type { GhidPage } from "@/lib/ghid/types";

export const inceputDeSezonPage: GhidPage = {
  slug: "inceput-de-sezon",
  title: "Început de sezon: lista de pași",
  lead: "Ce faci o dată pe an, ca să treci clubul într-un sezon nou.",
  blocks: [
    { t: "h2", text: "1. Creează sezonul" },
    {
      t: "steps",
      steps: [
        { text: "În meniu apasă **Sezoane**, apoi **Sezon nou**.", shot: "sezoane-lista", marks: ["sezon-nou"] },
        {
          text: "Completează **Sezon** (se scrie 2026-2027, doi ani la rând), **Început**, **Sfârșit** și **Taxă de membru**, apoi apasă **Salvează**. Câmpurile vin completate după sezonul anterior: verifică-le.",
        },
      ],
    },
    { t: "warn", text: "Un sezon cu înscrieri nu își mai schimbă numele: **Are înscrieri, nu se mai schimbă.**" },
    { t: "h2", text: "2. Verifică prețurile" },
    { t: "p", text: "Deschide **Prețuri** și schimbă ce s-a modificat pentru noul sezon." },
    { t: "h2", text: "3. Începe sezonul" },
    {
      t: "p",
      text: "Butonul **Începe sezonul** apare pe rândul sezonului de după cel curent. Până la ultimul pas nu se schimbă nimic.",
    },
    {
      t: "steps",
      steps: [
        { text: "În **Sezoane**, apasă **Începe sezonul** pe rândul sezonului nou." },
        {
          text: "Pasul 1 din 3 arată ce se schimbă: formularul de înscriere trece pe sezonul nou, **Grupe** și **Sportivi** se deschid pe el, sezonul vechi rămâne doar citire. Apasă **Continuă**.",
        },
        {
          text: "Pasul 2 din 3: pentru fiecare grupă bifează **Copiază sportivii** și **Copiază programul**. **Vezi sportivii** arată lista. Sportivii inactivi nu se copiază.",
        },
        { text: "Pasul 3 din 3 este rezumatul. Apasă **Începe sezonul** ca să aplici." },
      ],
    },
    {
      t: "warn",
      text: "Sezonul nou devine sezonul curent. **Membru A.C.S.** pornește de la **Nu** pentru toți. Pauzele nu se copiază.",
    },
    { t: "h2", text: "4. După începerea sezonului" },
    {
      t: "list",
      items: [
        "Adaugă din nou pauzele și vacanțele, la **Pauze**.",
        "Verifică grupele și sportivii fără grupă, la **Grupe**.",
        "Verifică programul fiecărei grupe.",
        "Mută înscrierile rămase în sezonul nou.",
      ],
    },
    {
      t: "links",
      items: [
        { slug: "preturi" },
        { slug: "creeaza-o-grupa" },
        { slug: "programul-unei-grupe" },
        { slug: "pauze-si-vacante" },
        { slug: "muta-in-alt-sezon-sau-la-alta-scoala" },
      ],
    },
  ],
};
