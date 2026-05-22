"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Star, ArrowUpRight, Wallet } from "lucide-react";
import UserHeader from "@/components/user-dashboard/UserHeader";
import UserSidebar from "@/components/user-dashboard/UserSidebar";

const testimonialsColumn1 = [
  {
    name: "Nwaigwe Winz",
    role: "Premium Investor",
    rating: 5.0,
    image: "https://github.com/shadcn.png",
    withdrawal: "$124.00",
    text: "The daily top-ups are real. I started with a small investment to test the waters, and seeing my balance rise every morning gave me the confidence to go big. Best financial move this year.",
  },
  {
    name: "Fuhad Olaosebikan",
    role: "Daily Trader",
    rating: 4.8,
    image: "https://github.com/shadcn.png",
    withdrawal: "$85.50",
    text: "Task Kash handles the trading while I handle my day job. The $20 bonus was credited instantly and I withdrew it along with my first profit payout just like they promised.",
  },
  {
    name: "Elvis TMZ",
    role: "Verified Member",
    rating: 4.9,
    image: "https://github.com/shadcn.png",
    withdrawal: "$310.00",
    text: "Transparency is what I look for. The platform shows exactly how the trades are performing. I've successfully withdrawn over $3k now without a single delay.",
  },
  {
    name: "Marcus Chen",
    role: "Task Completer",
    rating: 4.7,
    image: "https://github.com/shadcn.png",
    withdrawal: "$95.00",
    text: "I've been completing tasks for 3 months now. The payouts are consistent and the support team is always helpful when I have questions.",
  },
  {
    name: "Aisha Johnson",
    role: "Active Member",
    rating: 5.0,
    image: "https://github.com/shadcn.png",
    withdrawal: "$150.00",
    text: "TaskKash has become my go-to platform for earning extra income. The variety of tasks keeps it interesting and the rewards are fair.",
  },
];

const testimonialsColumn2 = [
  {
    name: "Benjamin Evans",
    role: "Global Investor",
    rating: 4.9,
    image: "https://github.com/shadcn.png",
    withdrawal: "$520.00",
    text: "Finally a platform that actually uses MT4/MT5 logic for retail investors. The passive income is consistent. It's not a get-rich-quick scheme, it's a real yield engine.",
  },
  {
    name: "Mr Presh",
    role: "Strategic Partner",
    rating: 5.0,
    image: "https://github.com/shadcn.png",
    withdrawal: "$92.00",
    text: "The support team is elite. Had an issue with my wallet address, and they fixed it in under 60 seconds. My daily returns have been topping up like clockwork.",
  },
  {
    name: "Sarah Jenkins",
    role: "Community Leader",
    rating: 5.0,
    image: "https://github.com/shadcn.png",
    withdrawal: "$245.00",
    text: "Task Kash changed my perspective on automated trading. No stress, no charts to watch all day\u2014just pure growth and easy withdrawals every week.",
  },
  {
    name: "David Kim",
    role: "Freelancer",
    rating: 4.8,
    image: "https://github.com/shadcn.png",
    withdrawal: "$180.00",
    text: "As a freelancer, I appreciate the flexibility of TaskKash. I can work on tasks whenever I have free time and the payments are reliable.",
  },
  {
    name: "Emily Rodriguez",
    role: "Student",
    rating: 4.9,
    image: "https://github.com/shadcn.png",
    withdrawal: "$75.00",
    text: "Perfect for students like me who need extra cash for textbooks and expenses. The tasks are simple and don't require much time.",
  },
  {
    name: "James Wilson",
    role: "Part-time Earner",
    rating: 4.7,
    image: "https://github.com/shadcn.png",
    withdrawal: "$210.00",
    text: "I use TaskKash as a side hustle. It's not my main income, but it definitely helps with bills and savings.",
  },
];

const testimonialsColumn3 = [
  {
    name: "Isabella Velez",
    role: "Portfolio Manager",
    rating: 5.0,
    image: "https://github.com/shadcn.png",
    withdrawal: "$432.00",
    text: "The risk-to-reward ratio here is perfectly balanced. I've moved a significant portion of my liquid assets into Task Kash because the execution is cleaner than most brokers.",
  },
  {
    name: "Kofi Mensah",
    role: "Crypto Arbitrageur",
    rating: 4.9,
    image: "https://github.com/shadcn.png",
    withdrawal: "$189.00",
    text: "I was skeptical about the daily top-ups, but the transparency in the dashboard is impressive. It's consistent, reliable, and the $20 bonus was a nice welcome touch.",
  },
  {
    name: "Sophia Schmidt",
    role: "Retirement Planner",
    rating: 5.0,
    image: "https://github.com/shadcn.png",
    withdrawal: "$1,550.00",
    text: "The best part isn't just the profit, it's the time I save. I don't have to study charts for 8 hours a day. The platform's algorithm does the heavy lifting.",
  },
  {
    name: "Jordan Lee",
    role: "Tech Entrepreneur",
    rating: 4.7,
    image: "https://github.com/shadcn.png",
    withdrawal: "$65.00",
    text: "Seamless UI and even better performance. For anyone looking for a 'set and forget' investment strategy, Task Kash is the gold standard.",
  },
  {
    name: "Amara Okoro",
    role: "Verified Trader",
    rating: 4.8,
    image: "https://github.com/shadcn.png",
    withdrawal: "$210.00",
    text: "Withdrawals are lightning fast. I requested a payout at 10 AM and had it in my wallet by lunchtime. That's how you build trust in this industry.",
  },
  {
    name: "Lucas Dupont",
    role: "Executive Investor",
    rating: 5.0,
    image: "https://github.com/shadcn.png",
    withdrawal: "$980.00",
    text: "The institutional-grade liquidity makes a huge difference. You can tell they are using high-end MT4/MT5 bridges. A very professional setup.",
  },
  {
    name: "Rachel Green",
    role: "Marketing Specialist",
    rating: 4.9,
    image: "https://github.com/shadcn.png",
    withdrawal: "$135.00",
    text: "I've tried many task platforms, but TaskKash stands out for its user-friendly interface and prompt payments. Highly recommended!",
  },
  {
    name: "Michael Brown",
    role: "Remote Worker",
    rating: 4.8,
    image: "https://github.com/shadcn.png",
    withdrawal: "$290.00",
    text: "Working remotely has its challenges, but TaskKash provides a steady stream of tasks that I can complete from anywhere in the world.",
  },
];

const testimonialsColumn4 = [
  {
    name: "Zoe Katsaros",
    role: "Daily Yield Seeker",
    rating: 5.0,
    image: "https://github.com/shadcn.png",
    withdrawal: "$145.00",
    text: "I love waking up and seeing my income topped up. It's the first thing I check every morning. Task Kash has become my favorite passive stream.",
  },
  {
    name: "Ahmed Hassan",
    role: "Financial Analyst",
    rating: 4.8,
    image: "https://github.com/shadcn.png",
    withdrawal: "$320.00",
    text: "The math checks out. They aren't promising 'magic' numbers, just solid market gains through disciplined trading. Very sustainable model.",
  },
  {
    name: "Chloe Miller",
    role: "Passive Income Pro",
    rating: 4.9,
    image: "https://github.com/shadcn.png",
    withdrawal: "$570.00",
    text: "Verified payouts and a solid community. The Telegram group is active and the support team actually knows what they are talking about.",
  },
  {
    name: "Tunde Williams",
    role: "Growth Strategist",
    rating: 5.0,
    image: "https://github.com/shadcn.png",
    withdrawal: "$890.00",
    text: "Started with the $20 bonus and a small deposit. Within 3 months, I've scaled my account to levels I didn't think were possible this quickly.",
  },
  {
    name: "Yuki Tanaka",
    role: "Global Partner",
    rating: 4.7,
    image: "https://github.com/shadcn.png",
    withdrawal: "$115.00",
    text: "Efficient, secure, and user-friendly. In Japan, we value precision, and Task Kash's trading platform is as precise as it gets.",
  },
  {
    name: "Ravi Sharma",
    role: "Long-term Holder",
    rating: 5.0,
    image: "https://github.com/shadcn.png",
    withdrawal: "$1,120.00",
    text: "Security is my #1 priority. Seeing the 'Secure' in the name actually reflect in their payout system is refreshing. My capital feels very safe here.",
  },
  {
    name: "Olivia Martinez",
    role: "Content Creator",
    rating: 4.8,
    image: "https://github.com/shadcn.png",
    withdrawal: "$165.00",
    text: "TaskKash fits perfectly with my content creation schedule. I can complete tasks between videos and earn consistently.",
  },
  {
    name: "Daniel Thompson",
    role: "Stay-at-home Parent",
    rating: 4.9,
    image: "https://github.com/shadcn.png",
    withdrawal: "$125.00",
    text: "As a stay-at-home dad, TaskKash gives me the flexibility to earn while taking care of my kids. The tasks are simple and pay well.",
  },
  {
    name: "Sophie Anderson",
    role: "College Student",
    rating: 4.7,
    image: "https://github.com/shadcn.png",
    withdrawal: "$88.00",
    text: "Perfect for college students! I earn enough to cover my coffee and lunch expenses every week. Highly recommend!",
  },
  {
    name: "Robert Taylor",
    role: "Retiree",
    rating: 5.0,
    image: "https://github.com/shadcn.png",
    withdrawal: "$195.00",
    text: "Even in retirement, I enjoy staying active and earning extra income. TaskKash is easy to use and the community is friendly.",
  },
];

export default function Testimonials() {
  return (
    <>
      <div className="flex h-screen overflow-hidden bg-background">
        <UserSidebar />

        <div className="flex-1 flex flex-col overflow-hidden text-foreground">
          <UserHeader />

          <main className="flex-1 overflow-y-auto pb-20 lg:pb-0 md:px-7">
            <section className="flex-grow mx-auto max-w-7xl px-4 py-10 lg:py-0 w-full">

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-0 items-center">
        
        {/* LEFT - Text Content */}
        <div className="space-y-5 order-1 lg:order-1 text-center lg:text-left flex flex-col items-center lg:items-start">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-primary font-mono font-bold tracking-widest uppercase text-xs">
              Verified Payouts 20/94
            </span>
          </div>

         <h1 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter leading-[0.9]">
  Real Tasks. <br />
  <span className="text-primary">Real Earnings.</span>
</h1>

<p className="text-muted-foreground text-lg max-w-md">
  Join thousands of users on Task Kash, complete available tasks, earn rewards, and withdraw your earnings with ease.
</p>

          <Link href="/user-dashboard/leaderboard">
            <button className="bg-green-500 text-white font-bold mt-5 cursor-pointer text-primary-foreground px-10 py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:scale-105 transition-transform flex items-center gap-3 mx-auto shadow-xl shadow-green/20">
              View Leaderboard
              <ArrowUpRight className="w-5 h-5" />
            </button>
          </Link>
        </div>

        {/* RIGHT \u2013 Scrolling Columns */}
        <div className="hidden lg:grid grid-cols-2 gap-6 h-[700px] relative overflow-hidden order-2">
          
          {/* COLUMN 1 \u2013 SCROLLING UP */}
          <div className="flex flex-col gap-6 animate-marquee-up hover:[animation-play-state:paused]">
            {[...testimonialsColumn1, ...testimonialsColumn1, ...testimonialsColumn3,...testimonialsColumn4].map((t, i) => (
              <TestimonialCard key={`up-${i}`} {...t} />
            ))}
          </div>

          {/* COLUMN 2 \u2013 SCROLLING DOWN */}
          <div className="flex flex-col gap-6 animate-marquee-down hover:[animation-play-state:paused]">
            {[...testimonialsColumn2, ...testimonialsColumn2, ...testimonialsColumn3,...testimonialsColumn4].map((t, i) => (
              <TestimonialCard key={`down-${i}`} {...t} />
            ))}
          </div>

          {/* Fade Edges */}
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-background via-background/80 to-transparent pointer-events-none z-10" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none z-10" />
        </div>

        {/* MOBILE */}
        <div className="lg:hidden grid grid-cols-1 gap-6 order-2">
          {[...testimonialsColumn1, ...testimonialsColumn2, ...testimonialsColumn3,...testimonialsColumn4].map((t, i) => (
            <TestimonialCard key={`mobile-${i}`} {...t} />
          ))}
        </div>
      </div>

      {/* Tailwind Animation Injections */}
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
          animation: marquee-up 50s linear infinite;
        }
        .animate-marquee-down {
          animation: marquee-down 50s linear infinite;
        }
      `}</style>
            </section>
          </main>
        </div>
      </div>
    </>
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
    <div className="bg-card/40 backdrop-blur-xl  cursor-pointer border border-primary/10 p-6 rounded-[2rem] space-y-4 shadow-xl hover:border-primary/30 transition-all group">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-1 text-primary">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`w-3 h-3 ${i < Math.floor(rating) ? "fill-primary" : "fill-none"} stroke-primary`} />
          ))}
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-mono text-[10px] font-bold">
          <Wallet className="w-3 h-3" />
          {withdrawal}
        </div>
      </div>

      <p className="text-muted-foreground text-sm leading-relaxed font-medium">
        \u201c{text}\u201d
      </p>

      <div className="flex items-center gap-3 pt-4 border-t border-primary/5">
        <img src={image} alt={name} className="w-11 h-11 rounded-full object-cover border-2 border-green-500 shadow-lg" />
        <div>
          <h4 className="font-black text-sm uppercase tracking-tight">{name}</h4>
          <p className="text-[10px] uppercase tracking-widest text-primary font-bold">{role}</p>
        </div>
      </div>
    </div>
  );
}