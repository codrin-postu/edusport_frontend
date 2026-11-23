import type { GhidPage } from "@/lib/ghid/types";

export const mutaDateleDePeServerulVechiPage: GhidPage = {
  slug: "muta-datele-de-pe-serverul-vechi",
  title: "Mută datele de pe serverul vechi",
  lead: "Doar la mutarea unei instalări existente: baza de date, imaginile, documentele și secretele.",
  blocks: [
    { t: "p", text: "Sari peste această pagină la o instalare nouă. La mutare, instalează întâi serverul nou după paginile anterioare, dar oprește-te înainte de pasul **Rulează scriptul de deploy** al panoului: baza se restaurează înainte de prima pornire a backend-ului." },
    {
      t: "warn",
      text: "Păstrează nemodificate, din fișierul vechi de variabile: APP_KEYS, API_TOKEN_SALT, ADMIN_JWT_SECRET, TRANSFER_TOKEN_SALT, JWT_SECRET, ENCRYPTION_KEY, AUTH_SECRET_KEY, AUTH_CODE_KEY, DOCUMENT_TOKEN_SECRET, PORTAL_BFF_SECRET. Valori noi strică secretele 2FA salvate și invalidează tokenul site-ului. Copiază fișierul pe un canal securizat și nu lipi secrete în documente sau mesaje.",
    },
    { t: "p", text: "Oprește editările din panou pe durata mutării. Versiunea majoră de PostgreSQL trebuie să fie aceeași pe ambele servere (16)." },
    {
      t: "steps",
      steps: [
        {
          text: "Pe serverul vechi, rulează scriptul de copie de siguranță și notează cele mai recente trei fișiere.",
          code: `cd /opt/edusport/edusport_backend
./scripts/backup.sh
ls -1t backups | head -3`,
        },
        {
          text: "Copiază pe serverul nou, prin rsync sau scp peste SSH, cele trei fișiere (**strapi-DATA.sql.gz**, **uploads-DATA.tar.gz**, **documents-DATA.tar.gz**) și vechiul **.env.production** al backend-ului. Nu copia fișierele **.env.production.bak** (cu orice sufix) sau **.env.production.pre-release**, care aparțin lui root.",
          code: `rsync -av --chmod=600 <server-vechi>:/opt/edusport/edusport_backend/.env.production /opt/edusport/edusport_backend/.env.production
rsync -av <server-vechi>:/opt/edusport/edusport_backend/backups/ /opt/edusport/edusport_backend/backups/`,
        },
        {
          text: "Adaptează fișierul copiat la serverul nou: **ADMIN_HOST**, **FRONTEND_ORIGIN**, **CMS_PUBLIC_URL** și, dacă portalurile rămân pornite, **PORTAL_HOSTS**, **PORTAL_ANTRENOR_URL** și **PORTAL_SPORTIV_URL** (nume noi, le cere versiunea curentă). Scoate **POSTGRES_PASSWORD**, dacă există: nu este citit. Verifică **DATABASE_CLIENT=postgres**.",
        },
        {
          text: "Creează volumele și pornește doar postgres.",
          code: `cd /opt/edusport/edusport_backend
docker compose -f docker-compose.production.yml --env-file .env.production build backend
docker compose -f docker-compose.production.yml --env-file .env.production up --no-start backend
docker compose -f docker-compose.production.yml --env-file .env.production up -d postgres`,
        },
        {
          text: "Restaurează baza de date. **restore.sh** cere să scrii **yes**, oprește backend-ul, șterge și recreează baza, trimite dump-ul în psql și pornește backend-ul. Apelează docker compose fără **--env-file**, deci exportă întâi fișierul în shell. Apoi oprește backend-ul la loc.",
          code: `set -a; . ./.env.production; set +a
./scripts/restore.sh backups/strapi-DATA.sql.gz
docker compose -f docker-compose.production.yml --env-file .env.production stop backend`,
        },
        {
          text: "Copiază imaginile și documentele în volume, cu backend-ul oprit, și redă proprietarul **100:101**. După extragerea documentelor, rădăcina volumului trebuie să conțină directorul **documents/**.",
          code: `docker run --rm -v edusport_backend_uploads:/uploads -v "$PWD/backups":/b alpine \\
  sh -c "cd /uploads && tar -xzf /b/uploads-DATA.tar.gz --strip-components=1 && chown -R 100:101 /uploads"

docker run --rm -v edusport_backend_private_documents:/p -v "$PWD/backups":/b alpine \\
  sh -c "cd /p && tar -xzf /b/documents-DATA.tar.gz --strip-components=1 && chown -R 100:101 /p"`,
        },
        {
          text: "Verifică proprietarul. Ambele comenzi trebuie să afișeze **100:101**; altfel, încărcările răspund 500 cu EACCES.",
          code: `docker run --rm -v edusport_backend_uploads:/u alpine stat -c %u:%g /u
docker run --rm -v edusport_backend_private_documents:/p alpine stat -c %u:%g /p`,
        },
        {
          text: "Pornește backend-ul, repornește-l încă o dată și verifică sănătatea. Răspunsul trebuie să fie **204**.",
          code: `docker compose -f docker-compose.production.yml --env-file .env.production up -d backend
docker compose -f docker-compose.production.yml --env-file .env.production restart backend
docker exec edusport_backend wget -S -qO- http://127.0.0.1:1337/_health 2>&1 | head -3`,
        },
        {
          text: "Continuă cu instalarea site-ului. Tokenul API și webhook-ul sunt deja în baza de date: copiază **STRAPI_API_TOKEN** și **REVALIDATE_SECRET** din vechiul **.env.production** al frontend-ului și schimbă adresa webhook-ului în panou dacă gazda site-ului s-a schimbat.",
        },
        {
          text: "La nume de gazdă noi: adaugă adresele de revenire noi în clientul OAuth Google (portaluri) și adresa IP nouă la Authorized IPs în Brevo. Apoi mută înregistrările DNS către serverul nou; scade TTL-ul cu o zi înainte.",
        },
        {
          text: "Dacă în panou s-a mai editat ceva după copiere, repetă copia, transferul și restaurarea pentru diferență, cu editările oprite.",
        },
      ],
    },
    { t: "p", text: "Fișierele **.dump** din **/opt/edusport/backups/** de pe serverul vechi sunt în format **pg_dump -Fc** și se restaurează cu **pg_restore**, nu cu psql." },
    {
      t: "p",
      text: "Alternative care nu se folosesc la mutarea pe alt server: **strapi export** și **strapi import** mută doar conținutul; **scripts/mirror-to-production.sh** înlocuiește conținutul din producție cu o bază locală și este distructiv.",
    },
    {
      t: "warn",
      text: "Pe serverul actual nu există o copie în afara serverului: copiile stau pe același disc. Serverul vechi mai păstrează, în afara depozitelor, politica de ieșire a containerelor și un Postfix doar pentru trimitere, cu OpenDKIM; copiază-le înainte de a-l scoate din uz, dacă mai sunt necesare.",
    },
    { t: "links", items: [{ slug: "instaleaza-panoul-de-administrare" }, { slug: "copii-de-siguranta-si-verificarea-finala" }] },
  ],
};
