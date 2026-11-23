import type { GhidPage } from "@/lib/ghid/types";

export const contabilitatePage: GhidPage = {
  slug: "contabilitate-pe-scurt",
  title: "Pagina Contabilitate",
  lead: "Încasările și sumele restante, lună de lună.",
  blocks: [
    {
      t: "p",
      text: "Pagina **Contabilitate** este în grupa **Club și școală**. Luna se schimbă cu **<** și **>** din dreapta sus. Cardurile de sus arată **Încasat**, **De încasat**, **Abonamente active**, **Expiră în 14 zile** și **Neachitați**.",
    },
    { t: "h2", text: "Cele patru taburi" },
    {
      t: "list",
      items: [
        "**Restanțe**: sportivii cu rest de plată, la **Școala de patinaj** și la **Club**. **+ Plată** de pe rând deschide plata sportivului.",
        "**Abonamente**: lista abonamentelor, cu **Folosite**, **Expiră** și **Stare**. Aici sunt **+ Abonament** și **Prelungește abonamentele**.",
        "**Plăți**: plățile lunii, de la cea mai recentă, cu **Total încasat** sub tabel. Filtrezi după **Metodă** și **Tip**.",
        "**Pe grupe**: **Datorat**, **Încasat**, **Rămas** și **Încasat %**, pe secțiune și grupă, pe metodă sau pe scop.",
      ],
    },
    {
      t: "p",
      text: "Cardul **Expiră în 14 zile** numără abonamentele active care expiră în următoarele 14 zile. Aceleași abonamente le găsești în tabul **Abonamente**, la **Stare**, alegând **Expiră în 14 zile**.",
    },
    {
      t: "links",
      items: [{ slug: "inregistreaza-o-plata" }, { slug: "corecteaza-sau-anuleaza-o-plata" }, { slug: "adauga-sau-prelungeste-un-abonament" }, { slug: "preturi" }],
    },
  ],
};
