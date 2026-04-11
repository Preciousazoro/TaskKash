// app/whitepaper/page.tsx
"use client";

import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  XCircle,
  Zap,
  Shield,
  Database,
  Code2,
  Layers,
  Server,
  Wrench,
  BarChart3,
  Coins,
  FileText,
  ChevronDown,
} from "lucide-react";
import { Montserrat, Space_Grotesk, JetBrains_Mono } from "next/font/google";

const montserrat = Montserrat({ subsets: ["latin"], weight: ["700", "800", "900"] });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["400", "500", "600"] });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"] });

import TaskKashHeader from "@/components/ui/TaskKashHeader";
import TaskKashFooter from "@/components/ui/TaskKashFooter";

const technicalStack = [
  { icon: <Code2 className="w-5 h-5" />, title: "Frontend Framework", description: "Next.js 16 with React 19 for server-side rendering and modern React features with TypeScript support." },
  { icon: <Database className="w-5 h-5" />, title: "Database & Storage", description: "MongoDB with Mongoose ODM for flexible data modeling and Cloudinary for media storage." },
  { icon: <Shield className="w-5 h-5" />, title: "Authentication & Security", description: "NextAuth.js 5 with secure session management and bcryptjs for password hashing." },
  { icon: <Layers className="w-5 h-5" />, title: "UI & Styling", description: "Tailwind CSS 4 with shadcn/ui components, Radix UI primitives, and Framer Motion." },
  { icon: <Server className="w-5 h-5" />, title: "Backend & APIs", description: "Node.js API routes with Next.js, SWR for data fetching, and RESTful architecture." },
  { icon: <Wrench className="w-5 h-5" />, title: "Development Tools", description: "TypeScript for type safety and modern development workflow with hot reload optimization." },
];

const problemPoints = [
  "Low-quality engagement and bot fraud",
  "Superficial marketing metrics (vanity likes)",
  "High barrier to entry for crypto earning",
  "Lack of sustainable participation models",
];

const solutionPoints = [
  "Structured task campaigns with proof-of-action",
  "Verifiable user interaction via API integration",
  "Task Points (TP) convertible to native SOL",
  "API-driven campaign management for brands",
];

const roadmap = [
  { status: "done", phase: "Phase 1 · Foundation", title: "Platform Genesis", tag: "Completed", description: "Core platform launch, Solana wallet integration, and initial user beta onboarding." },
  { status: "active", phase: "Phase 2 · Growth", title: "Analytical Scale", tag: "In Progress", description: "Advanced brand dashboard, real-time campaign analytics, and scaling to 500k+ users." },
  { status: "upcoming", phase: "Phase 3 · Ecosystem", title: "Developer API Launch", tag: "Q3 2026", description: "Opening our infrastructure for third-party dApp integrations and multi-project partnerships." },
  { status: "upcoming", phase: "Phase 4 · Global", title: "Cross-Chain Expansion", tag: "2027", description: "Native mobile applications and expansion to EVM-compatible chains." },
];

const milestones = [
  { value: "500K", label: "Users Target", sub: "projected growth" },
  { value: "1k+", label: "Tasks / Month", sub: "at full scale" },
  { value: "20+", label: "Brand Partners", sub: "live campaigns" },
  { value: "100%", label: "On-Chain Proof", sub: "every action" },
];

const tocItems = [
  { id: "summary", label: "Executive Summary" },
  { id: "problem", label: "Problem & Solution" },
  { id: "tech", label: "Technical Stack" },
  { id: "tokenomics", label: "Tokenomics" },
  { id: "roadmap", label: "Roadmap" },
  { id: "milestones", label: "Milestones" },
  { id: "security", label: "Security" },
];

export default function WhitepaperPage() {
  return (
    <main className={`${spaceGrotesk.className} min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300`}>
      <TaskKashHeader />

      {/* ── HERO ── Matches About Us structure */}
      <section className="pt-40 pb-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <div className={`${jetbrainsMono.className} inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.3em] uppercase text-emerald-500 mb-8`}>
            <FileText className="w-3 h-3" />
            Technical Documentation · v1.0
          </div>

          <h1 className={`${montserrat.className} text-5xl md:text-8xl font-black leading-[0.9] tracking-tighter mb-8`}>
            THE<br />
            <span className="text-emerald-500">WHITEPAPER</span>
          </h1>

          <p className="mx-auto max-w-xl text-slate-500 dark:text-slate-400 text-lg md:text-xl leading-relaxed mb-12 font-medium">
            Building the infrastructure for decentralized engagement — the gateway to micro-earnings on Solana.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="w-full sm:w-fit">
              <button className="w-full bg-emerald-500 text-white px-10 py-5 rounded-full font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-3 hover:scale-105 active:scale-95">
                Request PDF <ArrowRight size={16} />
              </button>
            </Link>
            <a href="#roadmap" className="w-full sm:w-fit">
              <button className="w-full border-2 border-slate-200 dark:border-white/10 hover:border-emerald-500 text-slate-900 dark:text-white px-10 py-5 rounded-full font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-3 hover:scale-105">
                Jump to Roadmap <ChevronDown size={16} />
              </button>
            </a>
          </div>
        </div>
      </section>

      {/* ── TOC STRIP ── */}
      <div className="border-y border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/30 py-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className={`${jetbrainsMono.className} flex flex-wrap justify-center gap-x-8 gap-y-4`}>
            {tocItems.map((item, i) => (
              <a key={item.id} href={`#${item.id}`}
                className="text-[10px] tracking-widest uppercase text-slate-400 hover:text-emerald-500 transition-colors flex items-center gap-2 font-bold">
                <span className="text-emerald-500/40">{(i + 1).toString().padStart(2, "0")}</span>
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex flex-col lg:flex-row gap-16 items-start">

          {/* Sticky sidebar */}
          <aside className="hidden xl:block w-56 shrink-0 sticky top-32 space-y-1">
            <div className={`${jetbrainsMono.className} text-[10px] tracking-[0.3em] uppercase text-slate-400 mb-6 font-bold`}>
              Index
            </div>
            {tocItems.map((item, i) => (
              <a key={item.id} href={`#${item.id}`}
                className="flex items-center gap-4 py-2 text-[11px] font-bold uppercase tracking-widest text-slate-400 hover:text-emerald-500 transition-colors group">
                <span className="text-[10px] text-slate-200 dark:text-slate-800 group-hover:text-emerald-500/50">
                  {(i + 1).toString().padStart(2, "0")}
                </span>
                {item.label}
              </a>
            ))}
          </aside>

          {/* Article body */}
          <article className="flex-1 min-w-0 space-y-32">

            {/* 01 EXECUTIVE SUMMARY */}
            <section id="summary" className="scroll-mt-32">
              <h2 className={`${montserrat.className} text-4xl md:text-5xl font-black uppercase mb-10 leading-tight tracking-tighter`}>
                The Protocol for<br />
                <span className="text-emerald-500">Verifiable Action</span>
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                  TaskKash addresses the critical disconnect in the digital economy: users lack accessible paths to earn crypto without capital risk, while brands struggle with bot-driven metrics.
                </p>
                <div className="h-px w-24 bg-emerald-500 my-8" />
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  By leveraging the high-speed Solana blockchain, TaskKash provides a scalable infrastructure layer where actions are verified and rewards are instant. Our mission is to foster global financial inclusion by turning everyday digital interactions into liquid on-chain assets.
                </p>
              </div>
            </section>

            {/* 02 PROBLEM & SOLUTION */}
            <section id="problem" className="scroll-mt-32">
              <h2 className={`${montserrat.className} text-4xl md:text-5xl font-black uppercase mb-12 tracking-tighter`}>
                Solving the <span className="text-emerald-500">Old Model</span>
              </h2>
              <div className="grid gap-8 md:grid-cols-2">
                <div className="space-y-6">
                  <h3 className={`${jetbrainsMono.className} text-xs font-bold uppercase tracking-[0.3em] text-slate-400 flex items-center gap-2`}>
                    <XCircle size={14} className="text-red-500" /> The Inefficiencies
                  </h3>
                  <ul className="space-y-4">
                    {problemPoints.map((point) => (
                      <li key={point} className="flex items-center gap-4 text-sm font-bold text-slate-600 dark:text-slate-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> {point}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-6">
                  <h3 className={`${jetbrainsMono.className} text-xs font-bold uppercase tracking-[0.3em] text-slate-400 flex items-center gap-2`}>
                    <CheckCircle2 size={14} className="text-emerald-500" /> The Solution
                  </h3>
                  <ul className="space-y-4">
                    {solutionPoints.map((point) => (
                      <li key={point} className="flex items-center gap-4 text-sm font-bold text-slate-600 dark:text-slate-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* 03 TECH STACK */}
            <section id="tech" className="scroll-mt-32">
              <h2 className={`${montserrat.className} text-4xl md:text-5xl font-black uppercase mb-12 tracking-tighter`}>
                Technical <span className="text-emerald-500">Infrastructure</span>
              </h2>
              <div className="grid gap-px bg-slate-100 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-3xl overflow-hidden">
                {technicalStack.map((item) => (
                  <div key={item.title} className="bg-white dark:bg-slate-950 p-8 flex flex-col md:flex-row md:items-center gap-6 group hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-emerald-500 shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className={`${montserrat.className} text-sm font-black uppercase mb-1`}>{item.title}</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ── 04 TOKENOMICS ── */}
            <section id="tokenomics" className="scroll-mt-32">
              <h2 className={`${montserrat.className} text-4xl md:text-5xl font-black uppercase mb-12 tracking-tighter`}>
                Economic <span className="text-emerald-500">Flow</span>
              </h2>
              <div className="rounded-3xl border-2 border-slate-100 dark:border-white/5 p-8 md:p-12">
                <p className="text-slate-500 dark:text-slate-400 mb-12 font-medium max-w-2xl text-lg">
                  Our circular economy ensures long-term viability through a verified action-to-reward loop, powered by Solana's high-speed infrastructure.
                </p>
                
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="space-y-4">
                    <div className="text-emerald-500 font-black text-xl flex items-center gap-2">
                      <BarChart3 size={20} /> 01. Brands
                    </div>
                    <p className="text-sm text-slate-500 font-medium">Brands deposit SOL to fund campaign escrows, ensuring guaranteed payouts for verified human engagement.</p>
                  </div>
                  <div className="space-y-4">
                    <div className="text-emerald-500 font-black text-xl flex items-center gap-2">
                      <Zap size={20} /> 02. Engine
                    </div>
                    <p className="text-sm text-slate-500 font-medium">The TaskKash verification layer validates proof-of-action on-chain before releasing Task Points (TP).</p>
                  </div>
                  <div className="space-y-4">
                    <div className="text-emerald-500 font-black text-xl flex items-center gap-2">
                      <Coins size={20} /> 03. Users
                    </div>
                    <p className="text-sm text-slate-500 font-medium">Users accumulate TP through participation, which is then convertible into liquid SOL directly to their wallets.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* 05 ROADMAP */}
            <section id="roadmap" className="scroll-mt-32">
              <h2 className={`${montserrat.className} text-4xl md:text-5xl font-black uppercase mb-12 tracking-tighter`}>
                Future <span className="text-emerald-500">Milestones</span>
              </h2>
              <div className="space-y-4">
                {roadmap.map((item) => (
                  <div key={item.phase} className="group flex flex-col md:flex-row md:items-center gap-6 p-8 rounded-3xl border-2 border-slate-100 dark:border-white/5 hover:border-emerald-500/50 transition-all">
                    <div className={`${jetbrainsMono.className} text-[10px] font-bold uppercase tracking-[0.2em] w-32 shrink-0 ${item.status === 'done' ? 'text-emerald-500' : 'text-slate-400'}`}>
                      {item.tag}
                    </div>
                    <div className="flex-1">
                      <h4 className={`${montserrat.className} text-lg font-black uppercase`}>{item.title}</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{item.description}</p>
                    </div>
                    <div className={`${jetbrainsMono.className} text-[10px] font-bold text-slate-300 dark:text-slate-700`}>
                      {item.phase.split('·')[0]}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ── 06 MILESTONES ── */}
            <section id="milestones" className="scroll-mt-32">
              <h2 className={`${montserrat.className} text-4xl md:text-5xl font-black uppercase mb-12 tracking-tighter`}>
                Growth <span className="text-emerald-500">Targets</span>
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                {milestones.map((item) => (
                  <div key={item.label} className="space-y-2">
                    <div className={`${montserrat.className} text-5xl font-black text-slate-900 dark:text-white`}>
                      {item.value}
                    </div>
                    <div className="text-xs font-black uppercase tracking-widest text-emerald-500">
                      {item.label}
                    </div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                      {item.sub}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ── 07 SECURITY ── */}
            <section id="security" className="scroll-mt-32 pb-12">
              <h2 className={`${montserrat.className} text-4xl md:text-5xl font-black uppercase mb-12 tracking-tighter`}>
                Security <span className="text-emerald-500">Protocol</span>
              </h2>
              <div className="bg-slate-50 dark:bg-slate-900/50 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row gap-10 items-start">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20">
                  <ShieldCheck size={32} />
                </div>
                <div className="space-y-6">
                  <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                    TaskKash employs on-chain verification and multi-layer encryption to ensure participant data and funds remain secure. Every submission passes through our proprietary proof-of-action layer.
                  </p>
                  <div className="flex flex-wrap gap-x-8 gap-y-4">
                    {["AES-256 Encryption", "On-Chain Verification", "Smart Contract Audits"].map((item) => (
                      <div key={item} className="flex items-center gap-2 text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">
                        <CheckCircle2 size={14} className="text-emerald-500" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

          </article>
        </div>
      </div>

      {/* ── FINAL CTA ── Cleaned up to match About Us style */}
      <section className="py-32 px-6 text-center border-t border-slate-100 dark:border-white/5">
        <div className="max-w-3xl mx-auto">
          <h2 className={`${montserrat.className} text-4xl md:text-6xl font-black mb-8 uppercase leading-[0.9] tracking-tighter`}>
            TaskKash is the<br />
            <span className="text-emerald-500">Infrastructure Layer</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium mb-12 text-lg leading-relaxed">
            It is the engagement foundation for the decentralized economy — where every digital action has verifiable, on-chain value.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup" className="w-full sm:w-fit">
              <button className="w-full bg-emerald-500 text-white px-12 py-5 rounded-full font-black uppercase tracking-widest text-xs transition-all hover:scale-105 active:scale-95">
                Join the Ecosystem
              </button>
            </Link>
            <Link href="/" className="w-full sm:w-fit">
              <button className="w-full border-2 border-slate-200 dark:border-white/10 hover:border-emerald-500 text-slate-900 dark:text-white px-12 py-5 rounded-full font-black uppercase tracking-widest text-xs transition-all hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-900">
                Explore Platform
              </button>
            </Link>
          </div>
        </div>
      </section>

      <TaskKashFooter />
    </main>
  );
}
