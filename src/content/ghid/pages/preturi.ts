import type { GhidPage } from "@/lib/ghid/types";

export const preturiPage: GhidPage = {
  slug: "preturi",
  title: "Prețuri",
  lead: "Aici schimbi prețurile școlii și ale clubului.",
  blocks: [
    {
      t: "steps",
      steps: [
        {
          text: "Deschide **Prețuri**, din grupa **Club și școală**. Alege secțiunea sus, de exemplu **Club**. Fiecare listă are **Nume**, **Tip**, **Ședințe**, **Membri** și **Neafiliați**.",
          shot: "preturi-liste", marks: ["club"],
        },
      ],
    },
    { t: "p", text: "**Preț membri** e prețul pentru membrii A.C.S., iar **Preț neafiliați** pentru ceilalți sportivi." },
    { t: "h2", text: "Schimbă un preț" },
    {
      t: "steps",
      steps: [
        {
          text: "Apasă un rând ca să se deschidă panoul prețului. Schimbă **Preț membri** sau **Preț neafiliați**.",
          shot: "preturi-editare", marks: ["pret", "pret-neafiliati"],
        },
        { text: "Apasă **Salvează**.", shot: "preturi-editare", marks: ["salveaza"] },
      ],
    },
    { t: "h2", text: "Adaugă un preț" },
    {
      t: "steps",
      steps: [
        {
          text: "La lista dorită apasă **Adaugă preț**. Completează **Nume**, **Tip**, **Ședințe** și prețurile.",
          shot: "preturi-liste", marks: ["adauga"],
        },
        { text: "Apasă **Salvează**." },
      ],
    },
    { t: "h2", text: "Listă nouă" },
    {
      t: "steps",
      steps: [
        { text: "Jos, în secțiunea dorită, apasă **Listă nouă**. Scrie **Nume** și alege **Secțiune**." },
        { text: "Apasă **Salvează**. Apoi adaugi prețurile în listă." },
      ],
    },
    { t: "h2", text: "Șterge un preț" },
    {
      t: "steps",
      steps: [
        { text: "Apasă rândul, apoi **Șterge**, jos în panou." },
        { text: "La **Ștergi prețul?** apasă **Șterge**. Prețul dispare din listă, de pe site și din formular." },
      ],
    },
    { t: "warn", text: "Un abonament păstrează prețul din ziua în care a fost adăugat. O schimbare de preț se aplică abonamentelor noi, iar plățile înregistrate nu se schimbă." },
    { t: "p", text: "Prețuri apare în meniu și la rolul Editor site, nu doar la Administrator club." },
    { t: "links", items: [{ slug: "contabilitate-pe-scurt" }, { slug: "adauga-sau-prelungeste-un-abonament" }, { slug: "inregistreaza-o-plata" }] },
  ],
};
