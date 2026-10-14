"use client";

import { usePathname } from "next/navigation";
import Nav from "./Navbar";

export default function NavbarWrapper() {
  const pathname = usePathname();

  const hideNavbar = [
    "/login",
    "/authorized/all",
    "/authorized/admin",
  ].includes(pathname);

  if (hideNavbar) return null;

  return <Nav />;
}
