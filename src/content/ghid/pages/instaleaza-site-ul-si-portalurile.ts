import type { GhidPage } from "@/lib/ghid/types";

export const instaleazaSiteulPage: GhidPage = {
  slug: "instaleaza-site-ul-si-portalurile",
  title: "Instalează site-ul și portalurile",
  lead: "Codul, variabilele și pornirea frontend-ului, care servește site-ul și ambele portaluri.",
  blocks: [
    { t: "p", text: "Instalează întâi backend-ul. Frontend-ul citește câmpuri pe care le furnizează backend-ul, iar unele pagini se încarcă la construire." },
    { t: "h2", text: "Codul și fișierul de variabile" },
    {
      t: "code",
      text: `cd /opt/edusport
git clone git@github.com:<org>/edusport_frontend.git
cd edusport_frontend
cp .env.example .env.production
chmod 600 .env.production`,
    },
    { t: "h2", text: "Variabile la construire" },
    { t: "p", text: "Sunt argumente de build ale compose. Orice schimbare cere reconstruire, nu doar repornire." },
    {
      t: "list",
      items: [
        "NEXT_PUBLIC_SITE_URL, NEXT_PUBLIC_STRAPI_URL;",
        "NEXT_PUBLIC_STRAPI_IMAGE_HOST: numai numele de gazdă, fără protocol sau port, altfel next/image răspunde 400;",
        "NEXT_PUBLIC_COMMIT_SHA (setat de deploy.sh);",
        "NEXT_PUBLIC_UMAMI_URL, NEXT_PUBLIC_UMAMI_WEBSITE_ID, NEXT_PUBLIC_UMAMI_WEBSITE_ID_SPORTIV, NEXT_PUBLIC_UMAMI_WEBSITE_ID_ANTRENOR;",
        "NEXT_PUBLIC_SENTRY_DSN, NEXT_PUBLIC_SENTRY_RELEASE, NEXT_PUBLIC_SENTRY_ENVIRONMENT.",
      ],
    },
    { t: "h2", text: "Variabile la rulare" },
    {
      t: "list",
      items: [
        "STRAPI_API_TOKEN;",
        "REVALIDATE_SECRET (egal cu backend-ul și cu webhook-ul);",
        "STRAPI_PREVIEW_SECRET (egal cu backend-ul);",
        "PORTAL_BFF_SECRET (egal cu backend-ul);",
        "PORTAL_HOST_ANTRENOR, PORTAL_HOST_SPORTIV: nume de gazdă fără protocol sau port; valoarea pentru antrenor construiește și adresa de revenire Google;",
        "PORTAL_STRAPI_URL (opțional);",
        "STRAPI_INTERNAL_URL (opțional);",
        "SENTRY_DSN, SENTRY_RELEASE, SENTRY_ENVIRONMENT;",
        "SKATE_RESULTS_API (opțional);",
        "GHID_PASSWORD.",
      ],
    },
    { t: "p", text: "**GHID_PASSWORD** deschide acest ghid, la **/ghid**, doar pe gazda site-ului. Setează-o în fișierul de variabile de pe server, niciodată în git. Dacă lipsește sau este goală, orice parolă este refuzată." },
    {
      t: "p",
      text: "**STRAPI_INTERNAL_URL**: apelurile de pe server folosesc STRAPI_INTERNAL_URL, apoi NEXT_PUBLIC_STRAPI_URL, apoi http://localhost:1337. Cu valoarea nesetată, cererile ies prin adresa publică și nginx. O cale internă mai rapidă este **STRAPI_INTERNAL_URL=http://edusport_backend:1337**, pentru că ambele containere sunt pe **edusport_net**.",
    },
    { t: "h2", text: "Pornire" },
    {
      t: "steps",
      steps: [
        { text: "Rulează scriptul de deploy al frontend-ului." },
        { text: "Verifică răspunsul de sănătate al containerului." },
      ],
    },
    {
      t: "code",
      text: `cd /opt/edusport/edusport_frontend
./scripts/deploy.sh
docker exec edusport-frontend wget -qO- http://localhost:3000/api/health`,
    },
    { t: "p", text: "Containerul rulează cu sistemul de fișiere doar pentru citire, iar memoria cache ISR se pierde la fiecare repornire; webhook-ul de reîmprospătare o reface." },
    { t: "links", items: [{ slug: "nginx-si-https" }] },
  ],
};
