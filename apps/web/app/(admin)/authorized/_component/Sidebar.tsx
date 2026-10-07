"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

import { ThemeToggle } from "../../../../components/ThemeToggle";
import { Menu, Home, Box, X, LogOut, LandPlot } from "lucide-react";

const successToastStyle = {
  backgroundColor: "#38A169",
  color: "white",
  border: "none",
};

const errorToastStyle = {
  backgroundColor: "#F56565",
  color: "white",
  border: "none",
};

type StoredUser = { email: string; role: string };

const navItems = [
  { name: "Dashboard", href: "/authorized/admin", icon: Home },
  { name: "All posts", href: "/authorized/all", icon: LandPlot },
];

function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<StoredUser | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  /* ------------------------------ Load user ------------------------------ */

  //   useEffect(() => {
  //     try {
  //       const stored = localStorage.getItem("user");
  //       if (stored) setUser(JSON.parse(stored));
  //     } catch (error) {
  //       console.error("Error reading user from localStorage:", error);
  //     }
  //   }, []);

  /* ------------------- Close the drawer on route change ------------------- */

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  /* ----- Mobile drawer: Escape to close, lock scroll, close on resize ----- */

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    const mq = window.matchMedia("(min-width: 768px)");
    const onResize = () => {
      if (mq.matches) setIsOpen(false);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    document.addEventListener("keydown", onKeyDown);
    mq.addEventListener("change", onResize);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      mq.removeEventListener("change", onResize);
    };
  }, [isOpen]);

  /* -------------------------------- Logout -------------------------------- */

  //   const handleLogout = async () => {
  //     if (isLoggingOut) return;
  //     setIsLoggingOut(true);

  //     // Read the token here, not during render: localStorage doesn't exist on the server.
  //     let token: string | null = null;
  //     try {
  //       token = localStorage.getItem("token");
  //     } catch {
  //       /* ignore */
  //     }

  //     try {
  //       const response = await fetch(LOGOUT_URL, {
  //         method: "POST",
  //         headers: { Authorization: `Bearer ${token}` },
  //         credentials: "include",
  //       });

  //       const data = await response.json().catch(() => ({}));

  //       if (!response.ok) throw new Error(data.message || "Logout failed");

  //       toast.success(data.message || "Logged out successfully", {
  //         style: successToastStyle,
  //       });
  //     } catch (error) {
  //       toast.error((error as Error).message || "Something went wrong", {
  //         style: errorToastStyle,
  //       });
  //     } finally {
  //       // Always end the session on this device, even if the server call failed.
  //       try {
  //         localStorage.removeItem("user");
  //         localStorage.removeItem("token");
  //       } catch {
  //         /* ignore */
  //       }
  //       setIsLoggingOut(false);
  //       router.push("/login");
  //     }
  //   };

  /* --------------------------------- Render -------------------------------- */

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      {/* Mobile menu button */}
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
        aria-controls="admin-sidebar"
        className="fixed right-3 top-3 z-50 rounded-lg border border-neutral-300 bg-white/90 p-2 text-neutral-800 shadow-sm backdrop-blur md:hidden dark:border-neutral-700 dark:bg-[#1b1b1b]/90 dark:text-white">
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden
        />
      )}

      {/* Sidebar */}
      <aside
        id="admin-sidebar"
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-neutral-300 bg-[#FBFBFB] transition-transform duration-300 ease-in-out dark:border-neutral-800 dark:bg-[#1b1b1b] md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}>
        {/* Brand */}
        <div className="flex items-center gap-3 border-b border-neutral-200 px-5 py-5 dark:border-neutral-800">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#213555] text-sm font-bold text-white">
            A
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-neutral-900 dark:text-white">
              Admin
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Dashboard
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav aria-label="Admin" className="flex-1 overflow-y-auto px-3 py-4">
          <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
            Menu
          </p>

          <ul className="space-y-1">
            {navItems.map(({ name, href, icon: Icon }) => {
              const active = isActive(href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      active
                        ? "bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300"
                        : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                    }`}>
                    <Icon />
                    {name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="space-y-3 border-t border-neutral-200 p-3 dark:border-neutral-800">
          <div className="px-1">
            <ThemeToggle />
          </div>

          {/* Profile */}
          <div className="flex items-center gap-3 rounded-lg bg-neutral-100 p-3 dark:bg-neutral-800/60">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#213555] text-sm font-semibold text-white">
              {user ? user.email.charAt(0).toUpperCase() : "?"}
            </span>

            <div className="min-w-0">
              {user ? (
                <>
                  <p
                    title={user.email}
                    className="truncate text-sm font-medium text-neutral-800 dark:text-white">
                    {user.email}
                  </p>
                  <p className="text-xs font-semibold tracking-wide text-neutral-500 dark:text-neutral-400">
                    {user.role?.toUpperCase()}
                  </p>
                </>
              ) : (
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Not signed in
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            // onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-600 transition-colors hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60 dark:text-neutral-300 dark:hover:bg-red-500/10 dark:hover:text-red-400">
            <LogOut className="h-5 w-5 shrink-0" aria-hidden />
            {isLoggingOut ? "Signing out…" : "Logout"}
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
