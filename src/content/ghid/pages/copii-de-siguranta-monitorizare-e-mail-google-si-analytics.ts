import type { GhidPage } from "@/lib/ghid/types";

export const copiiMonitorizareEmailPage: GhidPage = {
  slug: "copii-de-siguranta-monitorizare-e-mail-google-si-analytics",
  title: "Copii de siguranță, monitorizare, e-mail, Google și analytics",
  lead: "Serviciile din jurul aplicației, de configurat pe serverul nou.",
  blocks: [
    { t: "h2", text: "Copii de siguranță" },
    { t: "p", text: "Scriptul **scripts/backup.sh** scrie trei fișiere pe zi în **backups/** și păstrează ultimele 14 din fiecare fel. Pe serverul actual, programul este în **/etc/cron.d/service-backups**:" },
    { t: "code", text: "0 3 * * * root /opt/edusport/edusport_backend/scripts/backup.sh >> /var/log/backup-edusport.log 2>&1" },
    { t: "p", text: "Serverul actual curăță și memoria cache de build Docker, din **/etc/cron.d/docker-prune**:" },
    { t: "code", text: "30 4 * * * root docker builder prune -af --max-used-space 5GB" },
    {
      t: "warn",
      text: "Pe serverul actual nu există copie în afara serverului: nu există rclone și nici cron către alt server, iar copiile stau pe același disc. Verificarea de sănătate nu urmărește fișierele documents-*. Adaugă o copie în afara serverului pe cel nou.",
    },
    { t: "h2", text: "Monitorizarea serverului" },
    { t: "p", text: "Hub-ul Beszel și raportul zilnic de la 08:00 rulează pe ops-1. Un server nou are nevoie de:" },
    {
      t: "list",
      items: [
        "agentul Beszel (**/opt/server-monitor/docker-compose.yml**, cheile în **.env**);",
        "**common/health-check.py**, **common/ops-gateway.sh**, **common/vhost-log.conf** și **/etc/health-check.json** (listează fișierele de copie pentru fiecare serviciu);",
        "cheia SSH a lui ops-1, autorizată cu o comandă restrânsă prin **ops-gateway.sh**;",
        "o intrare în **ops-1/servers.json**, apoi **daily-report.py --dry-run**;",
        "fail2ban (**zz-sshd.local**; **ignoreip** conține adresele web-1 și ops-1, actualizează-le) și **admin-watchdog.timer**.",
      ],
    },
    { t: "p", text: "Lista completă este în README-ul depozitului server-ops, la \"Adding a server (web-N)\"." },
    { t: "h2", text: "Urmărirea erorilor (GlitchTip)" },
    {
      t: "p",
      text: "GlitchTip rulează pe web-1 (**glitchtip.codrin.space**). Fie continuă să trimiți către el, fără nicio schimbare, fie reinstalează-l și recreează proiectele și DSN-urile. Un proiect pentru frontend (site și ambele portaluri) și unul pentru backend. DSN-urile merg în **NEXT_PUBLIC_SENTRY_DSN** (argument de build) și **SENTRY_DSN** din frontend, și în **SENTRY_DSN** din backend.",
    },
    { t: "h2", text: "Analytics (Umami)" },
    {
      t: "p",
      text: "Umami rulează pe web-1 (**analytics.codrin.space**). Trei site-uri Umami (site, sportiv, antrenor) dau cele trei argumente de build NEXT_PUBLIC_UMAMI_WEBSITE_ID, cu sufixele SPORTIV și ANTRENOR; cardul din panou folosește variabilele cu prefixul UMAMI_. Un administrator Umami global nu vede niciun site dacă nu este membru al echipei proprietare.",
    },
    { t: "h2", text: "E-mail (Brevo)" },
    {
      t: "steps",
      steps: [
        { text: "Păstrează **BREVO_API_KEY** doar în fișierul de variabile de pe server." },
        { text: "Adresa **EMAIL_FROM_ADDRESS** trebuie să fie verificată în Brevo, pe un domeniu cu SPF și DKIM Brevo." },
        { text: "Brevo are \"Authorized IPs\" pornit: adaugă adresa publică a serverului nou, altfel trimiterea eșuează." },
      ],
    },
    { t: "p", text: "Fără cheie, mesajele așteaptă în tabelul **email-job** și se trimit mai târziu. Serverul actual rulează și un Postfix doar pentru trimitere, cu OpenDKIM (în niciun depozit): copiază configurația de pe serverul vechi dacă mai este necesar." },
    { t: "h2", text: "Google" },
    {
      t: "list",
      items: [
        "Contul de serviciu (variabilele GOOGLE_SA_) pentru sincronizarea Sheets rămâne neschimbat.",
        "Autentificarea Google în portal: la nume de gazdă noi, setează din nou adresele de revenire autorizate ale clientului OAuth din Google Cloud. La aceleași nume nu e nimic de făcut.",
      ],
    },
    {
      t: "code",
      text: `https://<PORTAL_HOST_ANTRENOR>/api/portal/google/callback
https://<PORTAL_HOST_SPORTIV>/api/portal/google/callback`,
    },
    { t: "p", text: "Adresa pentru antrenor este documentată în **.env.example** din frontend. Cea pentru sportiv nu este descrisă într-un document: verifică-o la prima autentificare. Autentificarea în portal este doar cu parolă și Google." },
    { t: "links", items: [{ slug: "verificarea-finala" }] },
  ],
};
