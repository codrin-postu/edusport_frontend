import type { GhidPage } from "@/lib/ghid/types";

export const serviciiDinSpatePage: GhidPage = {
  slug: "servicii-din-spate",
  title: "Servicii din spate",
  lead: "Ce rulează pentru site, panou și portaluri fără să se ocupe cineva de el.",
  blocks: [
    {
      t: "p",
      text: "Câteva servicii lucrează pentru site, panou și portaluri fără să le gestioneze cineva: copiile de siguranță, reînnoirea HTTPS, e-mailul, monitorizarea erorilor și a serverului și statisticile.",
    },
    { t: "h2", text: "Ce rulează automat" },
    {
      t: "list",
      items: [
        "**Copii de siguranță**: în fiecare noapte, baza de date, imaginile și PDF-urile de înscriere. Se păstrează ultimele 14 copii.",
        "**HTTPS**: adresele clubului folosesc certificate Let's Encrypt, reînnoite automat.",
        "**E-mail** (Brevo, opțional): trimite confirmările de înscriere, invitațiile în portal și celelalte e-mailuri automate. Fără el, mesajele așteaptă în coadă.",
        "**Monitorizarea erorilor** (GlitchTip, opțional): colectează automat erorile site-ului și ale panoului, afișate și în cardul **Sănătate site**.",
        "**Monitorizarea serverului** (opțional): starea serverului este urmărită automat.",
        "**Statistici** (Umami, opțional): numără vizitele pe site, fără cookie-uri. Panoul arată traficul și statisticile anunțurilor.",
        "**Google** (opțional): intrarea cu **Continuă cu Google**, în panou și în portaluri, și copierea formularelor într-un tabel Google Sheets.",
        "**skate-results** (opțional): serviciul cu rezultatele competițiilor importate, pentru profilurile sportivilor și pagina **Realizări**.",
      ],
    },
    { t: "p", text: "Serviciile opționale se pot adăuga oricând: site-ul și panoul funcționează și fără ele." },
    { t: "h2", text: "Pe ce se sprijină" },
    {
      t: "p",
      text: "Pe server rulează trei containere: baza de date, panoul cu API-ul și site-ul, care servește și portalurile. În fața lor stă nginx.",
    },
    {
      t: "list",
      items: [
        "**Baza de date** (PostgreSQL): păstrează sportivii, grupele, prezențele, plățile și conținutul site-ului.",
        "**Fișierele**: imaginile încărcate în Media și PDF-urile de înscriere, păstrate pe server, separat unele de altele.",
      ],
    },
    {
      t: "links",
      items: [
        { slug: "servicii-optionale" },
        { slug: "copii-de-siguranta-si-verificarea-finala" },
        { slug: "siguranta" },
        { slug: "hosting" },
      ],
    },
  ],
};
