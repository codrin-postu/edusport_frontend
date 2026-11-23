import type { GhidPage } from "@/lib/ghid/types";

export const adaugaSedintaInAfaraProgramuluiPage: GhidPage = {
  slug: "adauga-o-sedinta-in-afara-programului",
  title: "Adaugă o ședință în afara programului",
  lead: "O ședință care nu este în programul grupei se adaugă manual, apoi i se completează prezența.",
  blocks: [
    {
      t: "steps",
      steps: [
        { text: "În **Prezență**, la **Toate ședințele**, apasă **+ Ședință nouă**, sus în dreapta.", shot: "prezenta-lista", marks: ["sedinta-noua"] },
        {
          text: "Alege **Grupă**, **Data** și **Ora**, toate obligatorii. **Durată** are implicit 50 min. Alege **Antrenor**.",
          shot: "prezenta-noua", marks: ["grupa", "data", "ora", "durata", "antrenor"],
        },
        { text: "Apasă **Continuă**. Se deschide panoul ședinței, ca la o ședință din program.", shot: "prezenta-noua", marks: ["continua"] },
      ],
    },
    {
      t: "p",
      text: "**+ Ședință nouă** există și în tabul **Prezență** al grupei.",
    },
    {
      t: "p",
      text: "Dacă ședința există deja, fereastra spune **Există deja o ședință salvată** și oferă **Deschide prezența salvată** sau **Adaugă încă o ședință în ziua asta**.",
    },
    { t: "links", items: [{ slug: "completeaza-prezenta" }, { slug: "corecteaza-o-prezenta" }] },
  ],
};
