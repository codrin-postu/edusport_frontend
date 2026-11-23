import type { GhidPage } from "@/lib/ghid/types";

export const scoateAccesulParintePage: GhidPage = {
  slug: "scoate-accesul-unui-parinte",
  title: "Scoate accesul unui părinte",
  lead: "Accesul se scoate pe copil. Contul părintelui și ceilalți copii rămân.",
  blocks: [
    {
      t: "steps",
      steps: [
        { text: "Deschide fișa sportivului, tabul **Date**. La cardul **Acces portal** apasă **Scoate accesul**.", shot: "portal-card", marks: ["butoane"] },
        { text: "Confirmă în fereastra **Scoți accesul lui** adresa **la** sportiv. Apare **Acces scos.**" },
      ],
    },
    { t: "p", text: "Efectul este imediat: la următoarea cerere, părintele vede **Nu mai ai acces la acest sportiv.** și revine la lista **Sportivi**. Dacă acela era ultimul copil din cont, contul nu mai poate intra în portalul sportivilor." },
    { t: "p", text: "În fișa sportivului nu există un buton care dezactivează tot contul unui părinte." },
    { t: "h2", text: "Când sportivul pleacă din club" },
    {
      t: "list",
      items: [
        "**Marchează inactiv**: accesul rămâne, iar părintele vede în continuare istoricul și plățile.",
        "**Șterge sportivul**: accesul se șterge.",
        "**Anonimizează** (doar Super Admin): accesul se oprește, iar adresa și numele copilului se șterg din legăturile de acces. În **Istoric** rămâne **Acces portal oprit (anonimizat)**.",
        "Dacă vrei să oprești doar portalul, folosește **Scoate accesul**.",
      ],
    },
    { t: "p", text: "Dacă același cont este și al unui antrenor, vezi **Dezactivează tot** la Acces antrenor în portal." },
    {
      t: "links",
      items: [{ slug: "acces-antrenor-in-portal" }, { slug: "anonimizeaza-un-sportiv" }, { slug: "uneste-marcheaza-inactiv-sau-sterge-un-sportiv" }],
    },
  ],
};
