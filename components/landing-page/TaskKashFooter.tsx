"use client";

import Link from "next/link";
import {
  Youtube,
  Twitter,
  Send,
  ShieldCheck,
  Zap,
  Coins,
  ArrowRight,
  ArrowUpRight,
  Info,
  Lock,
} from "lucide-react";
import ScrollToTop from "@/components/landing-page/ScrollToTop";
import { FaDiscord } from "react-icons/fa6";

const SOCIAL_LINKS = [
  { name: "Telegram", icon: <Send size={18} />, href: "https://t.me/taskkash" },
  { name: "Discord", icon: <FaDiscord size={18} />, href: "https://discord.gg/taskkash" },
  { name: "X (Twitter)", icon: <Twitter size={18} />, href: "https://twitter.com/taskkash" },
  { name: "YouTube", icon: <Youtube size={18} />, href: "#" },
];

const FOOTER_COLUMNS = [
  {
    title: "Ecosystem",
    links: [
      { label: "TaskKash Users", href: "/#users" },
      { label: "TaskKash Brands", href: "/#brands" },
      { label: "About TaskKash", href: "/landing-page/about" },
      { label: "Our Whitepaper", href: "/landing-page/whitepaper" },
      { label: "How TaskKash Works", href: "/#how" },
    ],
  },
  {
    title: "Wallet Support",
    links: [
      { label: "Trust Wallet", href: "#" },
      { label: "Bank Transfer", href: "#" },
      { label: "Phantom Wallet", href: "#" },
      { label: "Solflare Wallet", href: "#" },
    ],
  },
  {
    title: "User Area",
    links: [
      { label: "Login Account", href: "/auth/login" },
      { label: "Signup Account", href: "/auth/signup" },
      { label: "TaskKash Support", href: "/landing-page/contact" },
      { label: "TaskKash Testimonials", href: "/landing-page/testimonials" },
    ],
  },
];

const TRUST_BADGES = [
  {
    icon: ShieldCheck,
    title: "Verified Gigs",
    desc: "Every task is audited for authentic brand engagement.",
  },
  {
    icon: Zap,
    title: "Solana Powered",
    desc: "Lightning fast conversions from TP to SOL on-chain.",
  },
  {
    icon: Coins,
    title: "Instant Accruals",
    desc: "Earn Task Points instantly upon proof verification.",
  },
];

export default function TaskKashFooter() {
  return (
    <footer className="relative w-full overflow-hidden border-t border-border bg-background text-foreground mt-10">
      {/* Top accent line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/60 to-transparent" />

      {/* Background texture + glows */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(ellipse at top, black 20%, transparent 70%)",
          WebkitMaskImage: "radial-gradient(ellipse at top, black 20%, transparent 70%)",
        }}
      />
      <div className="pointer-events-none absolute -left-40 top-0 z-0 h-80 w-80 rounded-full bg-emerald-500/10 blur-[130px]" />
      <div className="pointer-events-none absolute -right-40 bottom-20 z-0 h-80 w-80 rounded-full bg-emerald-500/10 blur-[130px]" />

      <div className="relative z-10 mx-auto w-full max-w-[1500px] px-4 pb-8 pt-14 md:px-8 md:pt-10 xl:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3 lg:grid-cols-12 lg:gap-8">
          {/* Brand */}
          <div className="flex flex-col space-y-6 md:col-span-3 lg:col-span-5">
            <Link href="/" className="inline-flex w-fit items-center gap-2.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/taskkash-logo.png"
                alt="TaskKash Logo"
                className="h-11 w-11 object-contain"
              />
              <span className="bg-gradient-to-r from-[#00C853] via-[#00A86B] to-[#6A0DAD] bg-clip-text text-2xl font-black tracking-tight text-transparent">
                TASKKASH
              </span>
            </Link>

            <p className="max-w-lg text-sm font-medium leading-relaxed text-muted-foreground md:text-base">
              The premier Web3 task-to-earn ecosystem on Solana. We bridge the
              gap between global brands and engaged users, rewarding digital
              participation with Task Points (TP) convertible directly to SOL.
            </p>

            <div>
              <h3 className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
                Join the Community
              </h3>
              <div className="flex flex-wrap gap-3">
                {SOCIAL_LINKS.map((social) => (
                  <Link
                    key={social.name}
                    href={social.href}
                    title={social.name}
                    aria-label={social.name}
                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-card/60 text-muted-foreground shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500 hover:bg-emerald-500 hover:text-white hover:shadow-[0_10px_25px_-8px_rgba(16,185,129,0.6)]"
                  >
                    {social.icon}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Link columns */}
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title} className="flex flex-col space-y-5 lg:col-span-2 lg:first:ml-0">
              <h3 className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.18em] text-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                {col.title}
              </h3>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-all duration-200 hover:translate-x-1 hover:text-emerald-600 dark:hover:text-emerald-400"
                    >
                      {link.label}
                      <ArrowUpRight className="h-3 w-3 -translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ───────── TRUST BADGES ───────── */}
        <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-3">
          {TRUST_BADGES.map((b) => {
            const Icon = b.icon;
            return (
              <div
                key={b.title}
                className="group flex items-center gap-4 rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-[0_10px_40px_-12px_rgba(16,185,129,0.35)]"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-emerald-500/25 bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 text-emerald-500 transition-transform duration-300 group-hover:scale-110">
                  <Icon size={22} />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold uppercase tracking-wide">
                    {b.title}
                  </h4>
                  <p className="mt-0.5 text-xs font-medium leading-relaxed text-muted-foreground">
                    {b.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ───────── DISCLAIMER + GOVERNANCE ───────── */}
        <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-muted/30 p-5">
            <div className="mb-2 flex items-center gap-2">
              <Info className="h-4 w-4 text-emerald-500" />
              <p className="text-[11px] font-extrabold uppercase tracking-widest text-foreground">
                Risk Disclosure
              </p>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Participating in Web3 activities involves significant risk. The
              value of Solana (SOL) can be highly volatile. Before using
              TaskKash, ensure you understand the mechanics of digital wallets.
              TaskKash is a platform for engagement. Task Points (TP) are
              internal rewards and have no value until converted.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-muted/30 p-5">
            <div className="mb-2 flex items-center gap-2">
              <Lock className="h-4 w-4 text-emerald-500" />
              <p className="text-[11px] font-extrabold uppercase tracking-widest text-foreground">
                Platform Governance
              </p>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Utilizing automated verification and human-in-the-loop auditing to
              prevent bot activity. All user data is handled with end-to-end
              encryption.
            </p>
          </div>
        </div>

        {/* ───────── BOTTOM BAR ───────── */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 text-sm text-muted-foreground md:flex-row">
          <div className="flex flex-col items-center gap-2 md:flex-row md:gap-6">
            <p className="text-xs md:text-sm">
              © {new Date().getFullYear()} TASKKASH — Empowering the Gig Economy.
            </p>
            <div className="flex gap-4 text-xs">
              <Link
                href="#"
                className="transition-colors hover:text-emerald-600 dark:hover:text-emerald-400"
              >
                Privacy Policy
              </Link>
              <span className="h-4 w-px bg-border" />
              <Link
                href="#"
                className="transition-colors hover:text-emerald-600 dark:hover:text-emerald-400"
              >
                Terms of Service
              </Link>
            </div>
          </div>
          <p className="max-w-md text-center text-[11px] italic leading-relaxed opacity-60 md:text-right">
            TaskKash is not a financial advisor. Use of this platform
            constitutes acceptance of our digital asset policy.
          </p>
        </div>
      </div>

      <ScrollToTop />
    </footer>
  );
}