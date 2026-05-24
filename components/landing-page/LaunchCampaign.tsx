"use client";

import Link from "next/link";
import { Montserrat } from "next/font/google";
import { Rocket, ArrowRight } from "lucide-react";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
});

export default function LaunchCampaign() {
  return (
    <section className="mx-auto max-w-[1400px] px-4 lg:px-8 py-10 pb-30 w-full">
      <div className="relative overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-neutral-50 to-white dark:from-neutral-950 dark:to-neutral-900 px-6 py-10 md:px-10 md:py-10 border border-border">
        
        {/* Background Logo */}
        <img
          src="/app-view.png"
          alt=""
          className="absolute bottom-0 right-0 w-[350px] h-auto object-contain opacity-100 dark:opacity-70 pointer-events-none translate-x-10 translate-y-10 lg:translate-x-5 lg:translate-y-5 dark:brightness-200"
        />

        {/* Decorative Subtle Radial Blur */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-neutral-400/10 dark:bg-neutral-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary border border-border text-[10px] font-bold uppercase tracking-[.2em] mb-6 text-emerald-600 dark:text-emerald-400">
            <Rocket className="w-3 h-3" />
            Grow with TaskKash
          </div>

          <h2
            className={`${montserrat.className} text-3xl md:text-5xl lg:text-4xl font-black leading-[1.1] tracking-tight text-foreground mb-6 uppercase`}
          >
            Earn or Launch a Campaign?
          </h2>
          <p className="text-muted-foreground mx-auto text-base md:text-lg font-semi mb-10 leading-relaxed">
            Join thousands of users earning rewards or brands driving real
            growth. Get started today and experience the future of Web3
            engagement.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
  <Link href="/auth/signup">
    <button
      className="
        w-full lg:w-auto flex items-center justify-center gap-3
        bg-black text-white
        dark:bg-white dark:text-black
        hover:scale-105 active:scale-95
        px-8 py-4 rounded-xl
        font-black uppercase tracking-widest text-xs
        transition-all shadow-lg cursor-pointer
      "
    >
      Get Started Now
    </button>
  </Link>

  <Link href="/landing-page/about">
    <button
      className="
        w-full sm:w-fit flex items-center justify-center gap-3
        border
        border-black/10
        bg-white text-black
        hover:bg-black/5
        dark:bg-transparent
        dark:text-white
        dark:border-white/15
        dark:hover:bg-white/10
        px-5 py-4 rounded-xl
        font-black uppercase tracking-widest text-xs
        transition-all backdrop-blur-md
      "
    >
      Learn More
    </button>
  </Link>
</div>
        </div>
      </div>
    </section>
  );
}