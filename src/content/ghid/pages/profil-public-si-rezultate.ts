import type { GhidPage } from "@/lib/ghid/types";

export const profilPublicSiRezultatePage: GhidPage = {
  slug: "profil-public-si-rezultate",
  title: "Profil public și rezultate",
  lead: "Tabul **Profil public** are pagina sportivului de pe site și legătura cu rezultatele din skate-results.",
  blocks: [
    {
      t: "steps",
      steps: [
        {
          text: "Deschide fișa sportivului, tabul **Profil public**. Dacă sportivul nu are profil, apasă **Creează profil public**.",
          shot: "sportivi-profil",
          marks: ["tab-profil"],
        },
        {
          text: "La **Vizibilitate pe site** alege **Public** sau **Ascuns**. **Slug** se vede, dar nu se poate schimba.",
          shot: "sportivi-profil",
          marks: ["vizibilitate"],
        },
        { text: "Completează cardurile: **Identitate**, **Poveste**, **Echipă și discipline**, **Mișcări și hobby-uri**, **Obiectiv de carieră**, **Galerie** și **Programe pe sezon**." },
        { text: "**Nume** se schimbă în **Date**." },
        { text: "După prima modificare apar **Renunță** și **Salvează**. Apasă **Salvează**." },
      ],
    },
    { t: "h2", text: "Legătura cu skate-results" },
    {
      t: "p",
      text: "Cardul **Rezultate competiții** leagă profilul de sportivul din skate-results. Cu legătura făcută, rezultatele apar în tabul **Competiții**.",
    },
    {
      t: "steps",
      steps: [
        {
          text: "La **Rezultate competiții** scrie numele în **Caută sportiv după nume** și apasă **Caută**.",
          shot: "sportivi-profil-rezultate",
          marks: ["nume", "cauta"],
        },
        { text: "Alege sportivul din listă. Lista arată țara, clubul și numărul de competiții. Cardul arată **conectat**. Apasă **Salvează**." },
        {
          text: "Sub **Istoric competițional** apasă **Importă**. Starea se vede lângă buton, de exemplu **Descărcare** sau **Finalizat**.",
        },
      ],
    },
    {
      t: "p",
      text: "Importul rulează pe server, deci poți închide pagina. **Oprește** sau **Anulează** îl oprește, **Importă din nou** îl pornește iar. **Deconectează** scoate legătura, apoi **Salvează**.",
    },
    {
      t: "p",
      text: "Dacă apare **Niciun rezultat**, sportivul nu e încă în skate-results: nicio competiție de-a lui nu a fost preluată.",
    },
    { t: "links", items: [{ slug: "competitii-si-rezultate" }, { slug: "fisa-sportivului" }] },
  ],
};
