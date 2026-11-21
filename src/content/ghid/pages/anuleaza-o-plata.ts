import type { GhidPage } from "@/lib/ghid/types";

export const anuleazaPlataPage: GhidPage = {
  slug: "anuleaza-o-plata",
  title: "Anulează o plată",
  lead: "O plată greșită se anulează. Nu se șterge și nu dispare din listă.",
  blocks: [
    {
      t: "steps",
      steps: [
        { text: "În **Contabilitate**, tabul **Plăți**, apasă **...** la rândul plății. Alege **Anulează plata**.", shot: "plati-meniu", marks: ["meniu", "anuleaza-plata"] },
        {
          text: "Se deschide **Anulează plata**, cu suma și data. Apasă **Anulează plata** ca să confirmi sau **Renunță** ca să lași plata.",
          shot: "plati-confirma", marks: ["anuleaza-plata"],
        },
        { text: "Plata rămâne în listă, tăiată, cu **anulată** lângă **Pentru**. Nu se mai poate edita sau anula." },
        { text: "Dacă ai anulat din greșeală, apasă **Anulează** în mesajul **Plată anulată** de jos. Ai 8 secunde." },
      ],
    },
    { t: "p", text: "Pentru o greșeală de sumă, dată sau metodă folosește **Editează** din același meniu **...**." },
    { t: "links", items: [{ slug: "inregistreaza-o-plata" }, { slug: "contabilitate" }, { slug: "siguranta", label: "Siguranța plăților" }] },
  ],
};
