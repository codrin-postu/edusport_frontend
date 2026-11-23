import type { GhidPage } from "@/lib/ghid/types";

export const ceItiTrebuiePage: GhidPage = {
  slug: "ce-iti-trebuie",
  title: "Ce îți trebuie",
  lead: "Serverul, domeniul, conturile și uneltele necesare înainte de instalare.",
  blocks: [
    {
      t: "warn",
      text: "Pașii de restaurare a datelor și de configurare nginx nu au fost rulați încă de la un capăt la altul pe un server nou. Verifică rezultatul fiecărui pas la rulare.",
    },
    {
      t: "p",
      text: "Instalarea de bază cuprinde **site-ul public** și **panoul de administrare**, cu baza de date. Portalurile antrenorilor și părinților sunt oprite și se pornesc separat, doar dacă sunt dorite. Serviciile din jur (e-mail, erori, statistici, Google) sunt opționale.",
    },
    { t: "h2", text: "Ce rulează pe server" },
    { t: "p", text: "Trei containere Docker pe aceeași rețea (**edusport_net**), în fața cărora stă nginx, instalat direct pe server:" },
    {
      t: "list",
      items: [
        "**edusport_postgres**: baza de date PostgreSQL 16, fără port publicat;",
        "**edusport_backend**: Strapi 5, panoul și API-ul, pe 127.0.0.1:1337;",
        "**edusport-frontend**: Next.js, site-ul (și portalurile, dacă sunt pornite), pe 127.0.0.1:3000.",
      ],
    },
    { t: "h2", text: "Serverul" },
    {
      t: "list",
      items: [
        "Ubuntu Server LTS, cu acces root sau sudo prin SSH;",
        "2 procesoare;",
        "cel puțin 4 GB de memorie, sau 2 GB de memorie plus 2 GB de swap: imaginile se construiesc pe server, iar construirea Strapi și Next consumă multă memorie;",
        "cel puțin 40 GB de disc;",
        "o adresă IP publică fixă.",
      ],
    },
    { t: "p", text: "Un server cloud de 2 procesoare și 4 GB este suficient. Costurile sunt pe pagina **Hosting**." },
    {
      t: "links",
      items: [
        { href: "https://docs.hetzner.com/cloud/", label: "Hetzner Cloud: documentație" },
        { href: "https://ubuntu.com/server/docs", label: "Ubuntu Server: documentație" },
        { slug: "hosting" },
      ],
    },
    { t: "h2", text: "Domeniul și înregistrările DNS" },
    { t: "p", text: "Instalarea de bază are nevoie de două nume de gazdă, fiecare cu o înregistrare **A** către adresa IP a serverului, create în panoul registrarului de domenii:" },
    {
      t: "list",
      items: [
        "site-ul public, de exemplu **exemplu.ro** sau **www.exemplu.ro**;",
        "panoul de administrare, de exemplu **admin.exemplu.ro**.",
      ],
    },
    {
      t: "code",
      text: `A    exemplu.ro          <adresa IP a serverului>
A    www.exemplu.ro      <adresa IP a serverului>
A    admin.exemplu.ro    <adresa IP a serverului>`,
    },
    { t: "p", text: "Portalurile adaugă încă două nume (**antrenor.** și **sportiv.**), doar dacă le pornești. E-mailul prin Brevo cere înregistrările SPF, DKIM și DMARC pe domeniul de expediere." },
    { t: "p", text: "Certificatele HTTPS vin gratuit de la Let's Encrypt, prin certbot, și se reînnoiesc automat." },
    {
      t: "links",
      items: [
        { href: "https://letsencrypt.org/docs/", label: "Let's Encrypt: documentație" },
        { href: "https://certbot.eff.org/instructions", label: "Certbot: instrucțiuni de instalare" },
      ],
    },
    { t: "h2", text: "Conturi" },
    {
      t: "list",
      items: [
        "**GitHub**: acces de citire la depozitele **edusport_backend** și **edusport_frontend**, pentru a adăuga câte o cheie de deploy;",
        "**Brevo** (opțional): e-mailurile de confirmare și invitațiile; fără el mesajele așteaptă în coadă;",
        "**Google Cloud** (opțional): un cont de serviciu pentru sincronizarea cu Google Sheets și, pentru portaluri, un client OAuth pentru autentificarea cu Google;",
        "**GlitchTip** și **Umami** (opțional): urmărirea erorilor și statisticile; o instalare existentă sau una proprie.",
      ],
    },
    {
      t: "links",
      items: [
        { href: "https://docs.github.com/en/authentication/connecting-to-github-with-ssh/managing-deploy-keys", label: "GitHub: chei de deploy" },
        { href: "https://developers.brevo.com/docs/getting-started", label: "Brevo: primii pași cu API-ul" },
        { href: "https://cloud.google.com/iam/docs/service-accounts-create", label: "Google Cloud: conturi de serviciu" },
        { href: "https://developers.google.com/identity/protocols/oauth2", label: "Google: OAuth 2.0" },
        { href: "https://glitchtip.com/documentation", label: "GlitchTip: documentație" },
        { href: "https://umami.is/docs", label: "Umami: documentație" },
      ],
    },
    { t: "h2", text: "Unelte pe server" },
    {
      t: "list",
      items: [
        "**Docker Engine** cu pluginul **Docker Compose**, din depozitul apt oficial Docker;",
        "**nginx**, **certbot** și pluginul **python3-certbot-nginx**;",
        "**git**, **rsync**, **fail2ban**, **ufw**;",
        "un utilizator fără drepturi de root, membru al grupului **docker**, cu care se face instalarea.",
      ],
    },
    {
      t: "links",
      items: [
        { href: "https://docs.docker.com/engine/install/ubuntu/", label: "Docker Engine pe Ubuntu" },
        { href: "https://docs.docker.com/compose/", label: "Docker Compose" },
        { href: "https://nginx.org/en/docs/", label: "nginx: documentație" },
      ],
    },
    { t: "h2", text: "Unelte pe calculatorul tău" },
    {
      t: "list",
      items: [
        "un client SSH cu o cheie SSH (parola prin SSH se dezactivează);",
        "**openssl**, pentru generarea secretelor;",
        "**dig** sau un alt verificator DNS.",
      ],
    },
    { t: "h2", text: "Ordinea paginilor" },
    { t: "p", text: "Pașii urmează ordinea de mai jos. Pagina portalurilor și cea a serviciilor opționale se pot sări." },
    {
      t: "links",
      items: [
        { slug: "pregateste-serverul" },
        { slug: "nginx-si-https" },
        { slug: "instaleaza-panoul-de-administrare" },
        { slug: "instaleaza-site-ul" },
        { slug: "portalurile-optional" },
        { slug: "servicii-optionale" },
        { slug: "muta-datele-de-pe-serverul-vechi" },
        { slug: "copii-de-siguranta-si-verificarea-finala" },
      ],
    },
  ],
};
