"use client";

import { Bell, Menu, User, LogOut, CheckCircle, AlertCircle, Gift, CheckSquare, Sun, Moon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useSession } from "@/components/providers/OptimizedSessionProvider";
import { useProfile, useNotifications, useMarkNotificationsRead } from "@/hooks/useProfileData";

export default function UserHeader({ title }: { title?: string }) {
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Use SWR hooks for cached data fetching
  const { profile, isLoading: profileLoading } = useProfile();
  const { notifications, unreadCount, isLoading: notifLoading, mutate } = useNotifications();
  const { markAsRead } = useMarkNotificationsRead();

  const taskPoints = profile?.taskPoints || 50;
  const userData = profile;
  const isLoading = profileLoading || notifLoading;

  // Debug: Log unreadCount
  console.log('unreadCount:', unreadCount, 'notifications:', notifications);

  // Close notification dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleNotificationClick = async () => {
    setNotifOpen((v) => !v);
    if (unreadCount > 0) {
      await markAsRead();
    }
  };

  const handleIndividualNotificationClick = async (notif: any) => {
    if (!notif.isRead) {
      await markAsRead(notif._id);
    }
    if (notif.actionUrl) {
      router.push(notif.actionUrl);
    }
    setNotifOpen(false);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "task":
        return <CheckSquare className="w-4 h-4 text-blue-500" />;
      case "task_approved":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "task_rejected":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case "new_task":
        return <Gift className="w-4 h-4 text-purple-500" />;
      case "submission_received":
        return <CheckSquare className="w-4 h-4 text-blue-500" />;
      case "points_earned":
        return <Gift className="w-4 h-4 text-yellow-500" />;
      case "welcome_bonus":
        return <Gift className="w-4 h-4 text-green-500" />;
      case "reward":
        return <Gift className="w-4 h-4 text-green-500" />;
      case "profile":
        return <User className="w-4 h-4 text-gray-500" />;
      case "alert":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <CheckCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const notifDate = new Date(date);
    const diffInMinutes = Math.floor(
      (now.getTime() - notifDate.getTime()) / (1000 * 60)
    );
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  // Helper function to strip HTML markup elements safely 
  const stripHtmlTags = (htmlString: string) => {
    if (!htmlString) return "";
    return htmlString.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  };

  const displayName = userData?.username || userData?.name || "User";
  const displayEmail = userData?.email || "";

  /* ── Notification Dropdown (shared markup) ── */
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

      {unreadCount > 0 && (
        <span className="text-[11px] font-bold uppercase tracking-wide bg-red-500/10 text-red-500 px-2.5 py-1 rounded-full border border-red-500/20">
          {unreadCount} unread
        </span>
      )}
    </div>

    {/* List */}
    <div className="max-h-[65vh] overflow-y-auto">
      {notifications.length > 0 ? (
        notifications.map((notif: any) => (
          <div
            key={notif._id}
            onClick={() => handleIndividualNotificationClick(notif)}
            className={`px-5 py-4 cursor-pointer transition-all duration-200 border-b border-border/40
              hover:bg-muted/60
              ${
                !notif.isRead
                  ? "bg-primary/5 border-l-2 border-l-primary"
                  : "bg-background"
              }`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-1 flex-shrink-0">
                {getNotificationIcon(notif.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <p className="text-sm font-bold tracking-tight text-foreground truncate">
                    {notif.title}
                  </p>

                  {!notif.isRead && (
                    <div className="w-2.5 h-2.5 bg-primary rounded-full flex-shrink-0" />
                  )}
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  {stripHtmlTags(notif.message)}
                </p>

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
      {/* Left — page title or spacer */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-xl hover:bg-secondary transition-colors"
          onClick={() =>
            window.dispatchEvent(new CustomEvent("open-sidebar"))
          }
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
        {/* Theme toggle — icon only, white on dark / black on light */}
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

        {/* User info + avatar — desktop only */}
        <div className="hidden lg:flex items-center gap-3 pl-4 border-l border-border">
          <div className="flex items-center gap-2">
            <div className="text-right mr-1">
              <p className="text-[8px] text-green-500 font-bold uppercase tracking-widest mt-0.5">
                Balance
              </p>
              <p className="text-xs font-black text-foreground leading-none">
                {isLoading ? "..." : `${taskPoints} TP`}
              </p>
            </div>

            <div className="text-right">
              <p className="text-xs font-black uppercase tracking-tight leading-none text-foreground">
                {isLoading ? "Loading..." : displayName}
              </p>
              <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-tighter mt-1 truncate max-w-[140px]">
                {isLoading ? "" : displayEmail}
              </p>
            </div>

            <button
              onClick={() => router.push("/user-dashboard/profile")}
              className="w-10 h-10 rounded-xl border-2 border-border hover:border-green-500 transition-colors overflow-hidden flex items-center justify-center bg-muted"
              title="Go to Profile"
            >
              {userData?.avatarUrl ? (
                <img
                  src={userData.avatarUrl}
                  alt={displayName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-5 h-5 text-green-500" />
              )}
            </button>
          </div>
        </div>

        {/* User avatar — mobile only */}
        <div className="flex lg:hidden items-center pl-3 border-l border-border">
          <button
            onClick={() => router.push("/user-dashboard/profile")}
            className="w-10 h-10 rounded-xl border-2 border-border hover:border-green-500 transition-colors overflow-hidden flex items-center justify-center bg-muted"
            title="Go to Profile"
          >
            {userData?.avatarUrl ? (
              <img
                src={userData.avatarUrl}
                alt={displayName}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-5 h-5 text-green-500" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}