import type { GhidPage } from "@/lib/ghid/types";

export const parcursInsignePage: GhidPage = {
  slug: "parcurs-si-insigne",
  title: "Parcurs și insigne",
  lead: "Tabul Parcurs arată insignele sportivului. Tu poți acorda unele dintre ele.",
  blocks: [
    {
      t: "steps",
      steps: [
        { text: "Deschide fișa sportivului, tabul **Parcurs**.", shot: "sportivi-parcurs" },
        { text: "În **Selectează** alege insigna: **Steaua antrenorului**, **Test promovat** sau **Săritură**." },
        { text: "La **Săritură** alegi și săritura (Salchow, Toe loop, Loop, Flip, Lutz sau Axel), apoi nivelul: Simplu, Dublu sau Triplu." },
        { text: "Apasă **Acordă**. Butonul rămâne inactiv până alegerea e completă." },
      ],
    },
    { t: "h2", text: "Ce arată tabul" },
    {
      t: "p",
      text: "Insignele sunt pe secțiuni: **Antrenamente**, **Concursuri**, **Membru**, **Insigne**, **Sărituri** și **Prietenie**. Cele câștigate au culoare și dată, cele necâștigate sunt gri.",
    },
    {
      t: "p",
      text: "**Antrenamente**, **Concursuri**, **Membru** și o parte din **Insigne** se calculează singure, din prezențe, rezultate și data de la care sportivul e membru.",
    },
    {
      t: "p",
      text: "Insignele acordate de tine apar sub **Acordate**, cu data și cine le-a dat. La **Prietenie**, **Primite** și **Oferite** arată insignele pe care sportivii și le dau între ei din portal.",
    },
    { t: "h2", text: "Ce vede sportivul" },
    {
      t: "p",
      text: "Sportivul vede aceleași insigne în portalul sportivului, la **Parcurs**.",
    },
    { t: "warn", text: "Iconița de ștergere de lângă o insignă acordată sau de prietenie o șterge imediat, fără întrebare." },
    { t: "links", items: [{ slug: "fisa-sportivului" }] },
  ],
};
