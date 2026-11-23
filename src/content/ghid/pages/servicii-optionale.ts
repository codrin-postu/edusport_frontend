import type { GhidPage } from "@/lib/ghid/types";

export const serviciiOptionalePage: GhidPage = {
  slug: "servicii-optionale",
  title: "Servicii opționale",
  lead: "E-mail, erori, statistici, Google Sheets, rezultate și previzualizare: ce adaugă fiecare, variabilele și ce se întâmplă fără el.",
  blocks: [
    {
      t: "p",
      text: "Fiecare serviciu se poate adăuga oricând și se poate lăsa deoparte fără să afecteze site-ul sau panoul. Variabilele din backend se citesc la pornire: după o schimbare, **up -d backend**. În frontend, variabilele **NEXT_PUBLIC_** cer **./scripts/deploy.sh** (reconstruire), celelalte doar **up -d frontend**.",
    },
    { t: "h2", text: "E-mail (Brevo)" },
    { t: "p", text: "Trimite confirmările de înscriere, invitațiile în portal și celelalte e-mailuri automate (pagina **E-mailuri automate**)." },
    {
      t: "steps",
      steps: [
        { text: "Creează contul Brevo și verifică domeniul de expediere: Brevo cere înregistrările SPF, DKIM și DMARC la registrar." },
        { text: "Creează o cheie API (SMTP & API, API keys) și adaugă adresa IP publică a serverului la Authorized IPs, dacă opțiunea este pornită. Fără adresa autorizată, trimiterea eșuează." },
        { text: "Completează variabilele de mai jos în backend și pornește-l din nou." },
        { text: "Verifică: trimite o înscriere de test de pe site și caută e-mailul în panou, la coadă și în căsuța destinatarului." },
      ],
    },
    {
      t: "list",
      items: [
        "**BREVO_API_KEY**: cheia API. Doar pe server, niciodată în git.",
        "**EMAIL_FROM_ADDRESS**: adresa expeditorului, verificată în Brevo.",
        "**EMAIL_LIVE**: **true** pentru a trimite destinatarilor reali. Altfel, totul merge la **EMAIL_TEST_RECIPIENT** (util pe un server de test).",
        "**EMAIL_FROM_NAME** și **EMAIL_REPLY_TO**: opționale, numele expeditorului și adresa de răspuns.",
      ],
    },
    { t: "p", text: "Fără Brevo: înscrierile funcționează, iar mesajele așteaptă în coadă (tabelul **email-job**) și se trimit după ce cheia apare. Nimic nu se pierde." },
    { t: "h2", text: "Erori (GlitchTip)" },
    { t: "p", text: "Strânge erorile din site și din panou într-un singur loc, cu alerte. GlitchTip acceptă aceleași adrese DSN ca Sentry. Se poate folosi instalarea existentă (**glitchtip.codrin.space**) sau una proprie, după documentația GlitchTip. Creează două proiecte: unul pentru site (și portaluri), unul pentru backend." },
    {
      t: "list",
      items: [
        "**NEXT_PUBLIC_SENTRY_DSN** (frontend): DSN-ul proiectului de site; cere reconstruire. Opțional **NEXT_PUBLIC_SENTRY_ENVIRONMENT**.",
        "**SENTRY_DSN** (backend): DSN-ul proiectului de backend. Opționale **SENTRY_ENVIRONMENT** și **SENTRY_TRACES_SAMPLE_RATE** (implicit 0.1).",
        "**GLITCHTIP_API_URL**, **GLITCHTIP_API_TOKEN**, **GLITCHTIP_ORG**, **GLITCHTIP_PROJECT** (backend): cardul **Sănătate site** din panou; proiectul este cel al site-ului. Opțional **GLITCHTIP_PUBLIC_URL**, pentru linkurile din card.",
      ],
    },
    { t: "p", text: "Fără GlitchTip: nimic nu se raportează, iar cardul din panou arată neconfigurat." },
    { t: "h2", text: "Statistici (Umami)" },
    { t: "p", text: "Numără vizitele pe site fără cookie-uri. Se poate folosi instalarea existentă (**analytics.codrin.space**) sau una proprie. Creează un site Umami pentru site-ul public și, dacă ai portaluri, câte unul pentru fiecare portal. Un administrator Umami vede un site doar dacă face parte din echipa care îl deține." },
    {
      t: "list",
      items: [
        "**NEXT_PUBLIC_UMAMI_URL** și **NEXT_PUBLIC_UMAMI_WEBSITE_ID** (frontend): adresa scriptului Umami și ID-ul site-ului. Statisticile pornesc numai cu amândouă; cer reconstruire.",
        "**UMAMI_API_URL**, **UMAMI_WEBSITE_ID**, **UMAMI_USERNAME**, **UMAMI_PASSWORD** (backend): cardul de trafic din panou și statisticile anunțurilor; toate patru sunt necesare. Opțional **UMAMI_PUBLIC_URL**, pentru linkul către Umami.",
      ],
    },
    { t: "p", text: "Fără Umami: site-ul nu încarcă niciun script, iar cardul din panou arată neconfigurat." },
    { t: "h2", text: "Google Sheets" },
    { t: "p", text: "Copiază înscrierile și celelalte formulare într-un tabel Google, pe măsură ce sosesc. Nu are legătură cu autentificarea Google din portaluri." },
    {
      t: "steps",
      steps: [
        { text: "În Google Cloud, activează **Google Sheets API** și **Google Drive API**, creează un cont de serviciu și descarcă-i cheia JSON." },
        { text: "Pune adresa contului în **GOOGLE_SA_EMAIL** și cheia privată din JSON în **GOOGLE_SA_PRIVATE_KEY**, apoi pornește din nou backend-ul." },
        { text: "În panou, la pagina **Google Sheets**, creează sau leagă tabelul fiecărui formular. Un tabel existent trebuie partajat cu adresa contului de serviciu." },
      ],
    },
    { t: "p", text: "Opțional, **SHEETS_SHARE_WITH**: adresa cu care se partajează tabelele nou create. Fără Google Sheets: sincronizarea este oprită, iar pagina din panou arată neconectat." },
    { t: "h2", text: "Rezultate de la competiții" },
    { t: "p", text: "Profilul public al sportivului arată rezultatele de la competiții din serviciul skate-results al clubului, pentru sportivii care au un identificator de rezultate completat (pagina **Profil public și rezultate**). **SKATE_RESULTS_API**, în frontend și în backend, are implicit adresa serviciului clubului; o instalare care nu o vrea nu completează identificatori. Fără serviciu, secțiunea nu apare." },
    { t: "h2", text: "Previzualizarea articolelor" },
    { t: "p", text: "Butonul de previzualizare din panou deschide un articol nepublicat pe site. Cere **STRAPI_PREVIEW_SECRET** cu aceeași valoare în backend și în frontend și **STRAPI_PREVIEW_FRONTEND_URL** în backend (originea site-ului). Fără ele, setează **STRAPI_PREVIEW_ENABLED=false** în backend, ca butonul să dispară." },
    { t: "h2", text: "Autentificarea Google în portaluri" },
    { t: "p", text: "Este descrisă pe pagina portalurilor." },
    {
      t: "links",
      items: [
        { slug: "portalurile-optional" },
        { slug: "e-mailuri-automate" },
        { slug: "profil-public-si-rezultate" },
        { href: "https://developers.brevo.com/docs/getting-started", label: "Brevo: primii pași cu API-ul" },
        { href: "https://glitchtip.com/documentation", label: "GlitchTip: documentație" },
        { href: "https://umami.is/docs", label: "Umami: documentație" },
        { href: "https://cloud.google.com/iam/docs/service-accounts-create", label: "Google Cloud: conturi de serviciu" },
      ],
    },
  ],
};
