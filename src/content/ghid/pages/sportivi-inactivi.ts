import type { GhidPage } from "@/lib/ghid/types";

export const sportiviInactiviPage: GhidPage = {
  slug: "sportivi-inactivi",
  title: "Sportivi inactivi",
  lead: "Panoul arată câți sportivi sunt inactivi de peste N ani. Nimic nu se anonimizează singur.",
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
      text: "Un sportiv e inactiv când ultimul sezon cu activitate e cu cel puțin atâția ani în urmă. Activitate înseamnă grupă, înscriere, prezență, lecție, plată sau abonament. Fără nicio activitate, contează vechimea fișei.",
    },
    { t: "h2", text: "Avertizarea de pe Acasă" },
    {
      t: "p",
      text: "Pe **Acasă** apare **N sportivi inactivi de peste 5 ani.**, cu **Vezi lista**. Super Admin poate apăsa **Ascunde până la sezonul următor**.",
    },
    { t: "h2", text: "Anonimizează din listă" },
    {
      t: "steps",
      steps: [
        { text: "În **Sportivi** apasă **Filtre**, la **Date personale** bifează **Inactivi de peste 5 ani**.", shot: "date-inactivi", marks: ["inactivi"] },
        { text: "Super Admin vede casete și butonul **Anonimizează (k)**. Bifează sportivii și apasă butonul." },
        { text: "Confirmă în **Anonimizezi datele pentru k sportivi?**. La final apare **k sportivi anonimizați.** și, dacă e cazul, **Sărite: n.** sau **Nereușite: n.**" },
      ],
    },
    { t: "warn", text: "Anonimizarea nu se poate anula. Fiecare sportiv se face separat: o greșeală la unul nu oprește ceilalți." },
    { t: "links", items: [{ slug: "ce-ramane-dupa-anonimizare" }, { slug: "anonimizeaza-un-sportiv" }] },
  ],
};
