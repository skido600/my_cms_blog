"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useLogout } from "../../../../hook/auth";
import { ThemeToggle } from "../../../../components/ThemeToggle";
import { Menu, Home, Box, X, LogOut, LandPlot } from "lucide-react";
import { useAuthStore } from "../../../../store/auth.store";

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
  const email = useAuthStore((state) => state.email);
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<StoredUser | null>(null);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

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
  const logoutMutation = useLogout();
  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    toast.success("Logged out successfully", { style: successToastStyle });
    router.push("/login");
  };

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
                  {email ? `Logged in as ${email}` : "Loading user..."}
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-600 transition-colors hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60 dark:text-neutral-300 dark:hover:bg-red-500/10 dark:hover:text-red-400">
            <LogOut className="h-5 w-5 shrink-0" aria-hidden />
            {logoutMutation.isPending ? "Signing out…" : "Logout"}
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
