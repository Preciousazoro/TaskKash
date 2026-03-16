// app/about/page.tsx
"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck, XCircle } from "lucide-react";
import TaskKashHeader from "@/components/ui/TaskKashHeader";
import TaskKashFooter from "@/components/ui/TaskKashFooter";

const technicalStack = [
  {
    title: "Frontend Framework",
    description:
      "Next.js 16 with React 19 for server-side rendering, optimized performance, and modern React features with TypeScript support.",
  },
  {
    title: "Database & Storage",
    description:
      "MongoDB with Mongoose ODM for flexible data modeling, Cloudinary for media storage and optimization, and efficient data management.",
  },
  {
    title: "Authentication & Security",
    description:
      "NextAuth.js 5 with secure session management, bcryptjs for password hashing, and JWT tokens for API authentication.",
  },
  {
    title: "UI & Styling",
    description:
      "Tailwind CSS 4 with shadcn/ui components, Radix UI primitives, Lucide React icons, and Framer Motion for smooth animations.",
  },
  {
    title: "Backend & APIs",
    description:
      "Node.js API routes with Next.js, SWR for data fetching, nodemailer for email services, and RESTful architecture.",
  },
  {
    title: "Development Tools",
    description:
      "TypeScript for type safety, ESLint for code quality, and modern development workflow with hot reload optimization.",
  },
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
  {
    phase: "Phase 1: Foundation",
    title: "Platform Genesis",
    description:
      "Core platform launch, Solana wallet integration, task engine development, and initial user beta onboarding.",
  },
  {
    phase: "Phase 2: Growth",
    title: "Analytical Scale",
    description:
      "Advanced brand dashboard, real-time campaign analytics, wallet expansion, and scaling to 500k+ users.",
  },
  {
    phase: "Phase 3: Ecosystem",
    title: "Developer API Launch",
    description:
      "Opening our infrastructure for third-party dApp integrations, multi-project partnerships, and reaching 1M+ users.",
  },
  {
    phase: "Phase 4: Global",
    title: "Cross-Chain Expansion",
    description:
      "Native mobile applications, AI-driven task matching, and expansion to EVM-compatible chains.",
  },
];

const milestones = [
  { value: "500k", label: "Users Target" },
  { value: "1M+", label: "Tasks / Month" },
  { value: "50+", label: "Brand Partners" },
  { value: "100%", label: "On-Chain Proof" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <TaskKashHeader />
      <main className="pt-20">
        <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(74,222,128,0.12),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(147,51,234,0.12),transparent_30%)]" />
        <div className="mx-auto w-[80%] max-w-6xl px-4 py-20 sm:px-6 sm:py-24 lg:py-28">
          <div className="mx-auto max-w-4xl text-center">
            <span className="mb-4 inline-flex rounded-full border border-green-400/20 bg-green-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-green-400">
              Technical Documentation
            </span>

            <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Building the Infrastructure for{" "}
              <span className="bg-gradient-to-r from-green-400 to-purple-500 bg-clip-text text-transparent">
                Decentralized Engagement
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">
              Explore the vision, architecture, and growth strategy behind
              TaskKash: the gateway to micro-earnings on Solana.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-green-400 to-purple-600 px-6 py-3 font-bold text-white shadow-lg transition hover:opacity-90"
              >
                Request Whitepaper PDF
              </Link>

              <a
                href="#roadmap"
                className="inline-flex items-center justify-center rounded-xl border border-border px-6 py-3 font-bold text-foreground transition hover:bg-muted"
              >
                View Roadmap
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto w-[80%] max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="rounded-3xl border border-border bg-card p-8 shadow-sm sm:p-10 lg:p-12">
            <span className="mb-3 block text-sm font-bold uppercase tracking-[0.18em] text-green-400">
              Executive Summary
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              The Protocol for Verifiable Human Action
            </h2>
            <p className="mt-5 text-base leading-8 text-muted-foreground sm:text-lg">
              TaskKash addresses the critical disconnect in the digital economy:
              users lack accessible, structured paths to earn crypto without
              capital risk, while brands struggle with bot-driven, low-quality
              engagement metrics. By leveraging the high-speed Solana
              blockchain, TaskKash provides a scalable infrastructure layer
              where actions are verified, rewards are instant, and engagement is
              measurable.
            </p>
            <p className="text-base leading-8 text-muted-foreground sm:text-lg">
              Our mission is to foster global financial inclusion by turning
              everyday digital interactions into liquid on-chain assets.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto grid w-[80%] max-w-6xl gap-6 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-2">
          <div className="rounded-3xl border border-red-500/20 bg-red-500/5 p-8">
            <span className="mb-3 block text-sm font-bold uppercase tracking-[0.18em] text-red-400">
              The Problem
            </span>
            <h3 className="text-2xl font-extrabold">Inefficient Engagement</h3>

            <div className="mt-6 space-y-4">
              {problemPoints.map((point) => (
                <div key={point} className="flex items-start gap-3">
                  <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
                  <p className="mb-0 text-muted-foreground">{point}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-green-400/20 bg-green-400/5 p-8">
            <span className="mb-3 block text-sm font-bold uppercase tracking-[0.18em] text-green-400">
              The Solution
            </span>
            <h3 className="text-2xl font-extrabold">The TaskKash Protocol</h3>

            <div className="mt-6 space-y-4">
              {solutionPoints.map((point) => (
                <div key={point} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-400" />
                  <p className="mb-0 text-muted-foreground">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto w-[80%] max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <span className="mb-3 block text-sm font-bold uppercase tracking-[0.18em] text-green-400">
            Technical Stack
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Secure &amp; Scalable Architecture
          </h2>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {technicalStack.map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-border bg-card p-6 shadow-sm transition hover:-translate-y-1 hover:border-green-400/30 sm:p-8"
              >
                <h4 className="text-lg font-extrabold sm:text-xl">{item.title}</h4>
                <p className="mt-4 text-sm leading-6 text-muted-foreground sm:text-base">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto w-[80%] max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="rounded-[2rem] border border-green-400/10 bg-slate-950 p-8 text-white shadow-xl sm:p-12 dark:bg-slate-950">
            <span className="mb-3 block text-sm font-bold uppercase tracking-[0.18em] text-green-400">
              Tokenomics &amp; Flow
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Sustainable Incentive Structure
            </h2>
            <p className="mt-4 max-w-2xl text-white/70">
              Our circular economy ensures long-term viability for all
              stakeholders.
            </p>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
                <h4 className="text-xl font-extrabold">Brands</h4>
                <p className="mt-2 text-sm text-white/70">Pay Campaign Fees</p>
              </div>

              <div className="rounded-2xl bg-gradient-to-r from-green-400 to-purple-600 p-6 text-center text-white shadow-lg">
                <h4 className="text-xl font-extrabold">TaskKash Engine</h4>
                <p className="mt-2 text-sm text-white/90">
                  Verification &amp; Escrow
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
                <h4 className="text-xl font-extrabold">Users</h4>
                <p className="mt-2 text-sm text-white/70">
                  Earn TP → Convert SOL
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="roadmap" className="border-b border-border">
        <div className="mx-auto w-[80%] max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <span className="mb-3 block text-sm font-bold uppercase tracking-[0.18em] text-green-400">
            Future Vision
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Development Roadmap
          </h2>

          <div className="relative mt-12 space-y-8 border-l border-green-400/20 pl-6 sm:pl-10">
            {roadmap.map((item) => (
              <div key={item.phase} className="relative">
                <div className="absolute -left-[33px] top-2 h-4 w-4 rounded-full border-4 border-background bg-green-400 shadow-[0_0_0_4px_rgba(74,222,128,0.15)]" />
                <div className="rounded-3xl border border-border bg-card p-7 shadow-sm">
                  <span className="inline-flex rounded-full bg-green-400/10 px-3 py-1 text-xs font-bold text-green-400">
                    {item.phase}
                  </span>
                  <h4 className="mt-4 text-2xl font-extrabold">{item.title}</h4>
                  <p className="mt-3 text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto w-[80%] max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <span className="mb-3 block text-sm font-bold uppercase tracking-[0.18em] text-green-400">
            Metrics that Matter
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Measurable Growth Milestones
          </h2>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {milestones.map((item) => (
              <div
                key={item.label}
                className="rounded-3xl border border-border bg-card p-8 text-center shadow-sm"
              >
                <span className="block text-3xl font-extrabold text-green-400 sm:text-4xl">
                  {item.value}
                </span>
                <p className="mt-3 mb-0 text-muted-foreground">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto w-[80%] max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="flex flex-col gap-5 rounded-[2rem] bg-gradient-to-r from-slate-950 to-slate-900 p-8 text-white shadow-xl sm:flex-row sm:items-center sm:p-10">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10">
              <ShieldCheck className="h-8 w-8 text-green-400" />
            </div>
            <div>
              <h3 className="text-2xl font-extrabold">
                Institutional-Grade Security
              </h3>
              <p className="mt-3 mb-0 max-w-3xl text-white/70">
                TaskKash employs on-chain verification, multi-layer encryption,
                and continuous smart contract audits to ensure participant data
                and funds remain secure.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(74,222,128,0.08),transparent_55%)]" />
        <div className="mx-auto w-[80%] max-w-5xl px-4 py-16 text-center sm:px-6 sm:py-24">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
            TaskKash is not just a task platform.
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-muted-foreground sm:text-2xl">
            It is the engagement infrastructure layer for the decentralized
            economy.
          </p>

          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/auth/signup"
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-green-400 to-purple-600 px-6 py-3 font-bold text-white shadow-lg transition hover:opacity-90"
            >
              Join the Ecosystem
            </Link>

            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-xl border border-border px-6 py-3 font-bold text-foreground transition hover:bg-muted"
            >
              Explore the Platform
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <TaskKashFooter />
      </main>
    </div>
  );
}