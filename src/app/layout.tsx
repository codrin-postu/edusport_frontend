import type { Metadata } from "next";
import Script from "next/script";
import CookieConsent from "@/components/blocks/cookie-consent/CookieConsent";
import { Inter, League_Spartan, Caveat, Lora } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { FooterReveal, Header } from "../components/blocks";
import ResumeRegistration from "@/components/blocks/resume-registration";
import NavigationProgress from "../components/NavigationProgress";
import { fetchStrapi } from "@/lib/strapi";
import { fetchAnnouncement } from "@/lib/strapi-announcement";
import { fetchNavPromoOverrides } from "@/lib/strapi-navigation";
import { mergeNavOverrides } from "@/components/blocks/header/mergeNavOverrides";
import { navItems as staticNavItems } from "@/components/blocks/header/navItems";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/site";
import { Announcement } from "@/components/blocks/announcement-popup";
import type { SiteContactInfo } from "@/components/blocks/footer/Footer";
import { OrganizationJsonLd } from "@/components/JsonLd";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
  display: "swap",
});

const leagueSpartan = League_Spartan({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-league-spartan",
  display: "swap",
});

const lora = Lora({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-lora",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-caveat",
  display: "swap",
});

const climateCrisis = localFont({
  src: "../../public/fonts/ClimateCrisis-Regular-VariableFont_YEAR.ttf",
  variable: "--font-climate-crisis",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: "website",
    locale: "ro_RO",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    // OG/Twitter image is supplied by the app-root `opengraph-image.tsx`
    // file convention (auto-injected on every route).
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let contactInfo: SiteContactInfo = {};
  let registrationOpen: boolean | undefined;
  try {
    // Both fields are JSON custom-fields, returned by default — no populate.
    const settings = await fetchStrapi<{
      contact?: SiteContactInfo;
      registration?: { open?: boolean };
    }>("site-settings");
    contactInfo = settings?.contact ?? {};
    registrationOpen = settings?.registration?.open;
  } catch {
    // Fall through with empty - footer uses hardcoded defaults
  }

  const announcement = await fetchAnnouncement();

  // The menu structure comes from code; the CMS may only override each promo
  // card's description and image. Header is a client component, so the fetch
  // has to happen here. fetchNavPromoOverrides never throws and returns [] on
  // any failure, which makes the merge a no-op, so a Strapi outage leaves the
  // navigation exactly as the static file defines it.
  const navigationItems = mergeNavOverrides(
    staticNavItems,
    await fetchNavPromoOverrides(),
  );

  // Social profile URLs -> schema.org `sameAs` (helps entity/knowledge-graph).
  const socialProfiles = [
    contactInfo.facebookUrl1,
    contactInfo.instagramUrl,
  ].filter(Boolean) as string[];
  return (
    <html
      lang="ro"
      className={`lv2-nav ${inter.variable} ${leagueSpartan.variable} ${caveat.variable} ${climateCrisis.variable} ${lora.variable}`}
    >
      <head>
        {/*
          Decides, BEFORE the first paint, whether the black contact strip is
          shown. The strip belongs only at the top of a page.

          The server cannot know where a visitor is scrolled, so it renders the
          strip hidden and this script opens it when appropriate: nothing stored
          means a first visit, and a stored position at the top means they are
          where the strip belongs. The Header records the position as they
          scroll.

          Hidden is the default deliberately. Whatever fails here, storage
          blocked, JavaScript off, the visitor simply never sees the strip,
          rather than seeing it flash in and snap away.

          Inline and blocking on purpose. Deferring it would defeat the point.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var v=sessionStorage.getItem('esNavY:'+location.pathname);" +
              "if(v===null||parseFloat(v)<=400)" +
              "document.documentElement.classList.add('nav-strip-open')}" +
              "catch(e){document.documentElement.classList.add('nav-strip-open')}",
          }}
        />
      </head>
      <body className="bg-edusport-blue overflow-x-clip">
        <OrganizationJsonLd
          telephone={contactInfo.phone}
          email={contactInfo.email}
          sameAs={socialProfiles}
        />
        <NavigationProgress />
        <Header
          registrationOpen={registrationOpen}
          contactInfo={contactInfo}
          navItems={navigationItems}
        />
        <main
          className="relative z-10 pt-20 pb-24 md:pb-32 bg-retro-cream lg:overflow-clip"
          style={{ marginBottom: "var(--footer-height, 0px)" }}
        >
          {children}
        </main>
        <FooterReveal contactInfo={contactInfo} registrationOpen={registrationOpen} />
        {/* Offers the way back into a form already begun, on whatever page
            they wandered to. Renders nothing without a saved draft. */}
        <ResumeRegistration />
        {announcement && <Announcement announcement={announcement} />}
        {/* Not gated behind consent: Umami is self-hosted, writes nothing to the
            device (its only storage touch is reading an opt-out flag) and does no
            profiling, so it falls under the audience-measurement exemption rather
            than art. 4(5) of Legea 506/2004. Disclosed in the privacy policy. */}
        {process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID && (
          <Script
            src={process.env.NEXT_PUBLIC_UMAMI_URL ?? "https://analytics.umami.is/script.js"}
            data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
            strategy="afterInteractive"
          />
        )}
        <CookieConsent />
      </body>
    </html>
  );
}
