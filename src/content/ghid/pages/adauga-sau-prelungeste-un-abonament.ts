import type { GhidPage } from "@/lib/ghid/types";

export const abonamentPage: GhidPage = {
  slug: "adauga-sau-prelungeste-un-abonament",
  title: "Adaugă sau prelungește un abonament",
  lead: "Un abonament nou se adaugă sportivului, iar cele active ale școlii se prelungesc dintr-o mișcare.",
  blocks: [
    { t: "h2", text: "Adaugă un abonament" },
    {
      t: "steps",
      steps: [
        { text: "Deschide **Contabilitate**, tabul **Abonamente**. Apasă **+ Abonament**.", shot: "abonamente-lista", marks: ["adauga"] },
        { text: "La **Sportiv** caută și alege sportivul. Se deschide **Adaugă abonament**, cu numele lui." },
        {
          text: "La **Abonament** alege din listă. Fiecare rând arată prețul, de membru sau de neafiliat.",
          shot: "abonament-adauga", marks: ["abonament"],
        },
        {
          text: "Verifică **Data de start**. **Expiră (estimat)** se schimbă după ea.",
          shot: "abonament-adauga", marks: ["start"],
        },
        {
          text: "Bifează **Înregistrează plata acum** dacă părintele plătește pe loc. Apar **Sumă**, **Metodă** și **Încasat la patinoar**.",
          shot: "abonament-adauga", marks: ["plata"],
        },
        {
          text: "Apasă **Adaugă abonament**. Jos apare **Abonament adăugat** sau, cu plată, **Abonament și plată înregistrate**, cu **Anulează** timp de 8 secunde.",
          shot: "abonament-adauga", marks: ["adauga"],
        },
      ],
    },
    {
      t: "p",
      text: "Același **Adaugă abonament** se deschide și din **...** de pe rândul sportivului din **Prezență** (doar la grupele școlii) și din fișa sportivului, la tabul **Grupe și abonament**, cu **+ Adaugă abonament**. Sportivul e deja ales.",
    },
    {
      t: "p",
      text: "Dacă sportivul are prezențe fără abonament, apare **Acoperă prezențe fără abonament**. Bifezi rândurile pe care le acoperă abonamentul nou.",
    },
    { t: "warn", text: "Abonamentul păstrează prețul din ziua în care a fost adăugat. O schimbare în **Prețuri** se aplică doar abonamentelor noi." },
    { t: "h2", text: "Prelungește abonamentele" },
    {
      t: "steps",
      steps: [
        { text: "În tabul **Abonamente** apasă **Prelungește abonamentele**.", shot: "abonamente-lista", marks: ["prelungeste"] },
        {
          text: "La **Număr de săptămâni** scrie de la 1 la 12. Sub câmp scrie câte abonamente se prelungesc.",
          shot: "abonament-prelungeste", marks: ["saptamani"],
        },
        {
          text: "Apasă butonul de confirmare, de exemplu **Prelungește 3 abonamente**. Jos apare **3 abonamente prelungite cu 1 săptămână.**, cu **Anulează** timp de 8 secunde.",
          shot: "abonament-prelungeste", marks: ["confirma"],
        },
      ],
    },
    { t: "warn", text: "Prelungirea se aplică tuturor abonamentelor active ale Școlii de patinaj, nu unei selecții." },
    { t: "links", items: [{ slug: "contabilitate-pe-scurt" }, { slug: "inregistreaza-o-plata" }, { slug: "preturi" }] },
  ],
};
