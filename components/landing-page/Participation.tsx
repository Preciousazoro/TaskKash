"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Montserrat } from "next/font/google";
import { Zap, Check, ArrowUpRight, Terminal } from "lucide-react";

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

const typedCodeSnippet = `<div className="p-6 bg-card border rounded-2xl">
  <div className="flex items-center justify-between">
    <h3 className="text-sm font-bold text-muted-foreground">
      XP Balance
    </h3>
    <span className="text-emerald-500 font-black">+1,250 XP</span>
  </div>
  
  <p className="text-3xl font-black mt-2 text-foreground">
    $42.50 <span className="text-xs font-medium text-muted-foreground">in SOL</span>
  </p>

  <button className="w-full mt-4 bg-linear-to-r from-[#00ff9d] to-[#8a2be2] text-white py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest">
    Convert XP to Cash
  </button>
</div>`;

export default function Participation() {
  const [displayedCode, setDisplayedCode] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isWaiting, setIsWaiting] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll effect as text generates
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [displayedCode]);

  // Typing effect loop logic
  useEffect(() => {
    if (isWaiting) return;

    if (currentIndex < typedCodeSnippet.length) {
      const timeout = setTimeout(() => {
        setDisplayedCode((prev) => prev + typedCodeSnippet[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, Math.random() * 10 + 5); 

      return () => clearTimeout(timeout);
    } else {
      setIsWaiting(true);
      const waitTimeout = setTimeout(() => {
        setDisplayedCode("");
        setCurrentIndex(0);
        setIsWaiting(false);
      }, 5000); // 5 seconds wait time at completion

      return () => clearTimeout(waitTimeout);
    }
  }, [currentIndex, isWaiting]);

  return (
    <section
      id="users"
      className="mx-auto max-w-[1400px] px-4 lg:px-8 py-10 lg:pb-30 lg:pt-0  w-full"
    >
      <div className="grid w-full items-center gap-12 lg:grid-cols-2">
        {/* Left Side: Content */}
        <div className="relative z-10 w-full">

          <h2
            className={`${montserrat.className} text-3xl sm:text-3xl md:text-3xl lg:text-3xl font-black leading-[1.1] tracking-tight text-foreground mb-5 uppercase`}
          >
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

        {/* Right Side: Animated Code Terminal (Clean, Single Fixed Height Container) */}
        <div className="w-full relative">
          <div className="absolute -inset-4 rounded-[2rem]  via-transparent to-[#8a2be2]/5 blur-2xl pointer-events-none" />

          <div className="w-full rounded-[1.5rem] border border-border bg-[#0d0b14] h-[450px] flex flex-col font-mono text-[11px] sm:text-xs select-none overflow-hidden relative">
            
            {/* Terminal Window Header */}
            <div className="flex items-center justify-between bg-[#13111c] px-4 sm:px-6 py-3.5 border-b border-border/60 shrink-0">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
                <div className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
                <div className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">
                <Terminal className="w-3.5 h-3.5 text-purple-400" />
                DashboardComponent.tsx
              </div>
            </div>

            {/* Terminal Screen Body (Fixed Viewport height with Scroll Control) */}
            <div 
              ref={scrollContainerRef}
              className="p-4 sm:p-6 flex-grow overflow-y-auto scrollbar-none text-slate-300 leading-relaxed font-medium whitespace-pre-wrap break-all sm:break-normal bg-gradient-to-b from-transparent to-[#07050a]/20"
            >
              <span className="text-purple-400">import</span> React <span className="text-purple-400">from</span> <span className="text-emerald-400">"react"</span>;
              {"\n"}
              <span className="text-purple-400">import</span> {"{"} Card {"}"} <span className="text-purple-400">from</span> <span className="text-emerald-400">"@/components/ui/card"</span>;
              {"\n\n"}
              <span className="text-blue-400">export default function</span> <span className="text-amber-300">RewardWidget</span>() {"{"}
              {"\n"}
              <span className="text-purple-400">  return</span> (
              {"\n    "}
              
              {/* Dynamic code text stream string element */}
              <span className="text-slate-100">{displayedCode}</span>
              
              {/* Terminal Pulse Cursor bar element */}
              <span className="inline-block w-[6px] h-3.5 bg-[#00ff9d] ml-0.5 align-middle animate-[pulse_0.8s_infinite]" />
              
              {"\n  "});{"\n"}
              {"}"}
            </div>

            {/* Terminal Status Footer Panel */}
            <div className="px-4 sm:px-6 py-2 bg-[#13111c]/80 border-t border-border/40 flex items-center justify-between text-[10px] text-muted-foreground/60 shrink-0">
              <span>UTF-8</span>
              <span>TypeScript React</span>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}