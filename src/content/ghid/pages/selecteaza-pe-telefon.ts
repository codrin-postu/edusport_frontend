import type { GhidPage } from "@/lib/ghid/types";

export const selecteazaTelefonPage: GhidPage = {
  slug: "selecteaza-pe-telefon",
  title: "Selectează pe telefon",
  lead: "Pe telefon, mai multe înscrieri se mută sau se arhivează dintr-o singură trecere.",
  blocks: [
    {
      t: "steps",
      steps: [
        { text: "Sus, în dreapta, apasă **...**, apoi **Selectează**.", shot: "inscrieri-tel-meniu" },
        {
          text: "Apasă cardurile dorite. Sus scrie câte sunt selectate. **Toate** le bifează pe toate de pe pagină, iar **Gata** iese din selecție.",
          shot: "inscrieri-tel-selectie",
        },
        { text: "Jos sunt **Mută...**, **Arhivează** și **Șterge**. Rămân inactive cât timp nu e bifat nimic." },
        {
          text: "**Mută...** deschide fereastra **Mută**. Alegi **Sezon destinație...** și apeși **Mută în sezon**. Cu două școli, la fel cu **Alege școala**.",
          shot: "inscrieri-tel-muta",
        },
      ],
    },
    { t: "warn", text: "**Șterge** cere o confirmare, apoi șterge definitiv. Pentru înscrierile vechi folosește **Arhivează**." },
    { t: "links", items: [{ slug: "muta-la-alt-sezon-sau-scoala" }, { slug: "arhiveaza-si-exporta" }] },
  ],
};
