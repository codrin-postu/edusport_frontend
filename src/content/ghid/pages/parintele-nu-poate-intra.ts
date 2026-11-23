import type { GhidPage } from "@/lib/ghid/types";

export const parinteleNuPoateIntraPage: GhidPage = {
  slug: "parintele-nu-poate-intra",
  title: "Părintele nu poate intra",
  lead: "Cele mai dese cauze sunt parola uitată, invitația expirată și o adresă greșită.",
  blocks: [
    { t: "h2", text: "Parola uitată" },
    {
      t: "steps",
      steps: [
        { text: "Părintele apasă **Am uitat parola**, pe pagina de intrare a portalului, și scrie e-mailul." },
        { text: "Primește același răspuns, **Dacă adresa are cont, am trimis un cod.**, indiferent dacă adresa are cont." },
        { text: "Mesajul **Codul pentru parola nouă** are un cod din 6 cifre, valabil 10 minute. După 5 încercări greșite, codul nu mai merge." },
        { text: "Scrie codul și o parolă nouă (cel puțin 10 caractere). Intră în cont, iar toate celelalte dispozitive se deconectează." },
      ],
    },
    {
      t: "list",
      items: [
        "Un cod nou anulează codurile vechi. Se pot cere cel mult 5 mesaje pe oră.",
        "Un cont dezactivat nu primește cod.",
        "Dacă invitația nu fusese acceptată, resetarea parolei activează contul.",
        "Cine intră doar cu Google poate cere o parolă tot așa.",
      ],
    },
    { t: "h2", text: "Invitația a expirat" },
    {
      t: "steps",
      steps: [
        { text: "Pagina arată **Invitația a expirat. Cere una nouă.**" },
        { text: "În panou, la cardul **Acces portal** al sportivului, apasă **Retrimite invitația**. Butonul apare cât timp starea este **INVITAT**." },
      ],
    },
    { t: "h2", text: "E-mailul este greșit" },
    {
      t: "list",
      items: [
        "Fără cont pe adresa scrisă, părintele nu primește niciun cod, iar cu Google primește **Nu am găsit un cont pentru adresa asta.**",
        "Cu Google merge doar adresa din invitație.",
        "Verifică adresa în **Date**. Dacă e greșită, schimb-o: se oprește accesul vechi și pleacă o invitație nouă.",
      ],
    },
    { t: "h2", text: "Alte cazuri" },
    {
      t: "list",
      items: [
        "După 5 parole greșite pentru aceeași adresă, intrarea se oprește 15 minute, iar proprietarul primește mesajul **Încercări de intrare în cont**.",
        "Contul nu mai are acces la niciun sportiv: portalul nu-l mai primește.",
        "Contul este dezactivat: nu poate intra.",
      ],
    },
    { t: "p", text: "Din panou nu se resetează parola unui părinte. Părintele o schimbă singur, cu codul de pe e-mail." },
    {
      t: "links",
      items: [{ slug: "invita-un-parinte-in-portal" }, { slug: "schimba-e-mailul-unui-sportiv" }, { slug: "ai-uitat-parola" }],
    },
  ],
};
