import type { GhidPage } from "@/lib/ghid/types";

export const intraInPanouPage: GhidPage = {
  slug: "intra-in-panou",
  title: "Intră în panou",
  lead: "Cum intri în panou și ce faci dacă ai uitat parola.",
  blocks: [
    { t: "h2", text: "Intră" },
    {
      t: "steps",
      steps: [
        { text: "Scrie **E-mail** (1) și **Parolă** (2), apoi apasă **Intră** (3).", shot: "primii-login", marks: ["email", "parola", "intra"], numbered: true },
        {
          text: "Dacă ai 2FA, apare pasul **2FA**: scrie codul și apasă **Verifică**. Cu **Altă metodă** alegi aplicația, codul pe e-mail sau un **Cod de rezervă**.",
        },
        { text: "Cu **Ține minte dispozitivul 30 de zile** nu ți se mai cere 2FA pe acel dispozitiv." },
      ],
    },
    { t: "p", text: "Fără parolă intri cu **Continuă cu Google**, dacă contul tău este legat de Google, sau cu **Folosește cheia de acces**, dacă ai creat una la **Securitate**." },
    { t: "p", text: "De pe un dispozitiv nou primești un e-mail, **Intrare de pe un dispozitiv nou**. Dacă nu ai fost tu, schimbă parola." },
    { t: "warn", text: "După 5 parole greșite, intrarea se oprește 15 minute." },
    { t: "h2", text: "Ai uitat parola" },
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
      text: "Antrenorii și părinții intră în portal cu invitația primită pe e-mail, unde își aleg parola sau continuă cu Google.",
    },
    { t: "links", items: [{ slug: "meniul-si-pagina-acasa" }, { slug: "contul-tau-parola-si-2fa" }] },
  ],
};
