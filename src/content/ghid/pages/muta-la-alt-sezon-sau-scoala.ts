import type { GhidPage } from "@/lib/ghid/types";

export const mutaSezonScoalaPage: GhidPage = {
  slug: "muta-la-alt-sezon-sau-scoala",
  title: "Mută la alt sezon sau altă școală",
  lead: "Înscrierile trec în alt sezon sau la altă școală, una câte una sau mai multe odată.",
  blocks: [
    { t: "h2", text: "Alt sezon" },
    {
      t: "steps",
      steps: [
        { text: "O singură înscriere: în panou, tabul **Date**, jos, alege alt sezon în câmpul **Sezon**." },
        {
          text: "Mai multe: bifează rândurile. În bara de sus alege **Sezon destinație...** și apasă **Mută în sezon**.",
          shot: "inscrieri-selectie", marks: ["sezon", "muta-in"],
        },
        {
          text: "Tot sezonul: apasă **...**, din dreapta sus, apoi **Mută tot sezonul...**. Alege **În sezonul** și apasă **Mută**.",
          shot: "inscrieri-tot-sezonul", marks: ["sezon", "arhivate"],
        },
      ],
    },
    {
      t: "p",
      text: "**Din sezonul** e sezonul ales sus. Bifa **Doar înscrierile arhivate** mută numai înscrierile arhivate. Numărul înscrierii nu se schimbă.",
    },
    { t: "warn", text: "**Mută tot sezonul** mută toate înscrierile sezonului. Verifică **Din sezonul** înainte de **Mută**." },
    { t: "h2", text: "Altă școală" },
    {
      t: "steps",
      steps: [
        { text: "Merge doar cu două sau mai multe școli. O singură înscriere: în panou, **...**, apoi **Mută la altă școală**.", shot: "inscrieri-panou-meniu", marks: ["meniu", "muta-la"] },
        { text: "Alege școala la **Școala** și apasă **Mută**." },
        { text: "Mai multe: bifează rândurile, alege **Alege școala** și apasă **Mută la altă școală**." },
      ],
    },
    {
      t: "p",
      text: "Înscrierile deja confirmate nu se mută. Mesajul de jos spune câte au rămas pe loc: **Nemutate (deja confirmate)**.",
    },
    { t: "links", items: [{ slug: "arhiveaza-si-exporta" }, { slug: "selecteaza-pe-telefon" }] },
  ],
};
