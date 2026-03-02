import { Link } from "@/components";
import { Text } from "@/components/ui/text";
import { cn } from "@/utils/cn";
import { BRAND_NAME, LinkVariants } from "@/utils/constants";
import React from "react";

const footerSections = {
  left: [
    {
      title: "Meniu",
      items: [
        { label: "Despre noi", href: "/about", type: "link" },
        { label: "Cursuri de patinaj", href: "/courses", type: "link" },
        { label: "Program", href: "/schedule", type: "link" },
        { label: "Regulament", href: "/rules", type: "link" },
      ],
    },
    {
      title: "Informații legale",
      items: [
        { label: "Termeni și condiții", href: "/terms", type: "link" },
        { label: "Politica de Cookies", href: "/cookies", type: "link" },
        {
          label: "Politica de confidentialitate",
          href: "/privacy",
          type: "link",
        },
        { label: "ANPC", href: "/anpc", type: "link" },
        {
          label: "Solutionarea online a litigiilor",
          href: "/odr",
          type: "link",
        },
      ],
    },
  ],
  right: {
    title: "Contacteaza-ne",
    items: [
      { label: "0723 623 712", type: "phone" },
      { label: "scoala.de.patinaj@gmail.com", type: "email" },
      {
        label: "Facebook",
        href: "https://facebook.com",
        type: "social",
        icon: "facebook",
      },
      {
        label: "Instagram",
        href: "https://instagram.com",
        type: "social",
        icon: "instagram",
      },
    ],
  },
};

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

const FooterLink: React.FC<{ label: string; href: string }> = ({
  label,
  href,
}) => {
  return (
    <Link
      href={href}
      className="text-base font-base"
      variant={LinkVariants.FOOTER_ANIMATED}
      linkType="external"
    >
      {label}
    </Link>
  );
};

const FooterText: React.FC<{ label: string }> = ({ label }) => {
  return <Text className="text-white">{label}</Text>;
};

const FooterPhone: React.FC<{ label: string }> = ({ label }) => {
  return (
    <Link
      href={`tel:${label.replace(/\s/g, "")}`}
      className="text-base font-base"
      variant={LinkVariants.FOOTER_ANIMATED}
      linkType="phone"
    >
      {label}
    </Link>
  );
};

const FooterEmail: React.FC<{ label: string }> = ({ label }) => {
  return (
    <Link
      href={`mailto:${label}`}
      className="text-base font-base"
      variant={LinkVariants.FOOTER_ANIMATED}
      linkType="email"
    >
      {label}
    </Link>
  );
};

const FooterSocialLink: React.FC<{ label: string; href: string }> = ({
  label,
  href,
}) => {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-base font-base"
      variant={LinkVariants.FOOTER_ANIMATED}
      linkType="external"
    >
      {label}
    </Link>
  );
};

const renderFooterItem = (
  item: { label: string; href?: string; type: string; icon?: string },
  itemIndex: number,
) => {
  switch (item.type) {
    case "link":
      return (
        <FooterLink key={itemIndex} label={item.label} href={item.href!} />
      );
    case "text":
      return <FooterText key={itemIndex} label={item.label} />;
    case "phone":
      return <FooterPhone key={itemIndex} label={item.label} />;
    case "email":
      return <FooterEmail key={itemIndex} label={item.label} />;
    case "social":
      return (
        <FooterSocialLink
          key={itemIndex}
          label={item.label}
          href={item.href!}
        />
      );
    default:
      return null;
  }
};

const FooterContent: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row max-footer-content lg:justify-between gap-8 md:gap-12 px-22 py-10 mx-auto">
      {/* On mobile: all sections in column */}
      {/* On md: all 3 sections in row */}
      {/* On lg+: first 2 sections grouped left, contact on right */}

      {/* Left group - Menu sections */}
      <div className="contents md:contents lg:flex lg:flex-row lg:gap-12">
        {footerSections.left.map((section, index) => (
          <div key={index} className="flex flex-col gap-3">
            <Text
              variant="heading"
              className="font-semibold text-lg lg:text-2xl text-white"
            >
              {section.title}
            </Text>
            <div className="flex flex-col gap-3">
              {section.items.map((item, itemIndex) =>
                renderFooterItem(item, itemIndex),
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Right group - Contact section */}
      <div className="flex flex-col gap-3">
        <Text
          variant="heading"
          className="font-semibold text-lg lg:text-2xl text-white"
        >
          {footerSections.right.title}
        </Text>
        <div className="flex flex-col gap-3">
          {footerSections.right.items.map((item, itemIndex) =>
            renderFooterItem(item, itemIndex),
          )}
        </div>
      </div>
    </div>
  );
};

const Footer: React.FC = () => {
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
      <FooterContent />
      <FooterBrandName />
    </footer>
  );
};

export default Footer;
