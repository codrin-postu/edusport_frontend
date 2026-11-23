import type { GhidPage } from "@/lib/ghid/types";

export const instaleazaPanoulPage: GhidPage = {
  slug: "instaleaza-panoul-de-administrare",
  title: "Instalează panoul de administrare",
  lead: "Baza de date și Strapi: codul, variabilele obligatorii, pornirea, primul administrator, tokenul și webhook-ul pentru site.",
  blocks: [
    {
      t: "warn",
      text: "La o mutare de pe un server vechi, nu genera secrete noi: copiază fișierul vechi de variabile și urmează pagina **Mută datele de pe serverul vechi**. Nu lipi niciodată valori de secrete în documente sau mesaje.",
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
          text: "Copiază **.env.example** în **.env.production** și restrânge accesul la fișier. Compose și scripturile citesc acest fișier printr-un **--env-file** explicit, pentru că compose citește singur doar **.env**.",
          code: `cd /opt/edusport/edusport_backend
cp .env.example .env.production
chmod 600 .env.production`,
        },
        {
          text: "Generează câte un secret pentru fiecare variabilă din grupul **Secrete** de mai jos, cu comanda de mai jos, rulată o dată pentru fiecare. **APP_KEYS** primește două valori, separate prin virgulă. Pentru **DOCUMENT_TOKEN_SECRET** folosește **-base64 48**.",
          code: "openssl rand -base64 32",
        },
        {
          text: "Completează variabilele din lista **Obligatorii** de mai jos și, după caz, pe cele **Recomandate**. Lasă restul necompletate sau comentate; în special **PORTAL_HOSTS** rămâne gol, ca portalurile să stea oprite.",
        },
        {
          text: "Doar pentru primul administrator: adaugă temporar linia **ADMIN_GATE=off**. Ea deschide autentificarea cu parolă a Strapi, pe care panoul o ține închisă în mod normal.",
          code: "ADMIN_GATE=off",
        },
        {
          text: "Rulează scriptul de deploy. Fazele lui: pull (aduce ultima versiune de pe main), build (construiește imaginea), up (pornește postgres, așteaptă să răspundă, apoi pornește backend-ul, care migrează schema la pornire) și health (verifică **/_health** în container, până la 60 de secunde). Păstrează **DATABASE_USERNAME=strapi**: scriptul așteaptă baza cu acest nume de utilizator.",
          code: `cd /opt/edusport/edusport_backend
./scripts/deploy.sh`,
        },
        {
          text: "Repornește backend-ul încă o dată. La prima pornire a unei versiuni noi, atributele noi ale tipurilor de conținut existente sunt ignorate la salvare până la repornire.",
          code: "docker compose -f docker-compose.production.yml --env-file .env.production restart backend",
        },
        {
          text: "Deschide **https://<gazda panoului>/admin** și creează primul administrator în formularul Strapi. Apoi, din panou, adaugă un al doilea Super Admin și autentifică-te și cu el. Nu s-a verificat dacă formularul de înregistrare funcționează cu poarta închisă, de aceea pasul cu **ADMIN_GATE=off**.",
        },
        {
          text: "Închide poarta: șterge linia **ADMIN_GATE=off** din **.env.production** (sau scrie **ADMIN_GATE=on**), pornește din nou backend-ul și verifică jurnalul. Mesajul **[security] ADMIN_GATE=off in production** nu trebuie să mai apară. Dacă în Strapi există deja tokenuri API sau de transfer, șterge-le înainte de a închide poarta.",
          code: `docker compose -f docker-compose.production.yml --env-file .env.production up -d backend
docker compose -f docker-compose.production.yml --env-file .env.production logs backend | grep -i admin_gate`,
        },
        {
          text: "Autentifică-te la **https://<gazda panoului>/login** (autentificarea proprie a panoului). Dă fiecărui administrator care nu este Super Admin un rol al platformei: jurnalul de pornire îi listează pe cei fără rol. Vezi **Roluri**.",
        },
        {
          text: "Creează tokenul pentru site: Settings, API Tokens, tip **Read-only**, durată nelimitată. Copiază valoarea imediat, se afișează o singură dată; ea devine **STRAPI_API_TOKEN** la instalarea site-ului.",
        },
        {
          text: "Creează webhook-ul de reîmprospătare: Settings, Webhooks, nume **Frontend revalidation**, URL **https://<gazda site-ului>/api/revalidate**, antetul **x-revalidate-secret** cu valoarea lui **REVALIDATE_SECRET**, la evenimentele de publicare, actualizare, depublicare și ștergere a intrărilor și de creare, actualizare și ștergere a fișierelor media.",
        },
      ],
    },
    { t: "h2", text: "Variabile obligatorii" },
    { t: "p", text: "Fără oricare dintre ele, backend-ul nu pornește sau panoul nu poate fi folosit." },
    {
      t: "list",
      items: [
        "**Secrete**: **APP_KEYS**, **API_TOKEN_SALT**, **ADMIN_JWT_SECRET**, **TRANSFER_TOKEN_SALT**, **JWT_SECRET**, **ENCRYPTION_KEY** (cheile Strapi pentru sesiuni, tokenuri și secretele salvate), **AUTH_SECRET_KEY** și **AUTH_CODE_KEY** (2FA din panou; în producție aplicația nu pornește fără ele), **DOCUMENT_TOKEN_SECRET** (linkurile de descărcare a PDF-urilor de înscriere; fără el formularul refuză înscrierile).",
        "**DATABASE_CLIENT**: **postgres**. Obligatoriu: fără el serverul refuză să pornească.",
        "**DATABASE_HOST**: **postgres**, numele serviciului din compose.",
        "**DATABASE_NAME**, **DATABASE_USERNAME**, **DATABASE_PASSWORD**: baza, utilizatorul și parola; compose le folosește și la crearea containerului postgres. Se fixează în volumul **pgdata** la prima pornire; o schimbare ulterioară cere ștergerea volumului sau **ALTER USER**.",
        "**ADMIN_HOST**: gazda panoului, fără protocol (de exemplu admin.exemplu.ro). O valoare greșită face ca fiecare autentificare să primească 403.",
        "**FRONTEND_ORIGIN**: originea site-ului, cu protocol (de exemplu https://exemplu.ro); mai multe origini se separă prin virgulă, prima este baza linkurilor din e-mail. Fără ea, formularele de pe site sunt refuzate (CORS).",
        "**HAS_ROLE_ENFORCED**: **true**, impune zonele rolurilor de administrator. Nesetată în producție, zonele doar se înregistrează în jurnal, nu se impun.",
      ],
    },
    { t: "h2", text: "Variabile recomandate" },
    {
      t: "list",
      items: [
        "**REVALIDATE_SECRET**: secret comun cu site-ul; backend-ul anunță site-ul după modificarea meniului, iar webhook-ul îl trimite la fiecare publicare. Fără el, paginile se reîmprospătează după expirarea cache-ului (30 de minute).",
        "**CMS_PUBLIC_URL**: adresa publică a panoului, cu protocol, fără bară la final; imaginea din antetul e-mailurilor și linkurile din Google Sheets. Fără ea, antetul e-mailului este text.",
        "**STRAPI_PREVIEW_SECRET** și **STRAPI_PREVIEW_FRONTEND_URL**: butonul de previzualizare a articolelor; secretul este comun cu site-ul, adresa este originea site-ului. Fără ele, butonul duce la localhost și site-ul răspunde 500; dacă nu vrei previzualizare, setează **STRAPI_PREVIEW_ENABLED=false**.",
      ],
    },
    { t: "p", text: "Variabilele pentru portaluri, e-mail, erori, statistici și Google sunt pe paginile lor și se pot adăuga oricând; după orice schimbare în **.env.production**, pornește din nou backend-ul cu **up -d backend**." },
    { t: "h2", text: "Volume și proprietar" },
    {
      t: "p",
      text: "Imaginile stau în volumul **edusport_backend_uploads** (montat la /opt/app/public/uploads), PDF-urile de înscriere în **edusport_backend_private_documents** (montat la /opt/app/private), baza în **edusport_backend_pgdata**. Volumele create prin compose primesc proprietarul **100:101** (utilizatorul strapi). Containerul nu poate schimba proprietarul: un volum deținut de root face ca fiecare încărcare să eșueze cu EACCES. Creează volumele mereu prin compose și, după orice copiere făcută ca root, redă proprietarul cu **chown -R 100:101**.",
    },
    { t: "p", text: "Comenzi de recuperare, din directorul backend-ului: **npm run admin:reset-2fa**, **npm run admin:end-sessions**." },
    { t: "links", items: [{ slug: "roluri" }, { slug: "adauga-un-administrator" }, { slug: "instaleaza-site-ul" }] },
  ],
};
