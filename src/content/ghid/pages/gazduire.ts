import type { GhidPage } from "@/lib/ghid/types";

export const gazduirePage: GhidPage = {
  slug: "gazduire",
  title: "Găzduire",
  lead: "Unde rulează site-ul și panoul, și de ce recomand să rămână acolo.",
  blocks: [
    { t: "h2", text: "Rămâne pe serverul meu" },
    { t: "p", text: "**6 euro pe lună**, rotunjit la 30 de lei. Site-ul, panoul și portalurile rulează azi aici. Prețul include:" },
    {
      t: "list",
      items: [
        "Site-ul, panoul de administrare, portalurile și baza de date.",
        "Copie în fiecare noapte, la 03:00 UTC, a bazei de date, a imaginilor încărcate și a PDF-urilor de înscriere. Se păstrează ultimele 14, pe același server.",
        "Erorile se strâng automat în GlitchTip.",
        "Starea serverului este urmărită automat, iar un raport zilnic ajunge la mine în fiecare dimineață la 08:00.",
        "Certificatele HTTPS se reînnoiesc automat.",
        "O singură persoană răspunde când ceva nu merge: eu.",
      ],
    },
    { t: "h2", text: "Server separat" },
    { t: "p", text: "Clubul ar închiria un server propriu la un furnizor de cloud. Pentru panou, site și baza de date sunt necesare cel puțin 4 GB de memorie." },
    {
      t: "list",
      items: [
        "Hetzner Cloud, 2 procesoare, 4 GB memorie, 80 GB disc: **16,99 euro pe lună**, fără TVA (citit pe 21 noiembrie 2026).",
        "DigitalOcean, 2 procesoare, 4 GB memorie, 80 GB disc: **24 de dolari pe lună** (citit pe 21 noiembrie 2026).",
      ],
    },
    { t: "p", text: "Prețul serverului nu acoperă restul. Un server separat înseamnă încă:" },
    {
      t: "list",
      items: [
        "cont la furnizor și card de plată;",
        "timp de configurare a serverului și a domeniului;",
        "copii de siguranță, făcute și verificate;",
        "actualizări;",
        "urmărirea stării și a erorilor;",
        "cineva care răspunde când se strică ceva, inclusiv noaptea.",
      ],
    },
    { t: "h2", text: "Ce recomand" },
    {
      t: "p",
      text: "Recomand să rămână pe serverul meu. Costă 30 de lei pe lună, mai puțin decât un server separat, iar copiile, urmărirea stării, erorile și certificatele funcționează deja. La un server separat, toate acestea trebuie refăcute, iar clubul rămâne cu grija lor.",
    },
  ],
};
