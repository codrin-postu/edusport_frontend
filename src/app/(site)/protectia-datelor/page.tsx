import type { Metadata } from "next";
import ProtectiaDatelor from "./_View";

export const metadata: Metadata = {
  title: "Protecția Datelor",
  description:
    "Politica de protecție a datelor cu caracter personal a școlii de patinaj EduSport.",
  alternates: { canonical: "/protectia-datelor" },
};

export const revalidate = 86400;

export default function Page() {
  return <ProtectiaDatelor />;
}
