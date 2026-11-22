import type { GhidPage } from "@/lib/ghid/types";

export const completeazaPrezentaPage: GhidPage = {
  slug: "completeaza-prezenta",
  title: "Completează prezența",
  lead: "Din Prezență bifezi cine a venit la fiecare ședință.",
  blocks: [
    {
      t: "list",
      items: [
        "**De completat**: ședințele care așteaptă prezența.",
        "**Toate ședințele**: ședințele unei zile, săptămâni sau luni, cu starea fiecăreia.",
        "**Tabel pe grupă**: prezența unei grupe pe o lună.",
      ],
    },
    {
      t: "steps",
      steps: [
        { text: "Deschide **Prezență**, în meniu, la **Club și școală**. În **De completat** sunt ședințele care așteaptă prezența.", shot: "prezenta-de-completat", marks: ["tab-de-completat"] },
        {
          text: "Altă ședință găsești în **Toate ședințele**: alege **Zi**, **Săptămână** sau **Lună** și restrânge cu **Filtre**.",
          shot: "prezenta-lista", marks: ["tab-toate", "perioada", "filtre"],
        },
        { text: "Apasă pe ședință. Panoul arată data, **Antrenor** și lista sportivilor.", shot: "prezenta-panou", marks: ["antrenor", "lista"] },
        { text: "Bifează **Grup** la fiecare sportiv prezent. Jos, contorul arată câți sunt prezenți din câți sunt pe listă, de exemplu 0 din 11 prezenți.", shot: "prezenta-panou", marks: ["grup"] },
        { text: "La grupele de club apare și **Uscat**, pentru antrenamentul uscat. Un sportiv bifat la **Uscat** se numără prezent, ca la **Grup**. La grupele școlii coloana lipsește.", shot: "prezenta-panou", marks: ["uscat"] },
        { text: "Verifică **Antrenor**: trebuie ales cel puțin unul. **+ Adaugă alți antrenori** adaugă un rând.", shot: "prezenta-panou", marks: ["antrenor"] },
        { text: "Apasă **Salvează**. Apare mesajul Prezență salvată, cu grupa și data.", shot: "prezenta-panou", marks: ["salveaza"] },
      ],
    },
    {
      t: "p",
      text: "Starea unei ședințe este **Completat**, **Necompletat** sau **Urmează**. Sub numele fiecărui sportiv scrie abonamentul lui, de exemplu **5 ședințe rămase**, sau **Fără abonament**. **...** de pe rând are **+ Plată** și, la grupele școlii, **Adaugă abonament**.",
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
    { t: "h2", text: "Sportiv inactiv și panou închis" },
    {
      t: "p",
      text: "Un sportiv inactiv bifat aduce întrebarea **Reactivezi?**, cu **Salvează fără** și **Reactivează și salvează**.",
    },
    {
      t: "p",
      text: "Dacă închizi panoul cu modificări nesalvate, întreabă **Închizi fără să salvezi?**. **Rămâi** te lasă să salvezi.",
    },
    { t: "links", items: [{ slug: "adauga-o-sedinta-in-afara-programului" }, { slug: "corecteaza-o-prezenta" }, { slug: "lectii-individuale" }] },
  ],
};
