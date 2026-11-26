import type { GhidPage } from "@/lib/ghid/types";

export const panoulDeAdministrarePage: GhidPage = {
  slug: "panoul-de-administrare",
  title: "Panoul de administrare",
  lead: "Locul de lucru al administratorilor: înscrieri, sportivi, grupe, prezență, plăți și site.",
  blocks: [
    {
      t: "p",
      text: "Înscrierile, sportivii, grupele, prezența, plățile și conținutul site-ului sunt în același loc. Fiecare cont vede doar ce îi permite rolul, iar schimbările la sportivi, înscrieri, prezențe, abonamente și plăți rămân în **Istoric**.",
    },
    { t: "h2", text: "Ce conține" },
    { t: "p", text: "Meniul din stânga are grupele de mai jos; fiecare cont vede doar grupele și paginile permise de rolul lui." },
    {
      t: "list",
      items: [
        "**Acasă**: **Ce e nou**, comutatorul **Înscrieri pe site** și **Acțiuni rapide**.",
        "**Noutăți**: **Anunțuri** și **Articole**.",
        "**Formulare**: **Înscrieri**, mesajele de **Contact**, cererile de la **Voluntari** și **Parteneri** și **Întrebările formularelor**.",
        "**Club și școală**: **Sportivi**, **Grupe**, **Prețuri**, **Prezență**, **Contabilitate**, **Calendar și serii** (ședințe, evenimente și pauze), **Tabele**, **Membri echipă** și **Competiții**.",
        "**Pagini site**: textele paginilor, de la **Pagina principală** la **Parteneri**, și **Meniu site**. **Sponsori** și **Evenimente colaborare** sunt taburi în pagina **Parteneri**, iar **Momente istoric** este tab în pagina **Istoric**.",
        "**Setări**: **Setări site**, **Sezoane**, **Discipline**, **Imagini**, **Securitate** (parola, 2FA și passkey-urile contului), **Funcții** (doar Super Admin), **Meniul Strapi** (doar Super Admin) și **Primii pași**.",
      ],
    },
    { t: "p", text: "Câteva activități se fac din mai multe pagini:" },
    {
      t: "list",
      items: [
        "Echipă și acces: administratorii se invită din **Utilizatori**, în meniul Strapi (doar Super Admin), antrenorii din **Membri echipă**, la **Cont portal**, iar părinții din fișa sportivului, la **Acces portal**.",
        "Date personale: **Exportă datele** și **Anonimizează**, din fișa sportivului, și limita pentru sportivii inactivi, în **Setări site**.",
        "Evidența modificărilor: fiecare schimbare la un sportiv, o înscriere, o prezență, un abonament sau o plată intră în **Istoric**.",
      ],
    },
    { t: "h2", text: "Cine îl folosește" },
    {
      t: "list",
      items: [
        "**Super Admin**: tot panoul, inclusiv **Utilizatori**, **Resetează 2FA** și **Anonimizează**.",
        "**Administrator club**: tot panoul, cu excepția paginilor rezervate rolului Super Admin. Invită antrenori și părinți în portal.",
        "**Editor site**: paginile site-ului, de exemplu **Pagina principală**, **Anunțuri**, **Competiții** și **Prețuri**.",
      ],
    },
    {
      t: "links",
      items: [
        { slug: "intra-in-panou" },
        { slug: "meniul-si-pagina-acasa" },
        { slug: "contul-tau-parola-si-2fa" },
        { slug: "roluri" },
        { slug: "ce-poate-face-fiecare-rol" },
        { slug: "adauga-un-administrator" },
      ],
    },
  ],
};
