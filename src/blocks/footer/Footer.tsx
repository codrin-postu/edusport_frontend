import { Link } from "@/components";
import { cn } from "@/utils/cn";
import { LinkVariants } from "@/utils/constants";
import { MAX_CONTENT_WIDTH } from "@/utils/style-constants";
import Image from "next/image";
import React from "react";

const footerLinks = [
  {
    label: "Acasa",
    href: "/",
  },
  {
    label: "Despre Noi",
    href: "/about",
    subLinks: [
      { label: "Echipa", href: "/about/team" },
      { label: "Istoric", href: "/about/history" },
    ],
  },
  {
    label: "Cursuri",
    href: "/courses",
    subLinks: [{ label: "Cursuri de Grup", href: "/courses/group" }],
  },
];

//TODO: Rename footer areas to more descriptive names

const ContactArea: React.FC = () => (
  <div className="md:w-3/10 w-full flex flex-col items-start mb-8 md:mb-0">
    <Image
      src="/logo.png"
      alt="EduSport Logo"
      width={128}
      height={96}
      className="mb-4 h-24 w-32"
    />
    <div className="mb-4">
      <p className="font-normal">Contact</p>
    </div>
    <div className="mb-4">
      <p>Adresa: 123 Main St, City, Country</p>
      <p>Telefon: (123) 456-7890</p>
    </div>
    <div className="flex gap-3">
      <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
        <Image
          src="/icons/facebook.svg"
          alt="Facebook"
          width={24}
          height={24}
          className="w-6 h-6"
        />
      </a>
      {/*TODO: Add more social icons here */}
    </div>
  </div>
);

const LinksMapArea: React.FC = () => (
  <div className="md:w-7/10 w-full flex flex-col justify-between items-end">
    <nav className="mb-15 w-full">
      <ul className="flex flex-col md:flex-row md:justify-end lg:space-x-60 md:space-x-40">
        {footerLinks.map((link) => (
          <li key={link.href} className="relative group text-start pe-10">
            <Link href={link.href} variant={LinkVariants.FOOTER}>
              {link.label}
            </Link>
            {link.subLinks && link.subLinks.length > 0 && (
              <ul className="mt-9 flex flex-col items-start gap-2">
                {link.subLinks.map((subLink) => (
                  <li key={subLink.href}>
                    <Link href={subLink.href} variant={LinkVariants.FOOTER}>
                      {subLink.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
    <div className="w-full md:max-w-[1120px] h-[350px] rounded-lg overflow-hidden">
      <iframe
        title="EduSport Location"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.835434509374!2d144.9537363153169!3d-37.81720997975171!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad65d43f1f1f1f1%3A0x5045675218ce6e0!2s123%20Main%20St%2C%20City%2C%20Country!5e0!3m2!1sen!2s!4v1680000000000!5m2!1sen!2s"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  </div>
);

const BottomLinksArea: React.FC = () => (
  <div className="pt-10 flex flex-row justify-between text-sm opacity-80 w-full">
    <span>
      &copy; {new Date().getFullYear()} EduSport. All rights reserved.
    </span>
    <div className="flex flex-col md:flex-row md:space-x-12 space-y-2 md:space-y-0">
      <Link href="/term" variant={LinkVariants.FOOTER}>
        Terms & Conditions
      </Link>
      <Link href="/privacy" variant={LinkVariants.FOOTER}>
        Privacy Policy
      </Link>
      <Link href="/cookies" variant={LinkVariants.FOOTER}>
        Cookies
      </Link>
    </div>
  </div>
);

const Footer: React.FC = () => {
  return (
    <footer className={cn("bg-[#193976]", "text-white", "py-16", "px-20")}>
      <div
        className={cn(
          "flex",
          "flex-col",
          "items-center",
          "mx-auto",
          `max-w-[${MAX_CONTENT_WIDTH}]`,
        )}
      >
        <div
          className={cn(
            "flex",
            "flex-col",
            "md:flex-row",
            "gap-8",
            "md:gap-0",
            "w-full",
            "justify-center",
            "items-center",
          )}
        >
          <ContactArea />
          <LinksMapArea />
        </div>
        <BottomLinksArea />
      </div>
    </footer>
  );
};

export default Footer;
