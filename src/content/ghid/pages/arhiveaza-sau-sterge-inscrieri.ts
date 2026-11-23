import type { GhidPage } from "@/lib/ghid/types";

export const arhiveazaStergeInscrieriPage: GhidPage = {
  slug: "arhiveaza-sau-sterge-inscrieri",
  title: "Arhivează sau șterge înscrieri",
  lead: "Înscrierile vechi se arhivează, nu se șterg. **Șterge** le scoate definitiv.",
  blocks: [
    { t: "h2", text: "Arhivează" },
    {
      t: "steps",
      steps: [
        {
          text: "Bifează înscrierile și apasă **Arhivează**, în bara de sus. Jos apare **Am arhivat** și numărul.",
          shot: "inscrieri-arhiveaza", marks: ["arhiveaza"],
        },
      ],
    },
    {
      t: "p",
      text: "Lista implicită nu arată înscrierile arhivate. O înscriere arhivată are eticheta **Arhivat**, iar în panoul ei, la **Arhivare**, apare **Arhivat**.",
    },
    { t: "h2", text: "Vezi înscrierile arhivate" },
    {
      t: "steps",
      steps: [
        { text: "Apasă **Alte filtre**." },
        { text: "La **Filtru** alege **Status**, iar la valoare **Arhivat**." },
        { text: "Apasă **Adaugă filtru**." },
      ],
    },
    { t: "h2", text: "Șterge" },
    {
      t: "steps",
      steps: [
        {
          text: "Bifează înscrierile și apasă **Șterge**, în bara de sus. Confirmă când ți se cere.",
          shot: "inscrieri-arhiveaza", marks: ["sterge"],
        },
      ],
    },
    { t: "warn", text: "**Șterge** elimină definitiv înscrierea și documentele ei. Pentru înscrierile vechi folosește **Arhivează**." },
    { t: "h2", text: "Pe telefon" },
    {
      t: "steps",
      steps: [
        { text: "Apasă **...**, apoi **Selectează**, și apasă cardurile dorite." },
        {
          text: "Jos apasă **Arhivează** sau **Șterge**. Butoanele sunt inactive până bifezi cel puțin un card. **Șterge** cere o confirmare, apoi șterge definitiv.",
          shot: "inscrieri-tel-selectie", marks: ["arhiveaza", "sterge"],
        },
      ],
    },
    { t: "links", items: [{ slug: "descarca-lista-si-formularele-goale" }, { slug: "muta-in-alt-sezon-sau-la-alta-scoala" }] },
  ],
};
