import type { GhidPage } from "@/lib/ghid/types";

export const aiUitatParolaPage: GhidPage = {
  slug: "ai-uitat-parola",
  title: "Resetarea parolei",
  lead: "Parola se resetează cu un cod de 6 cifre primit pe e-mail, în panou și în ambele portaluri.",
  blocks: [
    { t: "h2", text: "Pașii comuni" },
    {
      t: "steps",
      steps: [
        { text: "Pe pagina de intrare apasă **Am uitat parola** și scrie e-mailul." },
        { text: "Răspunsul este mereu același, **Dacă adresa are cont, am trimis un cod.**, indiferent dacă adresa are cont." },
        { text: "Codul este valabil 10 minute, iar după 5 încercări greșite devine invalid. Un cod nou anulează codurile vechi." },
        { text: "Scrie codul și parola nouă: între 10 și 128 de caractere, nu o parolă des folosită și nu adresa de e-mail. Toate dispozitivele se deconectează." },
      ],
    },
    { t: "h2", text: "Panoul" },
    {
      t: "list",
      items: [
        "Codul se trimite doar administratorilor activi.",
        "Cu 2FA activ, după parola nouă urmează pasul 2FA; resetarea nu îl ocolește.",
        "Fără 2FA, intrarea este directă și primești e-mailul pentru dispozitiv nou.",
        "Dacă ai pierdut dispozitivul 2FA și codurile de rezervă, un Super Admin îți resetează 2FA cu **Resetează 2FA**, în **Securitate**, **Administratori**. Primești un mesaj. Nu îți poți reseta singur 2FA.",
      ],
    },
    { t: "h2", text: "Portalul antrenorului" },
    {
      t: "list",
      items: [
        "Aceiași pași, pe pagina de intrare a portalului antrenorului. Un cont dezactivat nu primește cod.",
        "Parola antrenorului nu se poate reseta din panou. Dacă nu și-a activat contul, apasă **Retrimite invitația**.",
        "Dacă schimbi e-mailul contului, toate sesiunile se închid.",
      ],
    },
    { t: "h2", text: "Portalul părinților" },
    {
      t: "p",
      text: "Aceiași pași, pe pagina de intrare a portalului părinților. Dacă invitația nu a fost acceptată, resetarea parolei activează contul.",
    },
    { t: "warn", text: "Se pot cere cel mult 5 mesaje cu cod pe oră pentru aceeași adresă." },
    {
      t: "links",
      items: [{ slug: "intra-in-panou" }, { slug: "contul-tau-parola-si-2fa" }, { slug: "parintele-nu-poate-intra" }, { slug: "acces-antrenor-in-portal" }],
    },
  ],
};
