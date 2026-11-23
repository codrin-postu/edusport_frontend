import type { GhidPage } from "@/lib/ghid/types";

export const ceRamaneDupaAnonimizarePage: GhidPage = {
  slug: "ce-ramane-dupa-anonimizare",
  title: "Ce rămâne după anonimizare",
  lead: "După anonimizare rămân grupele pe sezoane, statusul A.C.S. și numărul de înscrieri, fără nume.",
  blocks: [
    { t: "h2", text: "Se șterge" },
    {
      t: "list",
      items: [
        "Din fișă: numele, data nașterii, persoana de contact, telefonul, e-mailul și notele.",
        "Din înscrieri: numele părintelui, e-mailul, telefonul, data nașterii copilului, înălțimea, mărimea de tricou, experiența anterioară, așteptările și nota internă.",
        "PDF-urile înscrierilor. Dacă o ștergere eșuează, se reia automat.",
        "Profilul public. Imaginile lui se șterg din Media, dacă nu sunt folosite în altă parte.",
        "Valorile personale din Istoric.",
        "Mesajele netrimise și adresele din coada de e-mailuri. Accesul în portal se oprește.",
        "Lecțiile individuale programate începând de azi, fără plată, și notele plăților.",
      ],
    },
    { t: "h2", text: "Rămâne" },
    {
      t: "list",
      items: [
        "Grupele pe sezoane și statusul A.C.S.",
        "Înscrierile, cu numărul, sezonul, secțiunea și statusul, dar fără datele personale.",
        "Plățile, cu suma, data, metoda, sezonul și legăturile lor.",
      ],
    },
    { t: "links", items: [{ slug: "anonimizeaza-un-sportiv" }, { slug: "sportivi-inactivi" }] },
  ],
};
