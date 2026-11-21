import type { GhidPage } from "@/lib/ghid/types";

export const trimiteMesajPage: GhidPage = {
  slug: "trimite-un-mesaj",
  title: "Trimite un mesaj",
  lead: "Din înscriere deschizi un mesaj gata scris, pe WhatsApp sau prin SMS.",
  blocks: [
    {
      t: "steps",
      steps: [
        { text: "Deschide înscrierea și apasă **Contactează**, jos. Merge și iconița de mesaj de lângă telefon, în tabul **Date**." },
        {
          text: "Se deschide fereastra cu numărul de telefon și un mesaj deja scris. Poți schimba textul.",
          shot: "inscrieri-contact", marks: ["mesaj", "sms", "whatsapp"],
        },
        { text: "Apasă **SMS** sau **WhatsApp**. Se deschide aplicația, cu mesajul pregătit pentru acel număr." },
        { text: "Sub mesaj, la **Status**, alege **Contactat** după ce ai scris părintelui." },
      ],
    },
    {
      t: "p",
      text: "**Contactează** lipsește când statusul e **Contactat** sau **Confirmat**, sau când înscrierea nu are telefon. Iconița **Copiază** de lângă număr îl copiază.",
    },
    {
      t: "p",
      text: "Dacă numărul nu e valid, lângă el apare **Număr de telefon invalid** și butoanele **SMS** și **WhatsApp** rămân inactive.",
    },
    { t: "links", items: [{ slug: "primeste-si-citeste-inscrieri" }, { slug: "confirma-o-inscriere" }] },
  ],
};
