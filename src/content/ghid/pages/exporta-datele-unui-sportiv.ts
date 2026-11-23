import type { GhidPage } from "@/lib/ghid/types";

export const exportaDateleSportivuluiPage: GhidPage = {
  slug: "exporta-datele-unui-sportiv",
  title: "Exportă datele unui sportiv",
  lead: "Exportul reunește toate datele unui sportiv într-un fișier ZIP, de exemplu la cererea părintelui.",
  blocks: [
    {
      t: "steps",
      steps: [
        { text: "Deschide fișa sportivului, din **Sportivi**." },
        { text: "Sus, în dreapta, apasă **...** (1), apoi **Exportă datele** (2).", shot: "date-meniu", marks: ["mai-multe", "exporta-datele"], numbered: true },
        { text: "Fișierul se descarcă și apare mesajul **Datele au fost exportate.** În caz de eroare apare **Datele nu au putut fi exportate.**" },
      ],
    },
    { t: "h2", text: "Ce conține" },
    {
      t: "p",
      text: "Fișierul se numește date-nume-data.zip. În el sunt **rezumat.pdf** și, în folderul **inscrieri**, PDF-urile fiecărei înscrieri.",
    },
    {
      t: "p",
      text: "**rezumat.pdf** are secțiunile **Sportiv**, **Grupe pe sezoane**, **Membru A.C.S. pe sezoane**, **Înscrieri**, **Istoric**, **Prezență**, **Lecții individuale**, **Abonamente**, **Plăți** și **Parcurs**. Un PDF care lipsește apare ca **Document indisponibil**.",
    },
    { t: "p", text: "Exportul se înregistrează în **Istoric**, cu **Date exportate**. Fișierul nu se păstrează pe server." },
    { t: "warn", text: "Fișierul are datele personale ale copilului. Trimite-l doar părintelui." },
    {
      t: "p",
      text: "Exportul este disponibil pentru **Administrator club** și **Super Admin**. Datele unui sportiv anonimizat nu se mai pot exporta.",
    },
    { t: "links", items: [{ slug: "anonimizeaza-un-sportiv" }, { slug: "ce-ramane-dupa-anonimizare" }] },
  ],
};
