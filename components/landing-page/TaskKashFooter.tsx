"use client";

import Link from "next/link";
import {
  Youtube,
  Twitter,
  Send,
  ShieldCheck,
  Zap,
  Coins,
} from "lucide-react";
import ScrollToTop from "@/components/landing-page/ScrollToTop";
import { FaDiscord } from "react-icons/fa6";

export default function TaskKashFooter() {
  const socialLinks = [
    {
      name: "Telegram",
      icon: <Send size={24} />,
      href: "https://t.me/taskkash",
    },
    { name: "Discord", icon: <FaDiscord size={24} />, href: "https://discord.gg/taskkash" },
    {
      name: "X (Twitter)",
      icon: <Twitter size={24} />,
      href: "https://twitter.com/taskkash",
    },
    { name: "YouTube", icon: <Youtube size={24} />, href: "#" },
  ];

  return (
    <footer className="bg-background border-t border-border text-foreground pb-12 pt-16 px-4 md:px-16 relative">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-12 md:gap-8 lg:gap-24">
        {/* Brand & Description */}
        <div className="flex flex-col space-y-6 md:col-span-4 lg:col-span-2">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <img
                src="/taskkash-logo.png"
                alt="TaskKash Logo"
                className="h-10 w-10 object-contain"
              />
              <span className="text-2xl md:text-3xl lg:text-3xl font-black tracking-tight bg-gradient-to-r from-[#00C853] via-[#00A86B] to-[#6A0DAD] bg-clip-text text-transparent">
                TASKKASH
              </span>
            </Link>
            <p className="mt-5 leading-relaxed text-muted-foreground max-w-sm">
              The premier Web3 task-to-earn ecosystem on Solana. We bridge the
              gap between global brands and engaged users, rewarding digital
              participation with Task Points (TP) convertible directly to SOL.
            </p>
          </div>

          {/* Social Media links */}
          <div>
            <h3 className="text-emerald-600 dark:text-emerald-500 font-bold uppercase tracking-wider text-sm mb-4">
              Join the Community
            </h3>
            <div className="flex flex-wrap gap-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  className="p-3 bg-secondary/50 rounded-xl hover:bg-emerald-600 hover:text-white transition-all duration-300 shadow-sm border border-border"
                  title={social.name}
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Ecosystem Section */}
        <div className="flex flex-col space-y-4">
          <h3 className="text-lg font-bold uppercase tracking-tight dark:bg-gradient-to-b dark:from-white dark:to-slate-500 dark:bg-clip-text dark:text-transparent">
            Ecosystem
          </h3>
          <ul className="space-y-2 text-muted-foreground font-medium">
            <li><Link href="/#users" className="hover:text-emerald-600 dark:hover:text-emerald-500 transition-colors">TaskKash Users</Link></li>
            <li><Link href="/#brands" className="hover:text-emerald-600 dark:hover:text-emerald-500 transition-colors">TaskKash Brands</Link></li>
            <li><Link href="/landing-page/about" className="hover:text-emerald-600 dark:hover:text-emerald-500 transition-colors">About TaskKash</Link></li>
            <li><Link href="/landing-page/whitepaper" className="hover:text-emerald-600 dark:hover:text-emerald-500 transition-colors">Our Whitepaper</Link></li>
            <li><Link href="/#how" className="hover:text-emerald-600 dark:hover:text-emerald-500 transition-colors">How TaskKash Works</Link></li>
          </ul>
        </div>

        {/* Wallet Support Section */}
        <div className="flex flex-col space-y-4">
          <h3 className="text-lg font-bold uppercase tracking-tight dark:bg-gradient-to-b dark:from-white dark:to-slate-500 dark:bg-clip-text dark:text-transparent">
            Wallet Support
          </h3>
          <ul className="space-y-2 text-muted-foreground font-medium">
            <li><Link href="#" className="hover:text-emerald-600 dark:hover:text-emerald-500 transition-colors">Trust Wallet</Link></li>
            <li><Link href="#" className="hover:text-emerald-600 dark:hover:text-emerald-500 transition-colors">Bank Transfer</Link></li>
            <li><Link href="#" className="hover:text-emerald-600 dark:hover:text-emerald-500 transition-colors">Phantom Wallet</Link></li>
            <li><Link href="#" className="hover:text-emerald-600 dark:hover:text-emerald-500 transition-colors">Solflare Wallet</Link></li>
          </ul>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col space-y-4">
          <h3 className="text-lg font-bold uppercase tracking-tight dark:bg-gradient-to-b dark:from-white dark:to-slate-500 dark:bg-clip-text dark:text-transparent">
            User Area
          </h3>
          <ul className="space-y-2 text-muted-foreground font-medium">
            <li><Link href="/auth/login" className="hover:text-emerald-600 dark:hover:text-emerald-500 transition-colors">Login Account</Link></li>
            <li><Link href="/auth/signup" className="hover:text-emerald-600 dark:hover:text-emerald-500 transition-colors">Signup Account</Link></li>
            <li><Link href="/landing-page/contact" className="hover:text-emerald-600 dark:hover:text-emerald-500 transition-colors">TaskKash Support</Link></li>
            <li><Link href="/landing-page/testimonials" className="hover:text-emerald-600 dark:hover:text-emerald-500 transition-colors">TaskKash Testimonials</Link></li>
          </ul>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="max-w-[1400px] mx-auto mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-border pt-12">
        <div className="flex items-center gap-4">
          <ShieldCheck className="text-emerald-600 dark:text-emerald-500" size={32} />
          <div>
            <h4 className="font-bold text-sm uppercase">Verified Gigs</h4>
            <p className="text-xs text-muted-foreground">Every task is audited for authentic brand engagement.</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Zap className="text-emerald-600 dark:text-emerald-500" size={32} />
          <div>
            <h4 className="font-bold text-sm uppercase">Solana Powered</h4>
            <p className="text-xs text-muted-foreground">Lightning fast conversions from TP to SOL on-chain.</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Coins className="text-emerald-600 dark:text-emerald-500" size={32} />
          <div>
            <h4 className="font-bold text-sm uppercase">Instant Accruals</h4>
            <p className="text-xs text-muted-foreground">Earn Task Points instantly upon proof verification.</p>
          </div>
        </div>
      </div>

      {/* Financial Disclaimer */}
      <div className="max-w-[1400px] mx-auto mt-16 space-y-8 text-[12px] leading-relaxed text-muted-foreground/70 border-t border-border pt-12">
        <div className="space-y-4">
          <p className="text-sm">
            <span className="font-bold uppercase text-foreground">Risk Disclosure:</span>{" "}
            Participating in Web3 activities involves significant risk. The value of Solana (SOL) 
            can be highly volatile. Before using TaskKash, ensure you understand the mechanics of digital wallets.
          </p>
          <p className="text-sm">
            TaskKash is a platform for engagement. Task Points (TP) are internal rewards and have no value until converted. 
          </p>
        </div>
        <div className="space-y-2 border-t border-border/20 pt-8">
          <p className="font-bold uppercase tracking-widest text-[10px] text-foreground">Platform Governance</p>
          <p className="text-sm">Utilizing automated verification and human-in-the-loop auditing to prevent bot activity. All user data is handled with end-to-end encryption.</p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-[1400px] mx-auto border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6">
          <p>© {new Date().getFullYear()} TASKKASH — Empowering the Gig Economy.</p>
          <div className="flex gap-4 text-[12px]">
            <Link href="#" className="hover:text-emerald-600 dark:hover:text-emerald-500">Privacy Policy</Link>
            <Link href="#" className="hover:text-emerald-600 dark:hover:text-emerald-500">Terms of Service</Link>
          </div>
        </div>
        <p className="italic text-xs text-center md:text-right max-w-md opacity-60">
          TaskKash is not a financial advisor. Use of this platform constitutes acceptance of our digital asset policy.
        </p>
      </div>

      <ScrollToTop />
    </footer>
  );
}