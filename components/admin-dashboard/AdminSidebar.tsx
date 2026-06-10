"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Layout,
  CheckCircle,
  Users,
  FileText,
  Wallet,
  Award,
  Settings,
  User as UserIcon,
  LogOut,
  X,
  Calendar,
  MessageSquare,
  ArrowDown,
  Send,
  History,
  ChevronDown,
  LayoutDashboard,
  Lock,
} from "lucide-react";
import { useAdminData } from "@/components/providers/AdminDataProvider";

type NavItem =
  | { name: string; icon: React.ElementType; href: string; color?: string }
  | {
      name: string;
      icon: React.ElementType;
      color?: string;
      children: { name: string; icon: React.ElementType; href: string; color?: string }[];
    };

const AdminSidebar = () => {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { admin, loading } = useAdminData();

  useEffect(() => {
    const onOpen = () => setMenuOpen(true);
    window.addEventListener("open-sidebar", onOpen);
    return () => window.removeEventListener("open-sidebar", onOpen);
  }, []);

  const getInitials = (name: string) =>
    name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-70 border-r h-screen sticky top-0 bg-background flex-col shadow-xl">
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between h-15 px-6 border-b border-border">
          <div className="flex flex-col">
            <h1 className="text-xl font-black uppercase tracking-tighter text-foreground">
              Admin<span className="text-green-500"> Dashboard</span>
            </h1>
            <p className="text-[8px] font-bold tracking-[0.2em] text-muted-foreground uppercase">
              Manage your platform
            </p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 min-h-0 overflow-y-auto px-4 py-5 space-y-1 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
          <SidebarNavItems
            admin={admin}
            loading={loading}
            getInitials={getInitials}
            pathname={pathname}
            onLinkClick={() => {}}
          />
        </nav>

        {/* Logout */}
        <div className="flex-shrink-0 border-t border-border px-4 py-2">
          <Link
            href="/auth/login"
            className="flex items-center cursor-pointer w-full px-4 py-3 text-red-500 hover:bg-red-500/10 transition-all rounded-sm group"
          >
            <LogOut className="w-5 h-5 mr-3 group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-black uppercase tracking-widest">
              Logout My Account
            </span>
          </Link>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={() => setMenuOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 90, damping: 15 }}
              className="fixed top-0 left-0 w-full h-full bg-background z-100 flex flex-col shadow-2xl"
            >
              {/* Mobile Header */}
              <div className="flex-shrink-0 flex items-center justify-between h-16 px-6 border-b border-border">
                <div className="flex flex-col">
                  <h1 className="text-xl font-black uppercase tracking-tighter text-foreground">
                    Admin<span className="text-green-500"> Dashboard</span>
                  </h1>
                  <p className="text-[8px] font-bold tracking-[0.2em] text-muted-foreground uppercase">
                    Manage your platform
                  </p>
                </div>
                <button
                  className="rounded-lg text-foreground"
                  onClick={() => setMenuOpen(false)}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Nav */}
              <nav className="flex-1 min-h-0 overflow-y-auto px-4 py-5 space-y-1 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
                <SidebarNavItems
                  admin={admin}
                  loading={loading}
                  getInitials={getInitials}
                  pathname={pathname}
                  onLinkClick={() => setMenuOpen(false)}
                />
              </nav>

              {/* Mobile Logout */}
              <div className="flex-shrink-0 border-t border-border px-4 py-2">
                <Link
                  href="/auth/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center cursor-pointer w-full px-4 py-3 text-red-500 hover:bg-red-500/10 transition-all rounded-sm group"
                >
                  <LogOut className="w-5 h-5 mr-3 group-hover:-translate-x-1 transition-transform" />
                  <span className="text-xs font-black uppercase tracking-widest">
                    Logout My Account
                  </span>
                </Link>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminSidebar;

/* ── Sidebar Nav Items (shared between desktop & mobile) ── */
function SidebarNavItems({
  admin,
  loading,
  getInitials,
  pathname,
  onLinkClick,
}: {
  admin: any;
  loading: boolean;
  getInitials: (name: string) => string;
  pathname: string;
  onLinkClick: () => void;
}) {
  const basePath = "/admin-dashboard";

  const navItems: NavItem[] = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      href: `${basePath}/dashboard`,
      color: "text-green-500",
    },
    {
      name: "Manage Tasks",
      icon: CheckCircle,
      color: "text-green-500",
      children: [
        {
          name: "Active Tasks",
          icon: CheckCircle,
          href: `${basePath}/manage-tasks`,
          color: "text-green-500",
        },
        {
          name: "Task History",
          icon: History,
          href: `${basePath}/manage-tasks/history`,
          color: "text-green-500",
        },
      ],
    },
    {
      name: "Users Management",
      icon: Users,
      href: `${basePath}/users`,
      color: "text-green-500",
    },
    {
      name: "Users Submissions",
      icon: FileText,
      href: `${basePath}/submissions`,
      color: "text-green-500",
    },
    {
      name: "Payout Requests",
      icon: Wallet,
      href: `${basePath}/withdrawals`,
      color: "text-green-500",
    },
    {
      name: "Contact Messages",
      icon: MessageSquare,
      href: `${basePath}/contact-messages`,
      color: "text-green-500",
    },
    {
      name: "Bookings",
      icon: Calendar,
      href: `${basePath}/bookings`,
      color: "text-green-500",
    },
    {
      name: "Broadcast",
      icon: Send,
      href: `${basePath}/broadcast`,
      color: "text-green-500",
    },
    {
      name: "Rewards",
      icon: Award,
      href: `${basePath}/rewards`,
      color: "text-green-500",
    },
    {
      name: "Settings",
      icon: Settings,
      color: "text-green-500",
      children: [
        {
          name: "Admin Profile",
          icon: UserIcon,
          href: `${basePath}/profile`,
          color: "text-green-500",
        },
        {
          name: "Admin Settings",
          icon: Settings,
          href: `${basePath}/settings`,
          color: "text-green-500",
        },
        {
          name: "Switch To User",
          icon: Lock,
          href: "/user-dashboard/dashboard",
          color: "text-cyan-500",
        },
      ],
    },
  ];

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    "Manage Tasks": true,
    "Settings": true,
  });

  useEffect(() => {
    navItems.forEach((item) => {
      if ("children" in item) {
        const hasActive = item.children.some((c) => pathname.startsWith(c.href));
        if (hasActive) {
          setOpenGroups((prev) => ({ ...prev, [item.name]: true }));
        }
      }
    });
  }, [pathname]);

  const toggleGroup = (name: string) =>
    setOpenGroups((prev) => ({ ...prev, [name]: !prev[name] }));

  return (
    <>
      {/* Admin Profile Widget */}
      <div className="mb-5 px-4 py-3 rounded-sm bg-muted/40 border border-border">
        <Link
          href="/admin-dashboard/profile"
          onClick={onLinkClick}
          className="flex items-center gap-3"
        >
          {admin?.avatarUrl ? (
            <img
              src={admin.avatarUrl}
              alt={admin.name}
              className="w-9 h-9 rounded-full object-cover flex-shrink-0"
            />
          ) : admin?.name ? (
            <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-black flex-shrink-0">
              {getInitials(admin.name)}
            </div>
          ) : (
            <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
              <UserIcon className="w-4 h-4 text-green-500" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-black uppercase tracking-widest text-foreground truncate">
              {loading ? "Loading..." : admin?.name || "Admin"}
            </p>
            <p className="text-[10px] font-bold tracking-widest text-green-500 uppercase">
              {admin?.role === "admin" ? "Administrator" : "User"}
            </p>
          </div>
        </Link>
      </div>

      {/* Nav Links */}
      <div className="space-y-1">
        {navItems.map((item) => {
          if ("href" in item) {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onLinkClick}
                className={`group flex items-center px-4 py-2.5 rounded-sm transition-all duration-200 ${
                  active
                    ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <item.icon
                  className={`w-5 h-5 mr-5 transition-transform flex-shrink-0 ${
                    active
                      ? "text-white scale-110"
                      : `${item.color ?? "text-green-500"} group-hover:scale-110`
                  }`}
                />
                <span className="text-[12px] font-black uppercase tracking-widest">
                  {item.name}
                </span>
              </Link>
            );
          }

          const isOpen = !!openGroups[item.name];
          const hasActiveChild =
            "children" in item &&
            item.children.some((c) => pathname.startsWith(c.href));

          return (
            <div key={item.name} className="flex flex-col">
              <button
                onClick={() => toggleGroup(item.name)}
                className={`group w-full flex items-center px-4 py-2.5 rounded-sm transition-all duration-200 cursor-pointer ${
                  hasActiveChild
                    ? "text-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <item.icon
                  className={`w-5 h-5 mr-5 flex-shrink-0 transition-transform ${
                    hasActiveChild
                      ? `scale-110 ${item.color ?? "text-green-500"}`
                      : `${item.color ?? "text-green-500"} group-hover:scale-110`
                  }`}
                />
                <span className="flex-1 text-left text-[12px] font-black uppercase tracking-widest">
                  {item.name}
                </span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div className={`${isOpen ? "block" : "hidden"} transition-all duration-300`}>
                <div className="ml-4 mt-1 mb-1 pl-4 border-l border-border space-y-0.5">
                  {"children" in item &&
                    item.children.map((child) => {
                      const childActive = pathname.startsWith(child.href);
                      return (
                        <Link
                          key={child.name}
                          href={child.href}
                          onClick={onLinkClick}
                          className={`group flex items-center gap-3 px-3 py-2 rounded-sm transition-all duration-200 ${
                            childActive
                              ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/20"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          }`}
                        >
                          <child.icon
                            className={`w-4 h-4 flex-shrink-0 transition-transform ${
                              childActive
                                ? "text-white scale-110"
                                : `${child.color ?? "text-green-500"} group-hover:scale-110`
                            }`}
                          />
                          <span className="text-[11px] font-black uppercase tracking-widest">
                            {child.name}
                          </span>
                        </Link>
                      );
                    })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}