import { Link } from "@/components";
import { Text } from "@/components/ui/text";
import { cn } from "@/utils/cn";
import { BRAND_NAME, LinkVariants } from "@/utils/constants";
import React from "react";
import { WhatsAppQR } from "./WhatsAppQR";

export interface SiteContactInfo {
  phone?: string;
  email?: string;
  facebookUrl1?: string;
  facebookUrl2?: string;
  instagramUrl?: string;
  whatsappChannelUrl?: string;
  addressDisplay?: string;
}

type FooterItemData =
  | { type: "link"; label: string; href: string }
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
    ],
  },
  {
    title: "Informații legale",
    items: [
      // TODO: create /termeni-si-conditii page
      { label: "Termeni și condiții", href: "/terms", type: "link" as const },
      // TODO: create /politica-cookies page
      { label: "Politica de Cookies", href: "/cookies", type: "link" as const },
      {
        label: "Politica de confidentialitate",
        href: "/protectia-datelor",
        type: "link" as const,
      },
      // TODO: create /anpc page
      { label: "ANPC", href: "/anpc", type: "link" as const },
      // TODO: create /odr page
      {
        label: "Solutionarea online a litigiilor",
        href: "/odr",
        type: "link" as const,
      },
    ],
  },
];

function buildContactItems(info: SiteContactInfo): FooterItemData[] {
  const items: FooterItemData[] = [];

  if (info.phone) {
    items.push({ type: "phone", label: info.phone });
  }
  if (info.email) {
    items.push({ type: "email", label: info.email });
  }
  if (info.facebookUrl1) {
    items.push({ type: "social", label: "Facebook", href: info.facebookUrl1, icon: "facebook" });
  }
  if (info.facebookUrl2) {
    items.push({ type: "social", label: "Facebook Juniors", href: info.facebookUrl2, icon: "facebook" });
  }
  if (info.instagramUrl) {
    items.push({ type: "social", label: "Instagram", href: info.instagramUrl, icon: "instagram" });
  }
  return items;
}

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
    return <Text className="text-white">{item.label}</Text>;
  }

  const href =
    item.type === "phone" ? `tel:${item.label.replace(/\s/g, "")}` :
    item.type === "email" ? `mailto:${item.label}` :
    item.href;

  const linkType = (
    item.type === "phone" ? "phone" :
    item.type === "email" ? "email" :
    "external"
  ) as "phone" | "email" | "external";

  return (
    <Link
      href={href}
      className="text-base font-base"
      variant={LinkVariants.FOOTER_ANIMATED}
      linkType={linkType}
      {...(item.type === "social" ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {item.label}
    </Link>
  );
};

const WhatsAppIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="shrink-0 text-white"
    aria-hidden="true"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
  </svg>
);

const FooterContent: React.FC<{ contactInfo?: SiteContactInfo }> = ({ contactInfo }) => {
  const contactItems = buildContactItems(contactInfo ?? {});
  const waUrl = contactInfo?.whatsappChannelUrl ?? "https://whatsapp.com/channel/0029Vaqul3WC6ZvanAX0DY06";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:flex lg:flex-row max-footer-content lg:justify-between gap-8 md:gap-10 lg:gap-12 px-22 py-10 mx-auto">
      {/* Meniu + Informații legale */}
      {footerLeftSections.map((section, index) => (
        <div key={index} className="flex flex-col gap-3">
          <Text variant="heading" className="font-semibold text-lg lg:text-2xl text-white">
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
        <Text variant="heading" className="font-semibold text-lg lg:text-2xl text-white">
          Contacteaza-ne
        </Text>
        <div className="flex flex-col gap-3">
          {contactItems.map((item, itemIndex) =>
            <FooterItem key={itemIndex} {...item} />,
          )}
        </div>
      </div>

      {/* WhatsApp - 4th column */}
      <div className="lg:flex-shrink-0 lg:min-w-[160px]">
        {/* Mobile: large QR → caption → link */}
        <div className="flex flex-col items-start gap-0 md:hidden">
          <Text variant="heading" className="font-semibold text-lg lg:text-2xl text-white mb-3">
            WhatsApp
          </Text>
          <WhatsAppQR size={84} url={waUrl} />
          <p className="text-[12px] text-white/45 leading-[1.55] mt-[10px] mb-[12px]">
            Intră pentru a primi ultimele informații
          </p>
          <div className="flex items-center gap-[6px]">
            <WhatsAppIcon />
            <Link
              href={waUrl}
              variant={LinkVariants.FOOTER_ANIMATED}
              linkType="external"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm"
              aria-label="Intră în canalul WhatsApp"
            >
              Intră în canal
            </Link>
          </div>
        </div>

        {/* Tablet + Desktop: caption → QR + divider + link row */}
        <div className="flex-col gap-0 hidden md:flex">
          <Text variant="heading" className="font-semibold text-lg lg:text-2xl text-white">
            WhatsApp
          </Text>
          <p className="text-[12px] text-white/45 leading-[1.55] mb-[12px]">
            Intră pentru a primi ultimele informații
          </p>
          <div className="flex items-center gap-[14px]">
            <WhatsAppQR size={72} url={waUrl} />
            <div className="w-px h-[72px] bg-white/15 shrink-0" />
            <div className="flex items-center gap-[6px]">
              <WhatsAppIcon />
              <Link
                href={waUrl}
                variant={LinkVariants.FOOTER_ANIMATED}
                linkType="external"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm"
                aria-label="Intră în canalul WhatsApp"
              >
                Intră în canal
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface FooterProps {
  contactInfo?: SiteContactInfo;
}

const Footer: React.FC<FooterProps> = ({ contactInfo }) => {
  return (
    <footer
      className={cn(
        "relative",
        "overflow-hidden",
        "bg-edusport-blue",
        "w-full",
        "min-h-[250px]",
        "pb-[10vw] 2xl:pb-[9.5em]",
      )}
    >
      <FooterContent contactInfo={contactInfo} />
      <FooterBrandName />
    </footer>
  );
};

export default Footer;
