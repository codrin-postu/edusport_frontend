import type { GhidPage } from "@/lib/ghid/types";

export const deschideFiltreazaTabelPage: GhidPage = {
  slug: "deschide-si-filtreaza-un-tabel",
  title: "Deschide și filtrează un tabel",
  lead: "Tabele arată sportivii, plățile, abonamentele și prezențele ca listă, cu filtre, grupare și coloane la alegere.",
  blocks: [
    {
      t: "steps",
      steps: [
        {
          text: "Deschide **Tabele**, din grupa **Club și școală**. În stânga, la **Gata făcute**, sunt tabelele pregătite, de exemplu **Restanțe** și **Date de contact**. Apasă unul.",
          shot: "tabele-lista", marks: ["restante"],
        },
        {
          text: "Sus alegi ce numeri: **Sportivi**, **Plăți**, **Abonamente**, **Prezență** sau **Prezență pe ședințe**. Butonul din dreapta alege sezonul. La **Plăți**, **Abonamente** și **Prezență** poți bifa și luni, iar **Tot sezonul** le scoate.",
        },
        {
          text: "**Filtru** adaugă un filtru: alegi câmpul, de exemplu **Stare**, apoi bifezi valorile. Filtrul apare ca o etichetă, iar **x** de pe ea îl scoate.",
          shot: "tabele-filtru", marks: ["filtru", "stare"],
        },
        {
          text: "Butonul de grupare, de exemplu **Pe grupă**, împarte rândurile pe grupe, fiecare cu numărul de rânduri și cu totalul lui. **Negrupat** le arată într-o singură listă.",
        },
        {
          text: "**Coloane** deschide lista coloanelor. Bifează ce vrei să vezi, mută o coloană cu săgețile sus și jos, sau caută una după nume.",
          shot: "tabele-coloane", marks: ["coloane", "varsta"],
        },
        { text: "Câmpul **Caută** găsește un sportiv după nume în tabelul de pe ecran." },
      ],
    },
    { t: "p", text: "**Restanțe** vine cu filtrul **Doar cu rest de plată**. Tabelele gata făcute nu se schimbă: orice modificare se salvează ca tabel nou." },
    { t: "warn", text: "Filtrele, coloanele și gruparea schimbate rămân doar pe ecran. Dacă deschizi alt tabel din listă, ele se pierd. Apasă întâi **Salvează tabelul**." },
    { t: "links", items: [{ slug: "salveaza-un-tabel" }, { slug: "descarca-un-tabel" }] },
  ],
};
