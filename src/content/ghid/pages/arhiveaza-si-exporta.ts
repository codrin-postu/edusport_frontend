import type { GhidPage } from "@/lib/ghid/types";

export const arhiveazaExportaPage: GhidPage = {
  slug: "arhiveaza-si-exporta",
  title: "Arhivează și exportă",
  lead: "Înscrierile vechi se arhivează, nu se șterg. Lista și formularele goale se descarcă din Export.",
  blocks: [
    { t: "h2", text: "Arhivează" },
    {
      t: "steps",
      steps: [
        { text: "Bifează înscrierile și apasă **Arhivează**, în bara de sus. Jos apare **Am arhivat** și numărul.", shot: "inscrieri-arhiveaza" },
        { text: "Pentru a le vedea: **Alte filtre**, la **Filtru** alege **Status**, la valoare **Arhivat**, apoi **Adaugă filtru**." },
      ],
    },
    {
      t: "p",
      text: "Lista obișnuită nu arată înscrierile arhivate. Pe ele apare **Arhivat**, iar în panou, la **Arhivare**, scrie **Arhivat**.",
    },
    { t: "warn", text: "**Șterge** șterge înscrierea și documentele ei, definitiv. Pentru înscrierile vechi folosește **Arhivează**." },
    { t: "h2", text: "Exportă" },
    {
      t: "steps",
      steps: [
        { text: "Apasă **Export**, apoi **Descarcă CSV**. Fișierul urmează lista de pe ecran: sezonul, căutarea și filtrele.", shot: "inscrieri-export" },
        { text: "Tot în **Export**, la **Formulare goale**, descarci **Acord (PDF)** și **Cerere de adeziune (PDF)**, cu sezonul curent." },
      ],
    },
    { t: "links", items: [{ slug: "muta-la-alt-sezon-sau-scoala" }, { slug: "primeste-si-citeste-inscrieri" }] },
  ],
};
