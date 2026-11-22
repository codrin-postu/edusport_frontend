import type { GhidPage } from "@/lib/ghid/types";

export const imaginiInMediaPage: GhidPage = {
  slug: "imagini-in-media",
  title: "Imagini în Media",
  lead: "Imaginile se încarcă în Biblioteca Media; de acolo se aleg apoi în articole.",
  blocks: [
    {
      t: "steps",
      steps: [
        { text: "În meniu deschide **Sistem**, apoi **Media**." },
        {
          text: "Apasă **Adaugă resurse noi**. La **De pe calculator** trage fișierul în fereastră. La **De la URL** lipești adresa unei imagini.",
          shot: "site-media",
          marks: ["adauga-resurse"],
        },
        {
          text: "Pentru foldere, apasă **Adaugă folder nou**.",
          shot: "site-media",
          marks: ["adauga-folder"],
        },
      ],
    },
    {
      t: "p",
      text: "Cum pui o imagine într-un articol se vede la Articole.",
    },
    { t: "links", items: [{ slug: "articole" }, { slug: "paginile-site-ului" }] },
  ],
};
