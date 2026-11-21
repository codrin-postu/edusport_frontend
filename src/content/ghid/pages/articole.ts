import type { GhidPage } from "@/lib/ghid/types";

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
          text: "Completează **title**, **description** (cel mult 300 de caractere), **body**, **category** și **date**. **title**, **category** și **date** sunt obligatorii; **slug** se completează din titlu.",
          shot: "site-articol",
        },
        {
          text: "Imaginea principală se pune la **coverImage**, pozele în plus la **gallery**. **Video** primește un link YouTube sau Vimeo, sau un fișier încărcat.",
        },
        { text: "Apasă **Salvează** ca să păstrezi ciorna, sau **Publică** ca să apară pe site." },
      ],
    },
    {
      t: "p",
      text: "În **body** scrii cu bara de sus: stil de text, aldin, cursiv, link și liste. Iconița de imagine din capătul barei pune o poză din Media în text.",
    },
    { t: "warn", text: "**Salvează** nu pune articolul pe site. Fără **Publică**, el rămâne ciornă." },
    { t: "p", text: "Pe site, un articol publicat apare după câteva minute." },
    { t: "links", items: [{ slug: "imagini-in-media" }, { slug: "pagini-site" }] },
  ],
};
