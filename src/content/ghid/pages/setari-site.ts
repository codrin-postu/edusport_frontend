import type { GhidPage } from "@/lib/ghid/types";

export const setariSitePage: GhidPage = {
  slug: "setari-site",
  title: "Setări site",
  lead: "Pagina Setări site are trei carduri: înscrierile, datele de contact și datele personale. Este disponibilă doar pentru Administrator club și Super Admin.",
  blocks: [
    {
      t: "steps",
      steps: [
        { text: "Deschide **Setări site**, în meniu, sus." },
        {
          text: "La cardul **Înscrieri**, comutatorul **Înscrieri deschise** deschide sau închide înscrierile.",
          shot: "date-setari",
          marks: ["inscrieri-deschise"],
        },
        { text: "La **Date de contact & rețele sociale** completezi **Număr telefon**, **Adresă email**, **Facebook**, **Instagram**, **Canal WhatsApp**, **Adresă afișată** și **Link hartă**." },
        { text: "Dacă **Link hartă** rămâne gol, se folosește căutarea Google Maps." },
        {
          text: "La cardul **Date personale** sunt **Ani până la anonimizare** și **Prezență și plăți din**.",
          shot: "date-setari",
          marks: ["limita", "prezenta-din"],
        },
        { text: "Apasă **Salvează**, în bara de jos." },
      ],
    },
    { t: "h2", text: "Înscrieri deschise" },
    {
      t: "p",
      text: "Cu comutatorul oprit, formularul de înscriere răspunde **Înscrierile sunt închise.**, iar butonul **Înscrie-te la cursuri** din antetul site-ului arată **Cursuri**.",
    },
    { t: "h2", text: "Date de contact" },
    {
      t: "p",
      text: "Datele apar pe site, în subsol și pe pagina Contact.",
    },
    { t: "h2", text: "Date personale" },
    {
      t: "list",
      items: [
        "**Ani până la anonimizare** stabilește după câți ani un sportiv este considerat inactiv. Detalii în pagina Sportivi inactivi.",
        "**Prezență și plăți din**: lunile de club dinaintea acestei date nu intră în sumele de plată. Dacă data lipsește, pagina Prezență cere completarea ei.",
      ],
    },
    { t: "links", items: [{ slug: "sportivi-inactivi" }, { slug: "roluri" }] },
  ],
};
