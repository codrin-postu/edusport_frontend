import type { GhidPage } from "@/lib/ghid/types";

export const descarcaListaFormularePage: GhidPage = {
  slug: "descarca-lista-si-formularele-goale",
  title: "Descarcă lista și formularele goale",
  lead: "Lista înscrierilor se descarcă ca CSV, iar formularele goale ca PDF, din **Export**.",
  blocks: [
    {
      t: "steps",
      steps: [
        {
          text: "Apasă **Export** (1), apoi **Descarcă CSV** (2). Fișierul urmează lista de pe ecran: sezonul, căutarea și filtrele.",
          shot: "inscrieri-export", marks: ["export", "descarca-csv"], numbered: true,
        },
        {
          text: "Tot în **Export**, la **Formulare goale**, descarci **Acord (PDF)** și **Cerere de adeziune (PDF)**, cu sezonul curent.",
          shot: "inscrieri-export", marks: ["acord-pdf", "cerere"],
        },
      ],
    },
    { t: "links", items: [{ slug: "citeste-inscrierile" }, { slug: "arhiveaza-sau-sterge-inscrieri" }] },
  ],
};
