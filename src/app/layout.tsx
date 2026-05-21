import type { Metadata } from "next";
import Script from "next/script";
import { Inter, Roboto, League_Spartan, Libre_Bodoni, Caveat } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { FooterReveal, Header } from "../components/blocks";
import { LazyPageTransition } from "../components/LazyPageTransition";
import NavigationProgress from "../components/NavigationProgress";
import { fetchStrapi } from "@/lib/strapi";
import { fetchAnnouncement } from "@/lib/strapi-announcement";
import { AnnouncementPopup } from "@/components/blocks/announcement-popup";
import type { SiteContactInfo } from "@/components/blocks/footer/Footer";
import { OrganizationJsonLd } from "@/components/JsonLd";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  weight: ["200", "300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const roboto = Roboto({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-roboto",
  display: "swap",
});

const leagueSpartan = League_Spartan({
  subsets: ["latin", "latin-ext"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-league-spartan",
  display: "swap",
});

const libreBodoni = Libre_Bodoni({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-libre-bodoni",
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

const SITE_NAME = "EduSport - Școala de Patinaj";
const SITE_DESCRIPTION =
  "Școala de patinaj EduSport din București oferă cursuri de patinaj artistic pentru copii și adulți, evenimente sportive și competiții la nivel național.";

export const metadata: Metadata = {
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://edusport.vercel.app",
  ),
  openGraph: {
    type: "website",
    locale: "ro_RO",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "EduSport - Școala de Patinaj" }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: ["/og-image.jpg"],
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
  return (
    <html
      lang="ro"
      className={`${inter.variable} ${roboto.variable} ${leagueSpartan.variable} ${libreBodoni.variable} ${caveat.variable} ${climateCrisis.variable}`}
    >
      <body className="bg-edusport-blue">
        <OrganizationJsonLd telephone={contactInfo.phone} email={contactInfo.email} />
        <NavigationProgress />
        <Header registrationOpen={registrationOpen} contactInfo={contactInfo} />
        <main
          className="relative z-10 pt-20 pb-24 md:pb-32 bg-white lg:overflow-clip"
          style={{ marginBottom: "var(--footer-height, 0px)" }}
        >
          {children}
        </main>
        <FooterReveal contactInfo={contactInfo} />
        {announcement && <AnnouncementPopup announcement={announcement} />}
        <LazyPageTransition />
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
