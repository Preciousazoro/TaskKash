"use client";

import React from "react";
import Link from "next/link";
import { Star, ArrowUpRight, Wallet } from "lucide-react";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
});

// Fallback profile image token
const DEFAULT_AVATAR = "https://github.com/shadcn.png";

const testimonialsColumn1 = [
  {
    name: "Nwaigwe Winz",
    role: "Power Contributor",
    rating: 5.0,
    image: DEFAULT_AVATAR,
    withdrawal: "0.85 SOL",
    text: "The task verification pipeline is extremely fast. I started processing minor app tests to see how the Task Points accumulated, and seeing them convert straight to my wallet map daily gave me the green light to hit the big campaigns.",
  },
  {
    name: "Fuhad Olaosebikan",
    role: "Daily Tasker",
    rating: 4.8,
    image: DEFAULT_AVATAR,
    withdrawal: "₦45,000.00",
    text: "TaskKash manages micro-campaign distribution smoothly in the background while I run my retail store. I chose direct local bank transfer, and the payout cleared seamlessly right into my checking account.",
  },
  {
    name: "Elvis TMZ",
    role: "Verified Member",
    rating: 4.9,
    image: DEFAULT_AVATAR,
    withdrawal: "2.10 SOL",
    text: "Transparent data tracking is exactly what makes this work. The app dashboard updates your earned TP immediately after content validation. Clean executions all the way through.",
  },
];

const testimonialsColumn2 = [
  {
    name: "Benjamin Evans",
    role: "Campaign Operator",
    rating: 4.9,
    image: DEFAULT_AVATAR,
    withdrawal: "4.30 SOL",
    text: "Finally a distributed workspace platform that respects worker parameters. The rewards system isn't full of empty promises—it's a verifiable ledger engine for performing micro-actions.",
  },
  {
    name: "Mr Presh",
    role: "Strategic Partner",
    rating: 5.0,
    image: DEFAULT_AVATAR,
    withdrawal: "₦78,200.00",
    text: "The assistance desk is stellar. Had a typo in my checking account numbers, and they updated the clearance form within minutes. Payouts arrive like clockwork.",
  },
  {
    name: "Sarah Jenkins",
    role: "Community Mod",
    rating: 5.0,
    image: DEFAULT_AVATAR,
    withdrawal: "1.65 SOL",
    text: "TaskKash completely flipped my workflow approach. No endless ads or data walls—just direct task requirements, clear TP parameters, and lightning payouts every week.",
  },
];

const testimonialsColumn3 = [
  {
    name: "Isabella Velez",
    role: "Growth Manager",
    rating: 5.0,
    image: DEFAULT_AVATAR,
    withdrawal: "3.90 SOL",
    text: "The execution layout here is highly organized. I regularly manage multiple micro-tasks in my spare blocks of time because the transaction verification settles faster than typical crowdsourcing options.",
  },
  {
    name: "Kofi Mensah",
    role: "Data Reviewer",
    rating: 4.9,
    image: DEFAULT_AVATAR,
    withdrawal: "₦32,500.00",
    text: "I was highly skeptical about automatic text reviews paying out into fiat accounts, but the platform audit log is solid. Consistent, reliable workspace rewards.",
  },
  {
    name: "Sophia Schmidt",
    role: "Digital Scholar",
    rating: 5.0,
    image: DEFAULT_AVATAR,
    withdrawal: "8.40 SOL",
    text: "The absolute best feature here is the flexibility of choice. Whether I want instant settlement to my Phantom wallet via SOL or direct bank clearance, TaskKash handles it.",
  },
  {
    name: "David Vance",
    role: "Beta Evaluator",
    rating: 4.8,
    image: DEFAULT_AVATAR,
    withdrawal: "0.55 SOL",
    text: "Testing mobile interface flows on TaskKash takes minutes. The points pile up transparently and withdrawing tokens over Web3 infrastructure is completely seamless.",
  },
  {
    name: "Chidi Obi",
    role: "Content Auditor",
    rating: 5.0,
    image: DEFAULT_AVATAR,
    withdrawal: "₦19,000.00",
    text: "The micro-task interface is highly polished. Running short video verifications yields direct local value smoothly.",
  },
];

const testimonialsColumn4 = [
  {
    name: "Zoe Katsaros",
    role: "Task Runner",
    rating: 5.0,
    image: DEFAULT_AVATAR,
    withdrawal: "1.15 SOL",
    text: "It is super satisfying watching my verified TP balance update after finishing a run of surveys. TaskKash has quickly become my absolute favorite source for flexible productivity online.",
  },
  {
    name: "Ahmed Hassan",
    role: "Quality Analyst",
    rating: 4.8,
    image: DEFAULT_AVATAR,
    withdrawal: "₦95,000.00",
    text: "The operational model functions correctly. They don't promise crazy overnight figures, just transparent reward allocations for legitimate micro-campaign actions.",
  },
  {
    name: "Tunde Williams",
    role: "Top Contributor",
    rating: 5.0,
    image: DEFAULT_AVATAR,
    withdrawal: "6.20 SOL",
    text: "I set up my profile, took on a handful of developer testing assignments, and scaled up quickly. The on-chain distribution mechanism works flawlessly.",
  },
  {
    name: "Elena Rostova",
    role: "UI Reviewer",
    rating: 4.9,
    image: DEFAULT_AVATAR,
    withdrawal: "1.40 SOL",
    text: "Clean structures, swift payments, and genuine tracking metrics. Securing micro-rewards via decentralized frameworks has never been this accessible.",
  },
  {
    name: "Marcus K.",
    role: "Survey Lead",
    rating: 4.7,
    image: DEFAULT_AVATAR,
    withdrawal: "₦26,800.00",
    text: "Perfect passive stream for my daily transit periods. Immediate bank settlement makes this my daily go-to solution.",
  },
];

export default function Testimonials() {
  return (
    <section className="flex-grow mx-auto max-w-[1400px] px-4 pt-20 lg:pt-16 w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">
        
        {/* LEFT - Text Content */}
        <div className="space-y-6 order-1 lg:order-1 text-center lg:text-left flex flex-col items-center lg:items-start">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold tracking-widest uppercase text-xs">
              Verified Feedback
            </span>
          </div>

          <h2 className={`${montserrat.className} text-4xl lg:text-6xl font-black uppercase tracking-tighter leading-[1.0]`}>
            Real People. <br />
            <span className="text-emerald-500">Real Rewards.</span>
          </h2>

          <p className="text-muted-foreground font-semibold text-lg max-w-md font-light leading-relaxed">
            See how our global network of contributors turns regular digital activities into verified on-chain points and direct cash assets.
          </p>

          <Link href="/auth/signup">
            <button className="bg-emerald-500 mt-5 cursor-pointer text-white px-10 py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:scale-105 transition-transform flex items-center gap-3 mx-auto shadow-xl shadow-emerald-500/20">
              Start Earning Now
              <ArrowUpRight className="w-5 h-5" />
            </button>
          </Link>
        </div>

        {/* RIGHT – Scrolling Columns (Desktop Only) */}
        <div className="hidden lg:grid grid-cols-2 gap-6 h-[800px] relative overflow-hidden order-2">
          
          {/* COLUMN 1 – SCROLLING UP */}
          <div className="flex flex-col gap-6 animate-marquee-up hover:[animation-play-state:paused]">
            {[...testimonialsColumn1, ...testimonialsColumn3, ...testimonialsColumn1, ...testimonialsColumn3].map((t, i) => (
              <TestimonialCard key={`up-${i}`} {...t} />
            ))}
          </div>

          {/* COLUMN 2 – SCROLLING DOWN */}
          <div className="flex flex-col gap-6 animate-marquee-down hover:[animation-play-state:paused]">
            {[...testimonialsColumn2, ...testimonialsColumn4, ...testimonialsColumn2, ...testimonialsColumn4].map((t, i) => (
              <TestimonialCard key={`down-${i}`} {...t} />
            ))}
          </div>

          {/* Fade Vignette Overlays */}
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background via-background/80 to-transparent pointer-events-none z-10" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none z-10" />
        </div>

        {/* MOBILE LAYOUT SPLIT - Shows all contributors dynamically */}
        <div className="lg:hidden grid grid-cols-1 gap-6 order-2">
          {[
            ...testimonialsColumn1, 
            ...testimonialsColumn2, 
            ...testimonialsColumn3, 
            ...testimonialsColumn4
          ].map((t, i) => (
            <TestimonialCard key={`mobile-${i}`} {...t} />
          ))}
        </div>
      </div>

      {/* Global CSS Injectors for Infinite Marquees */}
      <style jsx global>{`
        @keyframes marquee-up {
          from { transform: translateY(0); }
          to { transform: translateY(-50%); }
        }
        @keyframes marquee-down {
          from { transform: translateY(-50%); }
          to { transform: translateY(0); }
        }
        .animate-marquee-up {
          animation: marquee-up 55s linear infinite;
        }
        .animate-marquee-down {
          animation: marquee-down 55s linear infinite;
        }
      `}</style>
    </section>
  );
}

function TestimonialCard({
  name,
  role,
  rating,
  text,
  image,
  withdrawal
}: {
  name: string;
  role: string;
  rating: number;
  text: string;
  image: string;
  withdrawal: string;
}) {
  return (
    <div className="bg-card/40 backdrop-blur-xl border border-emerald-500/10 p-6 rounded-[2rem] space-y-4 shadow-xl hover:border-emerald-500/30 transition-all group">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-0.5 text-amber-500">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`w-3 h-3 ${i < Math.floor(rating) ? "fill-amber-500" : "fill-none"} stroke-amber-500`} />
          ))}
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] font-bold">
          <Wallet className="w-3 h-3" />
          {withdrawal}
        </div>
      </div>

      <p className="text-muted-foreground text-sm leading-relaxed font-light">
        &ldquo;{text}&rdquo;
      </p>

      <div className="flex items-center gap-3 pt-4 border-t border-border">
        <img src={image} alt={name} className="w-10 h-10 rounded-full object-cover border-2 border-emerald-500/20 shadow-sm" />
        <div>
          <h4 className={`font-black text-xs uppercase tracking-tight ${montserrat.className}`}>{name}</h4>
          <p className="text-[9px] uppercase tracking-widest text-emerald-500 font-extrabold">{role}</p>
        </div>
      </div>
    </div>
  );
}