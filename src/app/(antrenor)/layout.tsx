import type { Metadata } from "next";
import { Inter, League_Spartan } from "next/font/google";
import localFont from "next/font/local";
import "../globals.css";
import { PortalUmami } from "@/app/_portal/ui/PortalUmami";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const leagueSpartan = League_Spartan({
  subsets: ["latin", "latin-ext"],
  weight: ["800"],
  variable: "--font-league-spartan",
  display: "swap",
});

const climateCrisis = localFont({
  src: "../../../public/fonts/ClimateCrisis-1979.woff2",
  variable: "--font-climate-crisis",
  display: "swap",
});

export const metadata: Metadata = {
  title: "EduSport antrenor",
  robots: { index: false, follow: false },
};

export default function AntrenorRootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ro" className={`${inter.variable} ${leagueSpartan.variable} ${climateCrisis.variable}`}>
      <body data-theme="portal" className="bg-surface">
        {children}
        <PortalUmami portal="antrenor" websiteId={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID_ANTRENOR} />
      </body>
    </html>
  );
}
