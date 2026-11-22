import type { GhidPage } from "@/lib/ghid/types";

export const prezentaPeOLunaPage: GhidPage = {
  slug: "prezenta-pe-o-luna",
  title: "Prezența pe o lună",
  lead: "Vezi prezența unei grupe pe o lună, sportiv cu sportiv, și o descarci în Excel.",
  blocks: [
    {
      t: "steps",
      steps: [
        { text: "În **Prezență**, deschide **Tabel pe grupă**.", shot: "prezenta-tabel", marks: ["tab-tabel"] },
        { text: "Alege grupa și luna. Săgețile schimbă luna.", shot: "prezenta-tabel", marks: ["grupa", "luna"] },
        { text: "Fiecare sportiv are o bifă la ședințele la care a fost și un **Total**, de exemplu 2/2. **U** arată o prezență la antrenamentul uscat.", shot: "prezenta-tabel", marks: ["total"] },
        { text: "**Descarcă Excel** salvează tabelul.", shot: "prezenta-tabel", marks: ["descarca"] },
      ],
    },
    {
      t: "p",
      text: "Ședințele fără prezență poartă **necompletat**. Un sportiv adăugat doar la o ședință apare sub **Vizitatori**. Antetul unei ședințe o deschide.",
    },
    { t: "links", items: [{ slug: "corecteaza-o-prezenta" }, { slug: "completeaza-prezenta" }] },
  ],
};
