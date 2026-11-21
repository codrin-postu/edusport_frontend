import type { GhidPage } from "@/lib/ghid/types";

export const imaginiInMediaPage: GhidPage = {
  slug: "imagini-in-media",
  title: "Imagini în Media",
  lead: "Imaginile se încarcă în **Biblioteca Media** și se aleg apoi în articole.",
  blocks: [
    {
      t: "steps",
      steps: [
        { text: "În meniu deschide **Sistem**, apoi **Media**." },
        {
          text: "Apasă **Adaugă resurse noi**. La **De pe calculator** trage fișierul în fereastră. La **De la URL** lipești adresa unei imagini.",
          shot: "site-media", marks: ["m1"],
        },
        { text: "Într-un articol, apasă zona de la **coverImage** sau **gallery**: **Apasă pentru a adăuga o resursă**." },
        { text: "În fereastra **Adaugă resurse noi**, la **Răsfoiește**, alege imaginea și apasă **Finalizează**." },
        { text: "Salvează articolul." },
      ],
    },
    {
      t: "p",
      text: "**coverImage** și **gallery** primesc doar imagini. Pentru foldere, apasă **Adaugă folder nou** în Biblioteca Media.",
    },
    { t: "links", items: [{ slug: "articole" }] },
  ],
};
