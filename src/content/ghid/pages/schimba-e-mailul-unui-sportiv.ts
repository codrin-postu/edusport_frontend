import type { GhidPage } from "@/lib/ghid/types";

export const schimbaEmailulSportivPage: GhidPage = {
  slug: "schimba-e-mailul-unui-sportiv",
  title: "Schimbă e-mailul unui sportiv",
  lead: "Când schimbi e-mailul de pe fișă, accesul vechi la portal se oprește și noul e-mail primește o invitație.",
  blocks: [
    {
      t: "steps",
      steps: [
        { text: "Deschide fișa sportivului, tabul **Date**, și apasă **Editează**." },
        { text: "Schimbă **E-mail** și apasă **Salvează**." },
        { text: "La cardul **Acces portal** apare noua adresă, cu starea **INVITAT**." },
      ],
    },
    { t: "h2", text: "Ce se întâmplă" },
    {
      t: "list",
      items: [
        "Sportivul avea acces: accesul la vechiul e-mail se oprește imediat. Părintele vechi vede **Nu mai ai acces la acest sportiv.**",
        "Noul e-mail nu are cont: se creează unul și pleacă invitația.",
        "Noul e-mail are deja cont activ: sportivul se adaugă în acel cont, cu mesajul **Acces nou în portalul EduSport**.",
        "Noul e-mail aparține unui cont dezactivat: schimbarea se refuză.",
        "Sportivul nu avea acces: nu se creează nimic. Invitația se dă separat.",
      ],
    },
    { t: "p", text: "Contul vechi rămâne activ, cu ceilalți copii ai lui. Același lucru se întâmplă când e-mailul se schimbă la confirmare, la unirea a două fișe sau la anularea unei acțiuni." },
    { t: "p", text: "Părintele nu își poate schimba e-mailul din portal." },
    {
      t: "warn",
      text: "Dacă e-mailul schimbat este al unui antrenor, schimbă-l din blocul **Cont portal** al membrului echipei: toți copiii din cont îl urmează, dacă aveau pe fișă vechea adresă.",
    },
    {
      t: "links",
      items: [{ slug: "schimba-datele-unui-sportiv" }, { slug: "cum-functioneaza-contul-de-parinte" }, { slug: "acces-antrenor-in-portal" }],
    },
  ],
};
