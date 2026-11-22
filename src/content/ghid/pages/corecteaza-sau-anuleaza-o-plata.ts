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
        { text: "În **Contabilitate**, tabul **Plăți**, apasă **...** la rândul plății. Alege **Editează**.", shot: "plati-meniu", marks: ["meniu", "editeaza"] },
        {
          text: "Se deschide **Editează plata**, cu **Pentru**, **Sumă**, **Data**, **Metodă** și **Notă**. Schimbă ce e greșit.",
          shot: "plati-edit", marks: ["pentru", "suma", "data", "metoda", "nota"],
        },
        { text: "Apasă **Salvează**. Apare **Salvat.**, cu **Anulează** timp de 8 secunde. Fără nicio schimbare, apare **Nicio modificare.**", shot: "plati-edit", marks: ["salveaza"] },
      ],
    },
    { t: "p", text: "Sportivul unei plăți nu se schimbă. Dacă plata e pe sportivul greșit, anulează plata și înregistrează una nouă." },
    { t: "h2", text: "Anulează o plată" },
    {
      t: "steps",
      steps: [
        { text: "La același rând, apasă **...** și alege **Anulează plata**.", shot: "plati-meniu", marks: ["meniu", "anuleaza-plata"] },
        {
          text: "Se deschide **Anulează plata**, cu suma și data. Apasă **Anulează plata** ca să confirmi sau **Renunță** ca să lași plata.",
          shot: "plati-confirma", marks: ["anuleaza-plata", "renunta"],
        },
        { text: "Plata rămâne în listă, tăiată, cu **anulată** lângă **Pentru**. Nu se mai poate edita sau anula." },
        { text: "Dacă ai anulat din greșeală, apasă **Anulează** în mesajul **Plată anulată** de jos. Ai 8 secunde." },
      ],
    },
    {
      t: "links",
      items: [{ slug: "inregistreaza-o-plata" }, { slug: "contabilitate-pe-scurt" }, { slug: "siguranta", label: "Siguranța plăților" }],
    },
  ],
};
