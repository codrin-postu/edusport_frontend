import type { GhidPage } from "@/lib/ghid/types";

export const mutaDateleDePeServerulVechiPage: GhidPage = {
  slug: "muta-datele-de-pe-serverul-vechi",
  title: "Mută datele de pe serverul vechi",
  lead: "Baza de date, imaginile și documentele se copiază de pe serverul vechi pe cel nou.",
  blocks: [
    { t: "p", text: "Oprește editările din panou pe durata mutării. Versiunea majoră de Postgres trebuie să fie aceeași: restaurează 16.x în 16.x." },
    {
      t: "warn",
      text: "Scriptul **restore.sh** nu schimbă proprietarul volumelor în 100:101 și antetul lui acoperă doar imaginile, nu și documentele. Ambele se fac manual, la copierea imaginilor și documentelor, mai jos. Nu există nicio copie în afara serverului: copiile stau pe același disc.",
    },
    { t: "h2", text: "Pe serverul vechi" },
    {
      t: "steps",
      steps: [
        { text: "Rulează scriptul de copie de siguranță și notează cele mai recente fișiere." },
        { text: "Copiază pe serverul nou cele trei fișiere (**strapi-DATA.sql.gz**, **uploads-DATA.tar.gz**, **documents-DATA.tar.gz**) și vechiul **.env.production**, prin rsync sau scp, peste SSH. Exclude fișierele **.env.production.bak** (cu orice sufix) și **.env.production.pre-release**, care aparțin lui root." },
      ],
    },
    {
      t: "code",
      text: `cd /opt/edusport/edusport_backend
./scripts/backup.sh
ls -1t backups | head -3`,
    },
    { t: "p", text: "Fișierele **.dump** din **/opt/edusport/backups/** sunt în format custom **pg_dump -Fc** și se restaurează cu **pg_restore**, nu cu psql." },
    { t: "h2", text: "Pe serverul nou" },
    {
      t: "steps",
      steps: [
        { text: "Pune **.env.production** la locul lui și cele trei fișiere în **backups/**." },
        { text: "Creează volumele și pornește doar postgres." },
      ],
    },
    {
      t: "code",
      text: `cd /opt/edusport/edusport_backend
docker compose -f docker-compose.production.yml --env-file .env.production up --no-start backend
docker compose -f docker-compose.production.yml --env-file .env.production up -d postgres`,
    },
    {
      t: "steps",
      steps: [
        { text: "Restaurează baza de date. **restore.sh** cere să scrii **yes**, oprește backend-ul, șterge și recreează baza, trimite dump-ul în psql și pornește backend-ul. Apelează docker compose fără **--env-file**, deci exportă întâi fișierul în shell. Apoi oprește backend-ul." },
      ],
    },
    {
      t: "code",
      text: `set -a; . ./.env.production; set +a
./scripts/restore.sh backups/strapi-DATA.sql.gz
docker compose -f docker-compose.production.yml --env-file .env.production stop backend`,
    },
    { t: "p", text: "Imagini și documente: copiază imaginile și documentele în volume, cu backend-ul oprit, și redă proprietarul 100:101." },
    {
      t: "code",
      text: `docker run --rm -v edusport_backend_uploads:/uploads -v "$PWD/backups":/b alpine \\
  sh -c "cd /uploads && tar -xzf /b/uploads-DATA.tar.gz --strip-components=1 && chown -R 100:101 /uploads"

docker run --rm -v edusport_backend_private_documents:/p -v "$PWD/backups":/b alpine \\
  sh -c "cd /p && tar -xzf /b/documents-DATA.tar.gz --strip-components=1 && chown -R 100:101 /p"`,
    },
    { t: "p", text: "După extragerea documentelor, rădăcina volumului trebuie să conțină directorul **documents/**. Verifică proprietarul:" },
    {
      t: "code",
      text: `docker run --rm -v edusport_backend_uploads:/u alpine stat -c %u:%g /u
docker run --rm -v edusport_backend_private_documents:/p alpine stat -c %u:%g /p`,
    },
    { t: "p", text: "Ambele comenzi trebuie să afișeze **100:101**. Altfel, încărcările răspund 500 cu EACCES." },
    { t: "p", text: "Pornire: pornește backend-ul, repornește-l încă o dată și verifică sănătatea." },
    {
      t: "code",
      text: `docker compose -f docker-compose.production.yml --env-file .env.production up -d backend
docker compose -f docker-compose.production.yml --env-file .env.production restart backend
docker exec edusport_backend wget -S -qO- http://127.0.0.1:1337/_health 2>&1 | head -3`,
    },
    {
      t: "p",
      text: "Alternative care nu se folosesc la mutarea pe alt server: **strapi export** și **strapi import** mută doar conținutul. **scripts/mirror-to-production.sh** înlocuiește conținutul din producție cu o bază locală și este distructiv.",
    },
    { t: "links", items: [{ slug: "copii-de-siguranta-monitorizare-e-mail-google-si-analytics" }] },
  ],
};
