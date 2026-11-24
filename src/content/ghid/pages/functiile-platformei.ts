import type { GhidPage } from "@/lib/ghid/types";

export const functiilePlatformeiPage: GhidPage = {
  slug: "functiile-platformei",
  title: "Funcțiile platformei",
  lead: "Super Adminul alege ce părți ale platformei folosește clubul, din pagina **Funcții**.",
  blocks: [
    { t: "p", text: "O funcție dezactivată dispare din panou și din portaluri, dar datele ei se păstrează și revin când o activezi din nou." },
    { t: "h2", text: "Activează sau dezactivează o funcție" },
    {
      t: "steps",
      steps: [
        { text: "În meniul din stânga, la **Sistem**, deschide **Funcții**. Pagina apare doar pentru Super Admin." },
        { text: "Apasă comutatorul de lângă funcție." },
        { text: "La dezactivare, citește avertizarea și apasă **Dezactivează**. Activarea se face imediat, fără avertizare." },
      ],
    },
    { t: "h2", text: "Funcțiile" },
    {
      t: "list",
      items: [
        "**Prezență**: Antrenorii și administratorii completează prezența la fiecare ședință. Din prezență se calculează ședințele rămase din abonament.",
        "**Abonamente și plăți**: Evidența abonamentelor, a plăților și a restanțelor, în Contabilitate. Părinții primesc pe e-mail confirmarea fiecărei plăți.",
        "**Portalul antrenorilor**: Antrenorii au acces la un portal propriu, unde își văd programul, grupele și sportivii și completează prezența de pe telefon.",
        "**Portalul părinților**: Părinții și sportivii majori au acces la un portal unde urmăresc calendarul, prezența, plățile și rezultatele.",
        "**Parcurs și insigne**: Sportivii primesc insigne pentru antrenamente, concursuri și vechime, iar antrenorii le pot acorda și insigne proprii. Insignele apar în fișa sportivului și în portaluri.",
      ],
    },
    { t: "p", text: "**Abonamente și plăți** se poate activa doar împreună cu Prezența. Când dezactivezi Prezența, se dezactivează și Abonamente și plăți." },
    { t: "p", text: "Un portal care nu este instalat pe server apare dezactivat, cu mesajul **Portalul nu este instalat pe acest server.**" },
    { t: "p", text: "Mereu active: site-ul, înscrierile, sportivii, grupele și calendarul." },
    { t: "warn", text: "E-mailurile care așteaptă să fie trimise pentru o funcție dezactivată se anulează și nu se mai trimit nici după reactivare." },
    { t: "links", items: [{ slug: "ce-poate-face-fiecare-rol" }, { slug: "portalurile-optional" }] },
  ],
};
