import type { GhidPage } from "@/lib/ghid/types";

export const meniulSiPaginaAcasaPage: GhidPage = {
  slug: "meniul-si-pagina-acasa",
  title: "Meniul și pagina Acasă",
  lead: "Cum găsești paginile din panou și ce arată pagina Acasă.",
  blocks: [
    { t: "h2", text: "Meniul" },
    {
      t: "steps",
      steps: [
        { text: "Apasă o grupă din stânga, de exemplu **Club și școală**, ca să vezi paginile ei.", shot: "primii-meniu", marks: ["club-scoala"] },
        { text: "Sus, sub **Acasă**, sunt paginile folosite des: **Anunțuri**, **Setări site**, **Sezoane** și **Meniu site**." },
        { text: "Jos sunt **Contul meu** și **Ieși din cont**." },
      ],
    },
    { t: "p", text: "Fiecare cont vede doar grupele și paginile permise de rolul lui." },
    { t: "h2", text: "Pe telefon" },
    {
      t: "steps",
      steps: [
        { text: "Apasă butonul de meniu din dreapta sus.", shot: "primii-telefon", marks: ["meniu"] },
        { text: "Se deschide **Navigare**, cu aceleași grupe. Alege pagina, de exemplu **Sportivi**.", shot: "primii-telefon-meniu", marks: ["sportivi"] },
      ],
    },
    { t: "h2", text: "Pagina Acasă" },
    {
      t: "steps",
      steps: [
        {
          text: "**Ce e nou** arată ce așteaptă răspuns, de exemplu înscrieri noi. Apasă rândul ca să deschizi pagina. Fără nimic nou, scrie **La zi**.",
          shot: "acasa-panou",
          marks: ["ce-e-nou"],
        },
        {
          text: "**Înscrieri pe site** arată dacă înscrierile sunt **Deschise** sau **Închise**. Comutatorul le schimbă și se salvează imediat.",
          shot: "acasa-panou",
          marks: ["inscrieri"],
        },
        {
          text: "**Acțiuni rapide**: **Adaugă eveniment în calendar**, **Adaugă sportiv** și **Adaugă articol**.",
          shot: "acasa-panou",
          marks: ["actiuni"],
        },
      ],
    },
    { t: "h2", text: "Meniul Strapi" },
    {
      t: "steps",
      steps: [
        {
          text: "Pentru paginile care nu au încă ecran EduSport, apasă jos **Comută la meniul Strapi**.",
          shot: "primii-meniu",
          marks: ["strapi"],
        },
        { text: "Meniul din stânga se schimbă cu cel al Strapi, programul pe care e făcut panoul." },
        { text: "Ca să te întorci, apasă butonul **Panou EduSport**." },
      ],
    },
    { t: "links", items: [{ slug: "intra-in-panou" }, { slug: "adauga-un-administrator" }] },
  ],
};
