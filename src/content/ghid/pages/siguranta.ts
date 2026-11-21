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
        "Panoul are trei roluri: Super Admin, **Administrator club** și **Editor site**. Rolul hotărăște ce meniuri și pagini vede fiecare.",
        "Se intră cu e-mail și parolă sau cu Google. Se poate adăuga 2FA, cu aplicație de autentificare, cod pe e-mail sau cheie de acces.",
        "După 5 parole greșite, intrarea se oprește 15 minute.",
        "O intrare de pe un dispozitiv nou trimite un e-mail către cont.",
        "Portalurile se folosesc cu e-mail și parolă sau cu Google, fără 2FA deocamdată.",
      ],
    },
    { t: "h2", text: "Date" },
    {
      t: "list",
      items: [
        "Fiecare schimbare la un sportiv, o înscriere, o prezență, un abonament sau o plată intră în **Istoric**, cu data, ora și contul care a făcut-o.",
        "Datele unui sportiv se pot descărca din meniul fișei, la **Exportă datele**: un ZIP cu un rezumat PDF și PDF-urile înscrierilor.",
        "**Anonimizează** șterge datele personale, PDF-urile și profilul public. Rămân grupele pe sezoane, statusul A.C.S. și numărul de înscrieri. O poate face doar Super Admin.",
        "Panoul te anunță când există sportivi inactivi de peste un număr de ani, cu link la listă.",
      ],
    },
    { t: "warn", text: "Anonimizarea nu se poate anula." },
    { t: "h2", text: "Server" },
    {
      t: "list",
      items: [
        "Adresele clubului merg pe HTTPS, iar certificatele se reînnoiesc automat.",
        "În fiecare noapte se face o copie a bazei de date, a imaginilor încărcate și a PDF-urilor de înscriere. Se păstrează ultimele 14 copii, pe același server.",
        "Erorile site-ului și ale panoului se strâng automat în GlitchTip.",
        "Starea serverului este urmărită automat.",
      ],
    },
  ],
};
