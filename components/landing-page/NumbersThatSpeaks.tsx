"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
// import { Montserrat } from "next/font/google";
import { Users, Wallet, BarChart3, ArrowRight, Headphones } from "lucide-react";

// const montserrat = Montserrat({
//   subsets: ["latin"],
//   weight: ["700", "800", "900"],
// });

const DEFAULT_AVATARS = [
  "https://github.com/shadcn.png",
  "https://github.com/shadcn.png",
  "https://github.com/shadcn.png",
  "https://github.com/shadcn.png",
  "https://github.com/shadcn.png",
];

export default function NumbersThatSpeaks() {
  const [userAvatars, setUserAvatars] = useState(DEFAULT_AVATARS);

  useEffect(() => {
    fetchRandomUsers();
  }, []);

  const fetchRandomUsers = async () => {
    try {
      const response = await fetch("/api/users/random?count=5");
      const data = await response.json();
      if (data.success && data.users) {
        const avatarUrls = data.users.map((user: any) => 
          user.avatarUrl || "https://github.com/shadcn.png"
        );
        setUserAvatars(avatarUrls);
      }
    } catch (error) {
      console.error("Failed to fetch random users:", error);
    }
  };
  return (
    <section className="mx-auto max-w-[1400px] px-4 lg:px-8 pb-10 pt-20 lg:pt-30 w-full">
      {/* Header */}
      <div className="text-center mb-10">
        <h2
          className={`text-3xl md:text-5xl lg:text-4xl font-black leading-[1.1] tracking-tight text-foreground mb-6 uppercase`}
        >
          {" "}
          Numbers that speaks
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">
          Join a global community of users who trust TaskKash for reliable
          rewards, verified tasks, and industry-leading support.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Users Onboarded */}
        <div className="md:col-span-4 rounded-3xl border bg-secondary/30 border-border p-8 flex flex-col justify-between min-h-[280px] transition-all hover:-translate-y-1 hover:border-emerald-500/30 dark:hover:border-emerald-400/30">
          <div>
            <p className="text-[10px] tracking-[.2em] uppercase text-muted-foreground mb-2 font-mono">
              Users Onboarded
            </p>
            <h3 className="text-6xl font-black tracking-tighter text-foreground">
              120
              <span className="text-emerald-600 dark:text-emerald-400">
                K+
              </span>
            </h3>
            <p className="mt-2 text-xs text-muted-foreground font-mono">
              +28.4%{" "}
              <span className="text-emerald-600 dark:text-emerald-400">
                ↑
              </span>{" "}
              this quarter
            </p>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] tracking-widest uppercase text-muted-foreground/60 font-mono">
              All time
            </span>
            <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* Tasks Completed */}
        <div className="md:col-span-4 rounded-3xl border bg-secondary/30 border-border p-8 flex flex-col justify-between min-h-[280px] transition-all hover:-translate-y-1 hover:border-emerald-500/30 dark:hover:border-emerald-400/30">
          <div>
            <p className="text-[10px] tracking-[.2em] uppercase text-muted-foreground mb-2 font-mono">
              Tasks Completed
            </p>
            <h3 className="text-6xl font-black tracking-tighter text-foreground">
              2.5
              <span className="text-emerald-600 dark:text-emerald-400">
                M+
              </span>
            </h3>
          </div>
          <div>
            <p className="text-[10px] tracking-[.2em] uppercase text-muted-foreground mb-3 font-mono">
              Recent activity
            </p>
            <div className="flex items-center">
              {userAvatars.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt="User"
                  className="w-12 h-12 rounded-full border-2 border-background -ml-3 first:ml-0 object-cover bg-secondary"
                />
              ))}
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-[10px] font-bold bg-emerald-500/10 dark:bg-emerald-400/10 border-2 border-background text-emerald-600 dark:text-emerald-400 -ml-3 font-mono z-10">
                +1k
              </div>
            </div>
          </div>
        </div>

        {/* SOL Distributed */}
        <div className="md:col-span-4 rounded-3xl border bg-secondary/30 border-border p-8 flex flex-col justify-between min-h-[280px] relative overflow-hidden transition-all hover:-translate-y-1 hover:border-emerald-500/30 dark:hover:border-emerald-400/30">
          <div className="relative z-10">
            <p className="text-[10px] tracking-[.2em] uppercase text-muted-foreground mb-2 font-mono">
              SOL Distributed
            </p>
            <h3 className="text-6xl font-black tracking-tighter text-foreground">
              15
              <span className="text-emerald-600 dark:text-emerald-400">
                K+
              </span>
            </h3>
            <p className="mt-2 text-xs text-muted-foreground">
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
        <div className="md:col-span-7 rounded-3xl border bg-secondary/30 border-border p-8 flex md:flex-row items-start md:items-center justify-between gap-6 transition-all hover:-translate-y-1 hover:border-emerald-500/30 dark:hover:border-emerald-400/30">
          <div>
            <p className="text-[10px] tracking-[.2em] uppercase text-muted-foreground mb-2 font-mono">
              Active Campaigns
            </p>
            <h3 className="text-5xl font-black tracking-tighter text-foreground">
              350
              <span className="text-emerald-600 dark:text-emerald-400">
                +
              </span>
            </h3>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex gap-2 mb-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-400/10 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center">
                <ArrowRight className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-[10px] tracking-widest uppercase text-muted-foreground font-mono">
              Brands • Creators
            </p>
          </div>
        </div>

        {/* 24/7 Support */}
        <div className="md:col-span-5 rounded-3xl border bg-secondary/30 border-border p-8 flex flex-col justify-between transition-all hover:-translate-y-1 hover:border-emerald-500/30 dark:hover:border-emerald-400/30">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] tracking-widest uppercase font-mono text-emerald-600 dark:text-emerald-400">
                  Online now
                </span>
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tight text-foreground">
                24/7 Expert Support
              </h3>
            </div>
            <Headphones className="w-8 h-8 text-emerald-500/20" />
          </div>
          <div className="mt-4 rounded-xl px-4 py-2 text-[10px] tracking-widest uppercase font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-400/10 border border-emerald-500/20 dark:border-emerald-400/20">
            Avg response &lt; 60 seconds
          </div>
        </div>
      </div>

      {/* Ticker */}
      <div className="mt-12 py-4 border-y border-border overflow-hidden">
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
              className="text-[10px] tracking-[.3em] uppercase text-muted-foreground font-mono flex items-center gap-4"
            >
              {item}{" "}
              <span className="w-1 h-1 rounded-full bg-emerald-500/20" />
            </span>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-10 flex justify-center">
        <Link
          href="/auth/signup"
          className="w-fit bg-emerald-500 text-white px-10 py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-emerald-600 transition-all flex items-center gap-3 shadow-xl shadow-emerald-500/20 hover:scale-105"
        >
          Get Started Now
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </section>
  );
}