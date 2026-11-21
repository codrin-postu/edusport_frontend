import type { GhidPage } from "@/lib/ghid/types";

export const confirmaInscrierePage: GhidPage = {
  slug: "confirma-o-inscriere",
  title: "Confirmă o înscriere",
  lead: "Confirmarea leagă înscrierea de fișa sportivului și, dacă alegi, de o grupă.",
  blocks: [
    {
      t: "steps",
      steps: [
        { text: "Deschide înscrierea și apasă **Confirmă înscrierea**, jos." },
        {
          text: "La **Sportiv**, dacă există deja un sportiv potrivit, alegi **Sportiv existent** sau **Sportiv nou**. Fără alegere, butonul rămâne inactiv.",
          shot: "inscrieri-confirma", marks: ["existent", "nou"],
        },
        {
          text: "La un sportiv existent, **Compară și actualizează** arată diferențele. Bifezi ce se actualizează în fișă. **Caută alt sportiv** schimbă sportivul propus.",
          shot: "inscrieri-confirma", marks: ["compara", "cauta-alt"],
        },
        {
          text: "La **Grupa** poți alege grupa. Poate rămâne **Fără grupă deocamdată**. **Grupă principală** apare doar la un sportiv existent care are deja o grupă principală, și se bifează după ce alegi grupa.",
          shot: "inscrieri-confirma", marks: ["grupa"],
        },
        {
          text: "Dedesubt, **Membru A.C.S.** cu sezonul arată starea de acum și, după săgeată, starea după confirmare. **Dorește să fie membru (formular)** arată răspunsul părintelui. Sunt rânduri de citit, nu se schimbă de aici.",
          shot: "inscrieri-confirma", marks: ["acs"],
        },
        {
          text: "Apasă **Confirmă înscrierea**. Jos apare **Înscriere confirmată**, cu **Anulează** timp de 8 secunde.",
          shot: "inscrieri-confirma", marks: ["confirma-inscrierea"],
        },
      ],
    },
    {
      t: "p",
      text: "**Abonament dorit** arată ce a ales părintele în formular. Dacă sezonul nu e în curs, grupa și **Membru A.C.S.** nu apar, iar confirmarea scrie doar legătura cu fișa.",
    },
    {
      t: "p",
      text: "După confirmare, panoul arată **Deschide fișa sportivului**, iar în **Istoric** apare o linie nouă.",
    },
    { t: "h2", text: "Dacă ai greșit" },
    {
      t: "p",
      text: "Deschide **...** din panou și apasă **Anulează confirmarea**. Fereastra spune ce se anulează: legătura cu fișa, grupa și statusul A.C.S.",
    },
    { t: "warn", text: "O înscriere cu statusul **Respins** sau arhivată nu se poate confirma." },
    { t: "links", items: [{ slug: "contacteaza-parintele" }, { slug: "muta-in-alt-sezon-sau-la-alta-scoala" }] },
  ],
};
