"use client";

import { Bell, Menu, User, LogOut, CheckCircle, AlertCircle, Gift, CheckSquare, Sun, Moon, Wallet, ChevronDown, Copy, Check, X, Clock } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useSession } from "@/components/providers/OptimizedSessionProvider";
import { useProfile, useNotifications, useMarkNotificationsRead } from "@/hooks/useProfileData";
import { useWallet } from '@solana/wallet-adapter-react';
import { toast } from 'react-toastify';
import { SolanaWalletModal } from '@/components/SolanaWalletModal';
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useDragControls } from "framer-motion";

/* ───────────────────────────────────────────────
   Mobile bottom sheet (rendered in a portal, z-[500])
─────────────────────────────────────────────── */
function WalletSheet({
  open,
  onClose,
  iconUrl,
  name,
  address,
  connectedAt,
  copied,
  onCopy,
  onDisconnect,
  busy,
}: {
  open: boolean;
  onClose: () => void;
  iconUrl?: string;
  name?: string | null;
  address: string;
  connectedAt: string;
  copied: boolean;
  onCopy: () => void;
  onDisconnect: () => void;
  busy: boolean;
}) {
  const controls = useDragControls();

  // Lock page scroll + close on Escape while open
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-[500] sm:hidden"
          // keeps an outside-click handler on the wrapper from closing the sheet before buttons fire
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />

          {/* Sheet */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Wallet details"
            className="absolute inset-x-0 bottom-0 overflow-hidden rounded-t-3xl border-t border-border bg-background shadow-[0_-20px_60px_rgba(0,0,0,0.35)]"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 320 }}
            drag="y"
            dragControls={controls}
            dragListener={false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 110 || info.velocity.y > 600) onClose();
            }}
          >
            {/* Brand accent line */}
            {/* <div className="h-1 w-full bg-gradient-to-r from-[#9945FF] to-[#14F195]" /> */}

            {/* Drag handle */}
            {/* <div
              className="flex cursor-grab touch-none justify-center pb-2 pt-3 active:cursor-grabbing"
              onPointerDown={(e) => controls.start(e)}
            >
              <span className="h-1.5 w-12 rounded-full bg-muted-foreground/30" />
            </div> */}

            <div className="space-y-5 px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-2">
              {/* Header */}
              <div className="flex items-center gap-4">
                <div className="relative shrink-0">
                  {iconUrl ? (
                    <img
                      src={iconUrl}
                      alt={name || "Wallet"}
                      className="h-14 w-14 rounded-2xl border border-border object-cover shadow-md"
                    />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#9945FF] to-[#14F195] shadow-md">
                      <Wallet className="h-7 w-7 text-white" />
                    </div>
                  )}
                  <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-50" />
                    <span className="relative inline-flex h-4 w-4 rounded-full border-2 border-background bg-green-500" />
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    User Wallet
                  </p>
                  <p className="truncate text-lg font-extrabold leading-tight text-foreground">
                    {name}
                  </p>
                  {/* <span className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-green-500/25 bg-green-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-green-600 dark:text-green-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                    Connected
                  </span> */}
                </div>

                <button
                  onClick={onClose}
                  aria-label="Close"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors active:scale-95"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Address card */}
              <div className="rounded-2xl border border-border bg-muted/40 p-4">
                <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  Wallet Address
                </p>
                <p className="break-all font-mono text-[13px] leading-relaxed text-foreground">
                  {address}
                </p>
                <button
                  onClick={onCopy}
                  className={`mt-3 flex w-full items-center justify-center gap-2 rounded-xl border py-2.5 text-xs font-bold uppercase tracking-widest transition-all active:scale-[0.98] ${
                    copied
                      ? "border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400"
                      : "border-border bg-background text-foreground"
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" /> Copy Address
                    </>
                  )}
                </button>
              </div>

              {/* Last connected */}
              <div className="flex items-center gap-3 rounded-2xl border border-border bg-muted/40 px-4 py-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-secondary">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    Last Connected
                  </p>
                  <p className="truncate text-sm font-semibold text-foreground">
                    {connectedAt}
                  </p>
                </div>
              </div>

              {/* Disconnect */}
              <button
                onClick={onDisconnect}
                disabled={busy}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-red-500/30 bg-red-500/10 text-sm font-bold text-red-500 transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <LogOut className="h-4 w-4" />
                {busy ? "Disconnecting..." : "Disconnect Wallet"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}

export default function UserHeader({ title }: { title?: string }) {
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { data: session } = useSession();
  const { publicKey, disconnect, connected, wallet } = useWallet();
  const [walletDbAddress, setWalletDbAddress] = useState<string | null>(null);
  const [walletDbName, setWalletDbName] = useState<string | null>(null);
  const [walletConnectedAt, setWalletConnectedAt] = useState<Date | null>(null);
  const [isSavingWallet, setIsSavingWallet] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [walletDropdownOpen, setWalletDropdownOpen] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const walletDropdownRef = useRef<HTMLDivElement>(null);

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

  // Fetch wallet data from database on mount
  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        const response = await fetch('/api/user/wallet');
        if (response.ok) {
          const data = await response.json();
          setWalletDbAddress(data.walletAddress);
          setWalletDbName(data.walletName);
          setWalletConnectedAt(data.walletConnectedAt ? new Date(data.walletConnectedAt) : null);
        }
      } catch (error) {
        console.error('Error fetching wallet data:', error);
      }
    };

    if (session?.user?.id) {
      fetchWalletData();
    }
  }, [session?.user?.id]);

  // Handle wallet connection
  useEffect(() => {
    const handleWalletConnection = async () => {
      if (connected && publicKey && wallet?.adapter?.name) {
        // Check if this wallet is different from the one in database
        const currentAddress = publicKey.toString();
        
        if (currentAddress !== walletDbAddress) {
          setIsSavingWallet(true);
          try {
            const response = await fetch('/api/user/wallet', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                walletAddress: currentAddress,
                walletName: wallet.adapter.name,
              }),
            });

            if (response.ok) {
              const data = await response.json();
              setWalletDbAddress(data.walletAddress);
              setWalletDbName(data.walletName);
              setWalletConnectedAt(data.walletConnectedAt ? new Date(data.walletConnectedAt) : null);
              toast.success('Wallet connected successfully!');
            } else {
              const error = await response.json();
              toast.error(error.error || 'Failed to connect wallet');
              // Disconnect if connection failed
              await disconnect();
            }
          } catch (error) {
            console.error('Error saving wallet:', error);
            toast.error('Failed to connect wallet');
            await disconnect();
          } finally {
            setIsSavingWallet(false);
          }
        }
      }
    };

    handleWalletConnection();
  }, [connected, publicKey, wallet?.adapter?.name, walletDbAddress, disconnect]);

  // Handle wallet disconnection
  const handleDisconnect = async () => {
    try {
      await disconnect();
      
      // Remove wallet from database
      const response = await fetch('/api/user/wallet', {
        method: 'DELETE',
      });

      if (response.ok) {
        setWalletDbAddress(null);
        setWalletDbName(null);
        setWalletConnectedAt(null);
        setWalletDropdownOpen(false);
        toast.success('Wallet disconnected successfully');
      } else {
        toast.error('Failed to disconnect wallet from database');
      }
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
      toast.error('Failed to disconnect wallet');
    }
  };

  // Shorten wallet address for display
  const shortenAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  // Copy wallet address to clipboard
  const handleCopyAddress = async () => {
    if (walletDbAddress) {
      try {
        await navigator.clipboard.writeText(walletDbAddress);
        setCopiedAddress(true);
        toast.success('Address copied to clipboard');
        setTimeout(() => setCopiedAddress(false), 2000);
      } catch (error) {
        toast.error('Failed to copy address');
      }
    }
  };

  // Format date for display
  const formatConnectedDate = (date: Date | null) => {
    if (!date) return 'Not available';
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

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

  // Close wallet dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (walletDropdownRef.current && !walletDropdownRef.current.contains(e.target as Node)) {
        setWalletDropdownOpen(false);
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
    <>
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


{/* CONNECT WALLET */}
<div className="relative" ref={walletDropdownRef}>
  {walletDbAddress ? (
    <>
      <button
  onClick={() => setWalletDropdownOpen(!walletDropdownOpen)}
  disabled={isSavingWallet}
  aria-haspopup="dialog"
  aria-expanded={walletDropdownOpen}
  className="
    group relative flex items-center gap-2
    rounded-xl sm:rounded-full
    p-1 sm:py-1.5 sm:pl-1.5 sm:pr-4
    text-sm font-extrabold text-white
    bg-gradient-to-r from-[#9945FF] to-[#14F195]
    shadow-[0_0_15px_rgba(153,69,255,0.25)]
    transition-all duration-300
    hover:scale-[1.03]
    hover:shadow-[0_0_24px_rgba(20,241,149,0.35)]
    active:scale-[0.97]
    disabled:cursor-not-allowed disabled:opacity-50
  "
>
  {/* Avatar + green active dot */}
  <span className="relative shrink-0">
    <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-white/25 ring-2 ring-white/50">
      {wallet?.adapter?.icon ? (
        <img
          src={wallet.adapter.icon}
          alt={walletDbName || "Wallet"}
          className="h-full w-full object-cover"
        />
      ) : (
        <Wallet className="h-4 w-4" />
      )}
    </span>
    <span className="absolute -bottom-1 -right-1 z-10 flex h-3 w-3 sm:-bottom-0.5 sm:-right-0.5">
      {isSavingWallet && (
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
      )}
      <span className="relative inline-flex h-3 w-3 rounded-full border-2 border-background bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.9)]" />
    </span>
  </span>

  {/* Name + address (desktop only) */}
  <span className="hidden sm:flex flex-col items-start leading-none">
    <span className="text-[13px]">{walletDbName}</span>
    <span className="text-xs font-bold opacity-80 mt-0.5 text-[11px]">
      {shortenAddress(walletDbAddress)}
    </span>
  </span>

  <ChevronDown
    className={`hidden sm:block h-4 w-4 transition-transform duration-300 ${
      walletDropdownOpen ? "rotate-180" : ""
    }`}
  />
</button>

      {/* ── DESKTOP dropdown (unchanged, hidden on phones) ── */}
      {walletDropdownOpen && (
        <div className="absolute right-0 z-50 mt-2 hidden w-[320px] overflow-hidden rounded-xl border border-border/70 bg-background shadow-[0_12px_35px_rgba(0,0,0,0.18)] ring-1 ring-border/40 sm:block">
          <div className="space-y-4 p-4">
            {/* Wallet Name */}
            <div className="flex items-center gap-3">
              {wallet?.adapter?.icon ? (
                <img
                  src={wallet.adapter.icon}
                  alt={walletDbName || "Wallet"}
                  className="h-10 w-10 rounded-xl"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#9945FF] to-[#14F195]">
                  <Wallet className="h-5 w-5 text-white" />
                </div>
              )}
              <div>
                <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  User Wallet
                </p>
                <p className="text-sm font-bold text-foreground">{walletDbName}</p>
              </div>
            </div>

            {/* Full Address */}
            <div>
              <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                Address
              </p>
              <div className="flex items-center gap-2">
                <p className="flex-1 break-all font-mono text-xs text-muted-foreground">
                  {walletDbAddress}
                </p>
                <button
                  onClick={handleCopyAddress}
                  className="rounded-lg p-1.5 transition-colors hover:bg-secondary"
                  title="Copy address"
                >
                  {copiedAddress ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>
              </div>
            </div>

            {/* Last Connected */}
            <div>
              <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                Last Connected
              </p>
              <p className="text-xs text-muted-foreground">
                {formatConnectedDate(walletConnectedAt)}
              </p>
            </div>

            {/* Disconnect Button */}
            <button
              onClick={handleDisconnect}
              disabled={isSavingWallet}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm font-bold text-red-500 transition-colors hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <LogOut className="h-4 w-4" />
              {isSavingWallet ? "Disconnecting..." : "Disconnect Wallet"}
            </button>
          </div>
        </div>
      )}

      {/* ── MOBILE bottom sheet ── */}
      <WalletSheet
        open={walletDropdownOpen}
        onClose={() => setWalletDropdownOpen(false)}
        iconUrl={wallet?.adapter?.icon}
        name={walletDbName}
        address={walletDbAddress}
        connectedAt={formatConnectedDate(walletConnectedAt)}
        copied={copiedAddress}
        onCopy={handleCopyAddress}
        onDisconnect={handleDisconnect}
        busy={isSavingWallet}
      />
    </>
  ) : (
    <button
      type="button"
      onClick={() => setIsWalletModalOpen(true)}
      disabled={isSavingWallet}
      className="
        group relative flex items-center justify-center overflow-hidden
        rounded-xl sm:rounded-full
        h-10 w-10 sm:h-auto sm:w-auto sm:px-3 sm:py-2
        text-sm font-extrabold text-white
        bg-gradient-to-r from-[#9945FF] to-[#14F195]
        shadow-[0_0_15px_rgba(153,69,255,0.25)]
        transition-all duration-300
        hover:scale-[1.03]
        hover:shadow-[0_0_24px_rgba(20,241,149,0.35)]
        active:scale-[0.97]
        disabled:cursor-not-allowed disabled:opacity-50
      "
    >
      <Wallet className="h-5 w-5 sm:hidden" />
      <span className="hidden sm:inline">
        {isSavingWallet ? "Connecting..." : "Connect Wallet"}
      </span>
    </button>
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
              <img
                src={userData?.avatarUrl || "https://github.com/shadcn.png"}
                alt={displayName}
                className="w-full h-full object-cover"
              />
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
            <img
              src={userData?.avatarUrl || "https://github.com/shadcn.png"}
              alt={displayName}
              className="w-full h-full object-cover"
            />
          </button>
        </div>
      </div>
    </header>

    {/* Custom Wallet Modal */}
    <SolanaWalletModal
      isOpen={isWalletModalOpen}
      onClose={() => setIsWalletModalOpen(false)}
    />
    </>
  );
}