"use client";

import React, { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Bell, ChevronDown, ArrowRight, ArrowLeft, Flame, Sparkles,
  Wallet, ShieldCheck, Clock, Users, Coins, TrendingUp, CheckCircle2,
  Circle, Upload, Link2, Mail, Hash, FileText, AtSign, ExternalLink,
  X, SlidersHorizontal, ChevronRight, Zap, BadgeCheck, Globe, Lock,
  Layers, Target, Gift, Star, ChevronLeft, Info, Filter, AlertCircle
} from "lucide-react";

import UserSidebar from "@/components/user-dashboard/UserSidebar";
import UserHeader from "@/components/user-dashboard/UserHeader";

/* ============================================================================
   MOCK DATA
   ============================================================================ */
const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "featured", label: "Featured" },
  { id: "trending", label: "Trending" },
  { id: "web3", label: "Web3" },
  { id: "web2", label: "Web2" },
  { id: "digital", label: "Digital" },
  { id: "physical", label: "Physical" },
  { id: "finance", label: "Finance" },
  { id: "nft", label: "NFT" },
  { id: "ai", label: "AI" },
  { id: "education", label: "Education" },
  { id: "software", label: "Software" },
  { id: "gaming", label: "Gaming" },
  { id: "services", label: "Services" },
  { id: "creator", label: "Creator Economy" },
];

const DIFFICULTY_META = {
  easy: { label: "Easy", color: "text-green-500" },
  medium: { label: "Medium", color: "text-blue-500" },
  hard: { label: "Hard", color: "text-purple-500" },
};

const STATUS_META = {
  live: { label: "Live", color: "text-green-500" },
  ending: { label: "Ending Soon", color: "text-amber-500" },
  new: { label: "New", color: "text-blue-500" },
  full: { label: "Reward Pool Full", color: "text-gray-500" },
};

const REQ_ICON: Record<string, any> = {
  purchase: Coins,
  hold: Lock,
  mint: Sparkles,
  spend: Coins,
  stake: Layers,
  subscribe: Star,
  community: Users,
  download: Upload,
  kyc: ShieldCheck,
  receipt: FileText,
  wallet: Wallet,
  connect: Link2,
  visit: Globe,
  survey: FileText,
};

const VERIFY_ICON: Record<string, any> = {
  wallet: Wallet,
  tx: Hash,
  screenshot: Upload,
  receipt: FileText,
  email: Mail,
  order: Hash,
  username: AtSign,
  auto: Zap,
  manual: ShieldCheck,
};

function makeCampaign(c: any) {
  return {
    participants: Math.floor(Math.random() * 4000) + 120,
    successRate: Math.floor(Math.random() * 25) + 70,
    ...c,
  };
}

const CAMPAIGNS = [
  makeCampaign({
    id: "solend-hold",
    name: "Hold $SLND for 30 Days",
    brand: "Solend Finance",
    brandLogo: "🟢",
    category: ["web3", "finance", "trending"],
    banner: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80",
    reward: "1,800 TP",
    rewardValue: 1800,
    difficulty: "medium",
    status: "live",
    timeLeft: "12 days",
    verified: true,
    summary: "Buy and hold 50 SLND tokens for 30 consecutive days.",
    description:
      "Solend is Solana's leading algorithmic lending protocol. This campaign rewards long-term holders who believe in the protocol's growth. Acquire and hold a minimum position, verified automatically via on-chain wallet tracking.",
    website: "solend.fi",
    rewardPool: "4,500,000 TP",
    rewardsRemaining: "2,120,000 TP",
    endsOn: "Aug 4, 2026",
    verificationTime: "Instant (automatic)",
    requirements: [
      { type: "connect", label: "Connect your Solana wallet" },
      { type: "purchase", label: "Buy a minimum of 50 SLND" },
      { type: "hold", label: "Hold position for 30 consecutive days" },
    ],
    instructions: [
      "Connect your Phantom, Trust Wallet or Solflare wallet",
      "Swap SOL for a minimum of 50 SLND on Solend or Jupiter",
      "Keep the position untouched for 30 days",
      "TaskKash tracks your wallet automatically on-chain",
      "Task Points are credited the moment the hold period ends",
    ],
    verification: [
      { type: "wallet", label: "Wallet Address", mode: "automatic" },
      { type: "auto", label: "On-chain balance snapshot", mode: "automatic" },
    ],
  }),
  makeCampaign({
    id: "mad-lads-mint",
    name: "Mint a Mad Lads NFT",
    brand: "Mad Lads",
    brandLogo: "👺",
    category: ["web3", "nft", "featured", "trending"],
    banner: "https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=800&q=80",
    reward: "2,500 TP",
    rewardValue: 2500,
    difficulty: "hard",
    status: "live",
    timeLeft: "5 days",
    verified: true,
    summary: "Mint 1 Mad Lads NFT from the official collection.",
    description:
      "Mad Lads is one of Solana's most iconic NFT collections. Mint directly from the official mint page and submit your transaction hash for instant verification. Limited reward pool — first come, first served.",
    website: "madlads.com",
    rewardPool: "3,000,000 TP",
    rewardsRemaining: "410,000 TP",
    endsOn: "Jul 28, 2026",
    verificationTime: "Instant (automatic)",
    requirements: [
      { type: "connect", label: "Connect your Solana wallet" },
      { type: "mint", label: "Mint 1 Mad Lads NFT" },
      { type: "wallet", label: "Submit minting wallet address" },
    ],
    instructions: [
      "Connect your wallet to TaskKash",
      "Visit the official Mad Lads mint page",
      "Complete the mint transaction",
      "Copy your transaction hash",
      "Paste it into the verification form below",
    ],
    verification: [
      { type: "tx", label: "Transaction Hash", mode: "automatic" },
      { type: "wallet", label: "Minting Wallet Address", mode: "automatic" },
    ],
  }),
  makeCampaign({
    id: "notion-ai-subscribe",
    name: "Subscribe to Notion AI",
    brand: "Notion",
    brandLogo: "⬛",
    category: ["web2", "ai", "software", "featured"],
    banner: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800&q=80",
    reward: "900 TP",
    rewardValue: 900,
    difficulty: "easy",
    status: "live",
    timeLeft: "20 days",
    verified: true,
    summary: "Subscribe to any paid Notion AI plan for 1 month.",
    description:
      "Notion AI supercharges your workspace with AI-native writing, search and automation. Subscribe to any paid plan with AI add-on enabled and submit your receipt for verification.",
    website: "notion.so",
    rewardPool: "1,200,000 TP",
    rewardsRemaining: "860,000 TP",
    endsOn: "Aug 12, 2026",
    verificationTime: "Up to 24 hours",
    requirements: [
      { type: "subscribe", label: "Subscribe to a paid Notion plan" },
      { type: "receipt", label: "Upload payment receipt" },
      { type: "purchase", label: "Add-on: Notion AI enabled" },
    ],
    instructions: [
      "Create or log into your Notion account",
      "Upgrade to any paid plan",
      "Enable the Notion AI add-on",
      "Download your receipt or invoice",
      "Upload it here for manual review",
    ],
    verification: [
      { type: "receipt", label: "Payment Receipt", mode: "manual" },
      { type: "email", label: "Account Email", mode: "manual" },
    ],
  }),
  makeCampaign({
    id: "backpack-kyc",
    name: "Complete KYC on Backpack Exchange",
    brand: "Backpack",
    brandLogo: "🎒",
    category: ["web3", "finance", "trending"],
    banner: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&q=80",
    reward: "1,200 TP",
    rewardValue: 1200,
    difficulty: "medium",
    status: "live",
    timeLeft: "9 days",
    verified: true,
    summary: "Open an account and complete identity verification.",
    description:
      "Backpack Exchange is a regulated multi-chain exchange with self-custody built in. Sign up, complete KYC, and unlock your reward once your account is fully verified.",
    website: "backpack.exchange",
    rewardPool: "2,000,000 TP",
    rewardsRemaining: "1,340,000 TP",
    endsOn: "Aug 1, 2026",
    verificationTime: "1–3 business days",
    requirements: [
      { type: "kyc", label: "Complete full KYC verification" },
      { type: "connect", label: "Open a Backpack account" },
      { type: "username", label: "Submit your account username" },
    ],
    instructions: [
      "Sign up for a Backpack Exchange account",
      "Navigate to account settings",
      "Complete identity verification (KYC)",
      "Wait for approval confirmation",
      "Submit your verified username here",
    ],
    verification: [
      { type: "username", label: "Backpack Username", mode: "manual" },
      { type: "manual", label: "KYC Confirmation", mode: "manual" },
    ],
  }),
  makeCampaign({
    id: "raydium-stake",
    name: "Stake RAY for 14 Days",
    brand: "Raydium",
    brandLogo: "⚡",
    category: ["web3", "finance", "trending"],
    banner: "https://images.unsplash.com/photo-1622630998477-20aa696ecb05?w=800&q=80",
    reward: "1,650 TP",
    rewardValue: 1650,
    difficulty: "medium",
    status: "ending",
    timeLeft: "2 days",
    verified: true,
    summary: "Stake a minimum of 25 RAY tokens for 14 days.",
    description:
      "Raydium is Solana's leading automated market maker. Stake RAY in the official staking pool and earn Task Points on top of your native staking yield.",
    website: "raydium.io",
    rewardPool: "1,800,000 TP",
    rewardsRemaining: "95,000 TP",
    endsOn: "Jul 25, 2026",
    verificationTime: "Instant (automatic)",
    requirements: [
      { type: "connect", label: "Connect your Solana wallet" },
      { type: "stake", label: "Stake minimum 25 RAY" },
      { type: "hold", label: "Maintain stake for 14 days" },
    ],
    instructions: [
      "Connect your wallet",
      "Go to the Raydium staking pool",
      "Stake a minimum of 25 RAY",
      "Leave your position staked for 14 days",
      "Points are credited automatically",
    ],
    verification: [
      { type: "wallet", label: "Staking Wallet", mode: "automatic" },
      { type: "auto", label: "On-chain stake snapshot", mode: "automatic" },
    ],
  }),
  makeCampaign({
    id: "perplexity-pro",
    name: "Subscribe to Perplexity Pro",
    brand: "Perplexity AI",
    brandLogo: "🔮",
    category: ["web2", "ai", "software", "featured", "trending"],
    banner: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
    reward: "1,100 TP",
    rewardValue: 1100,
    difficulty: "easy",
    status: "live",
    timeLeft: "18 days",
    verified: true,
    summary: "Subscribe to Perplexity Pro for at least 1 month.",
    description:
      "Perplexity Pro unlocks advanced AI-powered search, unlimited file uploads and access to top-tier models. Subscribe with your account email and verify to claim your points.",
    website: "perplexity.ai",
    rewardPool: "1,500,000 TP",
    rewardsRemaining: "980,000 TP",
    endsOn: "Aug 10, 2026",
    verificationTime: "Up to 24 hours",
    requirements: [
      { type: "subscribe", label: "Subscribe to Perplexity Pro" },
      { type: "receipt", label: "Upload billing receipt" },
    ],
    instructions: [
      "Create a Perplexity account",
      "Upgrade to the Pro plan",
      "Download your billing receipt",
      "Upload the receipt here",
      "Verification typically completes within 24 hours",
    ],
    verification: [
      { type: "receipt", label: "Billing Receipt", mode: "manual" },
      { type: "email", label: "Account Email", mode: "manual" },
    ],
  }),
];

const FEATURED = CAMPAIGNS.find((c) => c.id === "mad-lads-mint") || CAMPAIGNS[0];

/* ============================================================================
   MAIN USER EARN PAGE COMPONENT
   ============================================================================ */
export default function UserEarnPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("reward-high");
  const [selectedCampaign, setSelectedCampaign] = useState<any | null>(null);
  
  // Claiming Form State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [claimSubmitted, setClaimSubmitted] = useState(false);
  const [verificationInputs, setVerificationInputs] = useState<Record<string, string>>({});

  // Filter & Sort Logic
  const filteredCampaigns = useMemo(() => {
    return CAMPAIGNS.filter((campaign) => {
      const matchesSearch =
        campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        campaign.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        campaign.summary.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" || campaign.category.includes(selectedCategory);

      return matchesSearch && matchesCategory;
    }).sort((a, b) => {
      if (sortBy === "reward-high") return b.rewardValue - a.rewardValue;
      if (sortBy === "reward-low") return a.rewardValue - b.rewardValue;
      if (sortBy === "popular") return b.participants - a.participants;
      return 0;
    });
  }, [searchQuery, selectedCategory, sortBy]);

  const handleOpenCampaign = useCallback((campaign: any) => {
    setSelectedCampaign(campaign);
    setClaimSubmitted(false);
    setVerificationInputs({});
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedCampaign(null);
    setClaimSubmitted(false);
    setIsSubmitting(false);
  }, []);

  const handleInputChange = (label: string, value: string) => {
    setVerificationInputs((prev) => ({ ...prev, [label]: value }));
  };

  const handleSubmitClaim = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate Verification Processing Delay
    setTimeout(() => {
      setIsSubmitting(false);
      setClaimSubmitted(true);
    }, 1800);
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Sidebar */}
      <UserSidebar />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <UserHeader />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto pb-32 p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Page Title */}
            <div>
              <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter leading-none">
                Kash Marketplace
              </h1>
              <p className="text-sm text-muted-foreground mt-2">
                Discover campaigns and earn rewards by completing tasks
              </p>
            </div>

        {/* HERO FEATURED BANNER */}
        {FEATURED && (
          <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-[#11131A] via-[#11131A] to-purple-950/30 group">
            <div className="absolute inset-0 z-0">
              <img 
                src={FEATURED.banner} 
                alt={FEATURED.name} 
                className="w-full h-full object-cover opacity-25 group-hover:scale-105 transition-transform duration-700 ease-out" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#11131A] via-[#11131A]/70 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#11131A] via-transparent to-transparent" />
            </div>

            <div className="relative z-10 p-6 md:p-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3" /> Featured Campaign
                  </span>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-black uppercase tracking-widest">
                    {FEATURED.status}
                  </span>
                </div>

                <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tight text-white leading-tight">
                  {FEATURED.name}
                </h1>

                <p className="text-sm text-gray-300 line-clamp-2">
                  {FEATURED.summary}
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-gray-400 font-mono">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-purple-400" />
                    <span>{FEATURED.participants.toLocaleString()} Claimants</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span>{FEATURED.timeLeft} left</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>{FEATURED.verificationTime}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row md:flex-col items-stretch md:items-end gap-3 w-full md:w-auto">
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 text-center md:text-right space-y-0.5">
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 font-black">Reward Value</p>
                  <p className="text-2xl font-black font-mono text-emerald-400">{FEATURED.reward}</p>
                </div>

                <button 
                  onClick={() => handleOpenCampaign(FEATURED)}
                  className="bg-emerald-400 hover:bg-emerald-300 text-black font-black uppercase tracking-wider text-xs px-8 py-4 rounded-2xl transition-all shadow-lg shadow-emerald-400/20 flex items-center justify-center gap-2 group/btn"
                >
                  <span>Earn Now</span>
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------------------------- */}
        {/* SEARCH & FILTERS BAR                                                  */}
        {/* ---------------------------------------------------------------------- */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by campaign, brand, or requirements..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#11131A] border border-white/10 rounded-2xl pl-11 pr-4 py-3.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-3">
              <div className="relative flex-1 md:flex-none">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full appearance-none bg-[#11131A] border border-white/10 rounded-2xl px-4 py-3.5 pr-10 text-xs font-bold text-gray-300 focus:outline-none focus:border-purple-500 cursor-pointer"
                >
                  <option value="reward-high">Highest Reward</option>
                  <option value="reward-low">Lowest Reward</option>
                  <option value="popular">Most Popular</option>
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Categories Horizontal Scroll */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((category) => {
              const active = selectedCategory === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all border ${
                    active
                      ? "bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-600/25"
                      : "bg-[#11131A] border-white/10 text-gray-400 hover:text-white hover:border-white/20"
                  }`}
                >
                  {category.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ---------------------------------------------------------------------- */}
        {/* CAMPAIGNS GRID                                                        */}
        {/* ---------------------------------------------------------------------- */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
            <span>Showing {filteredCampaigns.length} Campaign{filteredCampaigns.length === 1 ? '' : 's'}</span>
          </div>

          {filteredCampaigns.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCampaigns.map((campaign) => {
                const diffMeta = DIFFICULTY_META[campaign.difficulty as keyof typeof DIFFICULTY_META] || DIFFICULTY_META.easy;
                const statusMeta = STATUS_META[campaign.status as keyof typeof STATUS_META] || STATUS_META.live;

                return (
                  <motion.div
                    key={campaign.id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-[#11131A] border border-white/10 hover:border-purple-500/50 rounded-2xl overflow-hidden flex flex-col justify-between group transition-all duration-300 hover:shadow-xl hover:shadow-purple-950/20"
                  >
                    <div>
                      {/* Banner Image */}
                      <div className="h-36 relative overflow-hidden bg-black/40">
                        <img 
                          src={campaign.banner} 
                          alt={campaign.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#11131A] via-transparent to-black/30" />

                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                          <span 
                            className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider backdrop-blur-md border"
                            style={{ 
                              backgroundColor: `${statusMeta.color}15`, 
                              borderColor: `${statusMeta.color}30`,
                              color: statusMeta.color 
                            }}
                          >
                            {statusMeta.label}
                          </span>

                          <span 
                            className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider backdrop-blur-md border"
                            style={{ 
                              backgroundColor: `${diffMeta.color}15`, 
                              borderColor: `${diffMeta.color}30`,
                              color: diffMeta.color 
                            }}
                          >
                            {diffMeta.label}
                          </span>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-5 space-y-4">
                        <div className="flex items-start gap-3">
                          <span className="text-2xl p-2 rounded-xl bg-white/5 border border-white/10 shrink-0">
                            {campaign.brandLogo}
                          </span>
                          <div className="space-y-0.5">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{campaign.brand}</span>
                            <h3 className="font-black text-white text-base leading-snug line-clamp-1 group-hover:text-purple-300 transition-colors">
                              {campaign.name}
                            </h3>
                          </div>
                        </div>

                        <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                          {campaign.summary}
                        </p>

                        <div className="grid grid-cols-2 gap-2 bg-white/5 p-3 rounded-xl border border-white/5 font-mono text-xs">
                          <div>
                            <span className="text-[10px] uppercase text-gray-500 font-bold block">Reward</span>
                            <span className="font-bold text-emerald-400">{campaign.reward}</span>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase text-gray-500 font-bold block">Time Left</span>
                            <span className="font-bold text-gray-300">{campaign.timeLeft}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="px-5 pb-5 pt-0">
                      <button
                        onClick={() => handleOpenCampaign(campaign)}
                        className="w-full bg-white/5 hover:bg-purple-600 border border-white/10 hover:border-purple-500 text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl transition-all flex items-center justify-center gap-2 group/btn"
                      >
                        <span>View Task</span>
                        <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="bg-[#11131A] border border-white/10 rounded-3xl p-12 text-center space-y-4">
              <AlertCircle className="w-12 h-12 text-gray-500 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white uppercase tracking-wide">No Campaigns Found</h3>
                <p className="text-xs text-gray-400">Try loosening your search terms or choosing a different category filter.</p>
              </div>
              <button 
                onClick={() => { setSelectedCategory("all"); setSearchQuery(""); }}
                className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-4 py-2.5 rounded-xl uppercase tracking-wider"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
          </div>

        {/* ---------------------------------------------------------------------- */}
        {/* CAMPAIGN DETAILS & CLAIM MODAL                                        */}
        {/* ---------------------------------------------------------------------- */}
        <AnimatePresence>
          {selectedCampaign && (
            <div className="fixed inset-0 z-500 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleCloseModal}
                className="fixed inset-0 bg-black/80 backdrop-blur-md"
              />

              {/* Modal Box */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-xl bg-[#11131A] border border-white/10 rounded-3xl overflow-hidden shadow-2xl z-10 my-8 max-h-[90vh] flex flex-col"
              >
                {/* Modal Header Image */}
                <div className="h-44 relative shrink-0">
                  <img 
                    src={selectedCampaign.banner} 
                    alt={selectedCampaign.name} 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#11131A] via-[#11131A]/60 to-transparent" />

                  <button
                    onClick={handleCloseModal}
                    className="absolute top-4 right-4 p-2.5 rounded-full bg-black/60 border border-white/10 text-white hover:bg-black transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl p-2.5 rounded-2xl bg-[#11131A] border border-white/10">
                        {selectedCampaign.brandLogo}
                      </span>
                      <div>
                        <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">{selectedCampaign.brand}</span>
                        <h2 className="text-xl md:text-2xl font-black uppercase text-white leading-tight">{selectedCampaign.name}</h2>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Modal Body */}
                <div className="p-6 md:p-8 overflow-y-auto space-y-8 flex-1">
                  {/* Stats Bar */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white/5 p-4 rounded-2xl border border-white/5 font-mono text-xs">
                    <div>
                      <span className="text-[10px] text-gray-500 uppercase font-bold block">Reward</span>
                      <span className="text-emerald-400 font-bold">{selectedCampaign.reward}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-500 uppercase font-bold block">Remaining</span>
                      <span className="text-white font-bold">{selectedCampaign.rewardsRemaining}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-500 uppercase font-bold block">Verification</span>
                      <span className="text-gray-300 font-bold">{selectedCampaign.verificationTime}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-500 uppercase font-bold block">Ends On</span>
                      <span className="text-gray-300 font-bold">{selectedCampaign.endsOn}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-black uppercase tracking-wider text-gray-400">About Campaign</h4>
                    <p className="text-sm text-gray-300 leading-relaxed">{selectedCampaign.description}</p>
                  </div>

                  {/* Requirements */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-black uppercase tracking-wider text-gray-400">Requirements</h4>
                    <div className="grid grid-cols-1 gap-2.5">
                      {selectedCampaign.requirements.map((req: any, index: number) => {
                        const IconComp = REQ_ICON[req.type] || CheckCircle2;
                        return (
                          <div key={index} className="flex items-center gap-3 bg-white/5 p-3.5 rounded-xl border border-white/5 text-xs text-gray-200">
                            <IconComp className="w-4 h-4 text-purple-400 shrink-0" />
                            <span>{req.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Step-By-Step Instructions */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-black uppercase tracking-wider text-gray-400">Step-by-Step Guide</h4>
                    <div className="space-y-2">
                      {selectedCampaign.instructions.map((step: string, index: number) => (
                        <div key={index} className="flex items-start gap-3 text-xs text-gray-300">
                          <span className="w-5 h-5 rounded-full bg-purple-600/20 text-purple-400 font-mono font-bold flex items-center justify-center shrink-0 border border-purple-500/30 text-[10px]">
                            {index + 1}
                          </span>
                          <span className="pt-0.5">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Verification Form Section */}
                  <div className="pt-6 border-t border-white/10 space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Submit Proof & Claim Reward</span>
                    </h4>

                    {claimSubmitted ? (
                      <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6 text-center space-y-3">
                        <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                        <div className="space-y-1">
                          <h5 className="font-black text-white text-base uppercase">Verification Submitted!</h5>
                          <p className="text-xs text-gray-300">
                            Your proof is being processed ({selectedCampaign.verificationTime}). Points will be credited upon approval.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmitClaim} className="space-y-4">
                        {selectedCampaign.verification.map((v: any, index: number) => {
                          const IconComp = VERIFY_ICON[v.type] || FileText;
                          return (
                            <div key={index} className="space-y-1.5">
                              <label className="text-xs font-bold text-gray-300 flex items-center gap-2">
                                <IconComp className="w-3.5 h-3.5 text-purple-400" />
                                <span>{v.label}</span>
                              </label>

                              <input
                                type="text"
                                required
                                placeholder={`Enter ${v.label.toLowerCase()}...`}
                                value={verificationInputs[v.label] || ""}
                                onChange={(e) => handleInputChange(v.label, e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-emerald-400 transition-colors"
                              />
                            </div>
                          );
                        })}

                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 text-black font-black uppercase tracking-wider text-xs py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-400/20"
                        >
                          {isSubmitting ? (
                            <span>Verifying Proof...</span>
                          ) : (
                            <>
                              <span>Submit Proof & Earn {selectedCampaign.reward}</span>
                              <ArrowRight className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
        </main>
      </div>
    </div>
  );
}