import type { CookieConsentConfig } from "vanilla-cookieconsent";

/**
 * Consent configuration, written against Legea 506/2004 art. 4 alin. (5) and
 * GDPR. The constraints that shaped it, rather than the library defaults:
 *
 * - Refusal must be as visible and accessible as acceptance, on the first
 *   layer. Hence `equalWeightButtons: true` and a Refuz button in the main
 *   modal, not hidden behind Preferințe.
 * - No category may be pre-enabled except strictly necessary ones, so
 *   `functionality` and `analytics` both default to off.
 * - Wording has to say what is actually being chosen. No "accept for a better
 *   experience".
 * - Withdrawing consent must be at least as easy as giving it, so the footer
 *   carries a permanent link that reopens this panel.
 */

export const COOKIE_CATEGORIES = {
  necessary: "necessary",
  functionality: "functionality",
  analytics: "analytics",
} as const;

const config: CookieConsentConfig = {
  guiOptions: {
    consentModal: {
      layout: "box",
      position: "bottom left",
      // Required: refusal cannot be visually weaker than acceptance.
      equalWeightButtons: true,
      flipButtons: false,
    },
    preferencesModal: {
      layout: "box",
      equalWeightButtons: true,
      flipButtons: false,
    },
  },

  categories: {
    necessary: {
      enabled: true,
      readOnly: true,
    },
    // Content loaded from another provider so a page feature works. Today that
    // is only the YouTube player: even the nocookie domain sends the visitor's
    // IP to Google the moment the frame loads, so it stays unloaded until this
    // is accepted. Standard CMP taxonomy puts embeds here rather than giving
    // one vendor its own category.
    functionality: {
      enabled: false,
      readOnly: false,
    },
    // Traffic statistics. Self-hosted and cookieless, but gated anyway:
    // refusing means we count nothing, which is what declining should mean.
    analytics: {
      enabled: false,
      readOnly: false,
    },
  },

  language: {
    default: "ro",
    translations: {
      ro: {
        consentModal: {
          title: "Acest site folosește cookie-uri",
          description:
            "Folosim cookie-uri pentru a analiza traficul și pentru a afișa conținut încărcat de la alți furnizori. Poți alege ce permiți.",
          acceptAllBtn: "Accept tot",
          acceptNecessaryBtn: "Refuz",
          showPreferencesBtn: "Alege ce permiți",
          footer: "<a href='/protectia-datelor'>Protecția datelor</a>",
        },
        preferencesModal: {
          title: "Preferințe de confidențialitate",
          acceptAllBtn: "Accept tot",
          acceptNecessaryBtn: "Refuz tot",
          savePreferencesBtn: "Salvează alegerea",
          closeIconLabel: "Închide",
          sections: [
            {
              title: "Necesare",
              description:
                "Cookie-urile necesare fac site-ul utilizabil, permițând funcții de bază precum navigarea în pagini. Site-ul nu poate funcționa corect fără ele.",
              linkedCategory: "necessary",
            },
            {
              title: "Statistici",
              description:
                "Cookie-urile statistice ajută la înțelegerea modului în care vizitatorii interacționează cu site-ul, colectând și raportând informații în mod anonim.",
              linkedCategory: "analytics",
            },
            {
              title: "Funcționale",
              description:
                "Cookie-urile funcționale permit site-ului să ofere funcționalități suplimentare și conținut încărcat de la alți furnizori.",
              linkedCategory: "functionality",
            },
          ],
        },
      },
    },
  },
};

export default config;
