import type { GhidPage } from "@/lib/ghid/types";

export const contabilitatePage: GhidPage = {
  slug: "contabilitate",
  title: "Contabilitate",
  lead: "Încasările, restanțele și abonamentele școlii, pe luni.",
  blocks: [
    {
      t: "p",
      text: "Pagina **Contabilitate** e în grupa **Club și școală**. Luna se schimbă cu **<** și **>** din dreapta sus. Cardurile de sus arată **Încasat**, **De încasat**, **Abonamente active**, **Expiră în 14 zile** și **Neachitați**.",
    },
    { t: "h2", text: "Cele patru taburi" },
    {
      t: "list",
      items: [
        "**Restanțe**: sportivii cu rest de plată, la **Școala de patinaj** și la **Club**. **+ Plată** de la rând deschide plata sportivului.",
        "**Abonamente**: lista abonamentelor, cu **Folosite**, **Expiră** și **Stare**. Aici sunt **+ Abonament** și **Prelungește abonamentele**.",
        "**Plăți**: plățile lunii, cele mai noi primele, cu **Total încasat** sub tabel. Filtrezi după **Metodă** și **Tip**.",
        "**Pe grupe**: **Datorat**, **Încasat**, **Rămas** și **Încasat %**, pe secțiune și grupă, pe metodă sau pe scop.",
      ],
    },
    { t: "links", items: [{ slug: "inregistreaza-o-plata" }, { slug: "anuleaza-o-plata" }, { slug: "preturi" }] },
  ],
};
