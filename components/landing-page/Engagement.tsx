"use client";

import Link from "next/link";
import { Montserrat } from "next/font/google";
import { Target, Check, ArrowUpRight, BarChart3 } from "lucide-react";

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

export default function Engagement() {
  return (
    <section
      id="brands"
      className="mx-auto max-w-[1400px] px-4 lg:px-8 py-10 lg:py-0 w-full"
    >
      <div className="grid w-full items-center gap-16 lg:grid-cols-2">
        {/* Right Side: Analytics Mockup (Order 2 on Mobile, 1 on Desktop) */}
        <div className="order-2 lg:order-1 relative">
          {/* Decorative Glow */}
          <div className="absolute -inset-4 rounded-[3rem] blur-3xl" />

          <div className="relative rounded-[2.5rem] border border-border bg-secondary/30 p-4 backdrop-blur-sm sm:p-6 lg:rounded-[3rem]">
            <div className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-2xl">
              {/* Mockup Header */}
              <div className="flex items-center justify-between bg-secondary/50 px-6 py-4 border-b border-border">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
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
                  <div className="flex items-end justify-between gap-2 rounded-2xl bg-secondary/40 p-4 border border-border/50">
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
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
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
                        color: "text-foreground",
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
                        className="rounded-2xl bg-secondary/40 p-4 border border-border/50"
                      >
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-[.2em] mb-6 text-emerald-600 dark:text-emerald-400">
            <Target className="w-3 h-3" />
            For Brands & Creators
          </div>

          <h2
            className={`${montserrat.className} text-3xl md:text-5xl lg:text-4xl font-black leading-[1.1] tracking-tight text-foreground mb-6 uppercase`}
          >
            {" "}
            Engagement That Converts
          </h2>

          <p className="text-muted-foreground text-base font-semi md:text-lg max-w-xl mb-10 leading-relaxed">
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
                <span className="text-base md:text-sm font-medium tracking-tight">
                  {benefit}
                </span>
              </li>
            ))}
          </ul>

          <div className="flex justify-center sm:justify-start">
            <Link href="/contact">
              <button className="w-fit bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-4 rounded-xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-3 hover:scale-105 active:scale-95 shadow-lg shadow-emerald-500/10">
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