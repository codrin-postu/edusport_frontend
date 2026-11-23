import type { GhidPage } from "@/lib/ghid/types";

export const instaleazaSiteulPage: GhidPage = {
  slug: "instaleaza-site-ul",
  title: "Instalează site-ul",
  lead: "Codul, variabilele obligatorii și pornirea site-ului public.",
  blocks: [
    { t: "p", text: "Panoul trebuie să răspundă deja la adresa lui publică: site-ul citește conținut din panou la construire." },
    {
      t: "steps",
      steps: [
        {
          text: "Clonează codul frontend-ului și creează fișierul de variabile.",
          code: `cd /opt/edusport
git clone git@github.com:<org>/edusport_frontend.git
cd edusport_frontend
cp .env.example .env.production
chmod 600 .env.production`,
        },
        {
          text: "Completează variabilele din lista **Obligatorii** de mai jos și, după caz, pe cele **Recomandate**. Lasă **PORTAL_HOST_ANTRENOR** și **PORTAL_HOST_SPORTIV** comentate: fără ele, adresele portalurilor răspund 404 pe orice gazdă.",
        },
        {
          text: "Rulează scriptul de deploy. Fazele lui: pull, build (construiește imaginea, cu variabilele **NEXT_PUBLIC_** incluse în cod și cu hash-ul commit-ului), up și health (verifică **/api/health** în container). Construirea durează câteva minute.",
          code: `cd /opt/edusport/edusport_frontend
./scripts/deploy.sh`,
        },
        {
          text: "Verifică răspunsul de sănătate și pagina principală. Răspunsul de sănătate conține **\"ok\":true** și hash-ul commit-ului.",
          code: `docker exec edusport-frontend wget -qO- http://localhost:3000/api/health
curl -I https://<gazda site-ului>`,
        },
        {
          text: "Verifică reîmprospătarea: modifică o pagină în panou, publică și reîncarcă site-ul după câteva secunde. Dacă schimbarea nu apare, compară **REVALIDATE_SECRET** din cele două fișiere și antetul webhook-ului.",
        },
      ],
    },
    { t: "h2", text: "Variabile obligatorii" },
    {
      t: "list",
      items: [
        "**NEXT_PUBLIC_SITE_URL**: originea publică a site-ului, cu protocol (de exemplu https://exemplu.ro); sitemap, robots, OpenGraph. Fără ea, construirea se oprește cu un mesaj.",
        "**NEXT_PUBLIC_STRAPI_URL**: originea publică a panoului, cu protocol (de exemplu https://admin.exemplu.ro); formularele din browser trimit aici, imaginile se încarcă de aici. Fără ea, construirea se oprește.",
        "**STRAPI_API_TOKEN**: tokenul Read-only creat în panou. Fără el, panoul răspunde 403 și paginile site-ului dau eroare.",
      ],
    },
    { t: "h2", text: "Variabile recomandate" },
    {
      t: "list",
      items: [
        "**STRAPI_INTERNAL_URL**: **http://edusport_backend:1337**; cererile de pe server merg direct prin rețeaua Docker, nu prin adresa publică și nginx. Fără ea, totul funcționează, dar mai lent.",
        "**REVALIDATE_SECRET**: aceeași valoare ca în backend și în webhook. Fără ea, adresa **/api/revalidate** răspunde 500, iar paginile se reîmprospătează după 30 de minute.",
        "**GHID_PASSWORD**: parola acestui ghid, la **/ghid**, doar pe gazda site-ului. Fără ea, orice parolă este refuzată.",
        "**STRAPI_PREVIEW_SECRET**: aceeași valoare ca în backend; previzualizarea articolelor nepublicate. Fără ea, previzualizarea răspunde 500.",
      ],
    },
    {
      t: "p",
      text: "Variabilele **NEXT_PUBLIC_** se includ în cod la construire: orice schimbare a lor cere **./scripts/deploy.sh** din nou, nu doar o repornire. Celelalte se citesc la pornire: după o schimbare este suficient **docker compose -f docker-compose.production.yml --env-file .env.production up -d frontend**. **NEXT_PUBLIC_COMMIT_SHA** este setată de scriptul de deploy, nu o completa.",
    },
    { t: "p", text: "Containerul rulează cu sistemul de fișiere doar pentru citire. Cache-ul paginilor se pierde la fiecare repornire, iar primele cereri de după sunt mai lente; webhook-ul îl reface." },
    { t: "links", items: [{ slug: "portalurile-optional" }, { slug: "servicii-optionale" }] },
  ],
};
