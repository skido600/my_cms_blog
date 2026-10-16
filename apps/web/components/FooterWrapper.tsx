"use client";

import { usePathname } from "next/navigation";

import Footer from "./Footer";

export default function FooterWrapper() {
  const pathname = usePathname();

  const hideFooter = [
    "/login",
    "/authorized/all",
    "/authorized/admin",
    "/verify",
    "/unsubscribe",
  ].includes(pathname);

  if (hideFooter) return null;

  return (
    <>
      <Footer />
    </>
  );
}
