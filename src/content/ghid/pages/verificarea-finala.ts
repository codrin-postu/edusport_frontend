import type { GhidPage } from "@/lib/ghid/types";

export const verificareaFinalaPage: GhidPage = {
  slug: "verificarea-finala",
  title: "Verificarea finală",
  lead: "Lista de verificare după instalare sau mutare.",
  blocks: [
    { t: "h2", text: "Containere și rețea" },
    {
      t: "list",
      items: [
        "**docker compose ps** arată postgres, backend și frontend sănătoase.",
        "**docker network inspect edusport_net** listează cele trei containere.",
      ],
    },
    { t: "h2", text: "Adrese" },
    {
      t: "list",
      items: [
        "**https://<site>** răspunde 200.",
        "**https://<gazda panoului>/admin** se încarcă.",
        "**https://<gazda panoului>/_health** răspunde 204.",
        "**https://<site>/api/health** returnează **{\"ok\":true,\"commit\":...}**.",
      ],
    },
    { t: "h2", text: "Funcții" },
    {
      t: "list",
      items: [
        "Încarcă o imagine în panou: fără EACCES, iar ambele volume arată 100:101.",
        "Publică o pagină în panou și vezi-o schimbată pe site în câteva secunde (webhook-ul și REVALIDATE_SECRET coincid).",
        "Formularul de înscriere, de la un capăt la altul: rând în panou, linkul către PDF funcționează, e-mailul este în coadă sau trimis (Brevo, adresă autorizată), rând în Sheets dacă sincronizarea este pornită.",
        "Portalurile: **https://antrenor.<domeniu>/login** și **https://sportiv.<domeniu>/login**, autentificare cu parolă, autentificare Google, un link de invitație **/invite/<secret>** se deschide.",
        "Autentificarea în panou, la **/login**: avertismentul ADMIN_GATE a dispărut din jurnalul de pornire, iar rolurile sunt impuse.",
        "Autentificarea în **/ghid** cu GHID_PASSWORD funcționează doar pe gazda site-ului.",
      ],
    },
    { t: "h2", text: "Certificate, copii, monitorizare" },
    {
      t: "list",
      items: [
        "**certbot renew --dry-run** trece, iar **systemctl list-timers | grep certbot** arată temporizatorul.",
        "**./scripts/backup.sh** scrie trei fișiere, intrarea cron există și copia în afara serverului ajunge.",
        "GlitchTip primește un eveniment de test de la site și de la backend; Umami înregistrează o vizualizare pentru fiecare dintre cele trei site-uri.",
        "Serverul nou apare în Beszel, iar raportul zilnic îl include.",
      ],
    },
    { t: "p", text: "Porturi așteptate după instalare (**ss -ltnp**): 22, 80 și 443 publice; 3000 și 1337 doar pe 127.0.0.1; 5432 nepublicat." },
    { t: "links", items: [{ slug: "hosting" }] },
  ],
};
