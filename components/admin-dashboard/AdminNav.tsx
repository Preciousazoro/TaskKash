"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Settings,
  Plus,
  Wallet,
  FileText,
} from "lucide-react";

export default function UserNav() {
  const pathname = usePathname();
  const basePath = "/admin-dashboard";

  const navItems = [
    {
      name: "Home",
      icon: LayoutDashboard,
      href: `${basePath}/dashboard`,
    },
    {
      name: "Publish",
      icon: Plus,
      href: `${basePath}/tasks/create`,
    },
    {
      name: "Payout",
      icon: Wallet,
      href: `${basePath}/withdrawals`,
    },
    {
      name: "Entry",
      icon: FileText,
      href: `${basePath}/submissions`,
    },
    {
      name: "Users",
      icon: Users,
      href: `${basePath}/users`,
    },
    {
      name: "Settings",
      icon: Settings,
      href: `${basePath}/settings`,
    },
  ];

  const isActive = (href: string) =>
    pathname === href || pathname?.startsWith(`${href}/`);

  return (
    <nav
      className="
        fixed bottom-0 left-0 right-0 z-50
        lg:hidden
        flex items-center justify-around
        border-t border-border/60
        bg-background/95 backdrop-blur-xl
        px-2 py-2 pb-3
        shadow-[0_-10px_35px_-15px_rgba(0,0,0,0.35)]
      "
    >
      {navItems.map(({ name, href, icon: Icon }) => {
        const active = isActive(href);

        return (
          <Link
            key={name}
            href={href}
            className={`
              flex flex-col items-center justify-center
              transition-all duration-300
              ${
                active
                  ? "scale-105"
                  : "opacity-80 hover:opacity-100 hover:scale-[1.02]"
              }
            `}
          >
            {/* Icon wrapper */}
            <div
              className={`
                flex items-center justify-center
                w-12 h-12 rounded-lg mb-1.5
                transition-all duration-300
                ${
                  active
                    ? `
                      bg-gradient-to-r from-green-500 to-emerald-500 text-white
                    `
                    : `
                      bg-muted/50 text-muted-foreground
                    `
                }
              `}
            >
              <Icon
                className={`
                  w-5 h-5 transition-all duration-300
                  ${
                    active
                      ? "text-white scale-110"
                      : "text-muted-foreground opacity-80"
                  }
                `}
              />
            </div>

            {/* Label */}
            <span
              className={`
                text-[11px]
                uppercase
                font-black
                tracking-wide
                transition-all duration-300
                ${
                  active
                    ? "text-foreground opacity-100"
                    : "text-muted-foreground opacity-80"
                }
              `}
            >
              {name}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}