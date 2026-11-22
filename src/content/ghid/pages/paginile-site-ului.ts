import type { GhidPage } from "@/lib/ghid/types";

export const paginiSitePage: GhidPage = {
  slug: "paginile-site-ului",
  title: "Paginile site-ului",
  lead: "Textele paginilor se schimbă din grupul **Pagini site** al meniului, iar meniul de sus al site-ului din **Meniu site**.",
  blocks: [
    {
      t: "steps",
      steps: [
        { text: "În meniu deschide **Pagini site** și alege pagina: de exemplu **Cursuri**." },
        {
          text: "Schimbă textul din câmp. Jos apare **Modificări nesalvate**, cu **Renunță** și **Salvează**.",
          shot: "site-cursuri",
          marks: ["nume", "renunta", "salveaza"],
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
    { t: "h2", text: "Meniu site" },
    {
      t: "steps",
      steps: [
        { text: "Deschide **Meniu site**, în meniu, sus. **Secțiuni** arată meniul de sus al site-ului." },
        {
          text: "Alege **Despre Noi** sau **Cursuri**: doar ele au eticheta **card**, adică un card cu imagine în meniul site-ului.",
          shot: "site-meniu",
          marks: ["despre-noi", "cursuri"],
        },
        { text: "La **Descriere** scrie textul de sub titlul cardului." },
        { text: "La **Imagine** apasă **Alege** (sau **Schimbă**) și ia poza din Media. Recomandat 640 pe 400 px, sub 300 KB. **Elimină** scoate imaginea." },
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
