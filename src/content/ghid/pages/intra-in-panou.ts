import type { GhidPage } from "@/lib/ghid/types";

export const intraInPanouPage: GhidPage = {
  slug: "intra-in-panou",
  title: "Intră în panou",
  lead: "Intrarea în panou și recuperarea parolei.",
  blocks: [
    { t: "h2", text: "Intră cu parola" },
    {
      t: "steps",
      steps: [
        { text: "Scrie **E-mail** (1) și **Parolă** (2), apoi apasă **Intră** (3).", shot: "primii-login", marks: ["email", "parola", "intra"], numbered: true },
        {
          text: "Dacă 2FA este activ, urmează pasul **2FA**: scrie codul și apasă **Verifică**. Cu **Altă metodă** alegi aplicația, codul pe e-mail sau un **Cod de rezervă**.",
        },
        { text: "Cu **Ține minte dispozitivul 30 de zile**, 2FA nu mai este cerut pe acel dispozitiv." },
      ],
    },
    { t: "p", text: "Fără parolă intri cu **Continuă cu Google**, dacă contul tău este legat de Google, sau cu **Folosește cheia de acces**, dacă ai creat una la **Securitate**." },
    { t: "p", text: "La intrarea de pe un dispozitiv nou primești e-mailul **Intrare de pe un dispozitiv nou**. Dacă nu ai intrat tu, schimbă parola." },
    { t: "warn", text: "După 5 parole greșite, intrarea se blochează 15 minute." },
    { t: "h2", text: "Parola uitată" },
    {
      t: "steps",
      steps: [
        { text: "Pe pagina de intrare apasă **Am uitat parola**.", shot: "primii-login", marks: ["uitat"] },
        { text: "Scrie **E-mail** și apasă **Trimite codul**. Primești un cod pe e-mail." },
        { text: "Scrie **Cod din e-mail** și **Parolă nouă**, apoi apasă **Salvează parola**." },
      ],
    },
    { t: "h2", text: "Portalurile" },
    {
      t: "p",
      text: "Antrenorii și părinții intră în portal prin invitația primită pe e-mail: își aleg o parolă sau continuă cu Google.",
    },
    { t: "links", items: [{ slug: "meniul-si-pagina-acasa" }, { slug: "contul-tau-parola-si-2fa" }] },
  ],
};
