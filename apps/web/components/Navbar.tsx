"use client";

import { useState } from "react";
import { FaGithub, FaLinkedin, FaXTwitter } from "react-icons/fa6";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

interface NavLink {
  label: string;
  to: string;
}

interface MobileNavProps {
  toggle: () => void;
  navLinks: NavLink[];
  click: boolean;
}

const siteMetadata = {
  linkedin: "https://www.linkedin.com/in/leo-wave-309637239",
  twitter: "https://x.com/Momentum1962",
  github: "https://github.com/skido600",
  FaWhatsapp: "https://wa.me/+2349065849502",
};

const Nav = () => {
  const [click, setClick] = useState(false);

  const toggle = () => {
    setClick((prev) => !prev);
  };

  return (
    <div className="relative">
      <div className="pt-16 sm:pt-20" />

      <header className="fixed top-0 left-0 right-0 z-50 flex h-16 sm:h-20 items-center justify-between px-3 md:px-24  bg-white/40 dark:bg-neutral-950/40 backdrop-blur-2xl backdrop-saturate-150">
        <section className="flex items-center">
          <h1 className="text-xl font-bold text-black dark:text-white">
            Leowave /blog
          </h1>
          <nav
            aria-label="Main navigation"
            className="hidden sm:flex absolute  left-1/2 top-1/2 -translate-x-1/2 -translate-y-4 w-max items-center py-2.5 px-8 border dark:border-neutral-800 border-black  rounded-full font-medium capitalize bg-white/80 text-black backdrop-blur-sm">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                href={link.to}
                className="mx-2 transition-opacity hover:opacity-70">
                {link.label}
              </Link>
            ))}

            <ThemeToggle />
          </nav>
        </section>

        {/* Social Icons */}
        <div className="hidden sm:flex items-center">
          <a
            href={siteMetadata.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="mr-4">
            <FaLinkedin
              size={22}
              className="hover:scale-125 transition-all duration-200"
            />
          </a>

          <a
            href={siteMetadata.twitter}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter / X"
            className="mr-4">
            <FaXTwitter
              size={22}
              className="hover:scale-125 transition-all duration-200"
            />
          </a>

          <a
            href={siteMetadata.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="mr-4">
            <FaGithub
              size={22}
              className="hover:scale-125 transition-all duration-200"
            />
          </a>
        </div>

        {/* Mobile Menu Button (animated spans) */}
        <button
          type="button"
          className="relative flex h-10 w-10 items-center justify-center sm:hidden"
          onClick={toggle}
          aria-label={click ? "Close menu" : "Open menu"}
          aria-expanded={click}>
          <span className="relative block h-4 w-6">
            {/* Top bar */}
            <span
              className={`absolute left-0 top-0 block h-0.5 w-6 rounded-full bg-current transition-all duration-300 ease-in-out ${
                click ? "translate-y-1.75 rotate-45" : ""
              }`}
            />
            {/* Middle bar */}
            <span
              className={`absolute left-0 top-1.75 block h-0.5 w-6 rounded-full bg-current transition-all duration-300 ease-in-out ${
                click ? "scale-x-0 opacity-0" : "scale-x-100 opacity-100"
              }`}
            />
            {/* Bottom bar */}
            <span
              className={`absolute left-0 top-3.5 block h-0.5 w-6 rounded-full bg-current transition-all duration-300 ease-in-out ${
                click ? "-translate-y-1.75 -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </header>

      {/* Mobile Nav */}
      <MobileNav click={click} navLinks={navLinks} toggle={toggle} />
    </div>
  );
};

export default Nav;

const MobileNav = ({ click, navLinks, toggle }: MobileNavProps) => {
  return (
    <nav
      aria-label="Mobile navigation"
      className={`w-max py-3 z-50 px-6 sm:px-8 border dark:backdrop-blur-md border-black dark:border-neutral-700 rounded-full font-medium capitalize items-center flex sm:hidden fixed top-16 right-1/2 translate-x-1/2 bg-white/80 dark:bg-neutral-900/90 backdrop-blur-sm origin-top transition-all duration-300 ease-out ${
        click
          ? "translate-y-0 scale-100 opacity-100"
          : "-translate-y-6 scale-90 opacity-0 pointer-events-none"
      }`}>
      {navLinks.map((link) => (
        <Link key={link.to} href={link.to} onClick={toggle} className="mx-2">
          {link.label}
        </Link>
      ))}

      <ThemeToggle />
    </nav>
  );
};
