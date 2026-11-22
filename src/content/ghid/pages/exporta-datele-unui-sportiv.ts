import type { GhidPage } from "@/lib/ghid/types";

export const exportaDateleSportivuluiPage: GhidPage = {
  slug: "exporta-datele-unui-sportiv",
  title: "Exportă datele unui sportiv",
  lead: "Exportul dă toate datele unui sportiv într-un fișier ZIP, de exemplu când părintele le cere.",
  blocks: [
    {
      t: "steps",
      steps: [
        { text: "Deschide fișa sportivului, din **Sportivi**." },
        { text: "Sus, în dreapta, apasă **...**, apoi **Exportă datele**.", shot: "date-meniu", marks: ["mai-multe", "exporta-datele"] },
        { text: "Fișierul se descarcă și apare mesajul **Datele au fost exportate.** Dacă nu merge: **Datele nu au putut fi exportate.**" },
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
    { t: "p", text: "Exportul se notează în **Istoric**, cu **Date exportate**. Fișierul nu se păstrează pe server." },
    { t: "warn", text: "Fișierul are datele personale ale copilului. Trimite-l doar părintelui." },
    {
      t: "p",
      text: "Exportul îl fac **Administrator club** și **Super Admin**. Un sportiv deja anonimizat nu se mai exportă.",
    },
    { t: "links", items: [{ slug: "anonimizeaza-un-sportiv" }, { slug: "ce-ramane-dupa-anonimizare" }] },
  ],
};
