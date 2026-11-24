import { FeatureGate } from "../../_lib/features-context";

/** The whole page is the not-found page while its switch is off. */
export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <FeatureGate feature="abonamente">{children}</FeatureGate>;
}
