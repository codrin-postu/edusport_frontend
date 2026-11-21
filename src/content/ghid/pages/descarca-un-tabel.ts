import type { GhidPage } from "@/lib/ghid/types";

export const descarcaTabelPage: GhidPage = {
  slug: "descarca-un-tabel",
  title: "Descarcă un tabel",
  lead: "Tabelul de pe ecran se descarcă în Excel sau CSV, cu filtrele, căutarea și coloanele alese.",
  blocks: [
    {
      t: "steps",
      steps: [
        { text: "Pregătește tabelul. Nu trebuie salvat întâi." },
        { text: "Apasă **Descarcă Excel**, sus. Pentru CSV, apasă săgeata de lângă el (**Alte formate**) și alege **CSV**.", shot: "tabele-descarca", marks: ["excel", "csv"] },
      ],
    },
    {
      t: "list",
      items: [
        "Numele fișierului este numele tabelului și data, de exemplu restante-2026-11-21.xlsx.",
        "**Excel** păstrează gruparea, cu un total pe fiecare grupă și un **Total** la sfârșit.",
        "**CSV** are un rând pentru fiecare înregistrare, fără totaluri. Dacă tabelul e grupat, prima coloană este grupa.",
      ],
    },
    {
      t: "p",
      text: "Dacă tabelul are peste 5.000 de rânduri, apare **Peste 5.000 de rânduri. Adaugă filtre.** Adaugă filtre și încearcă din nou.",
    },
    { t: "links", items: [{ slug: "deschide-si-filtreaza-un-tabel" }, { slug: "salveaza-un-tabel" }] },
  ],
};
