import type { GhidPage } from "@/lib/ghid/types";

export const primesteInscrieriPage: GhidPage = {
  slug: "primeste-si-citeste-inscrieri",
  title: "Primești și citești înscrierile",
  lead: "Fiecare înscriere trimisă apare în lista Înscrieri, cu statusul Nou.",
  blocks: [
    {
      t: "steps",
      steps: [
        {
          text: "În meniu, în grupa **Formulare**, deschide **Înscrieri**. Eticheta de lângă titlu arată câte sunt **noi**. Apas-o ca să le vezi doar pe ele.",
          shot: "inscrieri-lista",
        },
        { text: "Apasă un rând. În dreapta se deschide panoul înscrierii: numele, statusul, **Nr.** și data trimiterii." },
        { text: "Pe telefon, înscrierea se deschide pe tot ecranul. **‹ Înscrieri**, sus, te duce înapoi la listă." },
        { text: "Pentru a găsi o înscriere, caută după nume, număr, telefon sau e-mail. **Status** și **Nivel** filtrează lista." },
      ],
    },
    {
      t: "p",
      text: "**Sezon**, din dreapta sus, schimbă sezonul afișat. Cu două sau mai multe școli apar și taburile **Toate** și câte unul pe școală.",
    },
    { t: "h2", text: "Taburile panoului" },
    {
      t: "list",
      items: [
        "**Date**: răspunsurile din formular. **Editează** le corectează.",
        "**Abonament**: ce a ales părintele pentru abonament și acordurile date.",
        "**Documente**: PDF-urile înscrierii, cu **Vezi** și **Descarcă**, și **Retrimite e-mailul**.",
        "**Istoric**: ce s-a întâmplat cu înscrierea, cele mai noi primele.",
      ],
    },
    { t: "h2", text: "Statusul" },
    {
      t: "p",
      text: "Din panou alegi **Nou**, **Contactat** sau **Respins**. **Confirmat** apare doar după **Confirmă înscrierea**, iar pe o înscriere confirmată statusul nu se mai schimbă de aici.",
    },
    { t: "links", items: [{ slug: "trimite-un-mesaj" }, { slug: "confirma-o-inscriere" }] },
  ],
};
