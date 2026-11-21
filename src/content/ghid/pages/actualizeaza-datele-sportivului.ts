import type { GhidPage } from "@/lib/ghid/types";

export const actualizeazaDateleSportivuluiPage: GhidPage = {
  slug: "actualizeaza-datele-sportivului",
  title: "Actualizează datele unui sportiv",
  lead: "Numele, data nașterii și datele de contact se schimbă din tabul Date al fișei.",
  blocks: [
    {
      t: "steps",
      steps: [
        { text: "Deschide fișa sportivului, tabul **Date**. Apasă **Editează**, în dreapta cardului.", shot: "sportivi-fisa" },
        {
          text: "Schimbă **Nume și prenume**, **Data nașterii**, **Persoana de contact**, **Telefon** sau **E-mail**.",
          shot: "sportivi-editare",
        },
        { text: "Apasă **Salvează**. **Renunță** închide editarea fără să schimbe nimic." },
      ],
    },
    {
      t: "p",
      text: "După salvare apare unul dintre mesajele **Salvat. Datele sunt complete.**, **Salvat. Mai lipsesc:** urmat de câmpurile goale, sau **Nicio modificare.**",
    },
    {
      t: "p",
      text: "Fără nume nu se salvează. Celelalte câmpuri pot rămâne goale, dar sportivul apare în listă cu **Lipsesc:** până se completează.",
    },
    {
      t: "p",
      text: "**Membru A.C.S.** se vede în Date, dar nu se schimbă din editare.",
    },
    { t: "links", items: [{ slug: "fisa-sportivului" }, { slug: "documentele-sportivului" }] },
  ],
};
