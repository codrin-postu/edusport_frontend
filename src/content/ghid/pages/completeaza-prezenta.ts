import type { GhidPage } from "@/lib/ghid/types";

export const completeazaPrezentaPage: GhidPage = {
  slug: "completeaza-prezenta",
  title: "Completează prezența",
  lead: "Din Prezență bifezi cine a venit la fiecare ședință.",
  blocks: [
    {
      t: "steps",
      steps: [
        {
          text: "Deschide **Prezență**, în meniu, la **Club și școală**. **De completat** listează ședințele fără prezență, **Toate ședințele** arată săptămâna, **Tabel pe grupă** arată o lună pe grupă.",
          shot: "prezenta-lista",
        },
        { text: "Alege **Zi**, **Săptămână** sau **Lună** și treci la alt interval cu săgețile. **Filtre** restrânge după secțiune și grupă. Starea e **Completat**, **Necompletat** sau **Urmează**." },
        { text: "Apasă pe ședință. Panoul arată data, **Antrenor** și lista sportivilor.", shot: "prezenta-panou" },
        { text: "Bifează **Grup** la fiecare sportiv prezent. Jos, contorul arată câți sunt prezenți din câți sunt pe listă, de exemplu 0 din 18 prezenți." },
        { text: "Verifică **Antrenor**: trebuie ales cel puțin unul. **+ Adaugă alți antrenori** adaugă un rând." },
        { text: "Apasă **Salvează**. Apare mesajul Prezență salvată, cu grupa și data." },
      ],
    },
    {
      t: "p",
      text: "La grupele de club apare și coloana **Uscat**. Sub numele fiecărui sportiv scrie abonamentul lui, de exemplu **5 ședințe rămase**, sau **Fără abonament**. **...** de pe rând are **+ Plată** și, la grupele școlii, **Adaugă abonament**.",
    },
    {
      t: "warn",
      text: "Prezențele intră în calculul plăților sportivului. Verifică lista înainte de **Salvează**.",
    },
    { t: "h2", text: "Sportiv din altă grupă" },
    {
      t: "p",
      text: "**+ Adaugă doar la ședința asta** adaugă un sportiv din altă grupă, numai pentru ședința aceasta. Se caută după nume.",
    },
    { t: "h2", text: "Ședință care nu e în program" },
    {
      t: "steps",
      steps: [
        { text: "Apasă **+ Ședință nouă**. Alege **Grupă**, **Data** și **Ora**, toate obligatorii. **Durată** vine 50 min. Alege **Antrenor**.", shot: "prezenta-noua" },
        { text: "Apasă **Continuă**. Se deschide panoul, ca la o ședință obișnuită." },
      ],
    },
    {
      t: "p",
      text: "Dacă ședința există deja, fereastra spune **Există deja o ședință salvată** și oferă **Deschide prezența salvată** sau **Adaugă încă o ședință în ziua asta**. Un sportiv inactiv bifat aduce întrebarea **Reactivezi?**, cu **Salvează fără** și **Reactivează și salvează**.",
    },
    {
      t: "p",
      text: "Dacă închizi panoul cu modificări nesalvate, întreabă **Închizi fără să salvezi?**. **Rămâi** te lasă să salvezi. Antrenorii pot completa prezența și din portalul antrenorului, de la **Azi**.",
    },
    { t: "links", items: [{ slug: "corecteaza-o-prezenta" }, { slug: "grupele" }] },
  ],
};
