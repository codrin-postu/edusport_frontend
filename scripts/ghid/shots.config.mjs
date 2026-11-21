// Screenshot and recording entries for the wiki. One entry per image.
//
//   id        file name: content/ghid/img/<id>.jpg, and the id a Step's `shot` field uses
//   path      admin or portal path, opened on --base
//   alt       image description (Romanian, terse)
//   viewport  default 1280x760; phone shots use { width: 390, height: 844 }
//   act       optional async (page) => {}: runs after the page loads, before the shot (and is the recording with --video)
//   marks     [{ key, selector }]: boxes drawn over the first element matching the selector; a step's `marks` names the keys it shows
//
// Test data only (invented names). Never point --base at production.
export const SHOTS = [
  {
    id: "contabilitate-plati",
    path: "/admin/plugins/edusport-contabilitate?tab=plati",
    alt: "Lista plăților din Contabilitate, cu butonul + Plată sus",
    marks: [{ key: "plata", selector: "button:has-text('+ Plată')" }],
  },
  {
    id: "primii-login",
    path: "/login",
    alt: "Pagina de intrare în panou, cu E-mail, Parolă și butonul Intră",
    act: async(page) => {
      await page.context().clearCookies();
      await page.goto(new URL("/login", page.url()).toString(), { waitUntil: "networkidle" });
      // Headless Chromium tries the passkey autofill and shows a refusal; a person's browser shows none.
      await page.waitForTimeout(1500);
      await page.evaluate(() => {
        for (const el of document.querySelectorAll("*")) {
          if (el.children.length === 0 && el.textContent?.trim() === "Nu am putut folosi cheia de acces.") el.closest(".ui-notice")?.remove();
        }
      });
    },
    marks: [
      { key: "email", selector: "input[type=email]" },
      { key: "parola", selector: "input[type=password]" },
      { key: "intra", selector: "button:text-is('Intră')" },
      { key: "uitat", selector: "text=Am uitat parola" },
    ],
  },
  {
    id: "primii-meniu",
    path: "/admin",
    alt: "Panoul de administrare cu meniul din stânga, grupa Club și școală deschisă",
    act: async(page) => {
      await page.locator("button.esd-grp-btn:visible", { hasText: "Club și școală" }).click();
      await page.waitForTimeout(600);
    },
    marks: [
      { key: "club-scoala", selector: "button.esd-grp-btn:visible:has-text('Club și școală')" },
      { key: "strapi", selector: "button.esd-switch" },
    ],
  },
  {
    id: "acasa-panou",
    path: "/admin",
    viewport: { width: 1280, height: 900 },
    alt: "Pagina Acasă, cu Ce e nou, comutatorul Înscrieri pe site și Acțiuni rapide",
    marks: [
      { key: "ce-e-nou", selector: "text=Ce e nou" },
      { key: "inscrieri", selector: "[aria-label='Comută înscrierile']" },
      { key: "actiuni", selector: "text=Acțiuni rapide" },
    ],
  },
  {
    id: "sezoane-lista",
    path: "/admin/plugins/edusport-sezoane",
    alt: "Pagina Sezoane, cu lista sezoanelor și butonul Sezon nou",
    marks: [{ key: "sezon-nou", selector: "button:has-text('Sezon nou')" }],
  },
  {
    id: "securitate",
    path: "/admin/plugins/edusport-securitate",
    viewport: { width: 1280, height: 900 },
    alt: "Pagina Securitate, cu 2FA, Chei de acces și Parolă",
    marks: [
      { key: "activeaza", selector: "button:text-is('Activează')" },
      { key: "cheie", selector: "button:text-is('Creează o cheie de acces')" },
      { key: "schimba-parola", selector: "button:text-is('Schimbă parola')" },
    ],
  },
  {
    id: "securitate-2fa",
    path: "/admin/plugins/edusport-securitate",
    viewport: { width: 1280, height: 900 },
    alt: "Pornirea 2FA cu aplicație, cu codul de scanat și câmpul Cod din aplicație",
    act: async(page) => {
      await page.getByRole("button", { name: "Activează" }).first().click();
      await page.waitForTimeout(1500);
    },
    marks: [
      { key: "cod", selector: "text=Cod din aplicație >> xpath=following::input[1]" },
      { key: "confirma", selector: "text=Cod din aplicație >> xpath=following::button[normalize-space()='Activează'][1]" },
    ],
  },
  {
    id: "primii-telefon",
    path: "/admin",
    viewport: { width: 390, height: 844 },
    alt: "Panoul pe telefon, cu butonul de meniu în dreapta sus",
    marks: [{ key: "meniu", selector: "[aria-label='Deschide meniul']" }],
  },
  {
    id: "primii-telefon-meniu",
    path: "/admin",
    viewport: { width: 390, height: 844 },
    alt: "Meniul Navigare pe telefon, cu grupele de pagini",
    act: async(page) => {
      await page.locator("[aria-label='Deschide meniul']").click();
      await page.waitForTimeout(800);
      await page.evaluate(() => (document.activeElement instanceof HTMLElement ? document.activeElement.blur() : null));
      await page.mouse.move(20, 300);
      await page.waitForTimeout(500);
    },
    marks: [{ key: "sportivi", selector: "a:text-is('Sportivi'), button:text-is('Sportivi')" }],
  },
  {
    id: "plati-form",
    path: "/admin/plugins/edusport-contabilitate?tab=plati",
    alt: "Fereastra Plată nouă, cu Sportiv, Pentru, Sumă, Data și Metodă",
    act: async(page) => {
      await page.getByRole("button", { name: "+ Plată" }).first().click();
      await page.waitForTimeout(1200);
    },
    marks: [
      { key: "cauta", selector: "input[placeholder='Caută sportiv']" },
      { key: "pentru", selector: "xpath=(//*[starts-with(normalize-space(text()),'Pentru')])[last()]/following::button[1]" },
    ],
  },
  {
    id: "plati-meniu",
    path: "/admin/plugins/edusport-contabilitate?tab=plati",
    alt: "Meniul ... al unei plăți, cu Editează și Anulează plata",
    act: async(page) => {
      await page.locator("button:has-text('...')").first().click();
      await page.waitForTimeout(600);
    },
    marks: [
      { key: "meniu", selector: "button:has-text('...')" },
      { key: "anuleaza-plata", selector: "[role=menuitem]:has-text('Anulează plata')" },
    ],
  },
  {
    id: "plati-confirma",
    path: "/admin/plugins/edusport-contabilitate?tab=plati",
    alt: "Fereastra Anulează plata, cu textul de confirmare",
    act: async(page) => {
      await page.locator("button:has-text('...')").first().click();
      await page.getByRole("menuitem", { name: "Anulează plata" }).click();
      await page.waitForTimeout(800);
    },
    marks: [{ key: "anuleaza-plata", selector: "[role=dialog] button:text-is('Anulează plata'), [role=alertdialog] button:text-is('Anulează plata')" }],
  },
  {
    id: "preturi-liste",
    path: "/admin/plugins/edusport-preturi",
    alt: "Prețuri, cu secțiunile sus și listele de prețuri ale unei secțiuni",
    marks: [
      { key: "club", selector: "[role=tab]:has-text('Club'), button:text-is('Club')" },
    ],
  },
  {
    id: "preturi-editare",
    path: "/admin/plugins/edusport-preturi",
    alt: "Panoul unui preț, cu Preț membri, Preț neafiliați și Salvează",
    act: async(page) => {
      await page.getByText("Abonament 6 ședințe grup").first().click();
      await page.waitForTimeout(1000);
    },
    marks: [
      { key: "pret", selector: "xpath=//*[starts-with(normalize-space(text()),'Preț membri')]/following::input[1]" },
      { key: "salveaza", selector: "button:text-is('Salvează')" },
    ],
  },
  {
    id: "formulare-hub",
    path: "/admin/plugins/edusport-formulare",
    alt: "Pagina Formulare, cu cele patru formulare, numărul de noi și butoanele Rezultate și Vezi mesajele",
    marks: [
      { key: "noi", selector: ".fm-counts" },
      { key: "vezi", selector: "button:text-is('Vezi mesajele')" },
    ],
  },
  {
    id: "inscrieri-lista",
    path: "/admin/plugins/edusport-inscrieri",
    alt: "Lista Înscrieri cu marcajul noi lângă titlu, un rând selectat și panoul înscrierii în dreapta",
    marks: [
      { key: "eticheta", selector: ".sbt-newtag" },
      { key: "cauta", selector: "input[placeholder*='telefon']" },
      { key: "status", selector: "button:has-text('Status')" },
      { key: "nume", selector: "tbody tr:first-child td.ins-name" },
    ],
  },
  {
    id: "inscrieri-contact",
    path: "/admin/plugins/edusport-inscrieri",
    alt: "Fereastra cu numărul de telefon, mesajul de editat, Status și butoanele Închide, SMS și WhatsApp",
    act: async(page) => {
      await page.locator("button:has-text('Contactează')").first().click();
      await page.waitForTimeout(900);
    },
    marks: [
      { key: "mesaj", selector: "[role=dialog] textarea" },
      { key: "sms", selector: "[role=dialog] button:text-is('SMS')" },
      { key: "whatsapp", selector: "[role=dialog] button:text-is('WhatsApp')" },
    ],
  },
  {
    id: "inscrieri-confirma",
    path: "/admin/plugins/edusport-inscrieri",
    alt: "Fereastra Confirmă înscrierea, cu Sportiv existent și Sportiv nou, Grupa, Membru A.C.S. și butonul Confirmă înscrierea",
    act: async(page) => {
      await page.locator("tbody tr:has-text('2026-0008') td.ins-name").click();
      await page.waitForTimeout(700);
      await page.locator("button:text-is('Confirmă înscrierea')").first().click();
      await page.waitForTimeout(1500);
    },
    marks: [
      { key: "existent", selector: "[role=dialog] label:has-text('Sportiv existent')" },
      { key: "nou", selector: "[role=dialog] label:has-text('Sportiv nou')" },
      { key: "compara", selector: "[role=dialog] button:has-text('Compară și actualizează')" },
      { key: "cauta-alt", selector: "[role=dialog] button:has-text('Caută alt sportiv')" },
      { key: "grupa", selector: "[role=dialog] .ins-fl" },
      { key: "acs", selector: "[role=dialog] .ins-acs" },
      { key: "confirma-inscrierea", selector: "[role=dialog] button:text-is('Confirmă înscrierea')" },
    ],
  },
  {
    id: "inscrieri-panou-meniu",
    path: "/admin/plugins/edusport-inscrieri",
    alt: "Meniul ... al înscrierii, cu Mută la altă școală și Șterge înscrierea",
    act: async(page) => {
      await page.locator(".ins-ph button:has-text('...')").first().click();
      await page.waitForTimeout(600);
    },
    marks: [
      { key: "meniu", selector: ".ins-ph button:has-text('...')" },
      { key: "muta-la", selector: "[role=menuitem]:has-text('Mută la altă școală')" },
    ],
  },
  {
    id: "inscrieri-selectie",
    path: "/admin/plugins/edusport-inscrieri",
    alt: "Bara de selecție cu Sezon destinație, Mută în sezon, Mută la altă școală, Arhivează și Șterge",
    act: async(page) => {
      await page.locator("tbody tr").nth(1).locator("input[type=checkbox]").check();
      await page.waitForTimeout(600);
    },
    marks: [
      { key: "sezon", selector: ".sbt-bulk .ui-select, .sbt-bulk [aria-label='Sezon destinație']" },
      { key: "muta-in", selector: ".sbt-bulk button:text-is('Mută în sezon')" },
    ],
  },
  {
    id: "inscrieri-arhiveaza",
    path: "/admin/plugins/edusport-inscrieri",
    alt: "Bara de selecție, cu butonul Arhivează",
    act: async(page) => {
      await page.locator("tbody tr").nth(1).locator("input[type=checkbox]").check();
      await page.waitForTimeout(600);
    },
    marks: [
      { key: "arhiveaza", selector: ".sbt-bulk button:text-is('Arhivează')" },
      { key: "sterge", selector: ".sbt-bulk button:text-is('Șterge')" },
    ],
  },
  {
    id: "inscrieri-tot-sezonul",
    path: "/admin/plugins/edusport-inscrieri",
    alt: "Fereastra Mută tot sezonul, cu Din sezonul, În sezonul și Doar înscrierile arhivate",
    act: async(page) => {
      await page.locator(".sbt-season button:text-is('...')").first().click();
      await page.getByRole("menuitem", { name: "Mută tot sezonul..." }).click();
      await page.waitForTimeout(800);
    },
    marks: [
      { key: "sezon", selector: "[role=dialog] button:has-text('Alege sezonul...')" },
      { key: "muta", selector: "[role=dialog] button:text-is('Mută')" },
    ],
  },
  {
    id: "inscrieri-export",
    path: "/admin/plugins/edusport-inscrieri",
    alt: "Meniul Export, cu Descarcă CSV și Formulare goale: Acord și Cerere de adeziune",
    act: async(page) => {
      await page.getByRole("button", { name: "Export" }).click();
      await page.waitForTimeout(600);
    },
    marks: [
      { key: "export", selector: "button:has-text('Export')" },
      { key: "descarca-csv", selector: "[role=menuitem]:has-text('Descarcă CSV')" },
      { key: "acord-pdf", selector: "[role=menuitem]:has-text('Acord (PDF)')" },
      { key: "cerere", selector: "[role=menuitem]:has-text('Cerere de adeziune (PDF)')" },
    ],
  },
  {
    id: "inscrieri-tel-meniu",
    path: "/admin/plugins/edusport-inscrieri",
    viewport: { width: 390, height: 844 },
    alt: "Înscrieri pe telefon, cu meniul ... deschis: Selectează și Mută tot sezonul",
    act: async(page) => {
      await page.locator(".sbt-season button:text-is('...')").first().click();
      await page.waitForTimeout(600);
    },
    marks: [{ key: "selecteaza", selector: "[role=menuitem]:text-is('Selectează')" }],
  },
  {
    id: "inscrieri-tel-selectie",
    path: "/admin/plugins/edusport-inscrieri",
    viewport: { width: 390, height: 844 },
    alt: "Lista pe telefon în selecție: o înscriere bifată, Toate și Gata sus, Mută, Arhivează și Șterge jos",
    act: async(page) => {
      await page.locator(".sbt-season button:text-is('...')").first().click();
      await page.getByRole("menuitem", { name: "Selectează" }).click();
      await page.waitForTimeout(500);
      await page.locator("text=Luca Popa").first().click();
      await page.waitForTimeout(500);
    },
    marks: [
      { key: "card", selector: ".sbt-card--on" },
      { key: "toate", selector: ".ui-ph-actions button:text-is('Toate')" },
      { key: "gata", selector: ".ui-ph-actions button:text-is('Gata')" },
      { key: "muta", selector: ".sbt-pselbar button:text-is('Mută...')" },
      { key: "arhiveaza", selector: ".sbt-pselbar button:text-is('Arhivează')" },
      { key: "sterge", selector: ".sbt-pselbar button:text-is('Șterge')" },
    ],
  },
  {
    id: "inscrieri-tel-muta",
    path: "/admin/plugins/edusport-inscrieri",
    viewport: { width: 390, height: 844 },
    alt: "Fereastra Mută 1 înscriere, cu Sezon destinație și Alege școala",
    act: async(page) => {
      await page.locator(".sbt-season button:text-is('...')").first().click();
      await page.getByRole("menuitem", { name: "Selectează" }).click();
      await page.waitForTimeout(500);
      await page.locator("text=Luca Popa").first().click();
      await page.getByRole("button", { name: "Mută..." }).click();
      await page.waitForTimeout(800);
    },
    marks: [
      { key: "muta-in", selector: "button:text-is('Mută în sezon')" },
      { key: "muta-la", selector: "button:text-is('Mută la altă școală')" },
    ],
  },
  {
    id: "sportivi-lista",
    path: "/admin/plugins/edusport-sportivi",
    alt: "Lista Sportivi, cu căutarea, Sezon, Filtre și butonul Adaugă sportiv",
    marks: [
      { key: "sezon", selector: "button:has-text('Sezon 20')" },
      { key: "cauta", selector: "input[placeholder^='Nume, telefon']" },
      { key: "filtre", selector: "button:has-text('Filtre')" },
      { key: "adauga-sportiv", selector: "button:has-text('Adaugă sportiv')" },
    ],
  },
  {
    id: "sportivi-adauga",
    path: "/admin/plugins/edusport-sportivi",
    alt: "Fereastra Adaugă sportiv, cu căutarea Caută sportiv și rândul Sportiv nou sub rezultate",
    act: async(page) => {
      await page.getByRole("button", { name: "Adaugă sportiv" }).click();
      await page.getByPlaceholder("Caută sportiv").fill("Ana Gh");
      await page.locator(".spv-result:has-text('Sportiv nou')").waitFor();
      await page.waitForTimeout(600);
    },
    marks: [
      { key: "cauta", selector: "input[placeholder='Caută sportiv']" },
      { key: "nou", selector: ".spv-result:has-text('Sportiv nou')" },
    ],
  },
  {
    id: "sportivi-adauga-formular",
    path: "/admin/plugins/edusport-sportivi",
    alt: "Formularul Sportiv nou, cu Nume complet, Data nașterii, Persoana de contact, Telefon, E-mail și butonul Adaugă sportiv",
    act: async(page) => {
      await page.getByRole("button", { name: "Adaugă sportiv" }).click();
      await page.getByPlaceholder("Caută sportiv").fill("Exemplu Nou");
      await page.locator(".spv-result:has-text('Sportiv nou')").click();
      await page.locator(".spv-form").waitFor();
      await page.waitForTimeout(600);
    },
    marks: [
      { key: "campuri", selector: ".spv-form" },
      { key: "adauga", selector: "[role=dialog] button:text-is('Adaugă sportiv')" },
    ],
  },
  {
    id: "sportivi-fisa",
    path: "/admin/plugins/edusport-sportivi",
    alt: "Fișa unui sportiv, cu taburile sus și cardul Date cu butonul Editează",
    act: async(page) => {
      await page.getByText("Ana Georgescu").first().click();
      await page.getByRole("button", { name: "Editează" }).waitFor();
      await page.waitForTimeout(800);
    },
    marks: [
      { key: "taburi", selector: "[role=tablist]" },
      { key: "tab-date", selector: "[role=tab]:text-is('Date')" },
      { key: "editeaza", selector: "button:text-is('Editează')" },
    ],
  },
  {
    id: "sportivi-editare",
    path: "/admin/plugins/edusport-sportivi",
    alt: "Cardul Date în editare, cu câmpurile și butoanele Renunță și Salvează",
    act: async(page) => {
      await page.getByText("Ana Georgescu").first().click();
      await page.getByRole("button", { name: "Editează" }).click();
      await page.waitForTimeout(800);
    },
    marks: [
      { key: "campuri", selector: ".spv-form" },
      { key: "salveaza", selector: "button:text-is('Salvează')" },
      { key: "renunta", selector: "button:text-is('Renunță')" },
    ],
  },
  {
    id: "sportivi-documente",
    path: "/admin/plugins/edusport-sportivi",
    alt: "Tabul Documente, cu PDF-urile înscrierii și butoanele Vezi și Descarcă",
    act: async(page) => {
      await page.getByText("Ana Georgescu").first().click();
      await page.getByRole("tab", { name: "Documente" }).click();
      await page.waitForTimeout(1000);
    },
    marks: [
      { key: "tab-documente", selector: "[role=tab]:has-text('Documente')" },
      { key: "vezi", selector: "button:has-text('Vezi')" },
      { key: "descarca", selector: "button:has-text('Descarcă')" },
    ],
  },
  {
    id: "sportivi-parcurs",
    path: "/admin/plugins/edusport-sportivi",
    alt: "Tabul Parcurs, cu selecția și butonul Acordă sus și insignele pe secțiuni",
    act: async(page) => {
      await page.getByText("Ana Georgescu").first().click();
      await page.getByRole("tab", { name: "Parcurs" }).click();
      await page.waitForTimeout(1500);
    },
    marks: [
      { key: "tab-parcurs", selector: "[role=tab]:has-text('Parcurs')" },
      { key: "selecteaza", selector: "button:has-text('Selectează')" },
      { key: "acorda", selector: "button:text-is('Acordă')" },
    ],
  },
  {
    id: "sportivi-profil",
    path: "/admin/plugins/edusport-sportivi",
    alt: "Tabul Profil public, cu fotografia, adresa, Activ din și comutatorul Vizibilitate pe site",
    act: async(page) => {
      await page.getByText("Andrei Popescu").first().click();
      await page.getByRole("tab", { name: "Profil public" }).click();
      await page.getByText("Vizibilitate pe site").waitFor();
      await page.waitForTimeout(1200);
    },
    marks: [
      { key: "tab-profil", selector: "[role=tab]:has-text('Profil public')" },
      { key: "vizibilitate", selector: "[aria-labelledby=sp-vis-label]" },
    ],
  },
  {
    id: "sportivi-profil-rezultate",
    path: "/admin/plugins/edusport-sportivi",
    alt: "Cardul Rezultate competiții din Profil public, cu căutarea sportivului în skate-results",
    act: async(page) => {
      await page.getByText("Andrei Popescu").first().click();
      await page.getByRole("tab", { name: "Profil public" }).click();
      await page.getByText("Vizibilitate pe site").waitFor();
      await page.locator("input[aria-label='Caută sportiv după nume']").scrollIntoViewIfNeeded();
      await page.mouse.wheel(0, 200);
      await page.waitForTimeout(1000);
    },
    marks: [
      { key: "nume", selector: "input[aria-label='Caută sportiv după nume']" },
      { key: "cauta", selector: ".sp-search button" },
    ],
  },
  {
    id: "sportivi-meniu",
    path: "/admin/plugins/edusport-sportivi",
    alt: "Fișa unui sportiv cu meniul de la butonul ... deschis: Marchează inactiv, Unește cu alt sportiv, Exportă datele, Anonimizează, Șterge sportivul",
    act: async(page) => {
      await page.getByText("Ana Georgescu").first().click();
      await page.getByRole("button", { name: "Mai multe acțiuni" }).click();
      await page.getByRole("menuitem", { name: "Unește cu alt sportiv" }).waitFor();
      await page.waitForTimeout(500);
    },
    marks: [
      { key: "meniu", selector: "button:has-text('Mai multe acțiuni')" },
      { key: "uneste", selector: "[role=menuitem]:text-is('Unește cu alt sportiv')" },
      { key: "inactiv", selector: "[role=menuitem]:text-is('Marchează inactiv')" },
      { key: "sterge", selector: "[role=menuitem]:text-is('Șterge sportivul')" },
    ],
  },
  {
    id: "sportivi-unire",
    path: "/admin/plugins/edusport-sportivi",
    alt: "Fereastra Unește cu alt sportiv, cu cele două fișe una lângă alta, bifa Rămâne și alegerea valorii pe fiecare rând",
    act: async(page) => {
      await page.getByText("Ana Georgescu").first().click();
      await page.getByRole("button", { name: "Mai multe acțiuni" }).click();
      await page.getByRole("menuitem", { name: "Unește cu alt sportiv" }).click();
      await page.getByPlaceholder("Caută sportiv").fill("Ana Gh");
      await page.locator(".spv-result").first().click();
      await page.locator(".spv-merge").waitFor();
      await page.waitForTimeout(800);
    },
    marks: [
      { key: "ramane", selector: ".spv-merge thead label:has-text('Rămâne')" },
      { key: "randuri", selector: ".spv-merge tbody" },
      { key: "uneste", selector: "[role=dialog] button:text-is('Unește')" },
    ],
  },
  {
    id: "grupe-lista",
    path: "/admin/plugins/edusport-grupe",
    alt: "Lista grupelor din Grupe, cu sezonul, secțiunile și butonul Grupă nouă",
    act: async(page) => {
      await page.waitForTimeout(1500);
    },
    marks: [
      { key: "sezon", selector: "button:has-text('Sezon 20')" },
      { key: "grupa-noua", selector: "button:has-text('Grupă nouă')" },
      { key: "grupa", selector: "td:has-text('Avansați Gold')" },
    ],
  },
  {
    id: "grupe-noua",
    path: "/admin/plugins/edusport-grupe",
    alt: "Fereastra Grupă nouă, cu Nume, Listă de prețuri, Antrenori și Program public",
    act: async(page) => {
      await page.getByRole("button", { name: "Grupă nouă" }).first().click();
      await page.waitForTimeout(1200);
    },
    marks: [
      { key: "nume", selector: "[role=dialog] input:not([type=checkbox])" },
      { key: "creeaza-grupa", selector: "button:text-is('Creează grupa')" },
    ],
  },
  {
    id: "grupe-fisa",
    path: "/admin/plugins/edusport-grupe",
    alt: "Pagina unei grupe, cu antrenorii, taburile și butonul Adaugă sportivi",
    act: async(page) => {
      await page.getByText("Avansați Gold").first().click();
      await page.getByRole("button", { name: "Adaugă sportivi" }).waitFor();
      await page.waitForTimeout(800);
    },
    marks: [
      { key: "program", selector: "[role=tab]:has-text('Program')" },
      { key: "adauga-sportivi", selector: "button:has-text('Adaugă sportivi')" },
    ],
  },
  {
    id: "grupe-program",
    path: "/admin/plugins/edusport-grupe",
    alt: "Tabul Program al unei grupe, cu programul obișnuit și calendarul lunii",
    act: async(page) => {
      await page.getByText("Avansați Gold").first().click();
      await page.getByRole("tab", { name: "Program" }).click();
      await page.waitForTimeout(1500);
    },
    marks: [
      { key: "schimba", selector: "button:text-is('Schimbă')" },
      { key: "adauga-program", selector: "button:has-text('Adaugă program')" },
    ],
  },
  {
    id: "grupe-program-nou",
    path: "/admin/plugins/edusport-grupe",
    alt: "Panoul Program nou, cu Se repetă, zilele, ora și Se aplică din",
    act: async(page) => {
      await page.getByText("Avansați Gold").first().click();
      await page.getByRole("tab", { name: "Program" }).click();
      await page.waitForTimeout(1200);
      await page.getByRole("button", { name: "Adaugă program" }).click();
      await page.waitForTimeout(1200);
    },
    marks: [
      { key: "zile", selector: "[role=group][aria-label='Zile']" },
      { key: "salveaza", selector: "button:text-is('Salvează')" },
    ],
  },
  {
    id: "program-data",
    path: "/admin/plugins/edusport-program",
    alt: "Panoul unei date din calendar, cu Ține, Anulează și Mută și caseta Anunță părinții pe e-mail",
    act: async(page) => {
      await page.getByText("Avansați Gold").first().click();
      await page.waitForTimeout(1000);
      await page.getByText("Anulează", { exact: true }).first().click();
      await page.waitForTimeout(800);
    },
    marks: [
      { key: "anunta-parintii", selector: "label:has-text('Anunță părinții pe e-mail')" },
      { key: "salveaza", selector: "button:text-is('Salvează')" },
    ],
  },
  {
    id: "program-calendar",
    path: "/admin/plugins/edusport-program",
    alt: "Pagina Program, cu calendarul lunii, butonul Adaugă și butonul Adaugă pauză",
    marks: [
      { key: "adauga-pauza", selector: "button:has-text('Adaugă pauză')" },
      { key: "adauga", selector: "button:text-is('Adaugă'), button:has-text('Adaugă'):not(:has-text('pauză'))" },
      { key: "lista", selector: "button:text-is('Listă')" },
    ],
  },
  {
    id: "program-eveniment",
    path: "/admin/plugins/edusport-program",
    alt: "Panoul Adaugă eveniment, cu Titlu, Categorie, ora și Se repetă",
    act: async(page) => {
      await page.waitForTimeout(1500);
      await page.locator("button:has-text('Adaugă'):not(:has-text('pauză'))").last().click();
      await page.waitForTimeout(1200);
    },
    marks: [
      { key: "se-repeta", selector: "text=Se repetă" },
      { key: "salveaza", selector: "button:text-is('Salvează')" },
    ],
  },
  {
    id: "program-pauza",
    path: "/admin/plugins/edusport-program",
    alt: "Fereastra Pauză nouă, cu Nume, De la, Până la și lista ședințelor care se anulează",
    act: async(page) => {
      await page.getByRole("button", { name: "Adaugă pauză" }).click();
      await page.waitForTimeout(800);
      await page.locator("text=Nume >> xpath=following::input[1]").fill("Vacanța de iarnă");
      const dates = page.locator("input[type=date]");
      await dates.nth(0).fill("2026-12-24");
      await dates.nth(1).fill("2027-01-03");
      await page.waitForTimeout(1500);
    },
    marks: [
      { key: "nume", selector: "text=Nume >> xpath=following::input[1]" },
      { key: "grila", selector: ".gtt-box" },
    ],
  },
  {
    id: "anunturi-lista",
    path: "/admin/plugins/edusport-anunturi",
    alt: "Lista Anunțuri, cu butoanele Filtre și Anunț nou",
    marks: [{ key: "anunt-nou", selector: "button:has-text('Anunț nou')" }],
  },
  {
    id: "anunturi-noul",
    path: "/admin/plugins/edusport-anunturi",
    alt: "Formularul Anunț nou, cu Portal sportiv bifat și alegerea grupelor",
    act: async(page) => {
      await page.getByRole("button", { name: "+ Anunț nou" }).click();
      await page.getByText("Portal sportiv", { exact: true }).first().click();
      await page.waitForTimeout(1200);
    },
    marks: [
      { key: "portal-sportiv", selector: "label:has-text('Portal sportiv')" },
      { key: "grupe-alese", selector: "button:text-is('Grupe alese')" },
    ],
  },
  {
    id: "prezenta-lista",
    path: "/admin/plugins/edusport-prezenta",
    alt: "Prezență, tabul Toate ședințele, cu ședințele săptămânii și starea fiecăreia",
    marks: [
      { key: "sedinta-noua", selector: "button:has-text('Ședință nouă')" },
      { key: "grupa", selector: "tr:has-text('Avansați Gold')" },
    ],
  },
  {
    id: "prezenta-noua",
    path: "/admin/plugins/edusport-prezenta",
    alt: "Fereastra Ședință nouă, cu Grupă, Data, Ora, Durata și Antrenor",
    act: async(page) => {
      await page.getByRole("button", { name: "+ Ședință nouă" }).click();
      await page.waitForTimeout(1000);
    },
    marks: [
      { key: "continua", selector: "button:text-is('Continuă')" },
    ],
  },
  {
    id: "prezenta-panou",
    path: "/admin/plugins/edusport-prezenta",
    alt: "Panoul unei ședințe, cu antrenorii, lista sportivilor cu caseta Grup și butonul Salvează",
    act: async(page) => {
      await page.getByText("Avansați Gold").first().click();
      await page.getByText("Ana Georgescu").first().waitFor();
      await page.waitForTimeout(1000);
    },
    marks: [
      { key: "grup", selector: "input[aria-label^='Grup, Ana Georgescu']" },
      { key: "salveaza", selector: "button:text-is('Salvează')" },
    ],
  },
  {
    id: "prezenta-salvata",
    path: "/admin/plugins/edusport-grupe",
    alt: "O ședință salvată, cu rândul Salvată de și Istoricul ședinței",
    act: async(page) => {
      await page.getByText("Avansați Gold").first().click();
      await page.getByRole("tab", { name: /Prezență/ }).click();
      await page.waitForTimeout(1200);
      await page.getByText("Mie 11 noi").first().click();
      await page.getByText("Istoric", { exact: true }).last().scrollIntoViewIfNeeded();
      await page.waitForTimeout(800);
    },
    marks: [
      { key: "salvata", selector: "text=/Salvată de/" },
      { key: "salveaza", selector: "button:text-is('Salvează')" },
    ],
  },
  {
    id: "tabele-lista",
    path: "/admin/plugins/edusport-tabele",
    alt: "Pagina Tabele, cu lista Gata făcute în stânga și tabelul Plăți pe grupă luna aceasta",
    act: async(page) => {
      await page.getByRole("button", { name: "Restanțe" }).waitFor();
      await page.waitForTimeout(1000);
    },
    marks: [{ key: "restante", selector: "button.tbl-rail-item:has-text('Restanțe')" }],
  },
  {
    id: "tabele-filtru",
    path: "/admin/plugins/edusport-tabele",
    alt: "Butonul Filtru deschis, cu câmpurile Grupă, Secțiune, Antrenor, Membru A.C.S. și Stare",
    act: async(page) => {
      await page.getByRole("button", { name: "Filtru" }).first().click();
      await page.waitForTimeout(800);
    },
    marks: [
      { key: "filtru", selector: "button:has-text('Filtru')" },
      { key: "stare", selector: ".tbl-pop button.tbl-field:has-text('Stare')" },
    ],
  },
  {
    id: "tabele-coloane",
    path: "/admin/plugins/edusport-tabele",
    alt: "Lista Coloane deschisă, cu casete de bifat și săgeți sus și jos",
    act: async(page) => {
      await page.getByRole("button", { name: /Coloane/ }).click();
      await page.waitForTimeout(800);
    },
    marks: [
      { key: "coloane", selector: "button:has-text('Coloane')" },
      { key: "varsta", selector: "label:has-text('Vârstă')" },
    ],
  },
  {
    id: "tabele-salveaza",
    path: "/admin/plugins/edusport-tabele",
    alt: "Fereastra Vizualizare nouă, cu câmpul Nume și butonul Salvează",
    act: async(page) => {
      await page.getByRole("button", { name: "Salvează tabelul" }).click();
      await page.waitForTimeout(800);
    },
    marks: [
      { key: "nume", selector: "[role=dialog] input" },
      { key: "salveaza", selector: "[role=dialog] button:text-is('Salvează')" },
    ],
  },
  {
    id: "tabele-actiuni",
    path: "/admin/plugins/edusport-tabele",
    alt: "Meniul ... al unui tabel salvat, cu Redenumește, Duplică și Șterge",
    act: async(page) => {
      await page.getByRole("button", { name: "Plati Sezon 2026-2027" }).click();
      await page.waitForTimeout(1000);
      await page.locator(".tbl-rail-menu button").first().click();
      await page.waitForTimeout(800);
    },
    marks: [
      { key: "meniu", selector: ".tbl-rail-menu button" },
      { key: "sterge", selector: "[role=menuitem]:text-is('Șterge')" },
    ],
  },
  {
    id: "tabele-descarca",
    path: "/admin/plugins/edusport-tabele",
    alt: "Butonul Descarcă Excel și meniul Alte formate, cu Excel și CSV",
    act: async(page) => {
      await page.getByRole("button", { name: "Alte formate" }).click();
      await page.waitForTimeout(800);
    },
    marks: [
      { key: "excel", selector: "button:has-text('Descarcă Excel')" },
      { key: "csv", selector: "[role=menuitem]:text-is('CSV')" },
    ],
  },
  {
    id: "echipa-utilizatori",
    path: "/admin/settings/users",
    alt: "Pagina Utilizatori din Setări, cu butonul Invită utilizator nou și lista administratorilor",
    act: async(page) => {
      await page.evaluate(() => localStorage.setItem("strapi-admin-language", "ro"));
      await page.reload({ waitUntil: "networkidle" });
      await page.getByRole("button", { name: "Invită utilizator nou" }).waitFor();
      await page.waitForTimeout(800);
    },
    marks: [{ key: "invita", selector: "button:has-text('Invită utilizator nou')" }],
  },
  {
    id: "echipa-invita",
    path: "/admin/settings/users",
    alt: "Fereastra Invită utilizator nou, cu Prenume, Nume, Email și Rolurile utilizatorului",
    act: async(page) => {
      await page.evaluate(() => localStorage.setItem("strapi-admin-language", "ro"));
      await page.reload({ waitUntil: "networkidle" });
      await page.getByRole("button", { name: "Invită utilizator nou" }).click();
      await page.getByRole("dialog").waitFor();
      await page.waitForTimeout(800);
    },
    marks: [
      { key: "email", selector: "[role=dialog] input[name=email]" },
      { key: "rol", selector: "[role=dialog] [role=combobox]" },
      { key: "invita", selector: "[role=dialog] button:has-text('Invită utilizator')" },
    ],
  },
  {
    id: "echipa-rol",
    path: "/admin/settings/users/1",
    alt: "Pagina de editare a unui administrator, cu Activ, Rolurile utilizatorului și bara Modificări nesalvate cu Salvează",
    act: async(page) => {
      await page.evaluate(() => localStorage.setItem("strapi-admin-language", "ro"));
      await page.reload({ waitUntil: "networkidle" });
      await page.getByText("Rolurile utilizatorului").first().waitFor();
      // Unsaved on purpose: it only makes the bottom bar with Salvează appear. The page is left without saving.
      await page.locator("input[name=isActive]").click();
      await page.waitForTimeout(800);
    },
    marks: [
      { key: "rol", selector: "[role=combobox]" },
      { key: "fals", selector: "text=/^fals$/i" },
      { key: "salveaza", selector: "button:has-text('Salvează') >> nth=1" },
    ],
  },
  {
    id: "echipa-cont-portal",
    path: "/admin/plugins/edusport-membri",
    alt: "Fereastra Editează membrul, cu blocul Cont portal, E-mail pentru cont și Trimite invitația",
    act: async(page) => {
      await page.getByText("Irina Test Antrenor").click();
      await page.getByText("Cont portal").waitFor();
      await page.waitForTimeout(1000);
    },
    marks: [
      { key: "email", selector: "section[aria-label='Cont portal'] input[type=email]" },
      { key: "trimite-invitatia", selector: "button:text-is('Trimite invitația')" },
    ],
  },
  {
    id: "site-cursuri",
    path: "/admin/plugins/edusport-cursuri",
    alt: "Pagina Cursuri din Pagini site, cu un câmp modificat și bara cu Renunță și Salvează jos",
    act: async(page) => {
      await page.getByPlaceholder("ex: Cursuri de Patinaj").waitFor();
      // Typed and left unsaved on purpose: it only makes the bottom bar appear. The page is left without saving.
      await page.getByPlaceholder("ex: Cursuri de Patinaj").fill("Titlu de probă");
      await page.waitForTimeout(800);
    },
    marks: [
      { key: "nume", selector: "input[placeholder='ex: Cursuri de Patinaj']" },
      { key: "salveaza", selector: "button:text-is('Salvează')" },
    ],
  },
  {
    id: "site-articol",
    path: "/admin/content-manager/collection-types/api::article.article/create",
    alt: "Editorul de articole Strapi, cu title, slug, description, body și coverImage",
    act: async(page) => {
      await page.evaluate(() => localStorage.setItem("strapi-admin-language", "ro"));
      await page.reload({ waitUntil: "networkidle" });
      await page.getByText("Creează o intrare").first().waitFor();
      const skip = page.getByRole("button", { name: "Sari peste" });
      if (await skip.count()) await skip.click();
      await page.waitForTimeout(1200);
    },
    marks: [
      { key: "titlu", selector: "input[name=title]" },
      { key: "salveaza", selector: "button:text-is('Salvează')" },
      { key: "publica", selector: "button:text-is('Publică')" },
    ],
  },
  {
    id: "site-competitie-noua",
    path: "/admin/plugins/edusport-competitie-edit",
    alt: "Pagina Adaugă competiție, cu Nume, Data, Locație, Nivel, Sezon și Sportivi participanți",
    act: async(page) => {
      await page.getByText("Adaugă competiție").first().waitFor();
      await page.waitForTimeout(1000);
    },
    marks: [
      { key: "nume", selector: "input[placeholder='Numele competiției']" },
      { key: "sezon", selector: "input[placeholder='ex. 2024-2025']" },
    ],
  },
  {
    id: "date-meniu",
    path: "/admin/plugins/edusport-sportivi",
    alt: "Fișa unui sportiv cu meniul de sus deschis: Exportă datele și Anonimizează",
    act: async(page) => {
      await page.getByText("Ana Georgescu").first().click();
      await page.getByRole("button", { name: "Editează" }).waitFor();
      await page.getByRole("button", { name: /Mai multe acțiuni/ }).first().click();
      await page.getByRole("menuitem", { name: "Anonimizează" }).waitFor();
      await page.waitForTimeout(600);
    },
    marks: [
      { key: "exporta-datele", selector: "[role=menuitem]:text-is('Exportă datele')" },
      { key: "anonimizeaza", selector: "[role=menuitem]:text-is('Anonimizează')" },
    ],
  },
  {
    id: "date-confirmare",
    path: "/admin/plugins/edusport-sportivi",
    alt: "Fereastra Anonimizezi datele sportivului, cu ce se șterge, ce rămâne și butoanele Anulează și Anonimizează",
    act: async(page) => {
      await page.getByText("Ana Georgescu").first().click();
      await page.getByRole("button", { name: "Editează" }).waitFor();
      await page.getByRole("button", { name: /Mai multe acțiuni/ }).first().click();
      await page.getByRole("menuitem", { name: "Anonimizează" }).click();
      await page.getByText("Anonimizezi datele sportivului?").waitFor();
      await page.waitForTimeout(600);
    },
    // Only opened; the dialog is left with Anulează by closing the page.
    marks: [{ key: "anuleaza", selector: "button:text-is('Anulează')" }],
  },
  {
    id: "date-setari",
    path: "/admin/plugins/edusport-setari",
    alt: "Setări site, cardul Date personale cu câmpul Ani până la anonimizare",
    act: async(page) => {
      await page.getByText("Ani până la anonimizare").first().waitFor();
      await page.getByText("Ani până la anonimizare").first().scrollIntoViewIfNeeded();
      // Hides the contact card above (the club's real address and phone); a display change only, nothing is edited.
      await page.evaluate(() => {
        for (const el of document.querySelectorAll(".ui-ecard")) {
          if (el.textContent.includes("Date de contact")) el.style.visibility = "hidden";
        }
      });
      await page.waitForTimeout(800);
    },
    marks: [{ key: "limita", selector: "input[role=spinbutton][aria-valuemax='20']" }],
  },
  {
    id: "date-inactivi",
    path: "/admin/plugins/edusport-sportivi",
    alt: "Filtrul Date personale, cu opțiunea Inactivi de peste 5 ani",
    act: async(page) => {
      await page.getByRole("button", { name: "Filtre" }).click();
      await page.getByText("Date personale", { exact: true }).last().click();
      await page.getByText(/Inactivi de peste/).first().waitFor();
      await page.waitForTimeout(600);
    },
    marks: [{ key: "inactivi", selector: "text=/Inactivi de peste/" }],
  },
];
