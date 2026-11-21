import type { GhidPage } from "@/lib/ghid/types";

export const anonimizeazaSportivPage: GhidPage = {
  slug: "anonimizeaza-un-sportiv",
  title: "Anonimizează un sportiv",
  lead: "Anonimizarea șterge datele personale ale unui sportiv. O face doar Super Admin și nu se poate anula.",
  blocks: [
    {
      t: "steps",
      steps: [
        { text: "Dacă părintele cere datele, fă întâi **Exportă datele**. După anonimizare exportul nu mai merge." },
        { text: "Deschide fișa sportivului. Sus, în dreapta, apasă **...**, apoi **Anonimizează**." },
        {
          text: "Fereastra **Anonimizezi datele sportivului?** spune ce se șterge și ce rămâne. Apasă **Anonimizează**. **Anulează** închide fără nicio schimbare.",
          shot: "date-confirmare",
        },
        { text: "Apare **1 sportiv anonimizat.** Numele din fișă devine **Sportiv anonimizat**." },
      ],
    },
    { t: "warn", text: "**Nu se poate anula.** Datele șterse nu se mai pot recupera din panou." },
    {
      t: "p",
      text: "**Administrator club** nu vede **Anonimizează** în meniu. În Istoric rămâne linia **Date anonimizate**.",
    },
    { t: "links", items: [{ slug: "ce-ramane-dupa-anonimizare" }, { slug: "sportivi-inactivi" }, { slug: "exporta-datele-unui-sportiv" }] },
  ],
};
