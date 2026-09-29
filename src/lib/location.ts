/**
 * The site's single location fallback, used wherever a page shows the rink
 * address (Cursuri banner, Cursuri about bullet, landing registration) and
 * the CMS site-settings contact data is unreachable. Keeping this in one
 * constant, rather than repeating the old hardcoded text/link per page, is
 * what lets every location on the site trace back to one source: the CMS
 * when it answers, this constant when it does not.
 */
export const FALLBACK_ADDRESS_DISPLAY =
  "Patinoarul Cotroceni On Ice, AFI Palace Cotroceni";
export const FALLBACK_ADDRESS_MAPS_URL =
  "https://maps.app.goo.gl/gmrERwQePvxYY6zx6";
