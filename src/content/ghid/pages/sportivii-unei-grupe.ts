import type { GhidPage } from "@/lib/ghid/types";

export const sportiviiUneiGrupePage: GhidPage = {
  slug: "sportivii-unei-grupe",
  title: "Sportivii unei grupe",
  lead: "Pagina unei grupe arată sportivii ei. De aici îi adaugi, îi muți sau îi scoți.",
  blocks: [
    {
      t: "steps",
      steps: [
        {
          text: "Deschide **Grupe** și apasă pe un rând ca să intri în grupă. Sub nume vezi **Antrenori**. Tabul **Sportivi** listează membrii, cu **Vârstă**, **Principală** și **Alte grupe**.",
          shot: "grupe-fisa", marks: ["antrenori", "tab-sportivi"],
        },
        { text: "Apasă **Adaugă sportivi**. Apar sportivii fără grupă. **Toți sportivii** caută în tot clubul, de la două litere.", shot: "grupe-fisa", marks: ["adauga-sportivi"] },
        { text: "Bifează sportivii și apasă **Adaugă în grupă**." },
        { text: "**...** de pe un rând are **Mută**, **Adaugă și în grupă** și **Scoate din grupă**. După fiecare acțiune apare un mesaj cu **Anulează**." },
      ],
    },
    {
      t: "p",
      text: "Numele unui antrenor deschide contul lui de portal. Dacă sunt sportivi fără grupă, lângă **Grupă nouă** apare **Fără grupă**, cu lista lor și **Alocă** pe fiecare rând.",
    },
    { t: "h2", text: "Celelalte taburi ale grupei" },
    {
      t: "list",
      items: [
        "**Program**: orele grupei.",
        "**Prezență**: ședințele lunii, cu **+ Ședință nouă**. Apasă pe o ședință ca să o corectezi.",
        "**Istoric**: evenimentele grupei.",
      ],
    },
    { t: "links", items: [{ slug: "programul-unei-grupe" }, { slug: "corecteaza-o-prezenta" }] },
  ],
};
