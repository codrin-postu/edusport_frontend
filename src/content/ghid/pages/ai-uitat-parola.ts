import type { GhidPage } from "@/lib/ghid/types";

export const aiUitatParolaPage: GhidPage = {
  slug: "ai-uitat-parola",
  title: "Ai uitat parola",
  lead: "Parola se schimbă cu un cod de 6 cifre trimis pe e-mail, în panou, în portalul antrenorului și în cel al părinților.",
  blocks: [
    { t: "h2", text: "La toate trei" },
    {
      t: "steps",
      steps: [
        { text: "Pe pagina de intrare apasă **Am uitat parola** și scrie e-mailul." },
        { text: "Răspunsul este același, **Dacă adresa are cont, am trimis un cod.**, chiar dacă adresa nu are cont." },
        { text: "Codul este valabil 10 minute, iar după 5 încercări greșite nu mai merge. Un cod nou anulează codurile vechi." },
        { text: "Scrie codul și o parolă nouă: 10 până la 128 de caractere, nu una foarte uzuală și nu e-mailul. Toate dispozitivele se deconectează." },
      ],
    },
    { t: "h2", text: "Panou" },
    {
      t: "list",
      items: [
        "Primește cod doar un administrator activ.",
        "Cu 2FA activ, după parola nouă urmează și pasul 2FA: resetarea nu îl sare.",
        "Fără 2FA, intri direct și primești mesajul pentru dispozitiv nou.",
        "Ai pierdut dispozitivul 2FA și codurile de rezervă: un Super Admin apasă **Resetează 2FA** la tine, în **Securitate**, **Administratori**. Primești un mesaj. Nu-ți poți reseta singur 2FA.",
      ],
    },
    { t: "h2", text: "Portalul antrenorului" },
    {
      t: "list",
      items: [
        "La fel, pe pagina portalului antrenorului. Contul dezactivat nu primește cod.",
        "Din panou nu se resetează parola lui. Dacă nu și-a activat contul, apasă **Retrimite invitația**.",
        "Dacă schimbi e-mailul contului, toate sesiunile se închid.",
      ],
    },
    { t: "h2", text: "Portalul părinților" },
    {
      t: "p",
      text: "La fel, pe pagina portalului părinților. Dacă invitația nu fusese acceptată, resetarea o acceptă și activează contul.",
    },
    { t: "warn", text: "Se pot cere cel mult 5 mesaje cu cod pe oră pentru aceeași adresă." },
    {
      t: "links",
      items: [{ slug: "intra-in-panou" }, { slug: "contul-tau-parola-si-2fa" }, { slug: "parintele-nu-poate-intra" }, { slug: "acces-antrenor-in-portal" }],
    },
  ],
};
