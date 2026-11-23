import type { GhidPage } from "@/lib/ghid/types";

export const siteulPublicPage: GhidPage = {
  slug: "site-ul-public",
  title: "Site-ul public",
  lead: "Site-ul deschis oricui, fără cont, cu conținutul schimbat din panou.",
  blocks: [
    {
      t: "p",
      text: "Textele, prețurile, articolele și anunțurile de pe site se schimbă din panou. Orarul urmează programul grupelor școlii, iar formularul de înscriere se deschide sau se închide cu un comutator.",
    },
    { t: "h2", text: "Ce conține" },
    {
      t: "list",
      items: [
        "**Acasă**: prezentarea clubului, articolele recente și secțiunea de înscriere.",
        "**Cursuri**: școala de patinaj și prețurile, **Program Cursuri**, cu orarul grupelor și calendarul, și **Regulament Cursuri**.",
        "Formularul de înscriere, deschis sau închis din panou.",
        "**Despre noi**: **Istoric**, **Echipa**, **Sportivi** (profilurile publice), **Realizări** (rezultatele competițiilor) și **Voluntariat**, cu formularul de voluntariat.",
        "**Noutăți**: articolele publicate.",
        "**Parteneri**: sponsorii, evenimentele de colaborare și formularul de parteneriat.",
        "**Contact**: datele de contact și formularul de contact.",
        "Anunțurile publicate pentru site.",
      ],
    },
    {
      t: "links",
      items: [
        { slug: "paginile-site-ului" },
        { slug: "articole" },
        { slug: "preturi" },
        { slug: "anunturi" },
        { slug: "setari-site" },
        { slug: "competitii-si-rezultate" },
        { slug: "echipa-sponsori-si-alte-liste" },
        { slug: "imagini-in-media" },
      ],
    },
  ],
};
