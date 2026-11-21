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
];
