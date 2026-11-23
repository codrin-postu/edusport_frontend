import type { GhidPage } from "@/lib/ghid/types";

export const sportiviInactiviPage: GhidPage = {
  slug: "sportivi-inactivi",
  title: "Sportivi inactivi",
  lead: "Panoul arată sportivii inactivi de un număr de ani stabilit în setări. Anonimizarea nu se face automat.",
  blocks: [
    { t: "h2", text: "Limita de ani" },
    {
      t: "steps",
      steps: [
        { text: "Deschide **Setări site**. La cardul **Date personale** schimbă **Ani până la anonimizare** (între 1 și 20). Valoarea implicită este 5.", shot: "date-setari", marks: ["limita"] },
        { text: "Apasă **Salvează**." },
      ],
    },
    {
      t: "p",
      text: "Un sportiv este inactiv când ultimul sezon cu activitate este cu cel puțin atâția ani în urmă. Activitate înseamnă grupă, înscriere, prezență, lecție, plată sau abonament; fără nicio activitate, contează vechimea fișei. Această stare nu are legătură cu **Marchează inactiv** din fișă.",
    },
    { t: "h2", text: "Avertizarea de pe pagina Acasă" },
    {
      t: "p",
      text: "Pe **Acasă** apare de exemplu **3 sportivi inactivi de peste 5 ani.**, cu **Vezi lista**. Numărul de ani urmează setarea de mai sus. Super Admin poate apăsa **Ascunde până la sezonul următor**.",
    },
    { t: "h2", text: "Anonimizează din listă" },
    {
      t: "steps",
      steps: [
        { text: "În **Sportivi** apasă **Filtre**, la **Date personale** bifează **Inactivi de peste 5 ani** (numărul urmează setarea).", shot: "date-inactivi", marks: ["inactivi"] },
        { text: "Super Admin vede casete de selectare și butonul **Anonimizează (2)**, cu numărul sportivilor bifați. Bifează sportivii și apasă butonul." },
        { text: "Confirmă în **Anonimizezi datele pentru 2 sportivi?**. La final apare **2 sportivi anonimizați.** și, dacă este cazul, **Sărite: 1.** sau **Nereușite: 1.**" },
      ],
    },
    { t: "warn", text: "Anonimizarea nu se poate anula. Fiecare sportiv se procesează separat: o eroare la unul nu îi oprește pe ceilalți." },
    { t: "links", items: [{ slug: "ce-ramane-dupa-anonimizare" }, { slug: "anonimizeaza-un-sportiv" }, { slug: "setari-site" }] },
  ],
};
