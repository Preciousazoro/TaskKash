"use client";

// import { Montserrat } from "next/font/google";
import { Wallet, Check, ArrowRight, ClipboardList } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const howItWorks = [
  {
    step: "01",
    title: "Connect Wallet",
    description: "Link your wallet in seconds and access available tasks.",
    icon: Wallet,
  },
  {
    step: "02",
    title: "Complete Tasks",
    description: "Finish micro-tasks and campaigns to earn Task Points (TP).",
    icon: Check,
  },
  {
    step: "03",
    title: "Convert TP to SOL",
    description: "Convert your points into SOL and withdraw directly.",
    icon: ArrowRight,
  },
  {
    step: "04",
    title: "Track Participation",
    description: "Monitor completed tasks and reward history in real time.",
    icon: ClipboardList,
  },
];

export default function HowWeWork() {
  return (
    <section
      id="how"
      className="mx-auto max-w-[1500px] px-4 lg:px-8 py-16 lg:py-10 lg:pt-0 w-full"
    >
      {/* Header */}
      <div className="mb-5">

        <h2 className={`text-3xl md:text-3xl font-black uppercase tracking-tighter mb-2`}>
          How WE Work
        </h2>

        <p className="text-muted-foreground font-semibold max-w-lg text-base md:text-lg mb-5">
          A simple, verified path from completing micro-tasks to withdrawing
          your rewards in SOL.
        </p>
      </div>

      {/* Desktop / Tablet Grid */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-5">
        {howItWorks.map((item, index) => (
          <StepCard key={index} item={item} />
        ))}
      </div>

      {/* Mobile Carousel */}
      <div className="md:hidden">
        <Carousel className="w-full">
          <CarouselContent>
            {howItWorks.map((item, i) => (
              <CarouselItem key={i}>
                <StepCard item={item} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="mt-5 flex items-center justify-center gap-6">
            <CarouselPrevious className="static translate-y-0 w-11 h-11 bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-500" />
            <CarouselNext className="static translate-y-0 w-11 h-11 bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-500" />
          </div>
        </Carousel>
      </div>

      {/* Footer rule */}
      <div className="mt-5 flex items-center gap-4">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
        <span className="text-[11px] uppercase tracking-widest text-muted-foreground font-medium whitespace-nowrap">
          Start your journey today
        </span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>
    </section>
  );
}

// ─── Step Card Sub-component ──────────────────────────────────────────────────

type HowItWorksItem = {
  step: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
};

function StepCard({ item }: { item: HowItWorksItem }) {
  const Icon = item.icon;
  return (
    <div className="group relative rounded-2xl border border-border bg-card p-6 transition-all duration-200 hover:-translate-y-1 hover:border-emerald-500/30 hover:shadow-[0_8px_32px_-8px_hsl(var(--primary)/0.15)] cursor-default overflow-hidden">
      {/* Top accent line — visible on hover */}
      <div className="absolute inset-x-0 top-0 h-[2px] rounded-t-2xl bg-gradient-to-r from-emerald-500 to-emerald-500/20 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

      {/* Step label + Icon Container */}
      <div className="flex items-start justify-between mb-2">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
          Step {item.step}
        </span>
        <div className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-emerald-500/20 bg-emerald-500/10 text-emerald-500 transition-colors duration-200 group-hover:bg-emerald-500 group-hover:text-white">
          <Icon className="w-[18px] h-[18px]" />
        </div>
      </div>

      {/* Text Content */}
      <h3 className="font-bold text-lg tracking-tight text-foreground">
        {item.title}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed font-semibold">
        {item.description}
      </p>
    </div>
  );
}