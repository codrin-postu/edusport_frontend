import type { GhidPage } from "@/lib/ghid/types";

export const deschideFiltreazaTabelPage: GhidPage = {
  slug: "deschide-si-filtreaza-un-tabel",
  title: "Deschide și filtrează un tabel",
  lead: "Pagina Tabele arată sportivii, plățile, abonamentele și prezențele ca listă, cu filtre, grupare și coloane la alegere.",
  blocks: [
    {
      t: "steps",
      steps: [
        {
          text: "Deschide **Tabele**, din grupa **Club și școală**. În stânga, la **Gata făcute**, sunt tabelele pregătite, de exemplu **Restanțe** și **Date de contact**. Apasă unul.",
          shot: "tabele-lista", marks: ["restante", "contacte"],
        },
        { text: "Sus alegi ce arată tabelul: **Sportivi**, **Plăți**, **Abonamente**, **Prezență** sau **Prezență pe ședințe**. Sezonul se alege din butonul din dreapta." },
        { text: "La **Plăți**, **Abonamente** și **Prezență** poți alege și lunile; **Tot sezonul** anulează selecția." },
        {
          text: "**Filtru** (1) adaugă un filtru: alegi câmpul, de exemplu **Stare** (2), apoi bifezi valorile. **x** de pe etichetă îl elimină.",
          shot: "tabele-filtru", marks: ["filtru", "stare"], numbered: true,
        },
        {
          text: "Butonul de grupare, de exemplu **Pe grupă**, împarte rândurile pe grupe, fiecare grupă cu numărul de rânduri și totalul ei. **Negrupat** le arată într-o singură listă.",
        },
        {
          text: "**Coloane** deschide lista coloanelor. Bifează coloanele dorite, schimbă ordinea cu săgețile sus și jos sau caută o coloană după nume.",
          shot: "tabele-coloane", marks: ["coloane", "varsta"],
        },
        { text: "Câmpul **Caută** găsește un sportiv după nume în tabelul de pe ecran." },
      ],
    },
    { t: "p", text: "**Restanțe** are implicit filtrul **Doar cu rest de plată**. Tabelele gata făcute nu se schimbă: orice modificare se salvează ca tabel nou." },
    { t: "warn", text: "Modificările de filtre, coloane și grupare nu se salvează automat și se pierd la deschiderea altui tabel. Apasă întâi **Salvează tabelul**." },
    { t: "links", items: [{ slug: "salveaza-un-tabel" }, { slug: "descarca-un-tabel" }] },
  ],
};
