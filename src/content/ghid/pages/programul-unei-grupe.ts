import type { GhidPage } from "@/lib/ghid/types";

export const programulUneiGrupePage: GhidPage = {
  slug: "programul-unei-grupe",
  title: "Programul unei grupe",
  lead: "Programul obișnuit al unei grupe se stabilește o dată și se modifică la nevoie.",
  blocks: [
    {
      t: "steps",
      steps: [
        {
          text: "Deschide grupa și apasă tabul **Program** (1). **Program obișnuit** (2) arată orele, de exemplu Lu și Mi, 19:00, și data de la care se aplică.",
          shot: "grupe-program", marks: ["tab-program", "program-obisnuit"], numbered: true,
        },
        { text: "Apasă **Adaugă program**.", shot: "grupe-program", marks: ["adauga-program"] },
        {
          text: "Pentru un program recurent lasă **Se repetă** pornit, alege **Cât de des** și bifează **Zile**. Pentru o ședință unică oprește **Se repetă**: apar **Data**, ora, **Durată** și **Notă**.",
          shot: "grupe-program-nou", marks: ["se-repeta", "cat-de-des", "zile"],
        },
        {
          text: "Alege ora la **De la** și **Durată**. La o serie alege și **Se aplică din**, apoi apasă **Salvează**.",
          shot: "grupe-program-nou", marks: ["de-la", "durata", "se-aplica", "salveaza"],
        },
      ],
    },
    {
      t: "p",
      text: "**Cât de des** are **Săptămânal**, **La 2 săptămâni** și **Lunar**.",
    },
    { t: "h2", text: "Schimbă sau șterge programul" },
    {
      t: "p",
      text: "**Schimbă**, lângă program, deschide **Schimbă programul**, cu aceleași câmpuri. **Se aplică din** stabilește data de la care este valabilă schimbarea.",
    },
    {
      t: "warn",
      text: "**Șterge programul** oprește seria de la data din **Se aplică din**. Ședințele anterioare acestei date rămân.",
    },
    { t: "links", items: [{ slug: "anuleaza-sau-muta-o-sedinta" }, { slug: "calendar-si-evenimente" }] },
  ],
};
