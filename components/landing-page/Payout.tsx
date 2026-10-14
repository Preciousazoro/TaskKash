"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const LEFT_FEATURES = [
  {
    title: "Crypto Withdrawals",
    desc: "Instantly route your earnings straight to your preferred Web3 wallet via the fast Solana network infrastructure.",
    icon: (
      <path d="M12 2l9 5v10l-9 5-9-5V7l9-5zm0 6v8m-4-4h8" />
    ),
  },
  {
    title: "Direct Bank Transfers",
    desc: "Not setup with crypto yet? Convert your balance safely into local fiat denominations directly to your checking account.",
    icon: (
      <path d="M3 10l9-6 9 6M5 10v8m4-8v8m6-8v8m4-8v8M3 20h18" />
    ),
  },
  {
    title: "Flexible Thresholds",
    desc: "Take full control over your liquidity with low withdrawal limits designed for casual micro-task workers.",
    icon: (
      <path d="M4 6h16M4 12h10M4 18h6m8-6l3 3m0 0l-3 3m3-3h-6" />
    ),
  },
];

const RIGHT_FEATURES = [
  {
    title: "Automated Processing",
    desc: "Smart contracts and ledger triggers process transactional distributions immediately upon task verifications.",
    icon: <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />,
  },
  {
    title: "Zero Hidden Deductions",
    desc: "What you earn is exactly what lands in your balance registry. We ensure complete structural financial transparency.",
    icon: <path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7l8-4zm-3 9l2 2 4-4" />,
  },
  {
    title: "Historical Audits",
    desc: "Track every previous execution, distribution, conversion, and bank clearance real-time on your interface log.",
    icon: <path d="M9 5h10M9 12h10M9 19h10M4 5h.01M4 12h.01M4 19h.01" />,
  },
];

const STATS = [
  { value: "Instant", label: "Solana-powered payouts" },
  { value: "0%", label: "Hidden deductions" },
  { value: "24/7", label: "Real-time audit log" },
];

/* Reveal-on-scroll hook */
function useInView<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, visible };
}

function FeatureCard({
  title,
  desc,
  icon,
  align,
  index,
  visible,
}: {
  title: string;
  desc: string;
  icon: React.ReactNode;
  align: "left" | "right";
  index: number;
  visible: boolean;
}) {
  const isLeft = align === "left";

  return (
    <div
      className={`group relative flex items-start gap-4 rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-sm
        transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-[0_10px_40px_-12px_rgba(16,185,129,0.35)]
        ${isLeft ? "lg:flex-row-reverse lg:text-right" : "text-left"}`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.6s ease ${index * 0.12}s, transform 0.6s ease ${index * 0.12}s, border-color .3s, box-shadow .3s`,
      }}
    >

      <div className="min-w-0">
        <h3 className="mb-1.5 text-sm font-extrabold uppercase leading-tight tracking-wide text-foreground xl:text-base">
          {title}
        </h3>
        <p className="text-sm font-medium leading-relaxed text-muted-foreground">
          {desc}
        </p>
      </div>
    </div>
  );
}

export default function PayoutsSection() {
  const { ref, visible } = useInView<HTMLElement>();

  return (
    <section
      ref={ref}
      className="relative w-full overflow-hidden bg-background py-16 md:py-20"
    >
      {/* Grid texture with fade mask */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage:
            "radial-gradient(ellipse at center, black 40%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 40%, transparent 75%)",
        }}
      />

      {/* Ambient emerald glows */}
      {/* <div className="pointer-events-none absolute left-1/2 top-[55%] z-0 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/15 blur-[130px] md:h-[620px] md:w-[620px]" />
      <div className="pointer-events-none absolute -left-32 top-10 z-0 h-72 w-72 rounded-full bg-emerald-500/10 blur-[110px]" />
      <div className="pointer-events-none absolute -right-32 bottom-10 z-0 h-72 w-72 rounded-full bg-emerald-500/10 blur-[110px]" /> */}

      {/* ── HEADER ── */}
      <div
        className="relative z-10 mx-auto mb-12 max-w-3xl px-4 text-center md:mb-5"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
        }}
      >

        <h2 className="mb-2 text-4xl font-black uppercase tracking-tight text-foreground md:text-4xl xl:text-4xl">
          100%{" "}
          <span className="bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
            Verified
          </span>{" "}
          Payouts
        </h2>

        <p className="mx-auto max-w-2xl text-base font-medium leading-relaxed text-muted-foreground md:text-lg">
          Convert your Task Points (TP) effortlessly. Get rewarded your way with
          automated asset pipeline releases handled flexibly across crypto
          channels or straight to your bank account.
        </p>
      </div>

      {/* ── MOBILE / TABLET LAYOUT (< lg) ── */}
      <div className="relative z-10 flex flex-col items-center gap-10 px-5 lg:hidden">
        <div
          className="relative flex w-full justify-center"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "scale(1)" : "scale(0.92)",
            transition: "opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s",
          }}
        >
          <div className="absolute inset-0 m-auto h-3/4 w-3/4 rounded-full bg-emerald-500/20 blur-3xl" />
          <Image
            src="/dollar.gif"
            alt="TaskKash Rewards Setup"
            width={800}
            height={800}
            className="relative z-10 h-auto w-full max-w-[380px] object-contain sm:max-w-[480px]"
            priority
            unoptimized
          />
        </div>

        <div className="grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2">
          {[...LEFT_FEATURES, ...RIGHT_FEATURES].map((f, i) => (
            <FeatureCard
              key={f.title}
              {...f}
              align="right"
              index={i}
              visible={visible}
            />
          ))}
        </div>
      </div>

      {/* ── DESKTOP LAYOUT (lg+) ── */}
      <div className="relative z-10 mx-auto hidden max-w-[1500px] items-center gap-x-6 px-8 lg:grid lg:grid-cols-[1fr_460px_1fr] xl:grid-cols-[1fr_640px_1fr] xl:gap-x-10 xl:px-12">
        {/* LEFT */}
        <div className="flex flex-col gap-3 xl:gap-5">
          {LEFT_FEATURES.map((f, i) => (
            <FeatureCard
              key={f.title}
              {...f}
              align="left"
              index={i}
              visible={visible}
            />
          ))}
        </div>

        {/* CENTER — BIGGER DOLLAR GIF */}
        <div
          className="relative flex items-center justify-center"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "scale(1)" : "scale(0.92)",
            transition: "opacity 0.9s ease 0.1s, transform 0.9s ease 0.1s",
          }}
        > 

          <Image
            src="/dollar.gif"
            alt="TaskKash Rewards Setup"
            width={900}
            height={900}
            className="relative z-10 h-auto w-[460px] object-contain  xl:w-[640px]"
            priority
            unoptimized
          />
        </div>

        {/* RIGHT */}
        <div className="flex flex-col gap-3 xl:gap-5">
          {RIGHT_FEATURES.map((f, i) => (
            <FeatureCard
              key={f.title}
              {...f}
              align="right"
              index={i + 3}
              visible={visible}
            />
          ))}
        </div>
      </div>

      {/* ── TRUST STRIP ── */}
      <div
        className="hidden lg:block relative z-10 mx-auto mt-14 max-w-4xl px-5 md:mt-8"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.7s ease 0.6s, transform 0.7s ease 0.6s",
        }}
      >
        <div className="grid grid-cols-1 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card/60 backdrop-blur-sm sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {STATS.map((s) => (
            <div key={s.label} className="px-6 py-6 text-center">
              <div className="bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-2xl font-black text-transparent md:text-2xl">
                {s.value}
              </div>
              <div className="mt-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}