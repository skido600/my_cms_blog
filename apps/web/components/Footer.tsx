import Link from "next/link";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import { siteMetadata } from "../helper/data";
import Subscriber from "./Subscriber";

const pages = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
];

const socials = [
  { label: "GitHub", href: siteMetadata.github, Icon: FaGithub },
  { label: "Twitter", href: siteMetadata.twitter, Icon: FaTwitter },
  { label: "LinkedIn", href: siteMetadata.linkedin, Icon: FaLinkedin },
];

function Footer() {
  return (
    <footer className="mx-2 mb-2 mt-16 rounded-2xl border border-neutral-200 bg-neutral-50 sm:mx-10 sm:mb-10 dark:border-neutral-800 dark:bg-neutral-900">
      <div className="grid gap-10 px-6 py-10 sm:px-10 md:grid-cols-[1fr_auto] md:gap-24">
        <div className="max-w-md">
          <h1 className="text-xl font-bold text-black dark:text-white">
            Leowave /blog
          </h1>
          <p className="mt-3 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
            Notes on JavaScript, TypeScript and whatever I&apos;m building at
            the moment. New posts land in your inbox, nothing else.
          </p>

          <div className="mt-5">
            <Subscriber />
          </div>
        </div>

        <nav aria-label="Footer">
          <ul className="mt-4 space-y-2.5 text-sm">
            {pages.map((page) => (
              <li key={page.to}>
                <Link
                  href={page.to}
                  className="text-neutral-600 transition-colors hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white">
                  {page.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="flex flex-col items-center justify-between gap-4 border-t border-neutral-200 px-6 py-5 sm:flex-row sm:px-10 dark:border-neutral-800">
        <span className="text-sm text-neutral-500">
          &copy; {new Date().getFullYear()} Leo
        </span>

        <div className="flex items-center gap-5">
          {socials.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="text-neutral-500 transition-colors hover:text-neutral-950 dark:hover:text-white">
              <Icon size={18} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
