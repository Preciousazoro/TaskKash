"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
});
import {
  ArrowRight,
  BarChart3,
  Check,
  Zap,
  ClipboardList,
  Rocket,
  Wallet,
  Plus,
  Headphones,
  ArrowUpRight,
  Layout,
  Users,
  Target,
  X,
} from "lucide-react";
import TaskKashHeader from "@/components/ui/TaskKashHeader";
import TaskKashFooter from "@/components/ui/TaskKashFooter";

const faqs = [
  {
    question: "How do I start earning on TaskKash?",
    answer:
      "Getting started is simple: connect your Solana wallet, browse available tasks from various brands, complete the required actions (like social media engagement or content creation), submit proof of completion, and earn Task Points (TP) once verified.",
  },
  {
    question: "What are Task Points and how do they work?",
    answer:
      "Task Points (TP) are the native reward units on TaskKash. You earn TP for completing verified tasks, which can then be converted to SOL based on current platform rates. The more tasks you complete, the more TP you accumulate and convert.",
  },
  {
    question: "How do I convert my Task Points to SOL?",
    answer:
      "Once you've accumulated TP, you can convert them to SOL through your dashboard. The conversion rate is transparent and displayed in real-time. SOL withdrawals are processed directly to your connected wallet.",
  },
  {
    question: "What types of tasks are available on TaskKash?",
    answer:
      "Tasks range from social media engagement (following, liking, sharing), content creation (posts, videos, reviews), commerce activities (product testing, reviews), to community participation. Each task clearly shows the TP reward and requirements.",
  },
  {
    question: "How does TaskKash verify task completion?",
    answer:
      "Our verification system requires users to submit proof of completion (screenshots, links, or other evidence). Our admin team reviews submissions to ensure authenticity before awarding TP. This maintains quality and fairness for both users and brands.",
  },
  {
    question: "Can brands track their campaign performance?",
    answer:
      "Yes. Brands get access to a comprehensive dashboard showing real-time analytics including participation rates, completion rates, engagement metrics, and ROI data. Campaign performance is fully transparent and measurable.",
  },
  {
    question: "Is there a minimum amount to withdraw SOL?",
    answer:
      "Yes, there's a minimum withdrawal threshold to ensure efficient blockchain transactions. The current minimum is displayed in your wallet section. We recommend accumulating TP before conversion to minimize transaction fees.",
  },
  {
    question: "How does TaskKash ensure security for users and brands?",
    answer:
      "We use Solana's secure blockchain infrastructure, implement wallet connection standards, and have a robust verification system. All transactions are transparent on-chain, and we maintain strict data protection policies for user information.",
  },
];

const howItWorks = [
  {
    title: "Connect Wallet",
    description: "Link your wallet in seconds and access available tasks.",
    icon: Wallet,
  },
  {
    title: "Complete Tasks",
    description: "Finish micro-tasks and campaigns to earn Task Points (TP).",
    icon: Check,
  },
  {
    title: "Convert TP to SOL",
    description: "Convert your points into SOL and withdraw directly.",
    icon: ArrowRight,
  },
  {
    title: "Track Participation",
    description: "Monitor completed tasks and reward history in real time.",
    icon: ClipboardList,
  },
];

const userBenefits = [
  "Complete simple interactive tasks",
  "Earn TP through verified participation and convert it to SOL",
  "Discover new Web3 communities and emerging projects",
  "Turn your everyday online activity into real rewards",
];

const brandBenefits = [
  "Launch structured engagement campaigns",
  "Reward verified participation",
  "Increase retention rates",
  "Access measurable participation data",
];

const metrics = [
  { value: "120K+", label: "Users Onboarded" },
  { value: "2.5M+", label: "Tasks Completed" },
  { value: "15K+", label: "SOL Distributed" },
  { value: "350+", label: "Active Campaigns" },
];

function FAQItem({
  faq,
  isOpen,
  onClick,
}: {
  faq: any;
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <div
      className={`group transition-all duration-300 rounded-[1rem] border ${
        isOpen
          ? "bg-white dark:bg-slate-800 border-emerald-500/50 shadow-xl shadow-emerald-500/5"
          : "bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-emerald-800"
      }`}
    >
      <button
        onClick={onClick}
        className="w-full flex items-center cursor-pointer justify-between p-6 text-left"
      >
        <span
          className={`text-sm md:text-base font-bold uppercase tracking-tight ${isOpen ? "text-emerald-600 dark:text-emerald-400" : "text-slate-900 dark:text-slate-100"}`}
        >
          {faq.question}
        </span>
        <div
          className={`flex-shrink-0 ml-4 transition-transform duration-300 ${isOpen ? "rotate-0" : "rotate-0"}`}
        >
          {isOpen ? (
            <X className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <Plus className="w-5 h-5 text-slate-400 dark:text-slate-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400" />
          )}
        </div>
      </button>

      {isOpen && (
        <div className="px-6 pb-8">
          <div className="h-px bg-emerald-500/10 dark:bg-emerald-400/10 mb-6" />
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed md:text-base">
            {faq.answer}
          </p>
        </div>
      )}
    </div>
  );
}

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 overflow-x-hidden">
      <TaskKashHeader />

      {/* HERO SECTION */}
<section className="relative mx-auto max-w-[1400px] flex items-center justify-center overflow-hidden pt-30 pb-10 md:pt-32 md:pb-20 lg:pt-40 lg:pb-20">
  {/* BACKGROUND IMAGE WITH OVERLAY & FLOATING BUBBLES */}
  <div className="absolute inset-0 z-0 flex justify-end">
    {/* Floating Elements Container */}
   <div className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-full items-center justify-center">
  <div className="relative w-[500px] h-[500px] flex items-center justify-center">
    
    {/* Central Logo - Width and Height set to 50 (h-50 w-50 is 200px / 12.5rem) */}
    <div className="relative z-20 p-8 bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl border border-slate-200 dark:border-white/10 animate-bounce-slow">
      <img
        src="/taskkash-logo.png"
        alt="TaskKash Logo"
        className="h-40 w-40 object-contain"
      />
    </div>

    {/* Floating Chat Bubbles - 6 total now */}
    {/* 1. Top Left */}
    <div className="absolute top-5 -left-10 bg-white dark:bg-slate-800 px-4 py-2 rounded-2xl shadow-xl text-[12px] font-bold border border-slate-100 dark:border-white/5 animate-float-delayed">
      🚀 TP feels juicy already! 💰
    </div>

    {/* 2. Top Right */}
    <div className="absolute top-12 -right-20 bg-white dark:bg-slate-800 px-4 py-2 rounded-2xl shadow-xl text-[12px] font-bold border border-slate-100 dark:border-white/5 animate-float">
      Just earned 0.5 SOL! 🔥
    </div>

    {/* 3. Mid Left */}
    <div className="absolute top-1/2 -left-20 -translate-y-1/2 bg-white dark:bg-slate-800 px-4 py-2 rounded-2xl shadow-xl text-[12px] font-bold border border-slate-100 dark:border-white/5 animate-float-delayed">
      Withdrawals are instant ⚡
    </div>

    {/* 4. Mid Right */}
    <div className="absolute top-1/2 -right-24 -translate-y-1/2 bg-white dark:bg-slate-800 px-4 py-2 rounded-2xl shadow-xl text-[12px] font-bold border border-slate-100 dark:border-white/5 animate-float">
      Tasks are super easy ✨
    </div>

    {/* 5. Bottom Left */}
    <div className="absolute bottom-10 -left-12 bg-white dark:bg-slate-800 px-4 py-2 rounded-2xl shadow-xl text-[12px] font-bold border border-slate-100 dark:border-white/5 animate-float">
      Joined the godly tier 🍉
    </div>

    {/* 6. Bottom Right */}
    <div className="absolute bottom-5 right-0 bg-white dark:bg-slate-800 px-4 py-2 rounded-2xl shadow-xl text-[12px] font-bold border border-slate-100 dark:border-white/5 animate-float-delayed">
      Best task-to-earn on Solana 💎
    </div>

  </div>
</div>

    {/* Gradient Overlays */}
    <div className="absolute inset-0 bg-gradient-to-r from-white via-white/40 to-transparent dark:from-slate-950 dark:via-slate-950/80" />
  </div>

  {/* First section - INTACT */}
  <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
    <div className="max-w-2xl lg:max-w-3xl">
      {/* TAGLINE */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        Turn Actions Into Rewards
      </div>

      {/* MAIN HEADING */}
      <h1
        className={`${montserrat.className} text-5xl md:text-6xl lg:text-6xl font-black leading-[1.1] tracking-tight text-slate-900 dark:text-white mb-6 uppercase`}
      >
        Turn Everyday Actions into <br />
        <span className="bg-gradient-to-r from-emerald-500 to-purple-600 bg-clip-text text-transparent">
          On-Chain Rewards
        </span>
      </h1>

      {/* SUBTEXT */}
      <p className="text-lg md:text-lg text-slate-600 dark:text-slate-400 mb-10 max-w-xl leading-relaxed font-light">
        Complete structured tasks, earn Task Points (TP), and convert them
        to SOL. Experience seamless, verified growth on the blockchain.
      </p>

      {/* CTA BUTTONS */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Link
          href="/auth/signup"
          className="w-full sm:w-auto px-10 py-5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-black uppercase tracking-widest rounded-2xl transition-all hover:scale-105 active:scale-95 text-center"
        >
          Start Earning Now
        </Link>

        <Link
          href="/contact"
          className="w-full sm:w-auto px-10 py-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm font-black uppercase tracking-widest rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all text-center"
        >
          Launch Campaign
        </Link>
      </div>

      {/* TRUST INDICATOR */}
      <div className="mt-12 flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8 opacity-90">
        <div className="flex items-center gap-8">
          <div className="flex flex-col">
            <span className="text-3xl font-black text-slate-900 dark:text-white leading-none mb-1">100%</span>
            <span className="text-[10px] uppercase tracking-widest font-black text-emerald-500">Verified Proof</span>
          </div>
          <div className="h-10 w-[1px] bg-slate-200 dark:bg-white/10" />
          <div className="flex flex-col">
            <span className="text-3xl font-black text-slate-900 dark:text-white leading-none mb-1">Insta</span>
            <span className="text-[10px] uppercase tracking-widest font-black text-purple-500">SOL Payouts</span>
          </div>
        </div>
        <div className="hidden md:block h-10 w-[1px] bg-slate-200 dark:bg-white/10" />
        <div className="flex items-center gap-4">
          <div className="flex -space-x-3 overflow-hidden">
            {[
              "https://i.postimg.cc/0yJ0FsJS/LE-MAC.jpg",
              "https://i.postimg.cc/rFsJGWVf/Kamala-Harris.jpg",
              "https://i.postimg.cc/mZ8jFVsy/Nailed-it.jpg",
              "https://i.postimg.cc/LXVTD3gC/The-secret.jpg",
            ].map((src, i) => (
              <div key={i} className="inline-block h-12 w-12 rounded-full border-2 border-white dark:border-slate-900 bg-slate-100 overflow-hidden">
                <img src={src} alt="User avatar" className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black text-slate-900 dark:text-white leading-none mb-1">1.1K+</span>
            <span className="text-[10px] uppercase tracking-widest font-black text-slate-500 dark:text-slate-400">Active Contributors</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white dark:from-slate-950 to-transparent z-10" />

  {/* CSS for the float animations - Add to your global CSS or a style tag */}
  <style jsx>{`
    @keyframes float {
      0% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
      100% { transform: translateY(0px); }
    }
    .animate-float { animation: float 3s ease-in-out infinite; }
    .animate-float-delayed { animation: float 3.5s ease-in-out infinite 1s; }
    .animate-bounce-slow { animation: bounce 4s infinite; }
  `}</style>
</section>

      {/* How TaskKash Works Section */}
      <section
        id="how"
        className="mx-auto max-w-[1400px] px-4 lg:px-8 py-20 w-full bg-white dark:bg-slate-950"
      >
        {/* Header */}
        <div className="text-center mb-10 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-[.2em] mb-4 text-emerald-600 dark:text-emerald-400">
            Process
          </div>

          <h2
            className={`${montserrat.className} text-3xl md:text-5xl lg:text-5xl font-black leading-[1.1] tracking-tight text-foreground mb-6 uppercase`}
          >
            {" "}
            How TaskKash{" "}
            <span className="text-emerald-600 dark:text-emerald-400">
              Works
            </span>
          </h2>

          <p className="text-slate-600 dark:text-slate-400 max-w-lg mx-auto text-base md:text-lg font-light leading-relaxed">
            A simple, verified path from completing micro-tasks to withdrawing
            your rewards in SOL.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {howItWorks.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="group relative cursor-pointer rounded-[2rem] border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 p-8 transition-all duration-300 hover:-translate-y-2 hover:border-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/10"
              >
                {/* Step Number Badge */}
                <div className="absolute top-6 right-8 text-4xl font-black text-slate-200 dark:text-slate-800 group-hover:text-emerald-500/20 transition-colors">
                  0{index + 1}
                </div>

                {/* Icon Container */}
                <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform duration-500">
                  <Icon className="h-7 w-7" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-slate-100 mb-3">
                  {item.title}
                </h3>

                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400 font-light">
                  {item.description}
                </p>

                {/* Bottom Decorative Line */}
                <div className="mt-6 h-1 w-12 rounded-full bg-slate-200 dark:bg-slate-800 group-hover:w-full group-hover:bg-emerald-500 transition-all duration-500" />
              </div>
            );
          })}
        </div>
      </section>

      {/* Participation Section */}
      <section
        id="users"
        className="mx-auto max-w-[1400px] px-4 lg:px-8 py-20 w-full"
      >
        <div className="grid w-full items-center gap-16 lg:grid-cols-2">
          {/* Left Side: Content */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-[.2em] mb-6 text-emerald-400">
              <Zap className="w-3 h-3" />
              For Contributors
            </div>

            <h2
              className={`${montserrat.className} text-3xl md:text-5xl lg:text-4xl font-black leading-[1.1] tracking-tight text-foreground mb-6 uppercase`}
            >
              Participation <span className="text-emerald-500">That Pays</span>
            </h2>

            <p className="text-slate-600 dark:text-slate-400 text-base md:text-lg max-w-xl mb-10 leading-relaxed font-light">
              Simple actions, transparent rewards. No trading skills required.
              Turn your digital engagement into real-world cryptocurrency.
            </p>

            <ul className="space-y-4 mb-10">
              {userBenefits.map((benefit) => (
                <li
                  key={benefit}
                  className="flex cursor-pointer items-start gap-4 text-slate-700 dark:text-slate-200 group"
                >
                  <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-base md:text-sm font-medium tracking-tight">
                    {benefit}
                  </span>
                </li>
              ))}
            </ul>

            <div className="flex justify-center sm:justify-start">
              <Link href="/auth/signup">
                <button className="w-fit bg-emerald-500 hover:bg-emerald-600 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-sm transition-all flex items-center justify-center gap-3 hover:scale-105 active:scale-95">
                  Start Earning Now
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>

          {/* Right Side: High-End Dashboard Mockup */}
          <div className="relative">
            {/* Decorative Glow */}
            <div className="absolute -inset-4 rounded-[3rem] blur-3xl" />

            <div className="relative rounded-[2.5rem] border border-slate-200 dark:border-white/5 bg-white/50 dark:bg-slate-900/50 p-4 backdrop-blur-sm sm:p-6 lg:rounded-[3rem]">
              <div className="overflow-hidden rounded-[2rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 shadow-2xl">
                {/* Fake Header */}
                <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 px-6 py-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-400" />
                    <div className="h-3 w-3 rounded-full bg-amber-400" />
                    <div className="h-3 w-3 rounded-full bg-emerald-400" />
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <Layout className="w-3 h-3" />
                    User Dashboard
                  </div>
                </div>

                {/* Dashboard Content */}
                <div className="p-6">
                  <div className="grid gap-4 sm:grid-cols-3 mb-6">
                    <div className="rounded-2xl bg-slate-50 dark:bg-slate-800 p-4 border border-slate-100 dark:border-slate-700">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Tasks
                      </p>
                      <p className="mt-1 text-2xl font-black text-slate-900 dark:text-white">
                        12
                      </p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 dark:bg-slate-800 p-4 border border-slate-100 dark:border-slate-700">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        TP Points
                      </p>
                      <p className="mt-1 text-2xl font-black text-purple-500">
                        1,250
                      </p>
                    </div>
                    <div className="rounded-2xl bg-emerald-500 p-4 shadow-lg shadow-emerald-500/20">
                      <p className="text-[10px] font-black text-white/70 uppercase tracking-widest">
                        Balance
                      </p>
                      <p className="mt-1 text-2xl font-black text-white">
                        4.5 SOL
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                      Recent Activity
                    </p>
                    {[
                      {
                        label: "Community Task",
                        reward: "+120 TP",
                        color: "text-purple-500",
                      },
                      {
                        label: "SOL Conversion",
                        reward: "+0.15 SOL",
                        color: "text-emerald-500",
                      },
                    ].map((row, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between rounded-2xl bg-slate-50 dark:bg-slate-800/50 px-5 py-4 border border-slate-100 dark:border-slate-800/50"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-white dark:bg-slate-700 flex items-center justify-center shadow-sm">
                            <Wallet className="w-4 h-4 text-slate-400" />
                          </div>
                          <div className="h-2 w-20 rounded-full bg-slate-200 dark:bg-slate-700" />
                        </div>
                        <span className={`text-xs font-black ${row.color}`}>
                          {row.reward}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Campaign Analytics Section */}
      <section
        id="brands"
        className="mx-auto max-w-[1400px] px-4 lg:px-8 py-20 w-full"
      >
        <div className="grid w-full items-center gap-16 lg:grid-cols-2">
          {/* Right Side: Analytics Mockup (Order 2 on Mobile, 1 on Desktop) */}
          <div className="order-2 lg:order-1 relative">
            {/* Decorative Glow */}
            <div className="absolute -inset-4 rounded-[3rem] blur-3xl" />

            <div className="relative rounded-[2.5rem] border border-slate-200 dark:border-white/5 bg-white/50 dark:bg-slate-900/50 p-4 backdrop-blur-sm sm:p-6 lg:rounded-[3rem]">
              <div className="overflow-hidden rounded-[2rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 shadow-2xl">
                {/* Mockup Header */}
                <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 px-6 py-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <BarChart3 className="w-3 h-3 text-emerald-500" />
                    Campaign Analytics
                  </div>
                  <div className="flex gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-red-400" />
                    <div className="h-3 w-3 rounded-full bg-amber-400" />
                    <div className="h-3 w-3 rounded-full bg-emerald-400" />
                  </div>
                </div>

                {/* Mockup Content */}
                <div className="p-6">
                  <div className="grid gap-4 md:grid-cols-[1.2fr_1fr] mb-6">
                    {/* Bar Chart Section */}
                    <div className="flex items-end justify-between gap-2 rounded-2xl bg-slate-50 dark:bg-slate-800 p-4 border border-slate-100 dark:border-slate-700">
                      {[65, 42, 84, 55, 70].map((h, i) => (
                        <div
                          key={i}
                          className="flex flex-col items-center gap-3 w-full"
                        >
                          <div
                            className={`w-full max-w-[32px] rounded-t-lg transition-all duration-500 ${
                              i === 2
                                ? "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                                : "bg-purple-500/40"
                            }`}
                            style={{ height: `${h}px` }}
                          />
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            {["M", "T", "W", "T", "F"][i]}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Stats Cards Section */}
                    <div className="space-y-3">
                      {[
                        {
                          label: "Engagement",
                          value: "25.3K",
                          color: "text-slate-900 dark:text-white",
                        },
                        {
                          label: "Conv. Rate",
                          value: "18.5%",
                          color: "text-emerald-500",
                        },
                        {
                          label: "Active Users",
                          value: "4.1K",
                          color: "text-purple-500",
                        },
                      ].map((stat, i) => (
                        <div
                          key={i}
                          className="rounded-2xl bg-slate-50 dark:bg-slate-800 p-4 border border-slate-100 dark:border-slate-700"
                        >
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            {stat.label}
                          </p>
                          <p
                            className={`mt-1 text-2xl font-black ${stat.color}`}
                          >
                            {stat.value}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Left Side: Content (Order 1 on Mobile, 2 on Desktop) */}
          <div className="order-1 lg:order-2 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-[.2em] mb-6 text-emerald-400">
              <Target className="w-3 h-3" />
              For Brands & Creators
            </div>

            <h2
              className={`${montserrat.className} text-3xl md:text-5xl lg:text-4xl font-black leading-[1.1] tracking-tight text-foreground mb-6 uppercase`}
            >
              {" "}
              Engagement <span className="text-emerald-500">That Converts</span>
            </h2>

            <p className="text-slate-600 dark:text-slate-400 text-base md:text-lg max-w-xl mb-10 leading-relaxed font-light">
              Verify user participation and drive measurable growth with
              structured campaigns. Reach a verified audience ready to engage
              with your vision.
            </p>

            <ul className="space-y-4 mb-10">
              {brandBenefits.map((benefit) => (
                <li
                  key={benefit}
                  className="flex cursor-pointer items-start gap-4 text-slate-700 dark:text-slate-200 group"
                >
                  <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-base md:text-sm font-medium tracking-tight">
                    {benefit}
                  </span>
                </li>
              ))}
            </ul>

            <div className="flex justify-center sm:justify-start">
              <Link href="/contact">
                <button className="w-fit bg-emerald-500 hover:bg-emerald-600 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-sm transition-all flex items-center justify-center gap-3 hover:scale-105 active:scale-95">
                  Launch Campaign
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Numbers that speaks section */}
      <section className="mx-auto max-w-[1400px] px-4 lg:px-8 py-10 w-full">
        {/* Header */}
        <div className="text-center mb-10">
          <h2
            className={`${montserrat.className} text-3xl md:text-5xl lg:text-5xl font-black leading-[1.1] tracking-tight text-foreground mb-6 uppercase`}
          >
            {" "}
            Numbers that{" "}
            <span className="text-emerald-600 dark:text-emerald-400">
              speaks
            </span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-base md:text-lg">
            Join a global community of users who trust TaskKash for reliable
            rewards, verified tasks, and industry-leading support.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Users Onboarded */}
          <div className="md:col-span-4 rounded-3xl border bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 p-8 flex flex-col justify-between min-h-[280px] transition-all hover:-translate-y-1 hover:border-emerald-200 dark:hover:border-emerald-800">
            <div>
              <p className="text-[10px] tracking-[.2em] uppercase text-slate-500 dark:text-slate-400 mb-2 font-mono">
                Users Onboarded
              </p>
              <h3 className="text-6xl font-black tracking-tighter text-slate-900 dark:text-slate-100">
                120
                <span className="text-emerald-600 dark:text-emerald-400">
                  K+
                </span>
              </h3>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 font-mono">
                +28.4%{" "}
                <span className="text-emerald-600 dark:text-emerald-400">
                  ↑
                </span>{" "}
                this quarter
              </p>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] tracking-widest uppercase text-slate-400 dark:text-slate-500 font-mono">
                All time
              </span>
              <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* Tasks Completed - UPDATED WITH IMAGES */}
          <div className="md:col-span-4 rounded-3xl border bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 p-8 flex flex-col justify-between min-h-[280px] transition-all hover:-translate-y-1 hover:border-emerald-200 dark:hover:border-emerald-800">
            <div>
              <p className="text-[10px] tracking-[.2em] uppercase text-slate-500 dark:text-slate-400 mb-2 font-mono">
                Tasks Completed
              </p>
              <h3 className="text-6xl font-black tracking-tighter text-slate-900 dark:text-slate-100">
                2.5
                <span className="text-emerald-600 dark:text-emerald-400">
                  M+
                </span>
              </h3>
            </div>
            <div>
              <p className="text-[10px] tracking-[.2em] uppercase text-slate-500 dark:text-slate-400 mb-3 font-mono">
                Recent activity
              </p>
              <div className="flex items-center">
                {[
                  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
                  "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop",
                  "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop",
                  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
                ].map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt="User"
                    className="w-12 h-12 rounded-full border-2 border-white dark:border-slate-900 -ml-3 first:ml-0 object-cover bg-slate-200 dark:bg-slate-800"
                  />
                ))}
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900/30 border-2 border-white dark:border-slate-900 text-emerald-600 dark:text-emerald-400 -ml-3 font-mono z-10">
                  +1k
                </div>
              </div>
            </div>
          </div>

          {/* SOL Distributed */}
          <div className="md:col-span-4 rounded-3xl border bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 p-8 flex flex-col justify-between min-h-[280px] relative overflow-hidden transition-all hover:-translate-y-1 hover:border-emerald-200 dark:hover:border-emerald-800">
            <div className="relative z-10">
              <p className="text-[10px] tracking-[.2em] uppercase text-slate-500 dark:text-slate-400 mb-2 font-mono">
                SOL Distributed
              </p>
              <h3 className="text-6xl font-black tracking-tighter text-slate-900 dark:text-slate-100">
                15
                <span className="text-emerald-600 dark:text-emerald-400">
                  K+
                </span>
              </h3>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                Instant withdrawals
              </p>
            </div>
            <Wallet className="absolute -right-6 -bottom-6 w-32 h-32 text-emerald-500/5" />
            <div className="relative z-10 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] tracking-widest uppercase font-mono text-emerald-600 dark:text-emerald-400">
                Live on Solana
              </span>
            </div>
          </div>

          {/* Active Campaigns */}
          <div className="md:col-span-7 rounded-3xl border bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 p-8 flex md:flex-row items-start md:items-center justify-between gap-6 transition-all hover:-translate-y-1 hover:border-emerald-200 dark:hover:border-emerald-800">
            <div>
              <p className="text-[10px] tracking-[.2em] uppercase text-slate-500 dark:text-slate-400 mb-2 font-mono">
                Active Campaigns
              </p>
              <h3 className="text-5xl font-black tracking-tighter text-slate-900 dark:text-slate-100">
                350
                <span className="text-emerald-600 dark:text-emerald-400">
                  +
                </span>
              </h3>
            </div>
            <div className="flex flex-col items-end">
              <div className="flex gap-2 mb-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center">
                  <ArrowRight className="w-5 h-5 text-white" />
                </div>
              </div>
              <p className="text-[10px] tracking-widest uppercase text-slate-400 dark:text-slate-500 font-mono">
                Brands • Creators
              </p>
            </div>
          </div>

          {/* 24/7 Support */}
          <div className="md:col-span-5 rounded-3xl border bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 p-8 flex flex-col justify-between transition-all hover:-translate-y-1 hover:border-emerald-200 dark:hover:border-emerald-800">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] tracking-widest uppercase font-mono text-emerald-600 dark:text-emerald-400">
                    Online now
                  </span>
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight text-slate-900 dark:text-slate-100">
                  24/7 Expert Support
                </h3>
              </div>
              <Headphones className="w-8 h-8 text-emerald-500/20" />
            </div>
            <div className="mt-4 rounded-xl px-4 py-2 text-[10px] tracking-widest uppercase font-mono text-slate-500 dark:text-slate-400 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
              Avg response &lt; 60 seconds
            </div>
          </div>
        </div>

        {/* Ticker */}
        <div className="mt-12 py-4 border-y border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="flex gap-12 whitespace-nowrap animate-[ticker_30s_linear_infinite]">
            {[
              "$15K+ SOL Distributed",
              "120K+ Users",
              "2.5M+ Tasks",
              "350+ Campaigns",
              "24/7 Support",
              "< 60s Response",
              "Trusted Worldwide",
              "Web3 Platform",
              ...[
                "$15K+ SOL Distributed",
                "120K+ Users",
                "2.5M+ Tasks",
                "350+ Campaigns",
                "24/7 Support",
                "< 60s Response",
                "Trusted Worldwide",
                "Web3 Platform",
              ],
            ].map((item, i) => (
              <span
                key={i}
                className="text-[10px] tracking-[.3em] uppercase text-slate-400 dark:text-slate-600 font-mono flex items-center gap-4"
              >
                {item}{" "}
                <span className="w-1 h-1 rounded-full bg-emerald-500/20" />
              </span>
            ))}
          </div>
        </div>

        {/* CTA - UPDATED TO BE CENTERED AND NOT 100% WIDTH */}
        <div className="mt-10 flex justify-center">
          <Link
            href="/auth/signup"
            className="w-fit bg-emerald-500 text-white px-10 py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-emerald-600 transition-colors flex items-center gap-3 shadow-xl shadow-emerald-500/20 hover:scale-105 transition-transform"
          >
            Get Started Now
            <ArrowUpRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Frequently Asked QuestionS Section */}
      <section className="mx-auto max-w-[1400px] px-4 lg:px-8 py-20 w-full">
        <div className="text-center mb-10 relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-[.2em] mb-4 text-emerald-600 dark:text-emerald-400">
            Support
          </div>

          {/* Main Heading */}
          <h2
            className={`${montserrat.className} text-3xl md:text-5xl lg:text-5xl font-black leading-[1.1] tracking-tight text-foreground mb-6 uppercase`}
          >
            {" "}
            Frequently Asked{" "}
            <span className="text-emerald-600 dark:text-emerald-400">
              Questions
            </span>
          </h2>

          {/* Centered Paragraph */}
          <p className="text-muted-foreground max-w-lg mx-auto text-base md:text-lg font-light leading-relaxed">
            Everything you need to know about the TaskKash ecosystem. From
            earning Task Points to converting them into SOL.
          </p>
        </div>

        {/* Two Column Layout like the reference */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          {/* Left Column */}
          <div className="space-y-4">
            {faqs.slice(0, 4).map((faq, index) => (
              <FAQItem
                key={index}
                faq={faq}
                isOpen={openFaq === index}
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
              />
            ))}
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {faqs.slice(4, 8).map((faq, index) => (
              <FAQItem
                key={index + 4}
                faq={faq}
                isOpen={openFaq === index + 4}
                onClick={() =>
                  setOpenFaq(openFaq === index + 4 ? null : index + 4)
                }
              />
            ))}
          </div>
        </div>
      </section>

      {/* Campaign Section */}
      <section className="mx-auto max-w-[1400px] px-4 lg:px-8 py-10 pb-20 w-full">
        <div className="relative overflow-hidden rounded-[2rem] bg-slate-950 px-6 py-12 md:px-16 md:py-15 border border-white/5">
          {/* Background Gradient Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(16,185,129,0.15),rgba(147,51,234,0.12))]" />

          {/* Background Logo - Positioned at right end corner like the promo */}
          <img
            src="/taskkash-logo.png"
            alt=""
            className="absolute bottom-0 right-0 w-[400px] md:w-[400px] h-auto object-contain opacity-10 md:opacity-20 pointer-events-none translate-x-10 translate-y-10 lg:translate-x-5 lg:translate-y-5  brightness-200"
          />

          {/* Decorative Blur */}
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-[10px] font-bold uppercase tracking-[.2em] mb-6 text-emerald-400">
              <Rocket className="w-3 h-3" />
              Grow with TaskKash
            </div>

            <h2
              className={`${montserrat.className} text-3xl md:text-5xl lg:text-5xl font-black leading-[1.1] tracking-tight text-white mb-6 uppercase`}
            >
              Ready to Earn or Launch a Campaign?
            </h2>

            <p className="text-slate-300 text-base md:text-lg max-w-xl mb-10 leading-relaxed font-light">
              Join thousands of users earning rewards or brands driving real
              growth. Get started today and experience the future of Web3
              engagement.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/auth/signup">
                <button className="w-full sm:w-fit bg-emerald-500 hover:bg-emerald-600 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-3 hover:scale-105 active:scale-95">
                  Get Started Now
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>

              <Link href="/about">
                <button className="w-full sm:w-fit bg-white/5 hover:bg-white/10 backdrop-blur-md text-white border border-white/10 px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-3">
                  Learn More
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <TaskKashFooter />
    </main>
  );
}
