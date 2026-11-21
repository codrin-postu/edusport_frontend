import type { GhidPage } from "@/lib/ghid/types";

export const programulUneiGrupePage: GhidPage = {
  slug: "programul-unei-grupe",
  title: "Programul unei grupe",
  lead: "Programul obișnuit se scrie o dată. Apoi fiecare dată se poate ține, anula sau muta.",
  blocks: [
    {
      t: "steps",
      steps: [
        {
          text: "Deschide grupa și apasă tabul **Program**. **Program obișnuit** arată orele, de exemplu Lu și Mi, 19:00, 60 min, și data de la care se aplică.",
          shot: "grupe-program", marks: ["schimba", "adauga-program"],
        },
        { text: "Apasă **Adaugă program**. Cu **Se repetă** pornit, alege **Cât de des**: **Săptămânal**, **La 2 săptămâni** sau **Lunar**. Apoi bifează **Zile**.", shot: "grupe-program-nou", marks: ["zile", "salveaza"] },
        { text: "Completează **De la** (ora), **Durată** și **Se aplică din**, apoi apasă **Salvează**." },
        { text: "Pentru o oră unică, oprește **Se repetă**. Apar **Data**, ora, **Durată** și **Notă**." },
      ],
    },
    { t: "h2", text: "Schimbă sau șterge programul" },
    {
      t: "p",
      text: "**Schimbă**, lângă program, deschide **Schimbă programul**, cu aceleași câmpuri. **Se aplică din** spune de când e valabilă schimbarea.",
    },
    {
      t: "warn",
      text: "**Șterge programul** oprește seria de la data din **Se aplică din**. Datele de dinainte rămân.",
    },
    { t: "h2", text: "Doar o dată" },
    {
      t: "steps",
      steps: [
        { text: "Apasă o dată din calendarul grupei sau din **Calendar și serii**. Panoul arată ziua, ora și grupa." },
        { text: "La **Această dată** alege **Ține**, **Anulează** sau **Mută**.", shot: "program-data", marks: ["anunta-parintii", "salveaza"] },
        { text: "La **Anulează** și **Mută** scrie **Motiv**. La **Mută** alege și **Data nouă** și ora de la **De la**." },
        { text: "Bifează **Anunță părinții pe e-mail**, dacă vrei să primească un mesaj. Mesajul pleacă la adresele de contact ale sportivilor din grupă." },
        { text: "Apasă **Salvează**." },
      ],
    },
    {
      t: "p",
      text: "O oră unică are în panou și **Șterge ședința**. O dată din pauză se citește doar: panoul spune **Pauză** și numele ei.",
    },
    { t: "links", items: [{ slug: "calendar-si-serii" }, { slug: "pauze" }] },
  ],
};
