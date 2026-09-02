"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import {
  Users,
  Link as LinkIcon,
  Copy,
  Share2,
  Zap,
  UsersRound,
  Activity,
  Clock,
  CheckCircle2,
  LockKeyholeOpen,
  Hourglass,
  HelpCircle,
  Calendar,
  Loader2,
  AlertCircle,
  Info,
  X,
  Twitter,
  Facebook,
  Linkedin,
  Mail,
} from "lucide-react";

// Navigation Imports
import UserSidebar from "@/components/user-dashboard/UserSidebar";
import UserHeader from "@/components/user-dashboard/UserHeader";

export default function ReferralsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [programActive, setProgramActive] = useState(true);
  const [copySuccess, setCopySuccess] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [referralLink, setReferralLink] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [referralStats, setReferralStats] = useState({
    totalInvites: 0,
    activeUsers: 0,
    pending: 0,
    qualified: 0,
    unlockedRewards: 0,
    pendingRewards: 100,
  });

  const copyReferralLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopySuccess(true);
      toast.success("Referral link copied to clipboard!");
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  const openShareModal = () => setShareModalOpen(true);
  const closeShareModal = () => setShareModalOpen(false);

  const toggleProgramState = () => {
    setProgramActive(!programActive);
    toast.info(programActive ? "Referral program paused" : "Referral program activated");
  };

  const fetchReferralData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/user/referral/generate');
      const data = await response.json();
      
      if (response.ok) {
        setReferralLink(data.referralLink || '');
        setReferralStats(data.referralStats || referralStats);
      }
    } catch (error) {
      console.error('Error fetching referral data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateReferralLink = async () => {
    try {
      setIsGenerating(true);
      const response = await fetch('/api/user/referral/generate', {
        method: 'POST',
      });
      const data = await response.json();
      
      if (response.ok) {
        setReferralLink(data.referralLink);
        toast.success('Referral link generated successfully!');
        await fetchReferralData();
      } else {
        toast.error(data.error || 'Failed to generate referral link');
      }
    } catch (error) {
      console.error('Error generating referral link:', error);
      toast.error('Failed to generate referral link');
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    fetchReferralData();
  }, []);

  const shareToSocial = (platform: string) => {
    const shareText = "Join TaskKash and earn rewards by completing tasks!";
    // Ensure the URL has proper protocol
    const shareUrl = referralLink.startsWith('http') ? referralLink : `https://${referralLink}`;
    
    let url = "";
    switch (platform) {
      case "twitter":
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case "linkedin":
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        break;
      case "email":
        url = `mailto:?subject=Join TaskKash&body=${encodeURIComponent(shareText + " " + shareUrl)}`;
        break;
    }
    
    if (url) {
      window.open(url, "_blank", "width=600,height=400");
    }
    closeShareModal();
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground transition-colors duration-300">
      <UserSidebar />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <UserHeader />

        <main className="flex-1 overflow-y-auto p-4 pb-32 md:p-8 space-y-8 animate-in fade-in duration-500">
          
          {/* Header Title & Program Status */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/50 pb-6">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                  Referral Hub
                </h1>
                {/* Status Badge */}
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${
                  programActive 
                    ? "bg-green-500/10 border border-green-500/30 text-green-500" 
                    : "bg-amber-500/10 border border-amber-500/30 text-amber-500"
                }`}>
                  <span className={`w-2 h-2 rounded-full ${programActive ? "bg-green-500 animate-pulse" : "bg-amber-500"}`} />
                  <span>{programActive ? "Referral Program Active" : "Referral Program Paused"}</span>
                </div>
              </div>
              <p className="text-muted-foreground text-sm sm:text-base mt-1">
                Invite people. Help them get active. Unlock rewards.
              </p>
            </div>

            {/* Total Quick Summary Pill */}
            <div className="flex items-center gap-3 bg-card border border-border px-4 py-2.5 rounded-xl self-start md:self-auto">
              <Zap className="w-5 h-5 text-green-500" />
              <div className="text-xs">
                <div className="text-muted-foreground">Unlocked Balance</div>
                <div className="font-bold text-green-500 text-sm sm:text-base">
                  {referralStats.unlockedRewards.toLocaleString()} TP
                </div>
              </div>
            </div>
          </div>

          {/* System Notification Banner (Hidden by default, shown when paused) */}
          <AnimatePresence>
            {!programActive && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-start gap-3 text-amber-200 text-sm"
              >
                <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-amber-400">Referral Program Paused:</span> The referral program is currently paused by administrators. You can still view your previous referrals and rewards below, but new referral invitations and link generations are temporarily disabled.
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 1. HERO / REFERRAL LINK CARD */}
          <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-purple-600/15 to-green-500/5 border border-purple-500/30 p-6 sm:p-8 shadow-lg transition-all">
            {/* Background Decorative Elements */}
            <div className="absolute -right-16 -top-16 w-64 h-64 bg-purple-600/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-green-500/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-purple-600/20 border border-purple-500/40 text-purple-400 text-xs font-bold uppercase tracking-wider mb-3">
                <Users className="w-3.5 h-3.5" />
                User Growth Program
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground leading-tight">
                Grow TaskKash. Earn from qualified referrals.
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base mt-2">
                Invite people to TaskKash and earn referral rewards when they become active, qualified members of the community.
              </p>

              {/* Link Copy Bar */}
              <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                    <LinkIcon className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    readOnly
                    value={referralLink}
                    className="w-full bg-background/80 border border-border rounded-xl pl-10 pr-4 py-3.5 text-sm sm:text-base font-mono text-foreground focus:outline-none focus:border-green-500 transition"
                  />
                </div>

                <div className="flex items-center gap-2">
                  {!referralLink ? (
                    <button
                      onClick={generateReferralLink}
                      disabled={!programActive || isGenerating || isLoading}
                      className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-purple-500 hover:bg-purple-500/90 text-background font-bold px-6 py-3.5 rounded-xl transition shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isGenerating ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <LinkIcon className="w-4 h-4" />
                      )}
                      <span>{isGenerating ? "Generating..." : "Generate Link"}</span>
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={copyReferralLink}
                        disabled={!programActive}
                        className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-green-500 hover:bg-green-500/90 text-background font-bold px-6 py-3.5 rounded-xl transition shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Copy className="w-4 h-4" />
                        <span>{copySuccess ? "Copied!" : "Copy Link"}</span>
                      </button>

                      <button
                        onClick={openShareModal}
                        disabled={!programActive}
                        className="flex items-center justify-center gap-2 bg-card hover:bg-border border border-border text-foreground font-medium px-4 py-3.5 rounded-xl transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Share2 className="w-4 h-4" />
                        <span className="hidden sm:inline">Share</span>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Terms Helper Note */}
              <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                <Info className="w-3.5 h-3.5 text-green-500" />
                <span>Rewards unlock automatically after referred users meet task & activity quotas.</span>
              </div>
            </div>
          </section>

          {/* 2. REFERRAL OVERVIEW CARDS (Grid of 6) */}
          <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {/* Total Referrals */}
            <div className="bg-card border border-border p-4 rounded-2xl hover:border-purple-500/50 transition group">
              <div className="flex items-center justify-between text-muted-foreground mb-2">
                <span className="text-xs font-medium">Total Invites</span>
                <UsersRound className="w-4 h-4 text-purple-500" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-foreground">{referralStats.totalInvites}</div>
              <div className="text-[10px] text-muted-foreground mt-1">Total registered</div>
            </div>

            {/* Active Referrals */}
            <div className="bg-card border border-border p-4 rounded-2xl hover:border-green-500/50 transition group">
              <div className="flex items-center justify-between text-muted-foreground mb-2">
                <span className="text-xs font-medium">Active Users</span>
                <Activity className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-foreground">{referralStats.activeUsers}</div>
              <div className="text-[10px] text-muted-foreground mt-1">Currently participating</div>
            </div>

            {/* Pending Referrals */}
            <div className="bg-card border border-border p-4 rounded-2xl hover:border-purple-500/50 transition group">
              <div className="flex items-center justify-between text-muted-foreground mb-2">
                <span className="text-xs font-medium">Pending</span>
                <Clock className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-amber-400">{referralStats.pending}</div>
              <div className="text-[10px] text-muted-foreground mt-1">In qualification</div>
            </div>

            {/* Qualified Referrals */}
            <div className="bg-card border border-border p-4 rounded-2xl hover:border-green-500/50 transition group">
              <div className="flex items-center justify-between text-muted-foreground mb-2">
                <span className="text-xs font-medium">Qualified</span>
                <CheckCircle2 className="w-4 h-4 text-green-500" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-green-500">{referralStats.qualified}</div>
              <div className="text-[10px] text-muted-foreground mt-1">Successfully unlocked</div>
            </div>

            {/* Unlocked Rewards */}
            <div className="bg-card border border-border p-4 rounded-2xl hover:border-green-500/50 transition group relative overflow-hidden">
              <div className="absolute -right-2 -bottom-2 w-12 h-12 bg-green-500/5 rounded-full blur-xl" />
              <div className="flex items-center justify-between text-muted-foreground mb-2">
                <span className="text-xs font-medium">Unlocked</span>
                <LockKeyholeOpen className="w-4 h-4 text-green-500" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-green-500">
                {referralStats.unlockedRewards.toLocaleString()} <span className="text-xs">TP</span>
              </div>
              <div className="text-[10px] text-green-500/80 mt-1">In referral balance</div>
            </div>

            {/* Pending Rewards */}
            <div className="bg-card border border-border p-4 rounded-2xl hover:border-purple-500/50 transition group">
              <div className="flex items-center justify-between text-muted-foreground mb-2">
                <span className="text-xs font-medium">Pending</span>
                <Hourglass className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-amber-400">
                {referralStats.pendingRewards.toLocaleString()} <span className="text-xs">TP</span>
              </div>
              <div className="text-[10px] text-muted-foreground mt-1">Awaiting criteria</div>
            </div>
          </section>

          {/* 3. HOW REFERRAL REWARDS WORK */}
          <section className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-purple-500" />
                  How Referral Rewards Work
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Simple 4-step progression to unlock your earnings
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
              {/* Step 1 */}
              <div className="bg-secondary/50 border border-border/60 p-4 rounded-xl relative group hover:border-purple-500/50 transition">
                <div className="text-2xl font-black text-purple-500/40 mb-2 group-hover:text-purple-500 transition">01</div>
                <h4 className="font-bold text-foreground text-sm mb-1">Invite Friends</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Share your unique referral link via social platforms or direct message.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-secondary/50 border border-border/60 p-4 rounded-xl relative group hover:border-purple-500/50 transition">
                <div className="text-2xl font-black text-purple-500/40 mb-2 group-hover:text-purple-500 transition">02</div>
                <h4 className="font-bold text-foreground text-sm mb-1">They Sign Up</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Your referral creates a verified TaskKash account using your link.
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-secondary/50 border border-border/60 p-4 rounded-xl relative group hover:border-green-500/50 transition">
                <div className="text-2xl font-black text-green-500/40 mb-2 group-hover:text-green-500 transition">03</div>
                <h4 className="font-bold text-foreground text-sm mb-1">They Get Active</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Referral completes tasks and stays active during the qualification period.
                </p>
              </div>

              {/* Step 4 */}
              <div className="bg-secondary/50 border border-border/60 p-4 rounded-xl relative group hover:border-green-500/50 transition">
                <div className="text-2xl font-black text-green-500/40 mb-2 group-hover:text-green-500 transition">04</div>
                <h4 className="font-bold text-foreground text-sm mb-1">You Unlock Rewards</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Once requirements are met, pending TP instantly converts to unlocked balance.
                </p>
              </div>
            </div>
          </section>

        </main>
      </div>

      {/* Share Modal */}
      <AnimatePresence>
        {shareModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-500"
              onClick={closeShareModal}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-500 flex items-center justify-center p-4"
            >
              <div
                className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-foreground">Share Referral Link</h3>
                  <button
                    onClick={closeShareModal}
                    className="text-muted-foreground hover:text-foreground transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => shareToSocial("twitter")}
                    className="flex items-center justify-center gap-2 p-4 rounded-xl bg-card border border-border hover:bg-secondary transition"
                  >
                    <Twitter className="w-5 h-5 text-blue-400" />
                    <span className="text-sm font-medium">Twitter</span>
                  </button>
                  <button
                    onClick={() => shareToSocial("facebook")}
                    className="flex items-center justify-center gap-2 p-4 rounded-xl bg-card border border-border hover:bg-secondary transition"
                  >
                    <Facebook className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium">Facebook</span>
                  </button>
                  <button
                    onClick={() => shareToSocial("linkedin")}
                    className="flex items-center justify-center gap-2 p-4 rounded-xl bg-card border border-border hover:bg-secondary transition"
                  >
                    <Linkedin className="w-5 h-5 text-blue-500" />
                    <span className="text-sm font-medium">LinkedIn</span>
                  </button>
                  <button
                    onClick={() => shareToSocial("email")}
                    className="flex items-center justify-center gap-2 p-4 rounded-xl bg-card border border-border hover:bg-secondary transition"
                  >
                    <Mail className="w-5 h-5 text-amber-500" />
                    <span className="text-sm font-medium">Email</span>
                  </button>
                </div>

                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground text-center">
                    Your referral link: <span className="font-mono text-foreground">{referralLink}</span>
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}