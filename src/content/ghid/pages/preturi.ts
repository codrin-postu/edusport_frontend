import type { GhidPage } from "@/lib/ghid/types";

export const preturiPage: GhidPage = {
  slug: "preturi",
  title: "Prețuri",
  lead: "Listele de prețuri ale școlii și ale clubului, pe secțiuni.",
  blocks: [
    {
      t: "steps",
      steps: [
        {
          text: "Deschide **Prețuri**, din grupa **Club și școală**. Alege secțiunea sus, de exemplu **Club**. Fiecare listă are **Nume**, **Tip**, **Ședințe**, **Membri** și **Neafiliați**.",
          shot: "preturi-liste",
        },
        {
          text: "Apasă un rând ca să se deschidă panoul prețului. Schimbă **Preț membri** sau **Preț neafiliați**, apoi apasă **Salvează**.",
          shot: "preturi-editare",
        },
        {
          text: "Pentru un preț nou apasă **Adaugă preț** la lista dorită, iar pentru o listă nouă **Listă nouă**. **Șterge** scoate prețul din listă.",
        },
      ],
    },
    { t: "p", text: "Prețuri apare în meniu și la rolul Editor site, nu doar la Administrator club." },
    { t: "warn", text: "Un abonament păstrează prețul din ziua în care a fost adăugat. O schimbare de preț se aplică abonamentelor noi." },
    { t: "links", items: [{ slug: "contabilitate" }, { slug: "inregistreaza-o-plata" }] },
  ],
};
