import { FeatureGate } from "../../_lib/me-context";

/** The whole section is the not-found page while the Prezență switch is off. */
export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <FeatureGate feature="prezenta">{children}</FeatureGate>;
}
