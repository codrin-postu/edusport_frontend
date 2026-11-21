import type { GhidPage } from "@/lib/ghid/types";

export const documenteleSportivuluiPage: GhidPage = {
  slug: "documentele-sportivului",
  title: "Documentele sportivului",
  lead: "Fișa arată documentele PDF ale înscrierilor sportivului. Le vezi sau le descarci.",
  blocks: [
    {
      t: "steps",
      steps: [
        { text: "Deschide fișa sportivului, tabul **Documente**.", shot: "sportivi-documente", marks: ["vezi", "descarca"] },
        { text: "Fiecare rând e un document, de exemplu **Acord** sau **Cerere de adeziune**, cu sezonul și numărul înscrierii." },
        { text: "**Vezi** deschide documentul. **Descarcă** îl salvează pe calculator." },
      ],
    },
    {
      t: "p",
      text: "Dacă sportivul nu are încă niciun document, tabul arată **Niciun document încă.** Documentele vin din înscrieri. Dacă un document nu se poate descărca, apare **Documentul nu a putut fi descărcat.**",
    },
    { t: "links", items: [{ slug: "descarca-lista-si-formularele-goale" }, { slug: "fisa-sportivului" }] },
  ],
};
