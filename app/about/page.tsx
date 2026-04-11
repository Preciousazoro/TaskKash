"use client";

import { 
  ArrowRight, 
  Shield, 
  Zap, 
  Globe, 
  Users, 
  TrendingUp, 
  Lock, 
  ChevronRight, 
  Coins, 
  Smartphone, 
  Unlock, 
  CheckCircle2, 
  Activity, 
  Gem,
  BarChart3
} from "lucide-react";
import Link from "next/link";
import { Montserrat, Space_Grotesk, JetBrains_Mono } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
});

import TaskKashHeader from "@/components/ui/TaskKashHeader";
import TaskKashFooter from "@/components/ui/TaskKashFooter";

const stats = [
  { label: "Active Users", value: "10K+", sub: "and growing", icon: <Users className="w-4 h-4" /> },
  { label: "Tasks Completed", value: "250K+", sub: "verified on-chain", icon: <CheckCircle2 className="w-4 h-4" /> },
  { label: "SOL Paid Out", value: "4,800+", sub: "to real users", icon: <Coins className="w-4 h-4" /> },
  { label: "Brand Partners", value: "80+", sub: "live campaigns", icon: <Activity className="w-4 h-4" /> },
];

const techPillars = [
  {
    icon: <Zap className="w-5 h-5" />,
    title: "Solana Speed",
    desc: "Sub-second finality and near-zero fees. Every task reward settles on-chain instantly — no waiting, no middlemen.",
  },
  {
    icon: <Shield className="w-5 h-5" />,
    title: "AES Encryption",
    desc: "Military-grade AES-256 encryption protects every user action. Proof-of-work systems filter bots, ensuring every reward is earned by a real human.",
  },
  {
    icon: <Lock className="w-5 h-5" />,
    title: "Verified Proofs",
    desc: "Each task submission passes through our proprietary verification layer. Screenshot proofs, wallet attestations, and social verifications — all validated.",
  },
  {
    icon: <Globe className="w-5 h-5" />,
    title: "Globally Accessible",
    desc: "Built for the world. Whether you're in Lagos, London, or Lima — if you have a wallet and Wi-Fi, TaskKash works for you.",
  },
];

const roadmapItems = [
  {
    status: "done",
    phase: "Phase 01",
    title: "Beta Testing",
    desc: "Closed alpha with 200 early users. Feature refinement, bot-detection tuning, and UX iterations based on real feedback.",
    tag: "Completed",
  },
  {
    status: "done",
    phase: "Phase 02",
    title: "Website Launch",
    desc: "Full MVP deployed. Core task feed, wallet connect, TP → SOL conversion engine, and brand campaign dashboard all live.",
    tag: "Completed",
  },
  {
    status: "active",
    phase: "Phase 03",
    title: "Growth Sprint",
    desc: "Target: 500–1,000 active users by April 2026. Expanding brand partnerships, adding new task categories, and deepening Solana integrations.",
    tag: "In Progress",
  },
  {
    status: "upcoming",
    phase: "Phase 04",
    title: "TP Token Launch",
    desc: "Task Points evolve into a tradable SPL token on Solana. Governance, staking, and liquidity pools unlocked for the community.",
    tag: "Q3 2026",
  },
  {
    status: "upcoming",
    phase: "Phase 05",
    title: "Mobile App",
    desc: "Native iOS & Android apps. Push notifications for new tasks, in-app wallet management, and biometric security.",
    tag: "Q4 2026",
  },
  {
    status: "upcoming",
    phase: "Phase 06",
    title: "Global Expansion",
    desc: "Multi-language support, regional brand hubs, and DAO-driven platform governance. TaskKash becomes a community-owned protocol.",
    tag: "2027",
  },
];

const values = [
  {
    icon: <Zap className="w-6 h-6 text-emerald-500" />,
    title: "Speed",
    desc: "Solana processes 65,000 TPS. We chose it so your rewards hit your wallet before you finish celebrating.",
  },
  {
    icon: <Shield className="w-6 h-6 text-purple-500" />,
    title: "Trust",
    desc: "Every interaction is cryptographically verified. Brands trust their spend is real. Users trust their rewards are guaranteed.",
  },
  {
    icon: <Gem className="w-6 h-6 text-emerald-500" />,
    title: "Value",
    desc: "No points that expire. No gift cards. Real SOL, real value — earned by real work and withdrawable at any time.",
  },
  {
    icon: <Globe className="w-6 h-6 text-purple-500" />,
    title: "Inclusion",
    desc: "Web3 should be for everyone. We build products that work from first principles — low fees, no bank account required.",
  },
];

export default function AboutPage() {
  return (
    <main
      className={`${spaceGrotesk.className} min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 overflow-x-hidden`}
    >
      <TaskKashHeader />

      {/* ── HERO ───────────────────────────────────────────────── */}
      <section className="relative mx-auto max-w-[1400px] flex flex-col items-center justify-center overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28">
        {/* Ambient glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(16,185,129,0.12) 0%, transparent 70%), radial-gradient(ellipse 60% 40% at 80% 60%, rgba(139,92,246,0.10) 0%, transparent 70%)",
          }}
        />

        <div
          className={`${jetbrainsMono.className} inline-flex items-center gap-2 text-xs font-medium tracking-[0.2em] uppercase text-emerald-500 dark:text-emerald-400 mb-6 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/5`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
          On-chain · Built on Solana
        </div>

        <h1
          className={`${montserrat.className} text-5xl md:text-6xl lg:text-6xl font-black leading-[1.0] tracking-tight mb-8 text-center px-6`}
        >
          ABOUT{" "}
          <span className="bg-gradient-to-r from-emerald-500 to-purple-500 bg-clip-text text-transparent">
            TASKKASH
          </span>
        </h1>

        <p className="mx-auto max-w-2xl text-lg md:text-xl text-slate-500 dark:text-slate-400 leading-relaxed mb-12 text-center px-6">
          TaskKash is a Web3 task-to-earn ecosystem built on Solana. We're
          bridging the gap between global brands and real users — where every
          click, follow, and proof of work converts directly into{" "}
          <span className="text-emerald-500 font-semibold">SOL</span>.
        </p>

        {/* Stat bar */}
        <div className="w-full max-w-4xl px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-slate-200 dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800">
            {stats.map((s) => (
              <div
                key={s.label}
                className="bg-white dark:bg-slate-950 px-6 py-8 text-center flex flex-col items-center gap-1"
              >
                <div className="text-slate-400 dark:text-slate-600 mb-2">{s.icon}</div>
                <div
                  className={`${montserrat.className} text-2xl md:text-3xl font-black bg-gradient-to-r from-emerald-500 to-purple-500 bg-clip-text text-transparent`}
                >
                  {s.value}
                </div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  {s.label}
                </div>
                <div className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-tighter">
                  {s.sub}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="mx-auto max-w-[1400px] px-6 space-y-32 pb-32">

        {/* ── WHAT IS TASKKASH ───────────────────────────────────── */}
        <section className="grid gap-16 lg:grid-cols-2 items-center py-10">
          <div className="space-y-6">
            <div className={`${jetbrainsMono.className} text-xs tracking-[0.2em] uppercase text-purple-500 dark:text-purple-400 font-bold`}>
              Development Protocol
            </div>
            <h2 className={`${montserrat.className} text-4xl md:text-5xl font-black leading-tight uppercase`}>
              A New Economy for <br />
              <span className="text-emerald-500">Digital Attention</span>
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
              Every day, billions of people scroll, like, follow, and engage — and none of them get paid for it. TaskKash changes that. We're building the infrastructure where brands pay for real engagement, and users earn real crypto for real actions.
            </p>
            <div className="pt-4 flex items-center gap-4 text-sm font-bold uppercase tracking-widest text-emerald-500">
              <span className="h-px w-12 bg-emerald-500" /> Transparent Rewards
            </div>
          </div>

<div className="hidden md:block rounded-[2.5rem] p-1 shadow-2xl bg-gradient-to-br from-emerald-500/20 to-purple-500/20">            <div className="rounded-[2.4rem] bg-white dark:bg-slate-900 p-8 md:p-12 space-y-4">
              {[
                { step: "01", label: "Brand posts a campaign", color: "text-emerald-500" },
                { step: "02", label: "Users complete verified tasks", color: "text-purple-500" },
                { step: "03", label: "Task Points (TP) are awarded", color: "text-emerald-500" },
                { step: "04", label: "TP converts to SOL instantly", color: "text-purple-500" },
              ].map((item) => (
                <div
                  key={item.step}
                  className="flex items-center gap-5 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-white/5 group hover:scale-[1.02] transition-transform"
                >
                  <span className={`${jetbrainsMono.className} text-sm font-black ${item.color} w-8`}>
                    {item.step}
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600" />
                  <span className="text-sm md:text-base font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wide">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── VISION & MISSION ──────────────────────────────────────
             Restored from previous version — core brand identity copy        */}
        <section className="space-y-10">
          <div className="text-center space-y-3">
            <div className={`${jetbrainsMono.className} text-xs tracking-[0.2em] uppercase text-emerald-500 dark:text-emerald-400 font-bold`}>
              Our Foundation
            </div>
            <h2 className={`${montserrat.className} text-3xl md:text-5xl font-black uppercase`}>
              Vision &amp; Mission
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Vision */}
            <div className="relative rounded-[3rem] border border-emerald-500/20 bg-emerald-500/5 p-10 space-y-5 overflow-hidden">
              <div
                aria-hidden
                className="absolute top-0 right-0 w-48 h-48 rounded-full -translate-y-1/2 translate-x-1/2 opacity-20 blur-3xl bg-emerald-400"
              />
              <div className={`${jetbrainsMono.className} text-xs tracking-[0.2em] uppercase text-emerald-600 dark:text-emerald-400 font-black`}>
                Our Vision
              </div>
              <h3 className={`${montserrat.className} text-2xl font-black uppercase`}>
                A Collaborative Future
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                At TaskKash, we envision a world where brands and users
                collaborate seamlessly. A platform where engagement feels
                natural, trust is built through transparency, and every
                interaction delivers real value — on-chain, in real time.
              </p>
            </div>

            {/* Mission */}
            <div className="relative rounded-[3rem] border border-purple-500/20 bg-purple-500/5 p-10 space-y-5 overflow-hidden">
              <div
                aria-hidden
                className="absolute top-0 right-0 w-48 h-48 rounded-full -translate-y-1/2 translate-x-1/2 opacity-20 blur-3xl bg-purple-400"
              />
              <div className={`${jetbrainsMono.className} text-xs tracking-[0.2em] uppercase text-purple-600 dark:text-purple-400 font-black`}>
                Our Mission
              </div>
              <h3 className={`${montserrat.className} text-2xl font-black uppercase`}>
                Bridge the Gap
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                To bridge the gap between brands and users by providing
                innovative tools that foster trust, meaningful engagement, and
                mutual growth — creating a space where every digital action has
                a fair, transparent, and instant reward.
              </p>
            </div>
          </div>
        </section>

        {/* ── TECH STACK ──────────────────────────────────────────── */}
        <section className="space-y-16">
          <div className="text-center space-y-4">
            <div className={`${jetbrainsMono.className} text-xs tracking-[0.2em] uppercase text-purple-500 font-bold`}>
              Infrastructure
            </div>
            <h2 className={`${montserrat.className} text-3xl md:text-5xl font-black uppercase`}>
              Institutional-Grade Tech
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {techPillars.map((pillar) => (
              <div
                key={pillar.title}
                className="group relative rounded-3xl p-8 border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900/50 hover:bg-emerald-500/5 transition-all space-y-4 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-emerald-500/10 transition-colors" />
                <span className="inline-flex w-12 h-12 rounded-2xl items-center justify-center bg-slate-100 dark:bg-slate-800 text-emerald-500 group-hover:scale-110 transition-transform">
                  {pillar.icon}
                </span>
                <h4 className={`${montserrat.className} font-black text-lg uppercase`}>
                  {pillar.title}
                </h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── WHY TASKKASH ─────────────────────────────────────────── */}
        <section className="grid gap-8 md:grid-cols-2">
          {/* Brands */}
          <div className="rounded-[3rem] border border-emerald-500/20 bg-emerald-500/5 p-10 space-y-8">
            <div className="space-y-4">
              <div className={`${jetbrainsMono.className} text-xs tracking-[0.2em] uppercase text-emerald-600 font-black flex items-center gap-2`}>
                <BarChart3 size={14} /> For Brands
              </div>
              <h3 className={`${montserrat.className} text-2xl md:text-3xl font-black uppercase`}>
                Stop Burning Budget
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                TaskKash gives brands a smarter way to connect with the right
                audience and drive measurable results — every engagement verified by a real human.
              </p>
            </div>
            <ul className="space-y-5">
              {[
                { icon: <Users size={18} />, title: "Real, Targeted Users", desc: "Reach verified users filtered by region, interest, and on-chain activity." },
                { icon: <TrendingUp size={18} />, title: "Live Analytics", desc: "Track completions and ROI in real time." },
                { icon: <Shield size={18} />, title: "Bot-Proof Verification", desc: "AES-encrypted proof and wallet ID checks eliminate fake engagement." },
                { icon: <Zap size={18} />, title: "Custom Campaign Builder", desc: "Design social, referral, or content tasks with flexible rewards." },
              ].map((item) => (
                <li key={item.title} className="flex gap-4">
                  <span className="shrink-0 w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-600 flex items-center justify-center">
                    {item.icon}
                  </span>
                  <div>
                    <div className="text-sm font-black uppercase tracking-tight text-slate-900 dark:text-slate-100">{item.title}</div>
                    <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">{item.desc}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Users */}
          <div className="rounded-[3rem] border border-purple-500/20 bg-purple-500/5 p-10 space-y-8">
            <div className="space-y-4">
              <div className={`${jetbrainsMono.className} text-xs tracking-[0.2em] uppercase text-purple-600 font-black flex items-center gap-2`}>
                <Coins size={14} /> For Users
              </div>
              <h3 className={`${montserrat.className} text-2xl md:text-3xl font-black uppercase`}>
                Monetize Attention
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                TaskKash is more than a platform — it's a community where effort
                is rewarded. Real SOL for real actions, every time.
              </p>
            </div>
            <ul className="space-y-5">
              {[
                { icon: <Coins size={18} />, title: "Earn Real SOL", desc: "Points convert directly to Solana instantly — no expiry, no gift cards." },
                { icon: <Smartphone size={18} />, title: "Simple Tasks", desc: "Follow, like, and share. No coding or crypto experience needed." },
                { icon: <Unlock size={18} />, title: "No Lock-ins", desc: "Your earnings are yours. No minimum withdrawal thresholds." },
                { icon: <Globe size={18} />, title: "Exclusive Access", desc: "Unlock premium tasks, partner offers, and early brand drops." },
              ].map((item) => (
                <li key={item.title} className="flex gap-4">
                  <span className="shrink-0 w-10 h-10 rounded-xl bg-purple-500/20 text-purple-600 flex items-center justify-center">
                    {item.icon}
                  </span>
                  <div>
                    <div className="text-sm font-black uppercase tracking-tight text-slate-900 dark:text-slate-100">{item.title}</div>
                    <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">{item.desc}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── CORE VALUES ─────────────────────────────────────────── */}
        <section className="space-y-10">
          <div className="text-center">
            <h2 className={`${montserrat.className} text-3xl md:text-4xl font-black uppercase`}>
              What We Stand For
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div
                key={v.title}
                className="text-center space-y-4 p-10 rounded-3xl border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/30 group hover:border-emerald-500/30 transition-all"
              >
                <div className="flex justify-center group-hover:scale-110 transition-transform">{v.icon}</div>
                <h4 className={`${montserrat.className} font-black text-lg uppercase tracking-tight`}>
                  {v.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-bold">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── ROADMAP ─────────────────────────────────────────────── */}
        <section className="space-y-16">
          <div className="text-center space-y-4">
            <h2 className={`${montserrat.className} text-3xl md:text-5xl font-black uppercase`}>
              Mission Timeline
            </h2>
            <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">
              Transparency in Execution
            </p>
          </div>

          <div className="relative grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {roadmapItems.map((item) => {
              const isDone = item.status === "done";
              const isActive = item.status === "active";
              return (
                <div
                  key={item.phase}
                  className={`relative rounded-3xl p-8 border transition-all space-y-4 ${
                    isDone
                      ? "border-emerald-500/30 bg-emerald-500/5 opacity-80"
                      : isActive
                      ? "border-purple-500 bg-purple-500/5 shadow-[0_0_30px_rgba(139,92,246,0.1)] scale-[1.02]"
                      : "border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`${jetbrainsMono.className} text-xs font-black tracking-widest uppercase ${
                        isDone ? "text-emerald-500" : isActive ? "text-purple-500" : "text-slate-400"
                      }`}
                    >
                      {item.phase}
                    </span>
                    <span
                      className={`text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-tighter ${
                        isDone
                          ? "bg-emerald-500/20 text-emerald-600"
                          : isActive
                          ? "bg-purple-500 text-white animate-pulse"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                      }`}
                    >
                      {item.tag}
                    </span>
                  </div>
                  <h4 className={`${montserrat.className} font-black text-xl uppercase text-slate-900 dark:text-slate-100`}>
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── LONG-TERM VISION ───────────────────────────────────── */}
        <section className="relative rounded-[3rem] border border-slate-200 dark:border-white/5 py-10 px-5 md:p-16 text-center space-y-6 overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(16,185,129,0.07) 0%, rgba(139,92,246,0.07) 60%, transparent 100%)",
            }}
          />
          <div className={`${jetbrainsMono.className} text-xs tracking-[0.2em] uppercase text-emerald-500 dark:text-emerald-400 font-bold`}>
            Long-Term Vision
          </div>
          <h2 className={`${montserrat.className} text-2xl md:text-4xl font-black uppercase`}>
            Community Building &amp;{" "}
            <span className="bg-gradient-to-r from-emerald-500 to-purple-500 bg-clip-text text-transparent">
              Global Expansion
            </span>
          </h2>
          <p className="mx-auto max-w-3xl text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
            We are committed to continuous improvement, community building, and
            global expansion — creating a platform where brands and users grow
            together. Our long-term goal is to evolve TaskKash into a
            community-owned protocol on Solana, governed by TP token holders,
            with open APIs, multi-language support, and a DAO that puts
            decision-making in the hands of the people who use it most.
          </p>
          <div className="flex flex-wrap gap-3 justify-center pt-2">
            {["DAO Governance", "SPL Token", "Cross-chain Bridges", "API for Brands", "Mobile-first", "Open-source SDK"].map((tag) => (
              <span
                key={tag}
                className="text-xs px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wide"
              >
                {tag}
              </span>
            ))}
          </div>
        </section>

      </div>

      <TaskKashFooter />
    </main>
  );
}
