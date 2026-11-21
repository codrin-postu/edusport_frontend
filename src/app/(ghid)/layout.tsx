import type { Metadata } from "next";
import { Inter, League_Spartan } from "next/font/google";
import "../globals.css";

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

export const metadata: Metadata = {
  title: "Ghid EduSport",
  robots: { index: false, follow: false },
};

export default function GhidRootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ro" className={`${inter.variable} ${leagueSpartan.variable}`}>
      <body data-theme="portal" className="bg-surface">
        {children}
      </body>
    </html>
  );
}
