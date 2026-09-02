import { Link } from "@/components";
import SpotlightButton from "@/components/ui/spotlight-button";
import { Text } from "@/components/ui/text";
import { WarmStripe } from "@/components/ui/warm-stripe";
import { cn } from "@/utils/cn";
import { BRAND_NAME, LinkVariants } from "@/utils/constants";
import React from "react";
import { WhatsAppQR } from "./WhatsAppQR";

export interface SiteContactInfo {
  phone?: string;
  email?: string;
  facebookUrl1?: string;
  instagramUrl?: string;
  whatsappChannelUrl?: string;
  addressDisplay?: string;
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
        label: "Politica de confidentialitate",
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
        label: "Solutionarea online a litigiilor",
        href: "https://ec.europa.eu/consumers/odr/",
        type: "link" as const,
        external: true,
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

const FooterItem: React.FC<FooterItemData & { retro?: boolean }> = ({ retro, ...item }) => {
  if (item.type === "text") {
    return <Text className="text-white">{item.label}</Text>;
  }

  const href =
    item.type === "phone" ? `tel:${item.label.replace(/\s/g, "")}` :
    item.type === "email" ? `mailto:${item.label}` :
    item.href;

  const isExternal =
    item.type === "social" ||
    (item.type === "link" && item.external === true);

  const linkType = (
    item.type === "phone" ? "phone" :
    item.type === "email" ? "email" :
    "external"
  ) as "phone" | "email" | "external";

  // Landing (retro): no arrow icon, a mustard underline that grows in on hover.
  if (retro) {
    return (
      <Link
        href={href}
        className="font-base relative w-fit pb-[2px] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-mustard after:transition-[width] after:duration-200 hover:after:w-full"
        variant={LinkVariants.DEFAULT}
        linkType={linkType}
        {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {item.label}
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className="text-base font-base"
      variant={LinkVariants.FOOTER_ANIMATED}
      linkType={linkType}
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
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

const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="shrink-0" aria-hidden="true">
    <path d="M13.5 21v-7h2.3l.4-3h-2.7V9.1c0-.9.3-1.5 1.6-1.5H16.3V4.9C16 4.86 15 4.8 13.9 4.8c-2.2 0-3.7 1.3-3.7 3.8V11H7.7v3h2.5v7h3.3z" />
  </svg>
);
const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="shrink-0" aria-hidden="true">
    <path fillRule="evenodd" clipRule="evenodd" d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 5.2a4.8 4.8 0 1 0 0 9.6 4.8 4.8 0 0 0 0-9.6zm0 2a2.8 2.8 0 1 1 0 5.6 2.8 2.8 0 0 1 0-5.6zM17.4 5.9a1.1 1.1 0 1 0 0 2.2 1.1 1.1 0 0 0 0-2.2z" />
  </svg>
);
const WhatsAppGlyph = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="shrink-0" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.05 21.785h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884" />
  </svg>
);

const FooterContent: React.FC<{ contactInfo?: SiteContactInfo; retro?: boolean }> = ({ contactInfo, retro }) => {
  const contactItems = buildContactItems(contactInfo ?? {});
  const waUrl = contactInfo?.whatsappChannelUrl;
  // Landing footer: social shown as compact icons instead of text links. Each
  // icon renders only when the BE provides its URL (mirrors HeaderTop).
  const socialIcons = [
    contactInfo?.facebookUrl1 && { label: "Facebook", href: contactInfo.facebookUrl1, Icon: FacebookIcon },
    contactInfo?.instagramUrl && { label: "Instagram", href: contactInfo.instagramUrl, Icon: InstagramIcon },
    waUrl && { label: "WhatsApp", href: waUrl, Icon: WhatsAppGlyph },
  ].filter(Boolean) as { label: string; href: string; Icon: React.FC }[];

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
              <FooterItem key={itemIndex} {...item} retro={retro} />,
            )}
          </div>
        </div>
      ))}

      {/* Contactează-ne */}
      <div className="flex flex-col gap-3">
        <Text variant="heading" className="font-semibold text-lg lg:text-2xl text-white">
          Contacteaza-ne
        </Text>
        {retro ? (
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-3">
              {contactInfo?.phone && <FooterItem type="phone" label={contactInfo.phone} retro />}
              {contactInfo?.email && <FooterItem type="email" label={contactInfo.email} retro />}
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
                    className="text-white transition-colors"
                  >
                    <s.Icon />
                  </a>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {contactItems.map((item, itemIndex) =>
              <FooterItem key={itemIndex} {...item} />,
            )}
          </div>
        )}
      </div>

      {/* WhatsApp - 4th column (only when the BE provides a channel URL) */}
      {waUrl && (
      <div className="lg:flex-shrink-0 lg:min-w-[160px]">
        {/* Mobile: large QR → caption → link */}
        <div className="flex flex-col items-start gap-0 md:hidden">
          <Text variant="heading" className="font-semibold text-lg lg:text-2xl text-white mb-3">
            WhatsApp
          </Text>
          <WhatsAppQR size={84} url={waUrl} />
          <p className="text-xs text-white/45 leading-[1.55] mt-[10px] mb-[12px]">
            Intră pentru a primi ultimele informații
          </p>
          <div className="flex items-center gap-[6px]">
            {!retro && <WhatsAppIcon />}
            <Link
              href={waUrl}
              variant={retro ? LinkVariants.DEFAULT : LinkVariants.FOOTER_ANIMATED}
              linkType="external"
              target="_blank"
              rel="noopener noreferrer"
              className={retro
                ? "text-sm relative w-fit pb-[2px] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-mustard after:transition-[width] after:duration-200 hover:after:w-full"
                : "text-sm"}
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
          <p className="text-xs text-white/45 leading-[1.55] mb-[12px]">
            Intră pentru a primi ultimele informații
          </p>
          <div className="flex items-center gap-[14px]">
            <WhatsAppQR size={72} url={waUrl} />
            <div className="w-px h-[72px] bg-white/15 shrink-0" />
            <div className="flex items-center gap-[6px]">
              {!retro && <WhatsAppIcon />}
              <Link
                href={waUrl}
                variant={retro ? LinkVariants.DEFAULT : LinkVariants.FOOTER_ANIMATED}
                linkType="external"
                target="_blank"
                rel="noopener noreferrer"
                className={retro
                  ? "text-sm relative w-fit pb-[2px] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-mustard after:transition-[width] after:duration-200 hover:after:w-full"
                  : "text-sm"}
              >
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
    <div className="max-w-content mx-auto px-6 md:px-8 py-9 md:py-11 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 lg:gap-10 text-center lg:text-left">
      <div className="lg:max-w-[54%]">
        <h2
          className="font-display font-extrabold text-navy leading-[1.05]"
          style={{ fontSize: "clamp(24px, 3vw, 38px)", letterSpacing: "-0.4px" }}
        >
          Începe aventura pe gheață
        </h2>
        <p className="text-navy/70 text-sm md:text-base leading-relaxed mt-2">
          Cursuri pentru toate vârstele și nivelurile, de la primii pași pe gheață până la performanță.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-center w-full sm:w-auto lg:shrink-0">
        <SpotlightButton layers layersFace="black" href="/inscrieri" className="text-sm" umamiEvent="footer.enroll">
          Înscrieri
        </SpotlightButton>
        <Link
          href="/cursuri"
          linkType="internal"
          variant={LinkVariants.DEFAULT}
          className="inline-flex items-center justify-center border-[1.5px] border-navy !text-navy px-8 py-3.5 text-sm font-bold uppercase tracking-[0.03em] transition-colors hover:bg-black hover:!text-white"
        >
          Școala de patinaj
        </Link>
      </div>
    </div>
  </section>
);

interface FooterProps {
  contactInfo?: SiteContactInfo;
  /** landing-v2 retro treatment: social as icons + phone/email placeholders. */
  retro?: boolean;
  /** When open (and retro), the register band shows as the footer top band. */
  registrationOpen?: boolean;
}

const Footer: React.FC<FooterProps> = ({ contactInfo, retro, registrationOpen }) => {
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
      {retro && registrationOpen !== false && <RegisterBand />}
      <FooterContent contactInfo={contactInfo} retro={retro} />
      <FooterBrandName />
    </footer>
  );
};

export default Footer;
