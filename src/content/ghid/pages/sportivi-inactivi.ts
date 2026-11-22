import type { GhidPage } from "@/lib/ghid/types";

export const sportiviInactiviPage: GhidPage = {
  slug: "sportivi-inactivi",
  title: "Sportivi inactivi",
  lead: "Panoul arată câți sportivi sunt inactivi de mai mulți ani, după o limită pe care o alegi. Nimic nu se anonimizează singur.",
  blocks: [
    { t: "h2", text: "Câți ani" },
    {
      t: "steps",
      steps: [
        { text: "Deschide **Setări site**. La cardul **Date personale** schimbă **Ani până la anonimizare** (între 1 și 20). Implicit sunt 5.", shot: "date-setari", marks: ["limita"] },
        { text: "Apasă **Salvează**." },
      ],
    },
    {
      t: "p",
      text: "Un sportiv e inactiv când ultimul sezon cu activitate e cu cel puțin atâția ani în urmă. Activitate înseamnă grupă, înscriere, prezență, lecție, plată sau abonament. Fără nicio activitate, contează vechimea fișei. Nu are legătură cu **Marchează inactiv** din fișă: contează doar activitatea.",
    },
    { t: "h2", text: "Avertizarea de pe Acasă" },
    {
      t: "p",
      text: "Pe **Acasă** apare de exemplu **3 sportivi inactivi de peste 5 ani.**, cu **Vezi lista**. Numărul de ani urmează setarea de mai sus. Super Admin poate apăsa **Ascunde până la sezonul următor**.",
    },
    { t: "h2", text: "Anonimizează din listă" },
    {
      t: "steps",
      steps: [
        { text: "În **Sportivi** apasă **Filtre**, la **Date personale** bifează **Inactivi de peste 5 ani** (numărul urmează setarea).", shot: "date-inactivi", marks: ["inactivi"] },
        { text: "Super Admin vede casete și butonul **Anonimizează (2)**, cu numărul sportivilor bifați. Bifează sportivii și apasă butonul." },
        { text: "Confirmă în **Anonimizezi datele pentru 2 sportivi?**. La final apare **2 sportivi anonimizați.** și, dacă e cazul, **Sărite: 1.** sau **Nereușite: 1.**" },
      ],
    },
    { t: "warn", text: "Anonimizarea nu se poate anula. Fiecare sportiv se face separat: o greșeală la unul nu oprește ceilalți." },
    { t: "links", items: [{ slug: "ce-ramane-dupa-anonimizare" }, { slug: "anonimizeaza-un-sportiv" }, { slug: "setari-site" }] },
  ],
};
