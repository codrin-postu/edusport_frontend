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
          shot: "inscrieri-confirma",
        },
        { text: "La un sportiv existent, **Compară și actualizează** arată diferențele. Bifezi ce se actualizează în fișă. **Caută alt sportiv** schimbă sportivul propus." },
        { text: "La **Grupa** poți alege grupa. Poate rămâne **Fără grupă deocamdată**." },
        { text: "Apasă **Confirmă înscrierea**. Jos apare **Înscriere confirmată**, cu **Anulează** timp de 8 secunde." },
      ],
    },
    {
      t: "p",
      text: "După confirmare, panoul arată **Deschide fișa sportivului**, iar în **Istoric** apare o linie nouă.",
    },
    { t: "h2", text: "Dacă ai greșit" },
    {
      t: "p",
      text: "Deschide **...** din panou și apasă **Anulează confirmarea**. Se anulează legătura cu fișa, grupa și statusul A.C.S.",
    },
    { t: "warn", text: "O înscriere cu statusul **Respins** sau arhivată nu se poate confirma." },
    { t: "links", items: [{ slug: "trimite-un-mesaj" }, { slug: "muta-la-alt-sezon-sau-scoala" }] },
  ],
};
