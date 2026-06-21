"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
// import { Montserrat } from "next/font/google";

// const montserrat = Montserrat({
//   subsets: ["latin"],
//   weight: ["700", "800", "900"],
// });

const AVATARS = [
  "https://github.com/shadcn.png",
  "https://github.com/shadcn.png",
  "https://github.com/shadcn.png",
  "https://github.com/shadcn.png",
];

const BOTTOM_STATS = [
  {
    label: "Stat Overview",
    value: "Scale Rise",
    sub: "New Opportunities",
  },
  { label: "#1 Platform", value: "Top Rated", sub: "Web3 Engagement" },
  { label: "Active Campaigns", value: "250+", sub: "Verified Tasks" },
  { label: "Instant Payouts", value: "100%", sub: "SOL Conversions" },
];

const Counter = ({ target }: { target: number }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target]);
  return <>{count.toLocaleString()}</>;
};

export default function Hero() {
  const [isMounted, setIsMounted] = useState(false);
  const [userAvatars, setUserAvatars] = useState(AVATARS);

  useEffect(() => {
    setIsMounted(true);
    fetchRandomUsers();
  }, []);

 const fetchRandomUsers = async () => {
  try {
    const count = window.innerWidth >= 768 ? 7 : 4;

    const response = await fetch(`/api/users/random?count=${count}`);
    const data = await response.json();

    if (data.success && data.users) {
      const avatarUrls = data.users.map(
        (user: any) => user.avatarUrl || "https://github.com/shadcn.png"
      );

      setUserAvatars(avatarUrls);
    }
  } catch (error) {
    console.error("Failed to fetch random users:", error);
  }
};

  if (!isMounted) return <div className="min-h-screen bg-background" />;

  return (
    <section className="relative w-full bg-background flex flex-col min-h-screen">
      {/* MAIN CONTENT GRID - 6-4-2 layout matching the blueprint */}
      <div className="flex-1 relative z-10 mx-auto w-full max-w-[1440px] px-6 lg:px-12 flex flex-col lg:grid lg:grid-cols-12 gap-0 pt-20 lg:pt-25 items-center">
        
        {/* LEFT COLUMN: Spans 6 columns */}
        <div className="lg:col-span-6 space-y-8 lg:text-left z-20 py-10 lg:pt-0 lg:pb-20">
          {/* TAGLINE */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-widest mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Turn Actions Into Rewards
          </div>

          <div className="space-y-5">
            <h1
              className={` text-3xl md:text-5xl xl:text-5xl font-black leading-[1.1] uppercase`}
            >
              Turn Everyday Actions into{" "}
              <span className="text-emerald-500">On-Chain Rewards.</span>
            </h1>
            <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto lg:mx-0">
              Complete structured tasks, earn Task Points (TP), and convert them
              to SOL. Experience seamless, verified growth on the blockchain.
            </p>
          </div>

          {/* CTA BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full sm:w-auto px-8 py-6 cursor-pointer text-xs font-bold rounded-xl border-border bg-background/50 backdrop-blur-md hover:bg-muted transition-all"
            >
              <Link href="/landing-page/contact" className="flex items-center gap-2">
                LAUNCH CAMPAIGN
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto px-8 py-6 bg-emerald-500 hover:bg-emerald-600 text-white cursor-pointer text-xs font-extrabold rounded-xl hover:scale-105 transition-transform"
            >
              <Link href="/auth/signup" className="flex items-center gap-2">
                START EARNING NOW
              </Link>
            </Button>
          </div>

          <div className="flex items-center justify-start lg:justify-start gap-4 flex-wrap pt-2">
            <div className="flex flex-col">
              <span className="text-xl font-bold text-foreground leading-none mb-1">
                100%
              </span>
              <span className="text-[9px] uppercase tracking-widest font-semibold text-muted-foreground">
                Verified Proof
              </span>
            </div>
            <div className="h-7 w-px bg-border" />
            <div className="flex flex-col">
              <span className="text-xl font-bold text-foreground leading-none mb-1">
                Instant
              </span>
              <span className="text-[9px] uppercase tracking-widest font-semibold text-muted-foreground">
                Crypto Payouts
              </span>
            </div>
            <div className="h-7 w-px bg-border" />
            <div className="flex items-center gap-2.5">
              <div className="flex -space-x-2.5">
                {userAvatars.map((src, i) => (
                  <div
                    key={i}
                    className="h-12 w-12 cursor-pointer rounded-full border-2 border-emerald-500 bg-background overflow-hidden"
                  >
                    <img
                      src={src}
                      alt="Contributor"
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-foreground leading-none mb-1">
                  1.1K+
                </span>
                <span className="text-[9px] uppercase tracking-widest font-semibold text-muted-foreground">
                  Active Contributors
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* CENTER COLUMN: Spans 4 columns */}
        <div className="lg:col-span-4 flex justify-center items-end h-full relative min-h-[450px] lg:min-h-100">
          <div className="relative w-full max-w-[320px] lg:max-w-[350px] h-full flex items-end justify-center">
            <Image
              src="/1-makup.png"
              alt="TaskKash Interface"
              width={500}
              height={500}
              className="object-contain object-bottom"
              priority
            />
          </div>
        </div>

        {/* RIGHT COLUMN: Spans 2 columns */}
        <div className="lg:col-span-2 space-y-10 py-10 lg:py-0 lg:pl-0 z-20 lg:text-left">
          <div>
            <h2
              className={` text-4xl xl:text-4xl font-black`}
            >
              <Counter target={1100} /> +
            </h2>
            <p className="text-emerald-500 font-bold text-sm tracking-widest uppercase mt-2">
              Completed Tasks
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-extrabold uppercase leading-tight">
              On-Chain Infrastructure
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed mx-auto lg:mx-0">
              We bring trustless automation and speed to distributed workspace micro-campaigns globally.
            </p>
          </div>
        </div>
      </div>

      {/* BOTTOM STATS BAR */}
      <div className="relative z-30 border-t border-border bg-background w-full pb-5 lg:pb-15">
        <div className="mx-auto max-w-[1440px] px-0 lg:px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-border">
            {BOTTOM_STATS.map((item, i) => (
              <div key={i} className="flex flex-col p-6 space-y-1">
                <span className="text-sm lg:text-sm font-bold uppercase tracking-tighter text-foreground">
                  {item.value}
                </span>
                <span className="text-sm text-muted-foreground leading-none">
                  {item.sub}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}