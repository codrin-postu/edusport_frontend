import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "../globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600", "700"],
  variable: "--font-inter",
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
    <html lang="ro" className={`${inter.variable} ${climateCrisis.variable}`}>
      <body data-theme="portal" className="bg-surface">{children}</body>
    </html>
  );
}
