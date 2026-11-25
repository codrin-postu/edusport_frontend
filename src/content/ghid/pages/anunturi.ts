import type { GhidPage } from "@/lib/ghid/types";

export const anunturiPage: GhidPage = {
  slug: "anunturi",
  title: "Anunțuri",
  lead: "Un anunț apare pe site, în portalul sportivilor sau în ambele.",
  blocks: [
    {
      t: "steps",
      steps: [
        { text: "În meniu, la **Noutăți**, deschide **Anunțuri**. **Filtre** restrânge lista. Apasă pe un anunț ca să îl editezi." },
        {
          text: "Apasă **+ Anunț nou**. La **Unde apare** bifează **Site**, **Portal sportiv** sau amândouă. Trebuie să rămână bifat cel puțin un loc.",
          shot: "anunturi-noul",
          marks: ["site", "portal-sportiv"],
        },
        {
          text: "La **Pentru cine** alege **Toate grupele** sau **Grupe alese**, apoi bifează grupele. Apare doar când **Portal sportiv** este bifat.",
          shot: "anunturi-noul",
          marks: ["pentru-cine"],
        },
        { text: "Scrie **Titlu** și **Mesaj**, ambele obligatorii. Mesajul acceptă doar text simplu." },
        { text: "La **Programare** pune **Începe** și **Se încheie**, orele și **Stare**: **Activ** sau **Inactiv**." },
        { text: "Apasă **Salvează**, în bara de jos. **Renunță** anulează modificările." },
      ],
    },
    {
      t: "p",
      text: "**Afișare** (**Format**, **Text buton**, **Link buton**) și **Etichetă mică** apar doar când anunțul este pe site.",
    },
    { t: "h2", text: "Oprește sau șterge" },
    {
      t: "p",
      text: "Un anunț activ pe portal are **Oprește**, sus în dreapta. Confirmarea spune: **Nu mai apare pe portal.** Rândurile marcate **Automat**, cum sunt ședințele anulate sau mutate, apar automat și nu se pot opri.",
    },
    {
      t: "warn",
      text: "**Șterge** elimină definitiv anunțul.",
    },
    { t: "links", items: [{ slug: "anuleaza-sau-muta-o-sedinta" }, { slug: "paginile-site-ului" }] },
  ],
};
