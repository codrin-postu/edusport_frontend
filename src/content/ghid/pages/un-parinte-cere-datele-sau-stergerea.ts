import type { GhidPage } from "@/lib/ghid/types";

export const parinteCereDatelePage: GhidPage = {
  slug: "un-parinte-cere-datele-sau-stergerea",
  title: "Cereri privind datele personale",
  lead: "Părintele nu poate exporta sau șterge datele din portal. Cererile lui le rezolvă administratorul, din panou.",
  blocks: [
    {
      t: "steps",
      steps: [
        { text: "Datele din portal sunt doar de citit; orice cerere se rezolvă din panou." },
        { text: "Pentru o copie a datelor: **Exportă datele**, din fișa sportivului. Trimite fișierul doar părintelui." },
        { text: "Pentru o corectare: schimbă datele în fișă, tabul **Date**." },
        { text: "Pentru ștergere: întâi **Exportă datele**, dacă părintele dorește o copie. Apoi un Super Admin apasă **Anonimizează**." },
        { text: "La anonimizare accesul în portal se oprește imediat, iar părintele vede **Nu mai ai acces la acest sportiv.**" },
      ],
    },
    { t: "warn", text: "Anonimizarea nu se poate anula, iar după ea exportul nu mai este posibil. Exportă datele înainte." },
    {
      t: "p",
      text: "Profilul public și rezultatele de pe site se ascund separat. Dacă părintele renunță doar la portal, folosește **Scoate accesul**.",
    },
    {
      t: "links",
      items: [
        { slug: "exporta-datele-unui-sportiv" },
        { slug: "schimba-datele-unui-sportiv" },
        { slug: "anonimizeaza-un-sportiv" },
        { slug: "ce-ramane-dupa-anonimizare" },
        { slug: "profil-public-si-rezultate" },
        { slug: "scoate-accesul-unui-parinte" },
      ],
    },
  ],
};
