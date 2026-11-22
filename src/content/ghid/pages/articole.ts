import type { GhidPage } from "@/lib/ghid/types";

// Articole is edited in the Strapi content manager. The custom ArticolePage and ArticolEditPage routes exist in the backend
// (admin/pages/routes.ts) but the menu does not point to them yet: when it does, this page must be rewritten for those screens.
export const articolePage: GhidPage = {
  slug: "articole",
  title: "Articole",
  lead: "Articolele se scriu în editorul Strapi. Un articol apare pe site doar după **Publică**.",
  blocks: [
    {
      t: "steps",
      steps: [
        { text: "În meniu deschide **Articole și media**, apoi **Articole**. Apasă **Creează intrare nouă**." },
        {
          text: "Completează **title** (titlul), **description** (cel mult 300 de caractere), **body** (textul), **category** și **date**.",
          shot: "site-articol",
          marks: ["titlu", "descriere", "body"],
        },
        { text: "Obligatorii sunt **title**, **category** și **date**; **slug** se completează din titlu." },
        { text: "Imaginea principală: la **coverImage** apasă **Apasă pentru a adăuga o resursă**." },
        { text: "În **Adaugă resurse noi**, la **Răsfoiește**, alege imaginea și apasă **Finalizează**." },
        { text: "Pozele în plus se pun la **gallery**." },
        { text: "**Video** primește un link YouTube sau Vimeo, sau un fișier încărcat." },
        {
          text: "Apasă **Salvează** ca să păstrezi ciorna, sau **Publică** ca să apară pe site.",
          shot: "site-articol",
          marks: ["salveaza", "publica"],
        },
      ],
    },
    {
      t: "p",
      text: "**coverImage** și **gallery** primesc doar imagini. Imaginile se încarcă întâi în Media.",
    },
    {
      t: "p",
      text: "În **body** scrii cu bara de sus: stil de text, aldin, cursiv, link și liste. Iconița de imagine din capătul barei pune o poză din Media în text.",
    },
    { t: "warn", text: "**Salvează** nu pune articolul pe site. Fără **Publică**, el rămâne ciornă." },
    { t: "p", text: "Pe site, un articol publicat apare după câteva minute." },
    { t: "links", items: [{ slug: "imagini-in-media" }, { slug: "paginile-site-ului" }] },
  ],
};
