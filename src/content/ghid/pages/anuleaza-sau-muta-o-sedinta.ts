import type { GhidPage } from "@/lib/ghid/types";

export const anuleazaSauMutaSedintaPage: GhidPage = {
  slug: "anuleaza-sau-muta-o-sedinta",
  title: "Anulează sau mută o ședință",
  lead: "O ședință din program se poate ține, anula sau muta, fără modificarea programului obișnuit.",
  blocks: [
    {
      t: "steps",
      steps: [
        { text: "Deschide grupa, tabul **Program**, și apasă data dorită din calendarul grupei. Panoul arată ziua și ora.", shot: "grupe-program", marks: ["calendar"] },
        { text: "La **Această dată** alege **Ține**, **Anulează** sau **Mută**.", shot: "program-data", marks: ["tine-anuleaza-muta"] },
        { text: "La **Mută** alege **Data nouă** și ora de la **De la**.", shot: "program-data", marks: ["data-noua", "de-la"] },
        { text: "La **Anulează** și **Mută** scrie **Motiv**.", shot: "program-data", marks: ["motiv"] },
        { text: "Bifează **Anunță părinții pe e-mail** ca părinții să fie anunțați. Mesajul se trimite la adresele de contact ale sportivilor din grupă.", shot: "program-data", marks: ["anunta-parintii"] },
        { text: "Apasă **Salvează**.", shot: "program-data", marks: ["salveaza"] },
      ],
    },
    {
      t: "p",
      text: "Aceeași dată se deschide și din calendarul de la **Calendar și serii**. O oră unică are în panou și **Șterge ședința**. O dată dintr-o pauză este doar de citit: panoul arată **Pauză** și numele pauzei.",
    },
    { t: "links", items: [{ slug: "programul-unei-grupe" }, { slug: "calendar-si-evenimente" }, { slug: "pauze-si-vacante" }, { slug: "anunturi" }] },
  ],
};
