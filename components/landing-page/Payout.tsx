"use client";

import Image from "next/image";
// import { Montserrat } from "next/font/google";

// const montserrat = Montserrat({
//   subsets: ["latin"],
//   weight: ["700", "800", "900"],
// });

const LEFT_FEATURES = [
  {
    title: "Crypto Withdrawals",
    desc: "Instantly route your earnings straight to your preferred Web3 wallet via the fast Solana network infrastructure.",
  },
  {
    title: "Direct Bank Transfers",
    desc: "Not setup with crypto yet? Convert your balance safely into local fiat denominations directly to your checking account.",
  },
  {
    title: "Flexible Thresholds",
    desc: "Take full control over your liquidity with low withdrawal limits designed for casual micro-task workers.",
  },
];

const RIGHT_FEATURES = [
  {
    title: "Automated Processing",
    desc: "Smart contracts and ledger triggers process transactional distributions immediately upon task verifications.",
  },
  {
    title: "Zero Hidden Deductions",
    desc: "What you earn is exactly what lands in your balance registry. We ensure complete structural financial transparency.",
  },
  {
    title: "Historical Audits",
    desc: "Track every previous execution, distribution, conversion, and bank clearance real-time on your interface log.",
  },
];

function FeatureItem({
  title,
  desc,
  align,
  index,
  visible,
}: {
  title: string;
  desc: string;
  align: "left" | "right";
  index: number;
  visible: boolean;
}) {
  const isLeft = align === "left";

  return (
    <div
      className="flex items-start gap-4"
      style={{
        flexDirection: isLeft ? "row-reverse" : "row",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : `translateY(24px)`,
        transition: `opacity 0.6s ease ${index * 0.12}s, transform 0.6s ease ${index * 0.12}s`,
      }}
    >
      {/* Emerald Custom Dot */}
      <div className="shrink-0 mt-1 h-8 w-8 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 block" />
      </div>

      {/* Text Container */}
      <div className={isLeft ? "text-right" : "text-left"}>
        <h3
          className={`text-foreground font-extrabold text-base xl:text-lg mb-1.5 leading-tight uppercase`}
        >
          {title}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed max-w-[280px] font-semibold">
          {desc}
        </p>
      </div>
    </div>
  );
}

export default function PayoutsSection() {
  const visible = true;

  return (
    <section className="relative w-full overflow-hidden bg-background py-5 md:py-17">
      {/* Subtle grid texture layout */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Blur element backing your core phone markup asset */}
      {/* <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-[120px] z-0" /> */}

      {/* ── SECTION HEADER ── */}
      <div
        className="relative z-10 text-center mb-10 px-4"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
        }}
      >
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-widest mb-4">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          Guaranteed Settlement
        </div>
        <h2
          className={`text-4xl mb-6 md:text-5xl xl:text-4xl font-black uppercase tracking-tight text-foreground`}
        >
          100% Verified Payouts
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg font-semi leading-relaxed">
          Convert your Task Points (TP) effortlessly. Get rewarded your way with automated asset pipeline releases handled flexibly across crypto channels or straight to your bank account.
        </p>
      </div>

      {/* ── MOBILE LAYOUT (< lg) ── */}
      <div className="lg:hidden relative z-10 px-5 flex flex-col items-center gap-10">
        <div
          className="relative flex justify-center"
          style={{
            opacity: visible ? 1 : 0,
            transition: "opacity 0.7s ease 0.2s",
          }}
        >
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-100 h-16 blur-3xl rounded-full" />
          <Image
            src="/2-markup.png"
            alt="TaskKash Rewards Setup"
            width={450}
            height={900}
            className="relative z-10 object-contain w-[100vw] max-w-[300px]"
            priority
          />
        </div>

        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-8">
          {[...LEFT_FEATURES, ...RIGHT_FEATURES].map((f, i) => (
            <FeatureItem
              key={i}
              title={f.title}
              desc={f.desc}
              align="right"
              index={i}
              visible={visible}
            />
          ))}
        </div>
      </div>

      {/* ── DESKTOP LAYOUT (lg+) ── */}
      <div
        className="hidden lg:grid relative z-10 mx-auto max-w-[1440px] px-8 xl:px-12"
        style={{
          gridTemplateColumns: "1fr 400px 1fr",
          gap: "0 2rem",
          alignItems: "center",
        }}
      >
        {/* LEFT FEATURE MATRIX */}
        <div className="flex flex-col gap-5 xl:gap-25">
          {LEFT_FEATURES.map((f, i) => (
            <FeatureItem
              key={i}
              title={f.title}
              desc={f.desc}
              align="left"
              index={i}
              visible={visible}
            />
          ))}
        </div>

        {/* RECONFIGURED CENTER MOCKUP DISPLAY */}
        <div
          className="relative flex justify-center items-center py-4"
          style={{
            opacity: visible ? 1 : 0,
            transition: "opacity 0.8s ease 0.1s",
          }}
        >
          <Image
            src="/2-markup.png"
            alt="TaskKash Rewards Setup"
            width={400}
            height={800}
            className="relative z-10 object-contain w-[360px] xl:w-[400px]"
            priority
          />
        </div>

        {/* RIGHT FEATURE MATRIX */}
        <div className="flex flex-col gap-5 xl:gap-25">
          {RIGHT_FEATURES.map((f, i) => (
            <FeatureItem
              key={i}
              title={f.title}
              desc={f.desc}
              align="right"
              index={i}
              visible={visible}
            />
          ))}
        </div>
      </div>
    </section>
  );
}