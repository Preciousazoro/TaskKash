"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Check, ArrowUpRight, Activity, TrendingUp, Users, Target } from "lucide-react";

const brandBenefits = [
  "Launch structured engagement campaigns",
  "Reward verified participation",
  "Increase retention rates",
  "Access measurable participation data",
];

// Seed raw data representing updating tracking milestones
const mockActivities = [
  { id: 1, type: "CONVERSION", campaign: "Solana Quest", value: "+18.5%", label: "Conversion Rate", time: "Just now", color: "text-emerald-500" },
  { id: 2, type: "VIEWS", campaign: "DeFi Micro-Tasks", value: "25.3K", label: "Total Reach", time: "1s ago", color: "text-blue-400" },
  { id: 3, type: "PAYOUT", campaign: "MemeCoin Blitz", value: "14.2 SOL", label: "Distributed Rewards", time: "3s ago", color: "text-amber-400" },
  { id: 4, type: "USER_JOIN", campaign: "NFT Whitelist", value: "+1,240", label: "Verified Users", time: "5s ago", color: "text-purple-400" },
  { id: 5, type: "ENGAGEMENT", campaign: "Social Amplifier", value: "94.2%", label: "Completion Pace", time: "8s ago", color: "text-pink-400" },
];

export default function Engagement() {
  const [activities, setActivities] = useState(mockActivities.slice(0, 3));
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll layout wrapper precisely down as new logs inject
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [activities]);

  // Simulates rolling incoming stream updates like an active chat ticker
  useEffect(() => {
    const interval = setInterval(() => {
      const randomBaseItem = mockActivities[Math.floor(Math.random() * mockActivities.length)];
      
      // Infinite values mutation variance engine
      const updatedItem = {
        ...randomBaseItem,
        id: Date.now(),
        time: "Just now",
        value: randomBaseItem.type === "VIEWS" 
          ? `${(parseFloat(randomBaseItem.value) + Math.random()).toFixed(1)}K`
          : randomBaseItem.value
      };

      setActivities((prev) => {
        // Keeps list localized to 6 components max to protect DOM layout integrity
        const cropped = prev.length > 5 ? prev.slice(1) : prev;
        return [...cropped, updatedItem];
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="brands"
      className="mx-auto max-w-[1400px] px-4 lg:px-8 py-10 lg:pb-0 w-full"
    >
      <div className="grid w-full items-center gap-12 lg:grid-cols-2">
        
        {/* Live Analytics Window (Order 2 on Mobile, 1 on Desktop) */}
        <div className="order-2 lg:order-1 w-full relative">
          <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-tr from-emerald-500/5 via-transparent to-purple-500/5 blur-2xl pointer-events-none" />

          {/* Glassmorphic Live Traffic Window Box Frame */}
          <div className="w-full rounded-[1.5rem] border border-border bg-[#0d0b14] h-[450px] flex flex-col font-sans select-none overflow-hidden relative shadow-2xl">
            
            {/* Header Stream Bar */}
            <div className="flex items-center justify-between bg-[#13111c] px-5 py-4 border-b border-border/60 shrink-0">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
                <div className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
                <div className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
              </div>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-400">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Campaign Analytics Stream
              </div>
            </div>

            {/* Live Chat-style Upward Flowing Feed Box Container */}
            <div 
              ref={scrollContainerRef}
              className="p-4 sm:p-6 flex-grow overflow-y-auto space-y-3 bg-gradient-to-b from-transparent to-[#07050a]/40 scrollbar-none"
            >
              <div className="text-zinc-500 font-mono text-[10px] text-center uppercase tracking-widest py-2 border-b border-border/20">
                -- Initialization Metrics Hook Loaded --
              </div>

              {activities.map((act) => (
                <div 
                  key={act.id} 
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 rounded-xl border border-border/40 bg-card/60 backdrop-blur-sm transition-all duration-300 transform translate-y-0 animate-in fade-in slide-in-from-bottom-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                      {act.type === "CONVERSION" && <TrendingUp className="w-4 h-4" />}
                      {act.type === "VIEWS" && <Activity className="w-4 h-4" />}
                      {act.type === "PAYOUT" && <Target className="w-4 h-4" />}
                      {act.type === "USER_JOIN" && <Users className="w-4 h-4" />}
                      {act.type === "ENGAGEMENT" && <Activity className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-foreground">{act.campaign}</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-zinc-800 text-zinc-400 font-mono uppercase tracking-wider">{act.type}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground font-light">{act.label}</p>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-baseline sm:items-end justify-between sm:justify-center border-t sm:border-t-0 border-border/20 pt-2 sm:pt-0">
                    <span className={`text-sm sm:text-base font-black ${act.color}`}>
                      {act.value}
                    </span>
                    <span className="text-[9px] font-mono text-zinc-500">{act.time}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer Panel Meta Data Indicator */}
            <div className="px-5 py-2.5 bg-[#13111c]/80 border-t border-border/40 flex items-center justify-between text-[10px] font-mono text-muted-foreground/50 shrink-0">
              <span>Status: Listening...</span>
              <span>Websocket Secure (WSS)</span>
            </div>

          </div>
        </div>

        {/* Left Side Content Column (Order 1 on Mobile, 2 on Desktop) */}
        <div className="order-1 lg:order-2 relative z-10 w-full">
          <h2 className="text-3xl sm:text-3xl md:text-3xl lg:text-3xl font-black leading-[1.1] tracking-tight text-foreground mb-5 uppercase">
            Engagement That Converts
          </h2>

          <p className="text-muted-foreground text-base md:text-lg max-w-xl mb-5 leading-relaxed font-semibold">
            Verify user participation and drive measurable growth with
            structured campaigns. Reach a verified audience ready to engage
            with your vision.
          </p>

          <ul className="space-y-4 mb-10">
            {brandBenefits.map((benefit) => (
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
            <Link href="/contact" className="w-full sm:w-fit">
              <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-4 rounded-xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-3 hover:scale-105 active:scale-95 shadow-lg shadow-emerald-500/10 cursor-pointer">
                Launch Campaign
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}