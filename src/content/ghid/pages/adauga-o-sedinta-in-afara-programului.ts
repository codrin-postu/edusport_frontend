import type { GhidPage } from "@/lib/ghid/types";

export const adaugaSedintaInAfaraProgramuluiPage: GhidPage = {
  slug: "adauga-o-sedinta-in-afara-programului",
  title: "Adaugă o ședință în afara programului",
  lead: "Creezi o ședință care nu e în programul grupei și îi completezi prezența.",
  blocks: [
    {
      t: "steps",
      steps: [
        { text: "În **Prezență**, la **Toate ședințele**, apasă **+ Ședință nouă**, sus în dreapta.", shot: "prezenta-lista", marks: ["sedinta-noua"] },
        {
          text: "Alege **Grupă**, **Data** și **Ora**, toate obligatorii. **Durată** vine 50 min. Alege **Antrenor**.",
          shot: "prezenta-noua", marks: ["grupa", "data", "ora", "durata", "antrenor"],
        },
        { text: "Apasă **Continuă**. Se deschide panoul, ca la o ședință obișnuită.", shot: "prezenta-noua", marks: ["continua"] },
      ],
    },
    {
      t: "p",
      text: "**+ Ședință nouă** e și în tabul **Prezență** al grupei.",
    },
    {
      t: "p",
      text: "Dacă ședința există deja, fereastra spune **Există deja o ședință salvată** și oferă **Deschide prezența salvată** sau **Adaugă încă o ședință în ziua asta**.",
    },
    { t: "links", items: [{ slug: "completeaza-prezenta" }, { slug: "corecteaza-o-prezenta" }] },
  ],
};
