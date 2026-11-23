import type { GhidPage } from "@/lib/ghid/types";

export const adaugaUnSportivPage: GhidPage = {
  slug: "adauga-un-sportiv",
  title: "Adaugă un sportiv",
  lead: "Un sportiv nou se adaugă din **Sportivi**, după ce verifici că nu există deja.",
  blocks: [
    {
      t: "steps",
      steps: [
        { text: "În **Sportivi** apasă **Adaugă sportiv**, sus în dreapta.", shot: "sportivi-lista", marks: ["adauga-sportiv"] },
        {
          text: "Scrie numele în **Caută sportiv**. Dacă sportivul apare în rezultate, apasă pe el: se deschide fișa lui și nu se creează altul.",
          shot: "sportivi-adauga",
          marks: ["cauta"],
        },
        {
          text: "Dacă nu este în listă, alege **Sportiv nou**, ultimul rând, sub rezultate. Numele introdus se păstrează în **Nume complet**.",
          shot: "sportivi-adauga",
          marks: ["nou"],
        },
        {
          text: "Completează **Nume complet** și **Data nașterii** (obligatorii) și, dacă le cunoști, **Persoana de contact**, **Telefon** și **E-mail**.",
          shot: "sportivi-adauga-formular",
          marks: ["campuri"],
        },
        {
          text: "Apasă **Adaugă sportiv**. Se deschide fișa noului sportiv.",
          shot: "sportivi-adauga-formular",
          marks: ["adauga"],
        },
      ],
    },
    {
      t: "p",
      text: "Dacă același sportiv are două fișe, unește-le cu **Unește cu alt sportiv**.",
    },
    {
      t: "links",
      items: [
        { slug: "fisa-sportivului" },
        { slug: "uneste-marcheaza-inactiv-sau-sterge-un-sportiv" },
        { slug: "confirma-o-inscriere" },
      ],
    },
  ],
};
