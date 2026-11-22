import type { GhidPage } from "@/lib/ghid/types";

export const calendarSiEvenimentePage: GhidPage = {
  slug: "calendar-si-evenimente",
  title: "Calendar și evenimente",
  lead: "Calendarul arată ședințele și evenimentele lunii. De aici adaugi evenimente, și unele care se repetă.",
  blocks: [
    {
      t: "steps",
      steps: [
        { text: "Deschide **Calendar și serii**, în meniu, la **Program și calendar**. Pagina se numește **Program** și arată luna curentă.", shot: "program-calendar", marks: ["meniu"] },
        { text: "**Lună** și **Listă** schimbă afișarea. Săgețile de lângă lună și **Azi** schimbă luna.", shot: "program-calendar", marks: ["afisare"] },
        {
          text: "La **Arată:** bifezi ce vrei să vezi: **Antrenament**, **Școala de patinaj**, **Competiție, cantonament, spectacol, eveniment** și **Liber, vacanță, sărbătoare**.",
          shot: "program-calendar", marks: ["arata"],
        },
        { text: "Apasă pe ședința unei grupe ca să o ții, anulezi sau muți.", shot: "program-calendar", marks: ["sedinta"] },
      ],
    },
    { t: "h2", text: "Adaugă un eveniment" },
    {
      t: "steps",
      steps: [
        { text: "Apasă **Adaugă**, sus în dreapta calendarului. Se deschide **Adaugă eveniment**.", shot: "program-calendar", marks: ["adauga"] },
        { text: "Scrie **Titlu** și alege **Categorie**, de exemplu **Competiție**, **Cantonament** sau **Vacanță**. **Etichetă** e un nume scurt, de exemplu Grupa A.", shot: "program-eveniment", marks: ["titlu", "categorie", "eticheta"] },
        { text: "La **Când** pune **Început** și **Sfârșit**, sau pornește **Toată ziua**. **Se termină a doua zi** e pentru un eveniment care trece de miezul nopții.", shot: "program-eveniment", marks: ["ora"] },
        {
          text: "**Se repetă** vine pornit. Pentru o serie alege **Săptămânal**, **La 2 săptămâni** sau **Lunar**, zilele și intervalul **De la** și **Până la**.",
          shot: "program-eveniment", marks: ["se-repeta", "zile", "interval"],
        },
        { text: "Intervalul e obligatoriu, iar seria poate dura cel mult un an." },
        { text: "Pentru un eveniment unic oprește **Se repetă**: apar **Data** și **Până la (opțional)**." },
        { text: "Apasă **Salvează**.", shot: "program-eveniment", marks: ["salveaza"] },
      ],
    },
    { t: "h2", text: "Anulează sau mută o dată dintr-o serie" },
    {
      t: "p",
      text: "**Excepții** apare la evenimentele care se repetă, nu la ședințele din categoria **Școala de patinaj**. Pentru acelea vezi **Anulează sau mută o ședință**.",
    },
    {
      t: "steps",
      steps: [
        { text: "Apasă pe un eveniment care se repetă, deschide **Excepții** și apasă **Adaugă excepție**.", shot: "program-exceptie", marks: ["exceptii", "adauga-exceptie"] },
        { text: "Alege **Anulat** sau **Mutat** și **Data** ședinței.", shot: "program-exceptie", marks: ["tip", "data"] },
        { text: "La **Mutat** pune și **Data nouă**, **Început** și **Sfârșit**. Apoi apasă **Salvează**.", shot: "program-exceptie", marks: ["data-noua"] },
      ],
    },
    { t: "links", items: [{ slug: "anuleaza-sau-muta-o-sedinta" }, { slug: "pauze-si-vacante" }, { slug: "programul-unei-grupe" }] },
  ],
};
