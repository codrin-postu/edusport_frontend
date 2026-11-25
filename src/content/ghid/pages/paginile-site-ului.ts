import type { GhidPage } from "@/lib/ghid/types";

export const paginiSitePage: GhidPage = {
  slug: "paginile-site-ului",
  title: "Paginile site-ului",
  lead: "Textele paginilor se modifică din grupa **Pagini site** a meniului, iar meniul de sus al site-ului din **Meniu site**.",
  blocks: [
    {
      t: "steps",
      steps: [
        { text: "În meniu deschide **Pagini site** și alege pagina: de exemplu **Cursuri**." },
        {
          text: "Modifică textul din câmp. Jos apare **Modificări nesalvate**, cu **Renunță** și **Salvează**.",
          shot: "site-cursuri",
          marks: ["nume", "renunta", "salveaza"],
        },
        { text: "Apasă **Salvează**." },
      ],
    },
    {
      t: "p",
      text: "Grupa conține: **Pagina principală**, **Cursuri**, **Regulament**, **Pagina Program**, **Pagina Echipă**, **Istoric**, **Realizări**, **Parteneri** și **Voluntariat**.",
    },
    { t: "warn", text: "Paginile nu au ciornă: ce salvezi apare direct pe site." },
    {
      t: "p",
      text: "Pe site, modificarea nu apare imediat: de obicei după câteva minute, cel târziu după o oră.",
    },
    { t: "h2", text: "Meniu site" },
    {
      t: "steps",
      steps: [
        { text: "În meniu, la **Pagini site**, deschide **Meniu site**. **Secțiuni** arată meniul de sus al site-ului." },
        {
          text: "Alege **Despre Noi** sau **Cursuri**: doar ele au eticheta **card**, adică un card cu imagine în meniul site-ului.",
          shot: "site-meniu",
          marks: ["despre-noi", "cursuri"],
        },
        { text: "La **Descriere** scrie textul de sub titlul cardului." },
        { text: "La **Imagine** apasă **Alege** (sau **Schimbă**) și alege imaginea din **Imagini**. Dimensiunea recomandată este 640 x 400 px, sub 300 KB. **Elimină** scoate imaginea." },
        { text: "Apasă **Salvează**, în bara de jos." },
      ],
    },
    {
      t: "p",
      text: "Numele, adresele și ordinea din meniu sunt stabilite în codul site-ului și nu se schimbă de aici. Dacă o secțiune arată **Card promo neînregistrat. Cere unui dezvoltator.**, cardul ei nu se poate edita încă.",
    },
    { t: "links", items: [{ slug: "articole" }, { slug: "imagini-in-media" }, { slug: "roluri" }] },
  ],
};
