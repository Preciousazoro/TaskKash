"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bell, Menu, User as UserIcon, Settings, LogOut, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { SafeHTMLRenderer } from "@/components/ui/SafeHTMLRenderer";
import { useAdminData } from "@/components/providers/AdminDataProvider";

export default function AdminHeader({ title = "Admin Dashboard" }: { title?: string }) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Use centralized admin data
  const {
    admin,
    notifications,
    unreadCount,
    loading,
    markNotificationAsRead,
    markAllNotificationsAsRead
  } = useAdminData();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (notifRef.current && !notifRef.current.contains(target)) {
        setNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleNotificationClick = () => {
    setNotifOpen((v) => !v);
  };

  const handleIndividualNotificationClick = (notification: any) => {
    if (!notification.read) {
      markNotificationAsRead(notification.id);
    }
    if (notification.link) {
      router.push(notification.link);
    }
    setNotifOpen(false);
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const displayName = admin?.name || "Admin";
  const displayEmail = admin?.email || "admin@taskkash.com";

  /* ── Shared Notification Dropdown Markup ── */
  const NotificationDropdown = ({ mobile }: { mobile?: boolean }) => (
    <div
      className={`mt-[-10px] lg:mt-2
        rounded-xl
        border border-border/70
        bg-background
        shadow-[0_12px_35px_rgba(0,0,0,0.18)]
        ring-1 ring-border/40
        z-50 overflow-hidden ${
        mobile
          ? "fixed top-[70px] left-1/2 -translate-x-1/2 w-[90vw]"
          : "absolute right-0 w-[360px]"
      }`}
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-border/70 flex items-center justify-between bg-muted/40">
        <span className="text-sm font-black uppercase tracking-wider text-foreground">
          Notifications
        </span>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                markAllNotificationsAsRead();
              }}
              className="text-xs text-primary hover:underline font-semibold mr-1"
            >
              Mark all as read
            </button>
          )}
          {unreadCount > 0 && (
            <span className="text-[11px] font-bold uppercase tracking-wide bg-red-500/10 text-red-500 px-2.5 py-1 rounded-full border border-red-500/20">
              {unreadCount} unread
            </span>
          )}
        </div>
      </div>

      {/* List */}
      <div className="max-h-[65vh] overflow-y-auto">
        {notifications.length > 0 ? (
          notifications.map((notif: any) => (
            <div
              key={notif.id}
              onClick={() => handleIndividualNotificationClick(notif)}
              className={`px-5 py-4 cursor-pointer transition-all duration-200 border-b border-border/40
                hover:bg-muted/60
                ${
                  !notif.read
                    ? "bg-primary/5 border-l-2 border-l-primary"
                    : "bg-background"
                }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-1 flex-shrink-0">
                  <Bell className="w-4 h-4 text-primary" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="text-sm font-bold tracking-tight text-foreground truncate">
                      {notif.title}
                    </p>

                    {!notif.read && (
                      <div className="w-2.5 h-2.5 bg-primary rounded-full flex-shrink-0" />
                    )}
                  </div>

                  <SafeHTMLRenderer
                    content={notif.message}
                    className="text-xs text-muted-foreground leading-relaxed line-clamp-2"
                  />

                  <p className="text-[11px] text-muted-foreground/70 mt-2 font-semibold uppercase tracking-wide">
                    {formatTimeAgo(notif.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-sm font-semibold tracking-wide text-muted-foreground">
            No notifications
          </div>
        )}
      </div>
    </div>
  );

  return (
    <header className="h-15 border-b border-border flex items-center justify-between gap-4 px-4 sm:px-6 bg-background/80 backdrop-blur-md sticky top-0 z-50">
      {/* Left — Page layout title / Mobile Burger */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <button
          className="md:hidden p-2 rounded-xl hover:bg-secondary transition-colors"
          onClick={() => window.dispatchEvent(new CustomEvent("open-sidebar"))}
        >
          <Menu className="h-5 w-5" />
        </button>

        {title && (
          <p className="text-[8px] md:text-xs text-muted-foreground font-bold uppercase tracking-widest hidden xs:block">
            {title}
          </p>
        )}
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        {/* Theme toggle */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 rounded-xl hover:bg-secondary transition-colors"
          title="Toggle theme"
        >
          {mounted && (theme === "dark" ? (
            <Sun className="w-5 h-5 text-white" />
          ) : (
            <Moon className="w-5 h-5 text-black" />
          ))}
        </button>

        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            className="p-2 rounded-xl hover:bg-secondary transition-colors relative"
            onClick={handleNotificationClick}
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-white text-[9px] font-black flex items-center justify-center border-2 border-background">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <>
              {/* Desktop dropdown */}
              <div className="hidden md:block">
                <NotificationDropdown />
              </div>
              {/* Mobile dropdown */}
              <div className="md:hidden">
                <NotificationDropdown mobile />
              </div>
            </>
          )}
        </div>

        {/* Profile Dropdown Component Container */}
        <div className="relative flex items-center pl-4 border-l border-border" ref={profileRef}>
          <div className="flex items-center gap-2">
            {/* User credentials descriptive metadata — Desktop only */}
            <div className="hidden lg:block text-right mr-1">
              <p className="text-xs font-black uppercase tracking-tight leading-none text-foreground">
                {loading ? "Loading..." : displayName}
              </p>
              <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-tighter mt-1 truncate max-w-[140px]">
                {loading ? "" : displayEmail}
              </p>
            </div>

            {/* Combined Avatar Action Trigger (Functional across Desktop & Mobile) */}
            <button
              onClick={() => setProfileOpen((v) => !v)}
              className="w-10 h-10 rounded-xl border-2 border-border hover:border-green-500 transition-colors overflow-hidden flex items-center justify-center bg-muted"
              title="Admin Menu"
            >
              {admin?.avatarUrl ? (
                <img
                  src={admin.avatarUrl}
                  alt={displayName}
                  className="w-full h-full object-cover"
                />
              ) : admin?.name ? (
                <div className="text-xs font-black text-green-500">
                  {getInitials(admin.name)}
                </div>
              ) : (
                <UserIcon className="w-5 h-5 text-green-500" />
              )}
            </button>
          </div>

          {/* Settings Custom Context Profile Menu Dropdown */}
          {profileOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-border/70 bg-background shadow-[0_12px_35px_rgba(0,0,0,0.18)] ring-1 ring-border/40 z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-border/70 bg-muted/40 lg:hidden">
                <p className="text-xs font-black uppercase tracking-tight text-foreground truncate">
                  {displayName}
                </p>
                <p className="text-[9px] text-muted-foreground font-bold mt-0.5 truncate">
                  {displayEmail}
                </p>
              </div>

              <button
                onClick={() => {
                  router.push("/admin-dashboard/profile");
                  setProfileOpen(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors text-left"
              >
                <UserIcon className="w-4 h-4" />
                Profile
              </button>

              <button
                onClick={() => {
                  router.push("/admin-dashboard/settings");
                  setProfileOpen(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors text-left"
              >
                <Settings className="w-4 h-4" />
                Settings
              </button>

              <button
                onClick={() => {
                  router.push("/auth/login");
                  setProfileOpen(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-red-500 hover:bg-red-500/5 border-t border-border/40 transition-colors text-left"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}