import type { GhidPage } from "@/lib/ghid/types";

export const paginiSitePage: GhidPage = {
  slug: "pagini-site",
  title: "Pagini site",
  lead: "Textele paginilor site-ului se schimbă din grupul **Pagini site** al meniului.",
  blocks: [
    {
      t: "steps",
      steps: [
        { text: "În meniu deschide **Pagini site** și alege pagina: de exemplu **Cursuri**." },
        {
          text: "Schimbă textul din câmp. Jos apare **Modificări nesalvate**, cu **Renunță** și **Salvează**.",
          shot: "site-cursuri", marks: ["nume", "salveaza"],
        },
        { text: "Apasă **Salvează**." },
      ],
    },
    {
      t: "p",
      text: "În grup sunt: **Pagina principală**, **Cursuri**, **Regulament**, **Pagina Program**, **Pagina Echipă**, **Istoric**, **Realizări**, **Parteneri** și **Voluntariat**.",
    },
    { t: "warn", text: "Paginile nu au ciornă: ce salvezi este varianta de pe site." },
    {
      t: "p",
      text: "Pe site, modificarea nu apare pe loc: de obicei după câteva minute, cel mult după o oră.",
    },
    { t: "links", items: [{ slug: "articole" }, { slug: "imagini-in-media" }, { slug: "roluri" }] },
  ],
};
