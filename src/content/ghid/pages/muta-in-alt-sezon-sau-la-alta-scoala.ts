import type { GhidPage } from "@/lib/ghid/types";

export const mutaSezonScoalaPage: GhidPage = {
  slug: "muta-in-alt-sezon-sau-la-alta-scoala",
  title: "Mută în alt sezon sau la altă școală",
  lead: "Înscrierile trec în alt sezon sau la altă școală, una câte una sau mai multe odată.",
  blocks: [
    { t: "h2", text: "Alt sezon" },
    {
      t: "steps",
      steps: [
        { text: "O singură înscriere: în panou, tabul **Date**, jos, alege alt sezon în câmpul **Sezon**." },
        {
          text: "Mai multe: bifează rândurile. În bara de sus alege **Sezon destinație...** (1) și apasă **Mută în sezon** (2).",
          shot: "inscrieri-selectie", marks: ["sezon", "muta-in"], numbered: true,
        },
        {
          text: "Tot sezonul: apasă **...**, din dreapta sus, apoi **Mută tot sezonul...**. Alege **În sezonul** (1) și apasă **Mută** (2).",
          shot: "inscrieri-tot-sezonul", marks: ["sezon", "muta"], numbered: true,
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
        { text: "Merge doar cu două sau mai multe școli. O singură înscriere: în panou, **...** (1), apoi **Mută la altă școală** (2).", shot: "inscrieri-panou-meniu", marks: ["meniu", "muta-la"], numbered: true },
        { text: "Alege școala la **Școala** și apasă **Mută**." },
        { text: "Mai multe: bifează rândurile, alege **Alege școala** și apasă **Mută la altă școală**." },
      ],
    },
    {
      t: "p",
      text: "Înscrierile deja confirmate nu se mută. Mesajul de jos spune câte au rămas pe loc: **Nemutate (deja confirmate)**.",
    },
    { t: "h2", text: "Pe telefon" },
    {
      t: "steps",
      steps: [
        { text: "Sus, în dreapta, apasă **...**, apoi **Selectează**.", shot: "inscrieri-tel-meniu", marks: ["selecteaza"] },
        {
          text: "Apasă cardurile dorite. Sus scrie câte sunt selectate. **Toate** le bifează pe toate de pe pagină, iar **Gata** iese din selecție.",
          shot: "inscrieri-tel-selectie", marks: ["card", "toate", "gata"],
        },
        {
          text: "Jos apasă **Mută...**. Rămâne inactiv cât timp nu e bifat nimic.",
          shot: "inscrieri-tel-selectie", marks: ["muta"],
        },
        {
          text: "În fereastra **Mută** alegi **Sezon destinație...** și apeși **Mută în sezon**. Cu două școli, la fel cu **Alege școala** și **Mută la altă școală**.",
          shot: "inscrieri-tel-muta", marks: ["muta-in", "muta-la"],
        },
      ],
    },
    { t: "links", items: [{ slug: "arhiveaza-sau-sterge-inscrieri" }, { slug: "citeste-inscrierile" }] },
  ],
};
