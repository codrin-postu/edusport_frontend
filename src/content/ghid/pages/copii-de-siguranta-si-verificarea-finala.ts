import type { GhidPage } from "@/lib/ghid/types";

export const copiiSiVerificareaFinalaPage: GhidPage = {
  slug: "copii-de-siguranta-si-verificarea-finala",
  title: "Copii de siguranță și verificarea finală",
  lead: "Copia zilnică, curățenia Docker, monitorizarea și lista de verificare de la sfârșit.",
  blocks: [
    { t: "h2", text: "Copii de siguranță" },
    { t: "p", text: "Scriptul **scripts/backup.sh** din backend scrie trei fișiere pe zi în **backups/**: baza de date (**strapi-DATA.sql.gz**), imaginile (**uploads-DATA.tar.gz**) și PDF-urile de înscriere (**documents-DATA.tar.gz**), și păstrează ultimele 14 din fiecare fel." },
    {
      t: "steps",
      steps: [
        {
          text: "Rulează scriptul o dată, manual, și verifică fișierele.",
          code: `cd /opt/edusport/edusport_backend
./scripts/backup.sh
ls -l backups`,
        },
        {
          text: "Programează-l zilnic, la 03:00, într-un fișier cron de sistem.",
          code: "echo \"0 3 * * * root /opt/edusport/edusport_backend/scripts/backup.sh >> /var/log/backup-edusport.log 2>&1\" | sudo tee /etc/cron.d/edusport-backup",
        },
        {
          text: "Programează și curățenia memoriei cache de build Docker, altfel discul se umple de la reconstruiri.",
          code: "echo \"30 4 * * * root docker builder prune -af --max-used-space 5GB\" | sudo tee /etc/cron.d/docker-prune",
        },
        {
          text: "Copiază directorul **backups/** în afara serverului, zilnic, pe un al doilea server sau într-un spațiu de stocare, cu rsync sau rclone.",
        },
        {
          text: "Testează o restaurare, pe un server de probă, după pașii de pe pagina **Mută datele de pe serverul vechi**. O copie de siguranță netestată nu oferă nicio garanție.",
        },
      ],
    },
    {
      t: "warn",
      text: "Pe serverul actual nu există o copie în afara serverului: copiile stau pe același disc cu datele. Pe serverul nou, pasul cu copia în afara serverului nu este opțional.",
    },
    { t: "h2", text: "Monitorizare (opțional)" },
    { t: "p", text: "Serverele existente raportează către hub-ul Beszel de pe ops-1, cu un raport zilnic la 08:00 pe Telegram. Pentru un server nou, lista completă este în README-ul depozitului **server-ops**, la \"Adding a server (web-N)\": agentul Beszel, **health-check.json** (care verifică și vechimea copiilor), cheia SSH a lui ops-1 și intrarea din **servers.json**. La un server care îl înlocuiește pe web-1, actualizează adresele din **ignoreip** al fail2ban." },
    { t: "h2", text: "Verificarea finală" },
    { t: "p", text: "Containere și adrese:" },
    {
      t: "list",
      items: [
        "**docker compose ps** (în fiecare din cele două directoare) arată postgres, backend și frontend sănătoase; **docker network inspect edusport_net** listează toate containerele.",
        "**ss -ltnp** arată 22, 80 și 443 publice, 3000 și 1337 doar pe 127.0.0.1, iar 5432 nepublicat.",
        "**https://<gazda site-ului>** răspunde 200; **https://<gazda site-ului>/api/health** returnează **\"ok\":true** și hash-ul commit-ului.",
        "**https://<gazda panoului>/admin** se încarcă; **https://<gazda panoului>/_health** răspunde 204.",
        "**sudo certbot renew --dry-run** trece.",
      ],
    },
    { t: "p", text: "Panou și site:" },
    {
      t: "list",
      items: [
        "Autentificarea la **/login** funcționează; jurnalul backend-ului nu mai conține **ADMIN_GATE=off in production**; fiecare administrator are un rol EduSport.",
        "O imagine încărcată în panou apare fără eroare (fără EACCES).",
        "O pagină publicată în panou se schimbă pe site în câteva secunde.",
        "O înscriere de test de pe site: rândul apare în panou, linkul către PDF funcționează, e-mailul este trimis sau așteaptă în coadă, rândul apare în Google Sheets dacă sincronizarea este pornită.",
        "**/ghid** se deschide cu **GHID_PASSWORD**, doar pe gazda site-ului.",
      ],
    },
    { t: "p", text: "Dacă sunt pornite:" },
    {
      t: "list",
      items: [
        "Portalurile: **https://antrenor.<domeniu>/login** și **https://sportiv.<domeniu>/login** se deschid, autentificarea cu parolă și cu Google funcționează, un link de invitație se deschide.",
        "GlitchTip primește un eveniment de test de la site și de la backend; Umami înregistrează o vizită pentru fiecare site.",
        "Copia de siguranță zilnică apare în **backups/**, iar copia din afara serverului ajunge la destinație.",
      ],
    },
    { t: "links", items: [{ slug: "muta-datele-de-pe-serverul-vechi" }, { slug: "hosting" }] },
  ],
};
