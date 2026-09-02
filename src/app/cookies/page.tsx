import type { Metadata } from "next";
import PoliticaCookies from "./_View";

export const metadata: Metadata = {
  title: "Politica de Cookies",
  description:
    "Ce cookie-uri folosește site-ul școlii de patinaj EduSport și cum poți controla stocarea lor.",
  alternates: { canonical: "/cookies" },
};

export const revalidate = 86400;

export default function Page() {
  return <PoliticaCookies />;
}
