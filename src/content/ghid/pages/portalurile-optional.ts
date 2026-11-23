import type { GhidPage } from "@/lib/ghid/types";

export const portalurileOptionalPage: GhidPage = {
  slug: "portalurile-optional",
  title: "Portalurile (opțional)",
  lead: "Ce sunt portalurile, cum se pornesc la nevoie și cum se opresc.",
  blocks: [
    {
      t: "p",
      text: "Portalul antrenorilor (**antrenor.**) este locul unde antrenorii completează prezența și văd grupele lor. Portalul sportivilor și părinților (**sportiv.**) arată părinților programul, prezența și plățile copilului. Amândouă rulează în același container cu site-ul, pe nume de gazdă proprii.",
    },
    {
      t: "p",
      text: "Portalurile sunt oprite după instalarea de bază. Backend-ul le pornește numai dacă **PORTAL_HOSTS** listează portalurile; gol sau lipsă înseamnă oprit: adresele de portal răspund 404, sarcinile programate ale portalurilor nu rulează, iar invitațiile din panou sunt refuzate cu un mesaj. Frontend-ul le pornește numai pentru gazdele din **PORTAL_HOST_ANTRENOR** și **PORTAL_HOST_SPORTIV**.",
    },
    { t: "p", text: "Invitațiile ajung la antrenori și părinți prin e-mail, deci configurează întâi Brevo (pagina **Servicii opționale**). Autentificarea în portal este cu parolă sau cu Google; nu există 2FA sau chei de acces în portaluri." },
    {
      t: "steps",
      steps: [
        {
          text: "Creează două înregistrări **A** către server: **antrenor.<domeniu>** și **sportiv.<domeniu>**. Așteaptă până se rezolvă.",
          code: `dig +short antrenor.<domeniu>
dig +short sportiv.<domeniu>`,
        },
        {
          text: "Adaugă un singur bloc nginx pentru amândouă, în **/etc/nginx/sites-available/edusport-portaluri**, identic cu blocul site-ului de pe pagina **nginx și HTTPS**, dar cu ambele nume. Activează-l și emite certificatul.",
          code: `server_name antrenor.<domeniu> sportiv.<domeniu>;

sudo ln -s /etc/nginx/sites-available/edusport-portaluri /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d antrenor.<domeniu> -d sportiv.<domeniu>`,
        },
        {
          text: "Generează secretul comun al portalurilor și completează în **.env.production** al backend-ului variabilele din lista **Backend** de mai jos. Pornește din nou backend-ul.",
          code: `openssl rand -base64 48
cd /opt/edusport/edusport_backend
docker compose -f docker-compose.production.yml --env-file .env.production up -d backend`,
        },
        {
          text: "Completează în **.env.production** al frontend-ului variabilele din lista **Frontend** de mai jos, cu același secret. Pornește din nou frontend-ul; aceste variabile se citesc la pornire, nu cer reconstruire.",
          code: `cd /opt/edusport/edusport_frontend
docker compose -f docker-compose.production.yml --env-file .env.production up -d frontend`,
        },
        {
          text: "Autentificare cu Google (opțional): în Google Cloud, creează un client OAuth de tip aplicație web și adaugă la adresele de revenire autorizate cele două adrese de mai jos. Pune ID-ul și secretul clientului în **PORTAL_GOOGLE_CLIENT_ID** și **PORTAL_GOOGLE_CLIENT_SECRET** din backend și pornește-l din nou. Fără ele, butonul Google nu apare, iar autentificarea cu parolă funcționează.",
          code: `https://antrenor.<domeniu>/api/portal/google/callback
https://sportiv.<domeniu>/api/portal/google/callback`,
        },
        {
          text: "Verifică: **https://antrenor.<domeniu>/login** și **https://sportiv.<domeniu>/login** se deschid. Din panou, dă acces unui antrenor (pagina **Acces antrenor în portal**); linkul de invitație din e-mail trebuie să ducă la gazda portalului și să se deschidă.",
        },
      ],
    },
    { t: "h2", text: "Variabile, backend" },
    {
      t: "list",
      items: [
        "**PORTAL_HOSTS**: **antrenor,sportiv**, sau doar una dintre ele. Este singurul comutator: gol înseamnă portaluri oprite.",
        "**PORTAL_ANTRENOR_URL** și **PORTAL_SPORTIV_URL**: originile portalurilor, cu protocol (de exemplu https://antrenor.exemplu.ro). Linkurile din e-mailurile de invitație și de acces se construiesc din ele; fără ele, invitația eșuează cu un mesaj.",
        "**PORTAL_BFF_SECRET**: secretul comun cu frontend-ul, cel puțin 32 de caractere. Fără el, fiecare cerere de portal primește 403.",
        "**PORTAL_GOOGLE_CLIENT_ID** și **PORTAL_GOOGLE_CLIENT_SECRET**: opționale, autentificarea cu Google.",
      ],
    },
    { t: "h2", text: "Variabile, frontend" },
    {
      t: "list",
      items: [
        "**PORTAL_HOST_ANTRENOR** și **PORTAL_HOST_SPORTIV**: numele de gazdă, fără protocol și fără port, aceleași cu cele din backend. Ele trimit o gazdă la paginile portalului și construiesc adresa de revenire Google.",
        "**PORTAL_BFF_SECRET**: aceeași valoare ca în backend.",
        "**NEXT_PUBLIC_UMAMI_WEBSITE_ID_ANTRENOR** și **NEXT_PUBLIC_UMAMI_WEBSITE_ID_SPORTIV**: opționale, câte un site Umami pentru fiecare portal (pagina **Servicii opționale**); cer reconstruire.",
      ],
    },
    { t: "warn", text: "Adresa de revenire Google pentru portalul sportivilor este construită de cod, dar nu este descrisă în documentația backend-ului. Verific-o la prima autentificare cu Google din acel portal." },
    { t: "h2", text: "Cum le oprești" },
    {
      t: "list",
      items: [
        "Backend: golește sau comentează **PORTAL_HOSTS**, apoi **up -d backend**. Adresele de portal răspund 404, sarcinile programate ale portalurilor se opresc, invitațiile sunt refuzate cu mesajul **Portalurile nu sunt activate pe acest server (PORTAL_HOSTS)**, iar e-mailurile de invitație aflate în coadă rămân acolo.",
        "Frontend: comentează **PORTAL_HOST_ANTRENOR** și **PORTAL_HOST_SPORTIV**, apoi **up -d frontend**. Gazdele portalurilor sunt tratate ca site-ul public.",
        "Blocul nginx, certificatul și înregistrările DNS pot rămâne sau pot fi șterse; nu afectează site-ul și panoul.",
      ],
    },
    { t: "links", items: [{ slug: "acces-antrenor-in-portal" }, { slug: "invita-un-parinte-in-portal" }, { slug: "servicii-optionale" }] },
  ],
};
