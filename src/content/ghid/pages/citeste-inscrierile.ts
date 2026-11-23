import type { GhidPage } from "@/lib/ghid/types";

export const citesteInscrierilePage: GhidPage = {
  slug: "citeste-inscrierile",
  title: "Vezi înscrierile",
  lead: "Fiecare înscriere trimisă apare în lista **Înscrieri**, cu statusul **Nou**.",
  blocks: [
    {
      t: "p",
      text: "**Sezon**, din dreapta sus, schimbă sezonul afișat. Dacă există cel puțin două școli, apar și taburile **Toate** și câte unul pentru fiecare școală.",
    },
    {
      t: "steps",
      steps: [
        {
          text: "În meniu, în grupa **Formulare**, deschide **Înscrieri**. Eticheta de lângă titlu arată câte sunt **noi**.",
          shot: "inscrieri-lista", marks: ["eticheta"],
        },
        {
          text: "Pentru a găsi o înscriere, caută după nume, număr, telefon sau e-mail. **Status** și **Nivel** filtrează lista.",
          shot: "inscrieri-lista", marks: ["cauta", "status"],
        },
        {
          text: "Apasă un rând. În dreapta se deschide panoul înscrierii: numele, statusul, **Nr.** și data trimiterii.",
          shot: "inscrieri-lista", marks: ["nume"],
        },
      ],
    },
    { t: "h2", text: "Taburile panoului" },
    {
      t: "list",
      items: [
        "**Date**: răspunsurile din formular. **Editează** le corectează.",
        "**Abonament**: abonamentul ales de părinte și acordurile date.",
        "**Documente**: PDF-urile înscrierii, cu **Vezi** și **Descarcă**, și **Retrimite e-mailul**.",
        "**Istoric**: modificările înscrierii, de la cea mai recentă.",
      ],
    },
    { t: "h2", text: "Statusul" },
    {
      t: "p",
      text: "În panoul înscrierii alegi **Nou**, **Contactat** sau **Respins**. **Confirmat** apare doar după **Confirmă înscrierea**, iar pe o înscriere confirmată statusul nu se mai schimbă de aici.",
    },
    { t: "h2", text: "Pe telefon" },
    {
      t: "p",
      text: "Înscrierea se deschide pe tot ecranul. **‹ Înscrieri**, sus, revine la listă.",
    },
    { t: "links", items: [{ slug: "contacteaza-parintele" }, { slug: "confirma-o-inscriere" }] },
  ],
};
