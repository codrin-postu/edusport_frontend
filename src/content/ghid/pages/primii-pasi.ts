import type { GhidPage } from "@/lib/ghid/types";

export const primiiPasiPage: GhidPage = {
  slug: "primii-pasi",
  title: "Primii pași",
  lead: "Intrarea în panou, meniul și lucrul de pe telefon.",
  blocks: [
    { t: "h2", text: "Intrarea" },
    {
      t: "steps",
      steps: [
        { text: "Scrie **E-mail** și **Parolă**, apoi apasă **Intră**.", shot: "primii-login" },
        { text: "Dacă contul tău este legat de Google, apasă **Continuă cu Google**." },
        {
          text: "Dacă ai 2FA, apare pasul **2FA**: scrie codul din aplicație sau din e-mail și apasă **Verifică**. Cu **Ține minte dispozitivul 30 de zile** nu ți-l mai cere pe acel dispozitiv.",
        },
        { text: "De pe un dispozitiv nou primești un e-mail, **Intrare de pe un dispozitiv nou**. Dacă nu ai fost tu, schimbă parola." },
        { text: "Dacă ai uitat parola, apasă **Am uitat parola** și scrie codul primit pe e-mail." },
      ],
    },
    { t: "warn", text: "După 5 parole greșite, intrarea se oprește 15 minute." },
    { t: "h2", text: "Meniul" },
    {
      t: "steps",
      steps: [
        { text: "Apasă o grupă din stânga, de exemplu **Club și școală**, ca să vezi paginile ei.", shot: "primii-meniu" },
        { text: "Jos sunt **Contul meu** și **Ieși din cont**." },
      ],
    },
    { t: "p", text: "Fiecare cont vede doar grupele și paginile permise de rolul lui." },
    { t: "h2", text: "Pe telefon" },
    {
      t: "steps",
      steps: [
        { text: "Apasă butonul de meniu din dreapta sus.", shot: "primii-telefon" },
        { text: "Se deschide **Navigare**, cu aceleași grupe. Alege pagina, de exemplu **Sportivi**.", shot: "primii-telefon-meniu" },
      ],
    },
    { t: "h2", text: "Portalurile" },
    {
      t: "p",
      text: "Antrenorii și părinții intră în portal cu invitația primită pe e-mail, unde își aleg parola sau continuă cu Google.",
    },
    { t: "links", items: [{ slug: "despre-sistem" }, { slug: "siguranta" }] },
  ],
};
