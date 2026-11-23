import type { GhidPage } from "@/lib/ghid/types";

export const salveazaTabelPage: GhidPage = {
  slug: "salveaza-un-tabel",
  title: "Salvează un tabel",
  lead: "Un tabel cu filtrele și coloanele tale se salvează cu un nume și se deschide oricând din listă.",
  blocks: [
    {
      t: "steps",
      steps: [
        { text: "Pregătește tabelul pe ecran, apoi apasă **Salvează tabelul**, sus.", shot: "tabele-salveaza", marks: ["salveaza-tabelul"] },
        { text: "Se deschide **Vizualizare nouă**. Scrie **Nume** (1) și apasă **Salvează** (2).", shot: "tabele-salveaza-nume", marks: ["nume", "salveaza"], numbered: true },
        { text: "Apare **Vizualizare salvată.**, iar tabelul este în lista din stânga, la **Ale mele**." },
        {
          text: "Pe un tabel de la **Ale mele**, după o schimbare, **Salvează tabelul** o salvează peste tabelul existent. Apare **Salvat.**",
        },
      ],
    },
    {
      t: "p",
      text: "Pe ecran, un tabel salvat se numește vizualizare. La un tabel gata făcut sau al unui coleg, **Salvează tabelul** face mereu un tabel nou, cu numele tău. Numele trebuie să fie diferit de al oricărui alt tabel.",
    },
    { t: "h2", text: "Redenumește, duplică, șterge" },
    {
      t: "steps",
      steps: [
        {
          text: "Pe rândul unui tabel din listă apasă **...** (1). Meniul are **Redenumește**, **Duplică** și **Șterge** (2).",
          shot: "tabele-actiuni", marks: ["meniu", "sterge"], numbered: true,
        },
        {
          text: "**Șterge** cere confirmarea. După ștergere, mesajul de jos are **Anulează**, valabil câteva secunde.",
        },
      ],
    },
    {
      t: "list",
      items: [
        "Tabelele colegilor apar la **Ale colegilor**. Le poți deschide și duplica. Le modifică doar autorul.",
        "Super Admin poate șterge și tabelele altora.",
        "Poți avea cel mult 200 de tabele salvate. Peste limită apare **Prea multe vizualizări salvate. Șterge una.**",
      ],
    },
    { t: "p", text: "Pagina **Tabele** apare la Administrator club, nu și la Editor site." },
    { t: "links", items: [{ slug: "deschide-si-filtreaza-un-tabel" }, { slug: "descarca-un-tabel" }] },
  ],
};
