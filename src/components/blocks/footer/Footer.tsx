import { Link } from "@/components";
import Button from "@/components/ui/button";
import Icon, { type IconName } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { WarmStripe } from "@/components/ui/warm-stripe";
import { ENROL_CTA, ENROL_HREF } from "@/lib/cta";
import { mapsHref } from "@/lib/mapsLink";
import { cn } from "@/utils/cn";
import { BRAND_NAME } from "@/utils/constants";
import React from "react";
import FooterHeightEffect from "./FooterHeightEffect";
import { WhatsAppQR } from "./WhatsAppQR";

export interface SiteContactInfo {
  phone?: string;
  email?: string;
  facebookUrl1?: string;
  instagramUrl?: string;
  whatsappChannelUrl?: string;
  addressDisplay?: string;
  /** Optional exact map link. Falls back to a search built from addressDisplay. */
  addressMapsUrl?: string;
}

type FooterItemData =
  | { type: "link"; label: string; href: string; external?: boolean }
  | { type: "text"; label: string }
  | { type: "phone"; label: string }
  | { type: "email"; label: string }
  | { type: "social"; label: string; href: string; icon?: string };

const footerLeftSections = [
  {
    title: "Meniu",
    items: [
      { label: "Despre noi", href: "/despre-noi/echipa", type: "link" as const },
      { label: "Cursuri de patinaj", href: "/cursuri", type: "link" as const },
      { label: "Program", href: "/cursuri/program", type: "link" as const },
      { label: "Regulament", href: "/cursuri/regulament", type: "link" as const },
      { label: "Voluntariat", href: "/voluntariat", type: "link" as const },
      { label: "Parteneri", href: "/parteneri", type: "link" as const },
    ],
  },
  {
    title: "Informații legale",
    items: [
      {
        label: "Politica de confidențialitate",
        href: "/protectia-datelor",
        type: "link" as const,
      },
      {
        label: "ANPC",
        href: "https://anpc.ro/",
        type: "link" as const,
        external: true,
      },
      {
        label: "Soluționarea online a litigiilor",
        href: "https://ec.europa.eu/consumers/odr/",
        type: "link" as const,
        external: true,
      },
    ],
  },
];

const FooterBrandName: React.FC = () => {
  return (
    <div
      className={cn(
        "absolute -bottom-[2vw] -left-[2vw]",
        "lg:left-1/2 lg:-translate-x-1/2 lg:-bottom-[30px]",
      )}
    >
      <Text variant="branding" className="text-branding-xl">
        {BRAND_NAME}
      </Text>
    </div>
  );
};

const FooterItem: React.FC<FooterItemData> = (item) => {
  if (item.type === "text") {
    return <Text className="text-primary-on-dark">{item.label}</Text>;
  }

  const href =
    item.type === "phone" ? `tel:${item.label.replace(/\s/g, "")}` :
    item.type === "email" ? `mailto:${item.label}` :
    item.href;

  const isExternal =
    item.type === "social" ||
    (item.type === "link" && item.external === true);

  return (
    <Link href={href} tone="footer" external={isExternal} className="font-base">
      {item.label}
    </Link>
  );
};

const FooterContent: React.FC<{ contactInfo?: SiteContactInfo }> = ({ contactInfo }) => {
  const waUrl = contactInfo?.whatsappChannelUrl;
  // Landing footer: social shown as compact icons instead of text links. Each
  // icon renders only when the BE provides its URL (mirrors HeaderTop).
  const socialIcons = [
    contactInfo?.facebookUrl1 && { label: "Facebook", href: contactInfo.facebookUrl1, icon: "facebook" as IconName },
    contactInfo?.instagramUrl && { label: "Instagram", href: contactInfo.instagramUrl, icon: "instagram" as IconName },
    waUrl && { label: "WhatsApp", href: waUrl, icon: "whatsapp" as IconName },
  ].filter(Boolean) as { label: string; href: string; icon: IconName }[];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:flex lg:flex-row max-w-content lg:justify-between gap-8 md:gap-12 lg:gap-12 gutter py-12 mx-auto">
      {/* Meniu + Informații legale */}
      {footerLeftSections.map((section, index) => (
        <div key={index} className="flex flex-col gap-3">
          <Text variant="heading" className="text-primary-on-dark">
            {section.title}
          </Text>
          <div className="flex flex-col gap-3">
            {section.items.map((item, itemIndex) =>
              <FooterItem key={itemIndex} {...item} />,
            )}
          </div>
        </div>
      ))}

      {/* Contactează-ne */}
      <div className="flex flex-col gap-3">
        <Text variant="heading" className="text-primary-on-dark">
          Contactează-ne
        </Text>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-3">
            {/* Address first: it is what people open the footer for, and it
                links to the map instead of being text to retype. */}
            {contactInfo?.addressDisplay &&
              (mapsHref(contactInfo.addressDisplay, contactInfo.addressMapsUrl) ? (
                <FooterItem
                  type="link"
                  label={contactInfo.addressDisplay}
                  href={mapsHref(contactInfo.addressDisplay, contactInfo.addressMapsUrl)!}
                  external
                />
              ) : (
                <FooterItem type="text" label={contactInfo.addressDisplay} />
              ))}
            {contactInfo?.phone && <FooterItem type="phone" label={contactInfo.phone} />}
            {contactInfo?.email && <FooterItem type="email" label={contactInfo.email} />}
          </div>
          {socialIcons.length > 0 && (
            <div className="flex items-center gap-4 mt-1">
              {socialIcons.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="-my-3 size-10 inline-flex items-center justify-center text-primary-on-dark transition-colors"
                >
                  <Icon name={s.icon} size="md" />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* WhatsApp - 4th column (only when the BE provides a channel URL) */}
      {waUrl && (
      <div className="lg:flex-shrink-0 lg:min-w-[160px]">
        {/* Mobile: large QR → caption → link */}
        <div className="flex flex-col items-start gap-0 md:hidden">
          <Text variant="heading" className="text-primary-on-dark mb-3">
            WhatsApp
          </Text>
          <WhatsAppQR size={84} url={waUrl} />
          <p className="text-caption text-secondary-on-dark mt-3 mb-3">
            Intră pentru a primi ultimele informații
          </p>
          <div className="flex items-center gap-2">
            <Link href={waUrl} tone="footer" external className="text-sm">
              Intră în canal
            </Link>
          </div>
        </div>

        {/* Tablet + Desktop: caption → QR + divider + link row */}
        <div className="flex-col gap-0 hidden md:flex">
          <Text variant="heading" className="text-primary-on-dark">
            WhatsApp
          </Text>
          <p className="text-caption text-secondary-on-dark mb-3">
            Intră pentru a primi ultimele informații
          </p>
          <div className="flex items-center gap-4">
            <WhatsAppQR size={72} url={waUrl} />
            <div className="w-px h-[72px] bg-surface-subtle-on-dark shrink-0" />
            <div className="flex items-center gap-2">
              <Link href={waUrl} tone="footer" external className="text-sm">
                Intră în canal
              </Link>
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

/**
 * Retro register band that sits as the footer's top band (warm stripe + pastel
 * band + generic, family-inclusive CTA). Copy centers and buttons go full-width
 * once they wrap (mobile / tablet). Shown only while registration is open.
 */
const RegisterBand: React.FC = () => (
  <section className="bg-pastel">
    <WarmStripe />
    <div className="max-w-content mx-auto gutter py-8 md:py-12 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 lg:gap-12 text-center lg:text-left">
      <div className="lg:max-w-[54%]">
        <h2 className="text-heading text-primary">
          Începe aventura pe gheață
        </h2>
        <p className="text-body text-primary mt-2">
          Cursuri pentru toate vârstele și nivelurile, de la primii pași pe gheață până la performanță.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-center w-full sm:w-auto lg:shrink-0">
        <Button face="black" href={ENROL_HREF} umamiEvent="footer.enroll">
          {ENROL_CTA}
        </Button>
        <Button variant="secondary" href="/cursuri">
          Școala de patinaj
        </Button>
      </div>
    </div>
  </section>
);

interface FooterProps {
  contactInfo?: SiteContactInfo;
  /** When open, the register band shows as the footer top band. */
  registrationOpen?: boolean;
}

const Footer: React.FC<FooterProps> = ({ contactInfo, registrationOpen }) => {
  return (
    <div className="relative">
      <FooterHeightEffect />
      <footer
        className={cn(
          "relative",
          "overflow-hidden",
          "bg-surface-dark",
          "w-full",
          "min-h-[250px]",
          "pb-[10vw] 2xl:pb-[9.5em]",
        )}
      >
        {registrationOpen !== false && <RegisterBand />}
        <FooterContent contactInfo={contactInfo} />
        <FooterBrandName />
      </footer>
    </div>
  );
};

export default Footer;
