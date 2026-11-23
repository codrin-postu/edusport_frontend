import type { GhidPage } from "@/lib/ghid/types";

export const instaleazaBackendulPage: GhidPage = {
  slug: "instaleaza-backend-ul",
  title: "Instalează backend-ul",
  lead: "Codul, variabilele, pornirea, primul administrator și volumele backend-ului.",
  blocks: [
    {
      t: "warn",
      text: "La o mutare de pe serverul vechi, păstrează aceste variabile NEMODIFICATE: APP_KEYS, API_TOKEN_SALT, ADMIN_JWT_SECRET, TRANSFER_TOKEN_SALT, JWT_SECRET, ENCRYPTION_KEY, AUTH_SECRET_KEY, AUTH_CODE_KEY, DOCUMENT_TOKEN_SECRET, PORTAL_BFF_SECRET. Valori noi strică secretele 2FA salvate și invalidează tokenurile. Copiază fișierul vechi pe un canal securizat și nu lipi niciodată secrete în documente sau mesaje.",
    },
    {
      t: "steps",
      steps: [
        {
          text: "Clonează codul backend-ului.",
          code: `cd /opt/edusport
git clone git@github.com:<org>/edusport_backend.git`,
        },
        {
          text: "Copiază **.env.example** în **.env.production** și restrânge accesul la fișier.",
          code: `cd /opt/edusport/edusport_backend
cp .env.example .env.production
chmod 600 .env.production`,
        },
        { text: "Generează fiecare secret cu **openssl rand -base64 32**. **APP_KEYS** este o listă de două valori, separate prin virgulă." },
        { text: "Completează variabilele din lista de mai jos. Compose și scripturile citesc fișierul printr-un **--env-file** explicit, pentru că compose citește singur doar **.env**." },
        {
          text: "Rulează scriptul de deploy. Fazele lui: pull, build, up (postgres, așteptarea pg_isready, apoi backend; Strapi migrează schema la pornire) și health (verifică /_health în container, până la 60 de secunde). Echivalentul manual: **docker compose ... up -d postgres backend**.",
          code: `cd /opt/edusport/edusport_backend
./scripts/deploy.sh`,
        },
        {
          text: "Repornește backend-ul încă o dată după prima pornire a unei versiuni noi. Atributele noi ale tipurilor existente sunt ignorate la salvare până la repornire.",
          code: "docker compose -f docker-compose.production.yml --env-file .env.production restart backend",
        },
        { text: "Doar la instalare nouă: setează **ADMIN_GATE=off**, rulează deploy, deschide **https://<gazda panoului>/admin** și creează primul administrator. Nu s-a verificat dacă ecranul de înregistrare funcționează cu poarta pornită." },
        { text: "Creează și autentifică doi Super Admin. Șterge toate tokenurile API și de transfer din Strapi, scoate linia **ADMIN_GATE** (sau setează **ADMIN_GATE=on**) și repornește. Jurnalul de pornire nu trebuie să mai afișeze **[security] ADMIN_GATE=off in production**." },
        { text: "Dă fiecărui administrator care nu este Super Admin un rol EduSport (jurnalul de pornire îi listează pe cei fără rol)." },
        { text: "În Strapi, la Settings, API Tokens, creează tokenul API doar pentru citire, pentru **STRAPI_API_TOKEN** din frontend." },
        { text: "Creează webhook-ul **Frontend revalidation**: URL **https://<gazda site-ului>/api/revalidate**, metoda POST, antetul **x-revalidate-secret** egal cu **REVALIDATE_SECRET** din frontend, la evenimentele publicare, actualizare, depublicare și ștergere de intrare, plus creare, actualizare și ștergere de fișier media." },
      ],
    },
    { t: "p", text: "La o mutare de date, tokenul și webhook-ul sunt deja în baza de date; secretul webhook-ului trebuie totuși să fie egal cu valoarea nouă din frontend." },
    { t: "p", text: "Unelte de recuperare: **npm run admin:reset-2fa**, **admin:end-sessions**, **passkeys:cutover**." },
    { t: "h2", text: "Variabilele, după rol" },
    {
      t: "list",
      items: [
        "**Rulare**: NODE_ENV (production), HOST, PORT.",
        "**Secrete Strapi**: APP_KEYS, API_TOKEN_SALT, ADMIN_JWT_SECRET, TRANSFER_TOKEN_SALT, JWT_SECRET, ENCRYPTION_KEY.",
        "**Baza de date**: DATABASE_CLIENT, DATABASE_HOST (numele serviciului compose, postgres), DATABASE_PORT, DATABASE_NAME, DATABASE_USERNAME, DATABASE_PASSWORD, DATABASE_SSL. Datele de acces se fixează în volumul pgdata la prima pornire; schimbarea lor ulterioară cere ștergerea volumului sau ALTER USER.",
        "**CORS și linkuri**: FRONTEND_ORIGIN (origini separate prin virgulă; prima este baza linkurilor din e-mail), CMS_PUBLIC_URL (fără bară la final).",
        "**Reîmprospătare cache**: REVALIDATE_SECRET (egal cu valoarea din frontend), REVALIDATE_FRONTEND_URL (opțional).",
        "**Google Sheets**: GOOGLE_SA_EMAIL, GOOGLE_SA_PRIVATE_KEY, SHEETS_SHARE_WITH, SHEETS_DRY_RUN, SHEETS_SPREADSHEET_ID, SHEETS_TAB_NAME.",
        "**Cardul GlitchTip din panou**: GLITCHTIP_API_URL, GLITCHTIP_API_TOKEN, GLITCHTIP_ORG, GLITCHTIP_PROJECT, GLITCHTIP_PUBLIC_URL.",
        "**Urmărirea erorilor**: SENTRY_DSN, SENTRY_ENVIRONMENT, SENTRY_TRACES_SAMPLE_RATE (fără efect dacă lipsesc).",
        "**Umami în panou** (lipsesc din .env.example): UMAMI_API_URL, UMAMI_PUBLIC_URL, UMAMI_WEBSITE_ID, UMAMI_USERNAME, UMAMI_PASSWORD.",
        "**PDF-uri de înscriere**: DOCUMENT_TOKEN_SECRET (cel puțin 32 de caractere, OBLIGATORIU: fără el formularul refuză înscrierile), PRIVATE_FILES_DIR (gol în producție).",
        "**E-mail**: BREVO_API_KEY (fără el, mesajele așteaptă în coadă), EMAIL_FROM_ADDRESS, EMAIL_FROM_NAME, EMAIL_REPLY_TO, EMAIL_LIVE (părinții primesc e-mailuri reale doar când NODE_ENV=production și EMAIL_LIVE=true), EMAIL_TEST_RECIPIENT.",
        "**Chei de autentificare**: AUTH_SECRET_KEY, AUTH_CODE_KEY (32 de octeți aleatori, base64; în producție aplicația nu pornește fără ambele), AUTH_SECRET_KEY_OLD, AUTH_CODE_KEY_OLD (doar la rotație).",
        "**Autentificare în panou**: ADMIN_HOST (gazda panoului FĂRĂ protocol; o valoare greșită face ca fiecare autentificare să primească 403), ADMIN_GATE (doar valoarea exactă off deschide autentificarea cu parolă a Strapi), ADMIN_ORIGIN (doar local), HAS_ROLE_ENFORCED (true impune rolurile de administrator).",
        "**Portal**: PORTAL_BFF_SECRET (egal cu valoarea din frontend, cel puțin 32 de caractere), PORTAL_HOSTS (lista etichetelor de portal; implicit doar antrenor, deci include și sportiv), PORTAL_GOOGLE_CLIENT_ID, PORTAL_GOOGLE_CLIENT_SECRET, PORTAL_2FA (oprit dacă nu este on).",
        "**Chei de acces (passkeys)**: WEBAUTHN_RP_ID (domeniul părinte înregistrabil), WEBAUTHN_ORIGINS (lista exactă a originilor; include antrenor, sportiv și gazda panoului), WEBAUTHN_MOVED_AT (doar la mutarea domeniului).",
        "**Previzualizare în panou** (lipsește din .env.example): STRAPI_PREVIEW_SECRET, egal cu valoarea din frontend.",
      ],
    },
    { t: "h2", text: "Volume și proprietar" },
    {
      t: "p",
      text: "Volumul **uploads** se montează la **/opt/app/public/uploads**, iar **private_documents** la **/opt/app/private**. Volumele create prin compose primesc proprietarul 100:101. Containerul renunță la toate capabilitățile și nu poate face chown: un volum cu proprietar root face ca fiecare încărcare să eșueze cu EACCES. Creează volumele mereu prin compose și redă proprietarul 100:101 după orice copiere făcută ca root.",
    },
    { t: "p", text: "Numele volumelor urmează numele directorului: **edusport_backend_pgdata**, **edusport_backend_uploads**, **edusport_backend_private_documents**." },
    { t: "links", items: [{ slug: "instaleaza-site-ul-si-portalurile" }] },
  ],
};
