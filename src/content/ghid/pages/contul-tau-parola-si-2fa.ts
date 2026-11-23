import type { GhidPage } from "@/lib/ghid/types";

export const contulTauPage: GhidPage = {
  slug: "contul-tau-parola-si-2fa",
  title: "Securitatea contului",
  lead: "2FA, cheile de acces și parola contului tău.",
  blocks: [
    { t: "p", text: "În meniu, la **Sistem**, deschide **Securitate**. Pagina se referă la contul cu care ești conectat." },
    { t: "h2", text: "Activează 2FA" },
    {
      t: "steps",
      steps: [
        {
          text: "La **2FA** alege **Aplicație de autentificare** sau **Cod pe e-mail** și apasă **Activează**.",
          shot: "securitate",
          marks: ["activeaza"],
        },
        {
          text: "Cu aplicația: scanează codul QR (sau scrie cheia de sub el), scrie **Cod din aplicație** (1) și apasă **Activează** (2).",
          shot: "securitate-2fa",
          marks: ["cod", "confirma"], numbered: true,
        },
        { text: "Cu e-mailul: completează **Cod din e-mail** cu codul primit pe adresa contului." },
        { text: "După activarea primei metode apar **Coduri de rezervă**. Apasă **Descarcă** sau **Copiază**, apoi **Gata**." },
      ],
    },
    { t: "warn", text: "Codurile de rezervă nu se mai arată după **Gata**. Fiecare cod se poate folosi o singură dată." },
    { t: "p", text: "Pentru coduri noi apasă **Generează coduri noi**; cele vechi devin invalide. **Oprește** dezactivează o metodă; la ultima metodă, fereastra anunță că se șterg și codurile de rezervă." },
    { t: "h2", text: "Cheie de acces" },
    {
      t: "steps",
      steps: [
        { text: "La **Chei de acces** apasă **Creează o cheie de acces**.", shot: "securitate", marks: ["cheie"] },
        { text: "Dacă apare **Confirmă din nou ca să continui.**, scrie parola sau codul cerut și apasă **Confirmă**." },
        { text: "Urmează pașii ceruți de telefon sau de calculator (amprentă, recunoaștere facială sau cod). Cheia apare în listă, cu **Redenumește** și **Șterge**. Sunt permise cel mult 10 chei." },
      ],
    },
    { t: "p", text: "Cheia de acces este o metodă de intrare fără parolă: pe pagina de intrare apasă **Folosește cheia de acces**. Nu este o metodă 2FA." },
    { t: "h2", text: "Schimbă parola" },
    {
      t: "steps",
      steps: [
        { text: "La **Parolă** scrie **Parola actuală** și **Parola nouă**.", shot: "securitate", marks: ["schimba-parola"] },
        { text: "Apasă **Schimbă parola**. Apare **Parolă schimbată.**" },
      ],
    },
    { t: "p", text: "Mai jos, **Google** arată dacă contul este legat de Google, iar **Dispozitive** listează dispozitivele conectate, fiecare cu **Deconectează**." },
    { t: "p", text: "Dacă ai pierdut accesul la 2FA, un Super Admin îți poate reseta 2FA la **Administratori**, în aceeași pagină. Nu îți poți reseta singur 2FA." },
    { t: "links", items: [{ slug: "intra-in-panou" }, { slug: "siguranta" }] },
  ],
};
