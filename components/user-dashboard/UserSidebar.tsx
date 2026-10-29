"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  Users,
  Megaphone,
  Settings,
  ThumbsUp,
  ShoppingCart,
  Smile,
  Wallet,
  LayoutDashboard,
  History,
  ClipboardList,
  X,
  LogOut,
  ChevronDown,
  Gem,
  Trophy,
  Crown,
  BadgeCheck,
  Lock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";

type NavChild = {
  name: string;
  icon: React.ElementType;
  href: string;
  color?: string;
};

type NavItem =
  | { name: string; icon: React.ElementType; href: string; color?: string }
  | {
      name: string;
      icon: React.ElementType;
      color?: string;
      children: NavChild[];
    };

export default function UserSidebar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const { data: session } = useSession();
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!session?.user?.id) return;
      try {
        const response = await fetch("/api/profile");
        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, [session]);

  useEffect(() => {
    const onOpen = () => setMenuOpen(true);
    window.addEventListener("open-sidebar", onOpen);
    return () => window.removeEventListener("open-sidebar", onOpen);
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showLogoutConfirm && countdown > 0) {
      timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    } else if (countdown === 0) {
      setShowLogoutConfirm(false);
      setCountdown(10);
    }
    return () => clearTimeout(timer);
  }, [showLogoutConfirm, countdown]);

  const router = useRouter();
  const isAdmin = userData?.role === "admin";

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex border-r h-screen sticky top-0 bg-background flex-col shadow-xl transition-all duration-300 ${
          isCollapsed ? "w-20" : "w-70"
        }`}
      >
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between h-15 px-4 border-b border-border">
          {!isCollapsed && (
            <div className="flex flex-col">
              <h1 className="text-xl font-black uppercase tracking-tighter text-foreground">
                User<span className="text-green-500"> Dashboard</span>
              </h1>
              <p className="text-[8px] font-bold tracking-[0.2em] text-muted-foreground uppercase">
                Manage your account
              </p>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-muted transition-colors ml-auto"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            ) : (
              <ChevronLeft className="w-5 h-5 text-muted-foreground" />
            )}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 min-h-0 overflow-y-auto px-4 py-5 space-y-1 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
          <SidebarNavItems
            userData={userData}
            isAdmin={isAdmin}
            isCollapsed={isCollapsed}
            onLinkClick={() => {}}
          />
        </nav>

        {/* Logout */}
        <div className="flex-shrink-0 border-t border-border px-4 py-2">
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center cursor-pointer w-full px-4 py-3 text-red-500 hover:bg-red-500/10 transition-all rounded-sm group justify-center"
          >
            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform flex-shrink-0" />
            {!isCollapsed && (
              <span className="text-xs font-black uppercase tracking-widest ml-3">
                Logout
              </span>
            )}
          </button>
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
                    User<span className="text-green-500"> Dashboard</span>
                  </h1>
                  <p className="text-[8px] font-bold tracking-[0.2em] text-muted-foreground uppercase">
                    Manage your account
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
                  userData={userData}
                  isAdmin={isAdmin}
                  isCollapsed={false}
                  onLinkClick={() => setMenuOpen(false)}
                />
              </nav>

              {/* Mobile Logout */}
              <div className="flex-shrink-0 border-t border-border px-4 py-2">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    setShowLogoutConfirm(true);
                  }}
                  className="flex items-center cursor-pointer w-full px-4 py-3 text-red-500 hover:bg-red-500/10 transition-all rounded-sm group"
                >
                  <LogOut className="w-5 h-5 mr-3 group-hover:-translate-x-1 transition-transform" />
                  <span className="text-xs font-black uppercase tracking-widest">
                    Logout
                  </span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Logout Modal */}
      {showLogoutConfirm && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={() => setShowLogoutConfirm(false)}
        >
          <div
            className="bg-background/95 border border-border rounded-[1.5rem] shadow-2xl w-full max-w-sm p-8 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-black uppercase tracking-tighter text-foreground mb-2">
              Logout
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Are you sure you want to sign out? You'll need to log in again to
              access your account.
            </p>

            {/* Countdown Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-xs text-muted-foreground mb-2">
                <span>Auto-closing in...</span>
                <span>{countdown}s</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div
                  className="bg-red-500 h-2 rounded-full transition-all duration-1000 ease-linear"
                  style={{ width: `${(countdown / 10) * 100}%` }}
                />
              </div>
            </div>

            <div className="flex sm:flex-row gap-3 mt-6">
              <button
                onClick={() => {
                  setShowLogoutConfirm(false);
                  setCountdown(10);
                }}
                className="flex-1 px-6 py-3 rounded-lg bg-secondary cursor-pointer text-foreground font-bold text-xs uppercase tracking-widest"
              >
                Stay
              </button>
              <button
                onClick={() => {
                  router.push("/auth/login");
                  toast.success("Successfully signed out");
                  setShowLogoutConfirm(false);
                  setCountdown(10);
                }}
                className="flex-1 px-6 py-3 rounded-lg bg-red-500 cursor-pointer text-white font-bold text-xs uppercase tracking-widest hover:bg-red-600 transition-colors"
              >
                Exit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ── Collapsed group: icon button + popup rendered in a portal over everything ── */
function CollapsedGroup({
  item,
  hasActiveChild,
  pathname,
  onLinkClick,
}: {
  item: Extract<NavItem, { children: NavChild[] }>;
  hasActiveChild: boolean;
  pathname: string;
  onLinkClick: () => void;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [open, setOpen] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  const measure = () => {
    const el = wrapperRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    // Estimated popup height so it never runs off the bottom of the screen
    const estimatedHeight = item.children.length * 42 + 56;
    const top = Math.max(
      8,
      Math.min(rect.top, window.innerHeight - estimatedHeight - 8)
    );
    setPos({ top, left: rect.right + 8 });
  };

  const clearHide = () => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
  };

  const show = () => {
    clearHide();
    measure();
    setOpen(true);
  };

  // Small delay so the mouse can cross the gap between icon and popup
  const hideSoon = () => {
    if (pinned) return;
    clearHide();
    hideTimer.current = setTimeout(() => setOpen(false), 140);
  };

  const close = () => {
    clearHide();
    setOpen(false);
    setPinned(false);
  };

  const handleClick = () => {
    if (pinned) {
      close();
    } else {
      measure();
      setPinned(true);
      setOpen(true);
    }
  };

  // Close when clicking outside
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        wrapperRef.current?.contains(target) ||
        popupRef.current?.contains(target)
      )
        return;
      close();
    };
    const onScroll = () => close();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("mousedown", onDown);
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onScroll);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onScroll);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Close after navigating
  useEffect(() => {
    close();
  }, [pathname]);

  useEffect(() => () => clearHide(), []);

  return (
    <div
      ref={wrapperRef}
      onMouseEnter={show}
      onMouseLeave={hideSoon}
    >
      <button
        onClick={handleClick}
        className={`group w-full flex items-center justify-center px-4 py-2.5 rounded-sm transition-all duration-200 cursor-pointer ${
          open
            ? "bg-muted text-foreground"
            : hasActiveChild
            ? "text-foreground"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        }`}
        title={item.name}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <item.icon
          className={`w-5 h-5 flex-shrink-0 transition-transform ${
            hasActiveChild
              ? `scale-110 ${item.color ?? "text-foreground"}`
              : `${item.color ?? "text-muted-foreground"} group-hover:scale-110`
          }`}
        />
      </button>

      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={popupRef}
            role="menu"
            onMouseEnter={show}
            onMouseLeave={hideSoon}
            style={{ position: "fixed", top: pos.top, left: pos.left }}
            className="z-[1000] w-52 rounded-xl border border-border bg-card shadow-2xl animate-in fade-in slide-in-from-left-1 duration-150"
          >
            <div className="px-4 pt-3 pb-1 text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">
              {item.name}
            </div>
            <div className="p-2 space-y-1">
              {item.children.map((child) => {
                const childActive = pathname === child.href;
                return (
                  <Link
                    key={child.name}
                    href={child.href}
                    onClick={() => {
                      close();
                      onLinkClick();
                    }}
                    role="menuitem"
                    className={`group flex items-center gap-3 px-3 py-2 rounded-sm transition-all duration-200 ${
                      childActive
                        ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <child.icon
                      className={`w-4 h-4 flex-shrink-0 transition-transform ${
                        childActive
                          ? "text-white scale-110"
                          : `${child.color ?? "text-muted-foreground"} group-hover:scale-110`
                      }`}
                    />
                    <span className="text-[11px] font-black uppercase tracking-widest">
                      {child.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}

/* ── Sidebar Nav Items (shared between desktop & mobile) ── */
function SidebarNavItems({
  userData,
  isAdmin,
  isCollapsed,
  onLinkClick,
}: {
  userData: any;
  isAdmin: boolean;
  isCollapsed: boolean;
  onLinkClick: () => void;
}) {
  const pathname = usePathname();
  const [withdrawalVisible, setWithdrawalVisible] = useState(true);

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    "All Tasks": true,
    Community: true,
    Account: false,
  });

  const basePath = "/user-dashboard";

  // Fetch withdrawal visibility
  useEffect(() => {
    const fetchWithdrawalVisibility = async () => {
      try {
        const response = await fetch("/api/withdrawal-visibility");
        const data = await response.json();
        if (data.isVisible !== undefined) {
          setWithdrawalVisible(data.isVisible);
        }
      } catch (error) {
        console.error("Failed to fetch withdrawal visibility:", error);
      }
    };
    fetchWithdrawalVisibility();
  }, []);

  const navItems: NavItem[] = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      href: `${basePath}/dashboard`,
    },
    {
      name: "All Tasks",
      icon: Megaphone,
      children: [
        {
          name: "Overall Tasks",
          icon: ClipboardList,
          href: `${basePath}/overall-tasks`,
        },
        {
          name: "Marketplace",
          icon: ShoppingCart,
          href: `${basePath}/kash-marketplace`,
        },
        {
          name: "Campaign Hub",
          icon: Megaphone,
          href: `${basePath}/campaign-center`,
        },
      ],
    },
    {
      name: "Gift Member",
      icon: Smile,
      href: `${basePath}/gift-user`,
    },
    {
      name: "Withdrawals",
      icon: Wallet,
      href: withdrawalVisible
        ? `${basePath}/withdraw`
        : `${basePath}/withdraw/locked`,
    },
    {
      name: "Transactions",
      icon: History,
      href: `${basePath}/transactions`,
    },
    {
      name: "Community",
      icon: Users,
      children: [
        {
          name: "Refer & Earn",
          icon: Users,
          href: `${basePath}/referals`,
        },
        {
          name: "Leaderboard",
          icon: Trophy,
          href: `${basePath}/leaderboard`,
        },
        {
          name: "Achievements",
          icon: Gem,
          href: `${basePath}/achievements`,
        },
        {
          name: "Share Feedback",
          icon: ThumbsUp,
          href: `${basePath}/feedback`,
        },
        {
          name: "Testimonials",
          icon: Crown,
          href: `${basePath}/testimonials`,
        },
      ],
    },
    {
      name: "Account",
      icon: Settings,
      children: [
        {
          name: "User Profile",
          icon: Users,
          href: `${basePath}/profile`,
        },
        {
          name: "Accounts Settings",
          icon: Settings,
          href: `${basePath}/settings`,
        },
        {
          name: "KYC Verification",
          icon: BadgeCheck,
          href: `${basePath}/kyc`,
        },
        ...(isAdmin
          ? [
              {
                name: "Switch to Admin",
                icon: Lock,
                href: "/admin-dashboard/dashboard",
                color: "text-green-500",
              },
            ]
          : []),
      ],
    },
  ];

  // Auto-open groups that have an active child
  useEffect(() => {
    navItems.forEach((item) => {
      if ("children" in item) {
        const hasActive = item.children.some((child) => pathname === child.href);
        if (hasActive) {
          setOpenGroups((prev) => ({ ...prev, [item.name]: true }));
        }
      }
    });
  }, [pathname]);

  const toggleGroup = (name: string) => {
    setOpenGroups((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <>
      <div className="space-y-1">
        {navItems.map((item) => {
          /* ── Single link ── */
          if ("href" in item) {
            const active = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onLinkClick}
                className={`group flex items-center px-4 py-2.5 rounded-sm transition-all duration-200 ${
                  active
                    ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                } ${isCollapsed ? "justify-center" : ""}`}
                title={isCollapsed ? item.name : undefined}
              >
                <item.icon
                  className={`w-5 h-5 transition-transform flex-shrink-0 ${
                    active
                      ? "text-white scale-110"
                      : `${item.color ?? "text-muted-foreground"} group-hover:scale-110`
                  } ${isCollapsed ? "" : "mr-5"}`}
                />
                {!isCollapsed && (
                  <span className="text-[12px] font-black uppercase tracking-widest">
                    {item.name}
                  </span>
                )}
              </Link>
            );
          }

          /* ── Group ── */
          const isOpen = !!openGroups[item.name];
          const hasActiveChild = item.children.some((c) => pathname === c.href);

          return (
            <div key={item.name} className="flex flex-col">
              {isCollapsed ? (
                <CollapsedGroup
                  item={item}
                  hasActiveChild={hasActiveChild}
                  pathname={pathname}
                  onLinkClick={onLinkClick}
                />
              ) : (
                <>
                  {/* Expanded: normal accordion */}
                  <button
                    onClick={() => toggleGroup(item.name)}
                    className={`group w-full flex items-center px-4 py-2.5 rounded-sm transition-all duration-200 cursor-pointer ${
                      hasActiveChild
                        ? "text-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <item.icon
                      className={`w-5 h-5 flex-shrink-0 transition-transform mr-5 ${
                        hasActiveChild
                          ? `scale-110 ${item.color ?? "text-foreground"}`
                          : `${item.color ?? "text-muted-foreground"} group-hover:scale-110`
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

                  <div
                    className={`${isOpen ? "block" : "hidden"} transition-all duration-300`}
                  >
                    <div className="ml-4 mt-1 mb-1 lg:mb-1 pl-4 border-l border-border space-y-0.5">
                      {item.children.map((child) => {
                        const childActive = pathname === child.href;
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
                                  : `${child.color ?? "text-muted-foreground"} group-hover:scale-110`
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
                </>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}