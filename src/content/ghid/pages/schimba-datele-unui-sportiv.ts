import type { GhidPage } from "@/lib/ghid/types";

export const schimbaDateleUnuiSportivPage: GhidPage = {
  slug: "schimba-datele-unui-sportiv",
  title: "Schimbă datele unui sportiv",
  lead: "Numele, data nașterii și datele de contact se schimbă din tabul **Date** al fișei.",
  blocks: [
    {
      t: "steps",
      steps: [
        {
          text: "Deschide fișa sportivului, tabul **Date** (1). Apasă **Editează** (2), în dreapta cardului.",
          shot: "sportivi-fisa",
          marks: ["tab-date", "editeaza"], numbered: true,
        },
        {
          text: "Schimbă **Nume și prenume**, **Data nașterii**, **Persoana de contact**, **Telefon** sau **E-mail**.",
          shot: "sportivi-editare",
          marks: ["campuri"],
        },
        {
          text: "Apasă **Salvează**. **Renunță** închide editarea fără să schimbe nimic.",
          shot: "sportivi-editare",
          marks: ["salveaza", "renunta"],
        },
      ],
    },
    {
      t: "p",
      text: "După salvare apare unul dintre mesajele **Salvat. Datele sunt complete.**, **Salvat. Mai lipsesc:** urmat de câmpurile goale, sau **Nicio modificare.**",
    },
    {
      t: "p",
      text: "Numele este obligatoriu. Celelalte câmpuri pot rămâne goale, dar sportivul apare în listă cu **Lipsesc:** până se completează.",
    },
    {
      t: "p",
      text: "**Membru A.C.S.** apare în **Date** cu sezonul, de exemplu **Membru A.C.S. 2026-2027**, doar de citit. Nu se schimbă din **Editează**.",
    },
    { t: "links", items: [{ slug: "fisa-sportivului" }, { slug: "documentele-sportivului" }] },
  ],
};
