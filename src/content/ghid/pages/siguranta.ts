import type { GhidPage } from "@/lib/ghid/types";

export const sigurantaPage: GhidPage = {
  slug: "siguranta",
  title: "Siguranță",
  lead: "Cum sunt protejate conturile și datele clubului.",
  blocks: [
    { t: "h2", text: "Conturi" },
    {
      t: "list",
      items: [
        "Panoul are trei roluri. Rolul stabilește ce pagini poate folosi fiecare administrator, iar serverul impune aceste limite. Detalii în pagina Roluri.",
        "Se intră cu e-mail și parolă, cu Google sau cu un passkey. 2FA se pornește cu aplicație de autentificare sau cod pe e-mail, cu coduri de rezervă.",
        "După 5 parole greșite, intrarea se blochează 15 minute.",
        "O intrare de pe un dispozitiv nou trimite un e-mail către cont.",
        "Intrarea în portaluri se face cu e-mail și parolă sau cu Google, deocamdată fără 2FA.",
      ],
    },
    { t: "h2", text: "Date" },
    {
      t: "list",
      items: [
        "Fiecare schimbare la un sportiv, o înscriere, o prezență, un abonament sau o plată intră în **Istoric**, cu data, ora și contul care a făcut-o.",
        "Datele unui sportiv se pot descărca din meniul fișei, la **Exportă datele**: un ZIP cu un rezumat PDF și PDF-urile înscrierilor.",
        "**Anonimizează** șterge datele personale, PDF-urile și profilul public. Rămân grupele pe sezoane, statusul A.C.S. și numărul de înscrieri. O poate face doar Super Admin și nu se poate anula.",
        "Panoul semnalează sportivii inactivi de peste un număr de ani, cu link la listă.",
      ],
    },
    { t: "h2", text: "Siguranța plăților" },
    {
      t: "list",
      items: [
        "O plată nu se șterge: anularea o marchează, iar rândul rămâne în listă.",
        "Fiecare plată arată cine a înregistrat-o, în coloana **Înregistrat de**.",
        "Fiecare plată nouă primește un **Nr. chitanță**, format din an și număr, de exemplu 2026-0001.",
        "Istoricul sportivului păstrează **Plată înregistrată** și **Plată anulată**, cu cine și când.",
        "Aceeași plată trimisă de două ori în 10 secunde de același cont se înregistrează o singură dată.",
        "**Contabilitate** este disponibilă rolului Administrator club. Editor site nu are acces la ea.",
      ],
    },
    { t: "h2", text: "Server" },
    {
      t: "list",
      items: [
        "Adresele clubului folosesc HTTPS, iar certificatele se reînnoiesc automat.",
        "În fiecare noapte se face o copie a bazei de date, a imaginilor încărcate și a PDF-urilor de înscriere. Se păstrează ultimele 14 copii, pe același server.",
        "Erorile site-ului și ale panoului se colectează automat în GlitchTip.",
        "Starea serverului este urmărită automat.",
      ],
    },
    { t: "links", items: [{ slug: "roluri" }, { slug: "anonimizeaza-un-sportiv" }, { slug: "contul-tau-parola-si-2fa" }, { slug: "inregistreaza-o-plata" }] },
  ],
};
