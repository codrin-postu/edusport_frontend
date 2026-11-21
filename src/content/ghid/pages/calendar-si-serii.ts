import type { GhidPage } from "@/lib/ghid/types";

export const calendarSiSeriiPage: GhidPage = {
  slug: "calendar-si-serii",
  title: "Calendar și serii",
  lead: "Calendarul arată ședințele și evenimentele lunii. De aici adaugi și evenimente care se repetă.",
  blocks: [
    {
      t: "steps",
      steps: [
        { text: "Deschide **Calendar și serii**, în meniu, la **Program și calendar**. Pagina se numește **Program** și arată luna curentă.", shot: "program-calendar", marks: ["adauga-pauza", "adauga", "lista"] },
        { text: "**Lună** și **Listă** schimbă afișarea. Săgețile de lângă lună și **Azi** schimbă luna." },
        {
          text: "La **Arată:** bifezi ce vrei să vezi: **Antrenament**, **Școala de patinaj**, **Competiție, cantonament, spectacol, eveniment** și **Liber, vacanță, sărbătoare**.",
        },
        { text: "Apasă pe ședința unei grupe ca să o ții, anulezi sau muți." },
      ],
    },
    { t: "h2", text: "Adaugă un eveniment" },
    {
      t: "steps",
      steps: [
        { text: "Apasă **Adaugă**, sus în dreapta calendarului. Se deschide **Adaugă eveniment**.", shot: "program-eveniment", marks: ["se-repeta", "salveaza"] },
        { text: "Scrie **Titlu** și alege **Categorie**. **Etichetă** e un nume scurt, de exemplu Grupa A." },
        { text: "La **Când** pune **Început** și **Sfârșit**, sau pornește **Toată ziua**. **Se termină a doua zi** e pentru un eveniment care trece de miezul nopții." },
        {
          text: "**Se repetă** face o serie: alege **Săptămânal**, **La 2 săptămâni** sau **Lunar**, zilele și intervalul **De la** și **Până la**. Intervalul e obligatoriu, iar seria poate dura cel mult un an.",
        },
        { text: "**Excepții** ține anulările și mutările din serie. Apasă **Salvează**." },
      ],
    },
    { t: "links", items: [{ slug: "pauze" }, { slug: "programul-unei-grupe" }] },
  ],
};
