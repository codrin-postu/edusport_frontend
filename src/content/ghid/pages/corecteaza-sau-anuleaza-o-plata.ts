import type { GhidPage } from "@/lib/ghid/types";

export const anuleazaPlataPage: GhidPage = {
  slug: "corecteaza-sau-anuleaza-o-plata",
  title: "Corectează sau anulează o plată",
  lead: "O plată greșită se corectează sau se anulează. Nu se șterge și nu dispare din listă.",
  blocks: [
    { t: "h2", text: "Corectează o plată" },
    {
      t: "steps",
      steps: [
        { text: "În **Contabilitate**, tabul **Plăți**, apasă **...** (1) la rândul plății. Alege **Editează** (2).", shot: "plati-meniu", marks: ["meniu", "editeaza"], numbered: true },
        {
          text: "Se deschide **Editează plata**, cu **Pentru**, **Sumă**, **Data**, **Metodă** și **Notă**. Corectează datele greșite.",
          shot: "plati-edit", marks: ["pentru", "suma", "data", "metoda", "nota"],
        },
        { text: "Apasă **Salvează**. Apare **Salvat.**, cu **Anulează** timp de 8 secunde. Dacă nu ai modificat nimic, apare **Nicio modificare.**", shot: "plati-edit", marks: ["salveaza"] },
      ],
    },
    { t: "p", text: "Sportivul unei plăți nu se poate schimba. Dacă plata este pe sportivul greșit, anulează plata și înregistrează una nouă." },
    { t: "h2", text: "Anulează o plată" },
    {
      t: "steps",
      steps: [
        { text: "La același rând, apasă **...** (1) și alege **Anulează plata** (2).", shot: "plati-meniu", marks: ["meniu", "anuleaza-plata"], numbered: true },
        {
          text: "Se deschide **Anulează plata**, cu suma și data. Apasă **Anulează plata** ca să confirmi sau **Renunță** ca să păstrezi plata.",
          shot: "plati-confirma", marks: ["anuleaza-plata", "renunta"],
        },
        { text: "Plata rămâne în listă, tăiată, cu **anulată** lângă **Pentru**. Nu se mai poate edita sau anula." },
        { text: "O anulare greșită se revocă cu **Anulează**, în mesajul **Plată anulată** de jos, timp de 8 secunde." },
      ],
    },
    {
      t: "links",
      items: [{ slug: "inregistreaza-o-plata" }, { slug: "contabilitate-pe-scurt" }, { slug: "siguranta", label: "Siguranța plăților" }],
    },
  ],
};
