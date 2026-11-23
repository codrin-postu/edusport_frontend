import type { GhidPage } from "@/lib/ghid/types";

export const ceEsteEdusportPage: GhidPage = {
  slug: "ce-este-edusport",
  title: "Ce este EduSport",
  lead: "Un singur sistem pentru site, înscrieri, prezență, program și plăți.",
  blocks: [
    {
      t: "p",
      text: "EduSport adună într-un singur loc ce acum este împărțit între patru instrumente: tabelul de prezență, formularul de înscriere, site-ul vechi și hârtia, telefonul și WhatsApp-ul.",
    },
    {
      t: "p",
      text: "Are patru părți: site-ul public, panoul de administrare, portalul antrenorului și portalul sportivului. Toate lucrează cu aceleași date, din aceeași bază de date.",
    },
    { t: "h2", text: "Ce câștigi" },
    {
      t: "list",
      items: [
        "Prezența se completează din telefon, în portal, iar ședințele rămase se calculează automat.",
        "Înscrierile ajung în panou, cu status, iar părintele primește pe e-mail PDF-ul formularului.",
        "Textele site-ului, prețurile și articolele se schimbă din panou, iar orarul urmează programul grupelor.",
        "Anulările, pauzele și anunțurile ajung la părinți în portal și, la alegere, pe e-mail.",
        "Plățile se înregistrează cu număr de chitanță, iar fiecare schimbare rămâne în **Istoric**.",
      ],
    },
    {
      t: "links",
      items: [
        { slug: "ce-se-schimba-fata-de-acum" },
        { slug: "cum-lucreaza-impreuna" },
        { slug: "site-ul-public" },
        { slug: "panoul-de-administrare" },
        { slug: "portalul-antrenorului" },
        { slug: "portalul-sportivului" },
        { slug: "servicii-din-spate" },
        { slug: "siguranta" },
        { slug: "hosting" },
      ],
    },
  ],
};
