import type { GhidPage } from "@/lib/ghid/types";

export const parcursInsignePage: GhidPage = {
  slug: "parcurs-si-insigne",
  title: "Parcurs și insigne",
  lead: "Tabul **Parcurs** arată insignele sportivului. Unele insigne se acordă manual.",
  blocks: [
    {
      t: "steps",
      steps: [
        { text: "Deschide fișa sportivului, tabul **Parcurs**.", shot: "sportivi-parcurs", marks: ["tab-parcurs"] },
        { text: "În **Selectează** alege insigna: **Steaua antrenorului**, **Test promovat** sau **Săritură**.", shot: "sportivi-parcurs", marks: ["selecteaza"] },
        { text: "La **Săritură** alegi și săritura (Salchow, Toe loop, Loop, Flip, Lutz sau Axel), apoi nivelul: Simplu, Dublu sau Triplu." },
        { text: "Apasă **Acordă**. Butonul rămâne inactiv până alegerea este completă.", shot: "sportivi-parcurs", marks: ["acorda"] },
      ],
    },
    { t: "h2", text: "Ce arată tabul" },
    {
      t: "p",
      text: "Insignele sunt pe secțiuni: **Antrenamente**, **Concursuri**, **Membru**, **Insigne**, **Sărituri** și **Prietenie**. Cele câștigate au culoare și dată, cele necâștigate sunt gri.",
    },
    {
      t: "p",
      text: "**Antrenamente**, **Concursuri**, **Membru** și o parte din **Insigne** se calculează automat, din prezențe, rezultate și data de la care sportivul este membru.",
    },
    {
      t: "p",
      text: "Insignele acordate manual apar sub **Acordate**, cu data și autorul. La **Prietenie**, **Primite** și **Oferite** arată insignele pe care sportivii și le oferă între ei în portal.",
    },
    { t: "h2", text: "Ce vede sportivul" },
    {
      t: "p",
      text: "Sportivul vede aceleași insigne în portalul sportivului, la **Parcurs**.",
    },
    { t: "warn", text: "Pictograma de ștergere de lângă o insignă acordată sau de prietenie o șterge imediat, fără confirmare." },
    { t: "links", items: [{ slug: "fisa-sportivului" }, { slug: "profil-public-si-rezultate" }] },
  ],
};
