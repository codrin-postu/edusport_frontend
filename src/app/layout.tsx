import type { Metadata } from "next";
import Script from "next/script";
import { Inter, League_Spartan, Caveat, Lora } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { FooterReveal, Header } from "../components/blocks";
import NavigationProgress from "../components/NavigationProgress";
import { fetchStrapi } from "@/lib/strapi";
import { fetchAnnouncement } from "@/lib/strapi-announcement";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/site";
import { AnnouncementPopup } from "@/components/blocks/announcement-popup";
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
      <body className="bg-edusport-blue overflow-x-clip">
        <OrganizationJsonLd
          telephone={contactInfo.phone}
          email={contactInfo.email}
          sameAs={socialProfiles}
        />
        <NavigationProgress />
        <Header registrationOpen={registrationOpen} contactInfo={contactInfo} />
        <main
          className="relative z-10 pt-20 pb-24 md:pb-32 bg-retro-cream lg:overflow-clip"
          style={{ marginBottom: "var(--footer-height, 0px)" }}
        >
          {children}
        </main>
        <FooterReveal contactInfo={contactInfo} registrationOpen={registrationOpen} />
        {announcement && <AnnouncementPopup announcement={announcement} />}
        {process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID && (
          <Script
            src={process.env.NEXT_PUBLIC_UMAMI_URL ?? "https://analytics.umami.is/script.js"}
            data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
