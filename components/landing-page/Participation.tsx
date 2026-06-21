"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Check, ArrowUpRight, Zap, Coins, Wallet, Award, Sparkles } from "lucide-react";

const userBenefits = [
  "Complete simple interactive tasks",
  "Earn TP through verified participation and convert it to SOL",
  "Discover new Web3 communities and emerging projects",
  "Turn your everyday online activity into real rewards",
];

// Seed raw stream data tracking incoming user reward balances
const mockEarnings = [
  { id: 1, type: "TASK_COMPLETE", user: "alpha_miner", reward: "+350 TP", cashValue: "~$0.70 SOL", task: "Twitter Engagement", color: "text-emerald-500" },
  { id: 2, type: "CONVERSION", user: "sol_seeker", reward: "-2,500 TP", cashValue: "+0.25 SOL", task: "Withdrew to Wallet", color: "text-purple-400" },
  { id: 3, type: "BONUS", user: "cryptowave", reward: "+100 TP", cashValue: "~$0.20 SOL", task: "Daily Streak Milestones", color: "text-amber-400" },
  { id: 4, type: "TASK_COMPLETE", user: "0x_builder", reward: "+750 TP", cashValue: "~$1.50 SOL", task: "Spotify Campaign Follow", color: "text-emerald-500" },
  { id: 5, type: "STAKING_BONUS", user: "kash_king", reward: "+50 TP", cashValue: "~$0.10 SOL", task: "Profile Verified Payout", color: "text-pink-400" },
];

export default function Participation() {
  const [earningsStream, setEarningsStream] = useState(mockEarnings.slice(0, 3));
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll the feed to ensure it mirrors a live streaming chat log
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [earningsStream]);

  // Rolling real-time mock updater
  useEffect(() => {
    const interval = setInterval(() => {
      const randomBaseItem = mockEarnings[Math.floor(Math.random() * mockEarnings.length)];
      
      const updatedItem = {
        ...randomBaseItem,
        id: Date.now(),
        user: `user_${Math.floor(1000 + Math.random() * 9000)}`,
        reward: randomBaseItem.type === "TASK_COMPLETE" 
          ? `+${Math.floor(50 + Math.random() * 450)} TP` 
          : randomBaseItem.reward
      };

      setEarningsStream((prev) => {
        const cropped = prev.length > 5 ? prev.slice(1) : prev;
        return [...cropped, updatedItem];
      });
    }, 2800);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="users"
      className="mx-auto max-w-[1400px] px-4 lg:px-8 py-10 lg:pb-10 lg:pt-0 w-full"
    >
      <div className="grid w-full items-center gap-12 lg:grid-cols-2">
        
        {/* Left Side: Content */}
        <div className="relative z-10 w-full">
          <h2 className="text-3xl sm:text-3xl md:text-3xl lg:text-3xl font-black leading-[1.1] tracking-tight text-foreground mb-5 uppercase">
            Participation That Pays
          </h2>

          <p className="text-muted-foreground text-base md:text-lg max-w-xl mb-5 leading-relaxed font-semibold">
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
                <span className="text-sm sm:text-base font-medium tracking-tight">
                  {benefit}
                </span>
              </li>
            ))}
          </ul>

          <div className="flex justify-center sm:justify-start">
            <Link href="/auth/signup" className="w-full sm:w-fit">
              <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-4 rounded-xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-3 hover:scale-105 active:scale-95 shadow-lg shadow-emerald-500/10 cursor-pointer">
                Start Earning Now
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>

        {/* Right Side: Live Earnings Feed Component Box */}
        <div className="w-full relative">
          <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-tr from-purple-500/5 via-transparent to-emerald-500/5 blur-2xl pointer-events-none" />

          {/* Clean Flat Panel Window Frame UI */}
          <div className="w-full rounded-[1.5rem] border border-border bg-[#0d0b14] h-[450px] flex flex-col font-sans select-none overflow-hidden relative shadow-2xl">
            
            {/* Terminal Window Header */}
            <div className="flex items-center justify-between bg-[#13111c] px-5 py-4 border-b border-border/60 shrink-0">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
                <div className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
                <div className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
              </div>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-purple-400">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                </span>
                Live Reward Stream
              </div>
            </div>

            {/* Chat Box Scrolling System Content viewport */}
            <div 
              ref={scrollContainerRef}
              className="p-4 sm:p-6 flex-grow overflow-y-auto space-y-3 bg-gradient-to-b from-transparent to-[#07050a]/40 scrollbar-none"
            >
              <div className="text-zinc-500 font-mono text-[10px] text-center uppercase tracking-widest py-2 border-b border-border/20">
                -- Realtime Reward Tracker Online --
              </div>

              {earningsStream.map((item) => (
                <div 
                  key={item.id} 
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 rounded-xl border border-border/40 bg-card/60 backdrop-blur-sm transition-all duration-300 transform translate-y-0 animate-in fade-in slide-in-from-bottom-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                      {item.type === "TASK_COMPLETE" && <Zap className="w-4 h-4" />}
                      {item.type === "CONVERSION" && <Wallet className="w-4 h-4" />}
                      {item.type === "BONUS" && <Sparkles className="w-4 h-4" />}
                      {item.type === "STAKING_BONUS" && <Award className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-mono text-zinc-300 font-bold">{item.user}</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-zinc-800 text-zinc-400 font-mono uppercase tracking-wider">{item.type}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground font-light">{item.task}</p>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-baseline sm:items-end justify-between sm:justify-center border-t sm:border-t-0 border-border/20 pt-2 sm:pt-0">
                    <span className={`text-sm sm:text-base font-black ${item.color}`}>
                      {item.reward}
                    </span>
                    <span className="text-[9px] font-mono text-zinc-500">{item.cashValue}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Panel Footer */}
            <div className="px-5 py-2.5 bg-[#13111c]/80 border-t border-border/40 flex items-center justify-between text-[10px] font-mono text-muted-foreground/50 shrink-0">
              <span>Status: Payout Active</span>
              <span>Solana Mainnet Ledger</span>
            </div>

          </div>
        </div>
        
      </div>
    </section>
  );
}