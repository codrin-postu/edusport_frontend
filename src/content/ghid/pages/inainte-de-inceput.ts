import type { GhidPage } from "@/lib/ghid/types";

export const inainteDeInceputPage: GhidPage = {
  slug: "inainte-de-inceput",
  title: "Înainte de început",
  lead: "Ce trebuie pregătit înainte de a instala EduSport pe un server nou.",
  blocks: [
    {
      t: "warn",
      text: "Pașii de restaurare a datelor și de configurare nginx nu au fost rulați încă de la un cap la altul pe un server nou. Verifică fiecare pas la rulare.",
    },
    { t: "h2", text: "Ce rulează" },
    { t: "p", text: "Trei containere pe aceeași rețea Docker (**edusport_net**), în fața cărora stă nginx, instalat direct pe server:" },
    {
      t: "list",
      items: [
        "**edusport_postgres**: baza de date, fără port publicat;",
        "**edusport_backend**: Strapi 5 (panoul și API-ul), pe 127.0.0.1:1337;",
        "**edusport-frontend**: site-ul și ambele portaluri, într-un singur container, pe 127.0.0.1:3000.",
      ],
    },
    { t: "p", text: "Frontend-ul alege între site și portal după numele de gazdă din cerere, deci nginx trebuie să trimită **Host** nemodificat." },
    { t: "h2", text: "Cerințe pentru server" },
    {
      t: "list",
      items: [
        "Ubuntu LTS;",
        "2 procesoare;",
        "cel puțin 4 GB de memorie sau 2 GB de swap;",
        "cel puțin 40 GB de disc.",
      ],
    },
    { t: "p", text: "Imaginile se construiesc pe server, iar construirea Strapi și Next consumă multă memorie: păstrează fișierul de swap." },
    { t: "h2", text: "Conturi și chei" },
    {
      t: "list",
      items: [
        "un utilizator fără drepturi de root, în grupul **docker**, pentru instalare;",
        "o cheie de deploy GitHub, doar pentru citire, pentru fiecare depozit (**edusport_backend** și **edusport_frontend**);",
        "acces SSH numai cu cheie.",
      ],
    },
    { t: "h2", text: "Nume de domeniu și înregistrări DNS" },
    { t: "p", text: "Sunt necesare patru nume de gazdă, toate cu înregistrare A către adresa noului server:" },
    {
      t: "list",
      items: [
        "site-ul public (exemplu: **edusport.codrin.space**);",
        "panoul și API-ul (exemplu: **admin.edusport.codrin.space**);",
        "portalul antrenorilor (exemplu: **antrenor.edusport.codrin.space**);",
        "portalul sportivilor și părinților (exemplu: **sportiv.edusport.codrin.space**).",
      ],
    },
    { t: "p", text: "La o mutare de pe un server vechi, scade TTL-ul cu o zi înainte. Așteaptă propagarea înainte de pasul cu certificatele." },
    {
      t: "code",
      text: `dig +short edusport.codrin.space
dig +short admin.edusport.codrin.space
dig +short antrenor.edusport.codrin.space
dig +short sportiv.edusport.codrin.space`,
    },
    { t: "p", text: "Pentru e-mail, domeniul de expediere are nevoie de înregistrările Brevo: SPF, DKIM și DMARC." },
    { t: "h2", text: "Ordinea paginilor" },
    {
      t: "links",
      items: [
        { slug: "pregateste-serverul" },
        { slug: "instaleaza-backend-ul" },
        { slug: "instaleaza-site-ul-si-portalurile" },
        { slug: "nginx-si-https" },
        { slug: "muta-datele-de-pe-serverul-vechi" },
        { slug: "copii-de-siguranta-monitorizare-e-mail-google-si-analytics" },
        { slug: "verificarea-finala" },
      ],
    },
  ],
};
