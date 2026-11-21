// Screenshot and recording entries for the wiki. One entry per image.
//
//   id        file name: content/ghid/img/<id>.jpg, and the id a Step's `shot` field uses
//   path      admin or portal path, opened on --base
//   alt       image description (Romanian, terse)
//   viewport  default 1280x760; phone shots use { width: 390, height: 844 }
//   act       optional async (page) => {}: runs after the page loads, before the shot (and is the recording with --video)
//   marks     [{ n, selector }]: numbered boxes drawn over the first element matching the selector
//
// Test data only (invented names). Never point --base at production.
export const SHOTS = [
  {
    id: "contabilitate-plati",
    path: "/admin/plugins/edusport-contabilitate?tab=plati",
    alt: "Lista plăților din Contabilitate, cu butonul + Plată sus",
    marks: [{ n: 1, selector: "button:has-text('+ Plată')" }],
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
      { n: 1, selector: "input[type=email]" },
      { n: 2, selector: "input[type=password]" },
      { n: 3, selector: "button:text-is('Intră')" },
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
      { n: 1, selector: "button.esd-grp-btn:visible:has-text('Club și școală')" },
      { n: 2, selector: "text=Contul meu" },
    ],
  },
  {
    id: "primii-telefon",
    path: "/admin",
    viewport: { width: 390, height: 844 },
    alt: "Panoul pe telefon, cu butonul de meniu în dreapta sus",
    marks: [{ n: 1, selector: "[aria-label='Deschide meniul']" }],
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
    marks: [{ n: 1, selector: "a:text-is('Sportivi'), button:text-is('Sportivi')" }],
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
      { n: 2, selector: "input[placeholder='Caută sportiv']" },
      { n: 3, selector: "xpath=(//*[starts-with(normalize-space(text()),'Pentru')])[last()]/following::button[1]" },
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
      { n: 1, selector: "button:has-text('...')" },
      { n: 2, selector: "[role=menuitem]:has-text('Anulează plata')" },
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
    marks: [{ n: 3, selector: "[role=dialog] button:text-is('Anulează plata'), [role=alertdialog] button:text-is('Anulează plata')" }],
  },
  {
    id: "preturi-liste",
    path: "/admin/plugins/edusport-preturi",
    alt: "Prețuri, cu secțiunile sus și listele de prețuri ale unei secțiuni",
    marks: [
      { n: 1, selector: "[role=tab]:has-text('Club'), button:text-is('Club')" },
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
      { n: 2, selector: "xpath=//*[starts-with(normalize-space(text()),'Preț membri')]/following::input[1]" },
      { n: 3, selector: "button:text-is('Salvează')" },
    ],
  },
];
