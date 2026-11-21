import type { GhidPage } from "@/lib/ghid/types";

export const grupelePage: GhidPage = {
  slug: "grupele",
  title: "Grupele",
  lead: "Din Grupe vezi grupele fiecărui sezon, creezi una nouă și muți sportivii între ele.",
  blocks: [
    {
      t: "steps",
      steps: [
        { text: "Deschide **Grupe**, în meniu, la **Club și școală**. Alege sezonul la **Sezon** și secțiunea din taburile de sub el.", shot: "grupe-lista" },
        { text: "Tabelul arată **Program**, **Antrenori**, **Listă de prețuri** și numărul de **Sportivi**. Apasă pe un rând ca să deschizi grupa." },
      ],
    },
    {
      t: "p",
      text: "Un sezon încheiat se poate doar citi: lipsesc butoanele care adaugă sau schimbă ceva. Dacă sunt sportivi fără grupă, lângă **Grupă nouă** apare **Fără grupă**, cu lista lor și **Alocă** pe fiecare rând.",
    },
    { t: "h2", text: "Creează o grupă" },
    {
      t: "steps",
      steps: [
        { text: "Alege secțiunea potrivită și apasă **Grupă nouă**, sus în dreapta.", shot: "grupe-noua" },
        { text: "Scrie **Nume**. Alege **Listă de prețuri** și **Antrenori**, dacă le știi." },
        { text: "**Program public** vine bifat. Bifat, programul grupei apare în orarul de pe site (pentru grupele școlii)." },
        { text: "Apasă **Creează grupa**. Se deschide tabul **Program** al grupei, ca să adaugi orele." },
      ],
    },
    { t: "h2", text: "Pagina grupei" },
    {
      t: "steps",
      steps: [
        {
          text: "Sub nume vezi **Antrenori** și **Listă de prețuri**. Numele unui antrenor deschide contul lui de portal. Tabul **Sportivi** listează membrii, cu **Vârstă**, **Principală** și **Alte grupe**.",
          shot: "grupe-fisa",
        },
        { text: "**Adaugă sportivi** arată sportivii fără grupă. **Toți sportivii** caută în tot clubul, de la două litere. Bifează și apasă **Adaugă în grupă**." },
        { text: "**...** de pe un rând are **Mută**, **Adaugă și în grupă** și **Scoate din grupă**. După fiecare acțiune apare un mesaj cu **Anulează**." },
      ],
    },
    {
      t: "p",
      text: "**...** din colțul paginii are **Editează grupa**, cu aceleași câmpuri ca la creare, și **Șterge grupa**. **Șterge grupa** apare doar la o grupă care n-a fost folosită. Tabul **Istoric** ține evenimentele grupei.",
    },
    { t: "links", items: [{ slug: "programul-unei-grupe" }, { slug: "completeaza-prezenta" }] },
  ],
};
