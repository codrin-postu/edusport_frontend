import type { GhidPage } from "@/lib/ghid/types";

export const salveazaTabelPage: GhidPage = {
  slug: "salveaza-un-tabel",
  title: "Salvează un tabel",
  lead: "Un tabel cu filtrele și coloanele alese se salvează cu un nume și se redeschide oricând din listă.",
  blocks: [
    {
      t: "steps",
      steps: [
        { text: "Pregătește tabelul pe ecran, apoi apasă **Salvează tabelul**, sus.", shot: "tabele-salveaza", marks: ["salveaza-tabelul"] },
        { text: "Se deschide **Vizualizare nouă**. Scrie **Nume** (1) și apasă **Salvează** (2).", shot: "tabele-salveaza-nume", marks: ["nume", "salveaza"], numbered: true },
        { text: "Apare **Vizualizare salvată.**, iar tabelul este în lista din stânga, la **Ale mele**." },
        {
          text: "La un tabel din **Ale mele**, **Salvează tabelul** suprascrie tabelul existent cu modificările făcute. Apare **Salvat.**",
        },
      ],
    },
    {
      t: "p",
      text: "În interfață, un tabel salvat se numește vizualizare. La un tabel gata făcut sau al unui coleg, **Salvează tabelul** creează întotdeauna un tabel nou, al tău. Numele trebuie să fie unic.",
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
        "Super Admin poate șterge și tabelele altor administratori.",
        "Poți avea cel mult 200 de tabele salvate. Peste limită apare **Prea multe vizualizări salvate. Șterge una.**",
      ],
    },
    { t: "p", text: "Pagina **Tabele** este disponibilă pentru Administrator club, nu și pentru Editor site." },
    { t: "links", items: [{ slug: "deschide-si-filtreaza-un-tabel" }, { slug: "descarca-un-tabel" }] },
  ],
};
