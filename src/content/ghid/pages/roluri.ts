import type { GhidPage } from "@/lib/ghid/types";

export const roluriPage: GhidPage = {
  slug: "roluri",
  title: "Roluri",
  lead: "Rolul stabilește ce pagini poate folosi fiecare administrator.",
  blocks: [
    { t: "p", text: "Serverul impune zonele fiecărui rol, nu doar meniul afișat." },
    { t: "h2", text: "Cele trei roluri" },
    {
      t: "list",
      items: [
        "**Super Admin**: toate paginile. Doar el vede **Administratori**, în **Securitate**.",
        "**Administrator club**: toate paginile, cu excepția celor rezervate rolului Super Admin.",
        "**Editor site**: **Panou EduSport**, **Securitate** și paginile site-ului, de exemplu **Pagina principală**, **Meniu site**, **Anunțuri**, **Competiții**, **Parteneri** (cu **Sponsori**), **Membri echipă**, **Voluntariat** și **Prețuri**.",
      ],
    },
    { t: "h2", text: "Pagini doar pentru Administrator club și Super Admin" },
    {
      t: "list",
      items: [
        "**Înscrieri**, **Formulare**, **Contact**, **Voluntari** și **Parteneri**.",
        "**Grupe**, **Sportivi**, **Prezență**, **Contabilitate** și **Calendar și serii**.",
        "**Tabele**.",
        "**Setări site** și **Sezoane**.",
        "Blocul **Cont portal**, din fișa unui membru al echipei.",
      ],
    },
    {
      t: "p",
      text: "Un administrator cu mai multe roluri cumulează drepturile tuturor rolurilor. Rolurile **Author** și **Editor** din aceeași listă aparțin Strapi și nu dau acces la nicio pagină a platformei în afară de **Panou EduSport** și **Securitate**.",
    },
    { t: "links", items: [{ slug: "ce-poate-face-fiecare-rol" }, { slug: "adauga-un-administrator" }, { slug: "schimba-rolul-sau-opreste-accesul" }, { slug: "siguranta" }] },
  ],
};
