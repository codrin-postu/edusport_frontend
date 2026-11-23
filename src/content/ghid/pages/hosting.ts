import type { GhidPage } from "@/lib/ghid/types";

export const hostingPage: GhidPage = {
  slug: "hosting",
  title: "Hosting",
  lead: "Opțiunile de hosting pentru site, panou și portaluri, cu costul fiecăreia.",
  blocks: [
    { t: "h2", text: "Server propriu" },
    { t: "p", text: "Serverul se închiriază de la un furnizor de cloud. Site-ul, panoul, portalurile și baza de date au nevoie de cel puțin 4 GB de memorie." },
    {
      t: "list",
      items: [
        "Hetzner Cloud, 2 procesoare, 4 GB memorie, 80 GB disc: **16,99 euro pe lună**, fără TVA (preț verificat pe 21 noiembrie 2026).",
        "DigitalOcean, 2 procesoare, 4 GB memorie, 80 GB disc: **24 de dolari pe lună** (preț verificat pe 21 noiembrie 2026).",
      ],
    },
    { t: "p", text: "Costul serverului nu include:" },
    {
      t: "list",
      items: [
        "contul la furnizor și cardul de plată;",
        "configurarea serverului și a domeniului;",
        "copii de siguranță zilnice, verificate periodic;",
        "actualizări de securitate;",
        "monitorizarea serverului și a erorilor;",
        "intervenția la defecțiuni, inclusiv în afara programului.",
      ],
    },
    { t: "p", text: "Pașii de instalare sunt în **Instalare pe un server nou**." },
    { t: "links", items: [{ slug: "ce-iti-trebuie", label: "Instalare pe un server nou" }] },
    { t: "h2", text: "Hosting administrat" },
    { t: "p", text: "Site-ul, panoul și portalurile rulează în prezent în această variantă. Cost: **6 euro pe lună**. Include:" },
    {
      t: "list",
      items: [
        "site-ul, panoul de administrare, portalurile și baza de date;",
        "copie de siguranță zilnică la 03:00 UTC a bazei de date, a imaginilor încărcate și a PDF-urilor de înscriere; se păstrează ultimele 14 copii, pe același server;",
        "monitorizarea erorilor (GlitchTip);",
        "monitorizarea serverului, cu raport zilnic la 08:00;",
        "reînnoirea automată a certificatelor HTTPS;",
        "un singur punct de contact pentru defecțiuni.",
      ],
    },
    { t: "h2", text: "Recomandare" },
    {
      t: "p",
      text: "Varianta recomandată este hostingul administrat. Costul este mai mic decât al unui server propriu, iar copiile de siguranță, monitorizarea și certificatele funcționează deja. Pe un server propriu, acestea trebuie configurate din nou și întreținute separat.",
    },
  ],
};
