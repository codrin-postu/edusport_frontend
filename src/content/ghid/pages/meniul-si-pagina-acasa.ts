import type { GhidPage } from "@/lib/ghid/types";

export const meniulSiPaginaAcasaPage: GhidPage = {
  slug: "meniul-si-pagina-acasa",
  title: "Meniul și pagina Acasă",
  lead: "Navigarea în panou și pagina Acasă.",
  blocks: [
    { t: "h2", text: "Meniul" },
    {
      t: "steps",
      steps: [
        { text: "Apasă o grupă din stânga, de exemplu **Club și școală**, ca să vezi paginile ei.", shot: "primii-meniu", marks: ["club-scoala"] },
        { text: "Sub **Acasă**, paginile sunt grupate după subiect: **Formulare**, **Club și școală**, **Noutăți**, **Pagini site** și **Setări**." },
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
          text: "**Ce e nou** arată ce necesită atenție, de exemplu înscrierile noi. Apasă un rând ca să deschizi pagina. Când nu este nimic nou, apare **La zi**.",
          shot: "acasa-panou",
          marks: ["ce-e-nou"],
        },
        {
          text: "**Înscrieri pe site** arată dacă înscrierile sunt **Deschise** sau **Închise**. Comutatorul schimbă starea, iar modificarea se salvează imediat.",
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
          text: "Pentru paginile care nu au încă ecran propriu în panou, apasă jos **Comută la meniul Strapi**.",
          shot: "primii-meniu",
          marks: ["strapi"],
        },
        { text: "Meniul din stânga este înlocuit cu cel al Strapi, platforma pe care este construit panoul." },
        { text: "Ca să te întorci, apasă butonul **Panou EduSport**." },
      ],
    },
    { t: "links", items: [{ slug: "intra-in-panou" }, { slug: "adauga-un-administrator" }] },
  ],
};
