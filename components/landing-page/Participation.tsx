"use client";

import Link from "next/link";
import { Montserrat } from "next/font/google";
import { Zap, Check, ArrowUpRight, Wallet, Layout } from "lucide-react";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
});

const userBenefits = [
  "Complete simple interactive tasks",
  "Earn TP through verified participation and convert it to SOL",
  "Discover new Web3 communities and emerging projects",
  "Turn your everyday online activity into real rewards",
];

export default function Participation() {
  return (
    <section
      id="users"
      className="mx-auto max-w-[1400px] px-4 lg:px-8 py-10 lg:py-20 w-full"
    >
      <div className="grid w-full items-center gap-16 lg:grid-cols-2">
        {/* Left Side: Content */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-[.2em] mb-6 text-emerald-600 dark:text-emerald-400">
            <Zap className="w-3 h-3" />
            For Contributors
          </div>

          <h2
            className={`${montserrat.className} text-3xl md:text-5xl lg:text-4xl font-black leading-[1.1] tracking-tight text-foreground mb-6 uppercase`}
          >
            Participation That Pays
          </h2>

          <p className="text-muted-foreground text-base md:text-lg max-w-xl mb-10 leading-relaxed font-semi">
            Simple actions, transparent rewards. No trading skills required.
            Turn your digital engagement into real-world cryptocurrency.
          </p>

          <ul className="space-y-4 mb-10">
            {userBenefits.map((benefit) => (
              <li
                key={benefit}
                className="flex cursor-pointer items-start gap-4 text-foreground/90 group"
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
              <button className="w-fit bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-4 rounded-xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-3 hover:scale-105 active:scale-95 shadow-lg shadow-emerald-500/10">
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

          <div className="relative rounded-[2.5rem] border border-border bg-secondary/30 p-4 backdrop-blur-sm sm:p-6 lg:rounded-[3rem]">
            <div className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-2xl">
              {/* Fake Header */}
              <div className="flex items-center justify-between bg-secondary/50 px-6 py-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-400" />
                  <div className="h-3 w-3 rounded-full bg-amber-400" />
                  <div className="h-3 w-3 rounded-full bg-emerald-400" />
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  <Layout className="w-3 h-3" />
                  User Dashboard
                </div>
              </div>

              {/* Dashboard Content */}
              <div className="p-6">
                <div className="grid gap-4 sm:grid-cols-3 mb-6">
                  <div className="rounded-2xl bg-secondary/40 p-4 border border-border/50">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                      Tasks
                    </p>
                    <p className="mt-1 text-2xl font-black text-foreground">
                      12
                    </p>
                  </div>
                  <div className="rounded-2xl bg-secondary/40 p-4 border border-border/50">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
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
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">
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
                      className="flex items-center justify-between rounded-2xl bg-secondary/30 px-5 py-4 border border-border/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-card flex items-center justify-center shadow-sm border border-border/50">
                          <Wallet className="w-4 h-4 text-muted-foreground/60" />
                        </div>
                        <div className="h-2 w-20 rounded-full bg-muted/40" />
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
  );
}