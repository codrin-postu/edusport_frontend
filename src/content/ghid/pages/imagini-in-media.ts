import type { GhidPage } from "@/lib/ghid/types";

export const imaginiInMediaPage: GhidPage = {
  slug: "imagini-in-media",
  title: "Imagini în Media",
  lead: "Imaginile se încarcă în Biblioteca Media și se aleg de acolo în articole.",
  blocks: [
    {
      t: "steps",
      steps: [
        { text: "În meniu deschide **Sistem**, apoi **Media**." },
        {
          text: "Apasă **Adaugă resurse noi**. La **De pe calculator** trage fișierul în fereastră. La **De la URL** lipește adresa imaginii.",
          shot: "site-media",
          marks: ["adauga-resurse"],
        },
        {
          text: "Pentru un folder nou apasă **Adaugă folder nou**.",
          shot: "site-media",
          marks: ["adauga-folder"],
        },
      ],
    },
    {
      t: "p",
      text: "Inserarea unei imagini într-un articol este descrisă în pagina Articole.",
    },
    { t: "links", items: [{ slug: "articole" }, { slug: "paginile-site-ului" }] },
  ],
};
