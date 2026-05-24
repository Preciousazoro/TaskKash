"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Montserrat } from "next/font/google";
import { Target, Check, ArrowUpRight, Terminal } from "lucide-react";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
});

const brandBenefits = [
  "Launch structured engagement campaigns",
  "Reward verified participation",
  "Increase retention rates",
  "Access measurable participation data",
];

const typedCodeSnippet = `<div className="p-6 bg-card border rounded-2xl">
  <div className="flex items-center justify-between">
    <h3 className="text-sm font-bold text-muted-foreground">
      Campaign Analytics
    </h3>
    <span className="text-purple-500 font-black">Live Traffic</span>
  </div>
  
  <div className="grid grid-cols-2 gap-4 mt-4">
    <div>
      <p className="text-[10px] uppercase text-muted-foreground">Total Views</p>
      <p className="text-xl font-black text-foreground">25.3K</p>
    </div>
    <div>
      <p className="text-[10px] uppercase text-muted-foreground">Conversion</p>
      <p className="text-xl font-black text-emerald-500">18.5%</p>
    </div>
  </div>
</div>`;

export default function Engagement() {
  const [displayedCode, setDisplayedCode] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isWaiting, setIsWaiting] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Smooth auto-scroll helper loop
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [displayedCode]);

  // Terminal simulated keypress loop 
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
      }, 5000); // Wait for exactly 5 seconds

      return () => clearTimeout(waitTimeout);
    }
  }, [currentIndex, isWaiting]);

  return (
    <section
      id="brands"
      className="mx-auto max-w-[1400px] px-4 lg:px-8 py-10 lg:py-0 w-full"
    >
      <div className="grid w-full items-center gap-12 lg:grid-cols-2">
        
        {/* Terminal Section (Order 2 on Mobile, 1 on Desktop) */}
        <div className="order-2 lg:order-1 w-full relative">
          <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-tr from-[#00ff9d]/5 via-transparent to-[#8a2be2]/5 blur-2xl pointer-events-none" />

          {/* Clean Border Flat Terminal Window Frame Wrapper */}
          <div className="w-full rounded-[1.5rem] border border-border bg-[#0d0b14] h-[450px] flex flex-col font-mono text-[11px] sm:text-xs select-none overflow-hidden relative">
            
            {/* Header Window Bar */}
            <div className="flex items-center justify-between bg-[#13111c] px-4 sm:px-6 py-3.5 border-b border-border/60 shrink-0">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
                <div className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
                <div className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                CampaignAnalytics.tsx
              </div>
            </div>

            {/* Viewport Editor Screen Body Pane with Fixed Height Scroller */}
            <div 
              ref={scrollContainerRef}
              className="p-4 sm:p-6 flex-grow overflow-y-auto scrollbar-none text-slate-300 leading-relaxed font-medium whitespace-pre-wrap break-all sm:break-normal bg-gradient-to-b from-transparent to-[#07050a]/20"
            >
              <span className="text-purple-400">import</span> React <span className="text-purple-400">from</span> <span className="text-emerald-400">"react"</span>;
              {"\n"}
              <span className="text-purple-400">import</span> {"{"} Analytics {"}"} <span className="text-purple-400">from</span> <span className="text-emerald-400">"@/components/analytics"</span>;
              {"\n\n"}
              <span className="text-blue-400">export default function</span> <span className="text-amber-300">BrandDashboard</span>() {"{"}
              {"\n"}
              <span className="text-purple-400">  return</span> (
              {"\n    "}
              
              {/* String Generation Stream block output */}
              <span className="text-slate-100">{displayedCode}</span>
              
              {/* Pulse Blinker Indicator */}
              <span className="inline-block w-[6px] h-3.5 bg-[#00ff9d] ml-0.5 align-middle animate-[pulse_0.8s_infinite]" />
              
              {"\n  "});{"\n"}
              {"}"}
            </div>

            {/* Footer Panel Context Meta Info */}
            <div className="px-4 sm:px-6 py-2 bg-[#13111c]/80 border-t border-border/40 flex items-center justify-between text-[10px] text-muted-foreground/60 shrink-0">
              <span>UTF-8</span>
              <span>TypeScript React</span>
            </div>

          </div>
        </div>

        {/* Left Side Content Column (Order 1 on Mobile, 2 on Desktop) */}
        <div className="order-1 lg:order-2 relative z-10 w-full">
          {/* <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-[.2em] mb-6 text-emerald-600 dark:text-emerald-400">
            <Target className="w-3 h-3" />
            For Brands & Creators
          </div> */}

          <h2
            className={`${montserrat.className} text-3xl sm:text-3xl md:text-3xl lg:text-3xl font-black leading-[1.1] tracking-tight text-foreground mb-5 uppercase`}
          >
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