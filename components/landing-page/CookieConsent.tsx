"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Coins, TrendingUp } from "lucide-react";
import { IBM_Plex_Mono } from "next/font/google";

const plexMono = IBM_Plex_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  display: "swap",
});

export default function CookieConsent() {
  const [mounted, setMounted] = useState(false);
  const [consent, setConsent] = useState<"accepted" | "declined" | null>(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("cookieConsent") as
      | "accepted"
      | "declined"
      | null;
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const [closed, setClosed] = useState(false);

  const handleClose = () => {
    setClosed(true);
    // Re-show after 5 minutes
    setTimeout(() => setClosed(false), 5 * 60 * 1000);
  };

  const handleConsent = (value: "accepted" | "declined") => {
    localStorage.setItem("cookieConsent", value);
    setConsent(value);
  };

  return (
    <AnimatePresence>
      {mounted && consent === null && !closed && (
        <>
          {/* 1. BLUR OVERLAY (Mobile only to avoid blocking full desktop screen) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-500 bg-black/30 dark:bg-black/50 backdrop-blur-sm sm:hidden pointer-events-none"
          />

          {/* 2. CARD CONTAINER - Centered on Mobile, Bottom-Right on Desktop */}
          <div className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:left-6 z-500 flex items-center justify-center p-4 sm:p-0 font-sans pointer-events-none">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="pointer-events-auto relative w-full max-w-[380px] sm:w-[380px] rounded-3xl overflow-hidden shadow-2xl shadow-emerald-950/20 dark:shadow-black/70 ring-1 ring-border bg-card text-card-foreground"
            >
              {/* Token-themed backdrop with emerald glow */}
              <div className="pointer-events-none absolute inset-0 overflow-hidden">

                {/* Ambient emerald glow */}
                <div className="absolute -top-16 left-1/2 -translate-x-1/2 h-[200px] w-[200px] rounded-full bg-emerald-500/15 blur-[80px]" />
                <div className="absolute right-0 bottom-0 h-[160px] w-[160px] rounded-full bg-teal-500/10 blur-[70px]" />
              </div>

              {/* Close Button */}
              <button
                onClick={handleClose}
                aria-label="Dismiss"
                className="absolute top-4 right-4 z-20 cursor-pointer text-muted-foreground hover:text-foreground hover:bg-accent transition-all p-2 rounded-full border border-transparent hover:border-border"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="relative z-10 p-6">
                {/* Live status strip */}
                <div
                  className={`${plexMono.className} flex items-center justify-center gap-2 mb-4 text-[10px] uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-semibold`}
                >
                  <span className="relative flex h-2 w-2 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
                  </span>
                  Token Live
                </div>

                {/* Icon */}
                <div className="relative z-10 flex justify-center mb-2">
                  <img
                    src="/favicon.ico"
                    alt="Cookie"
                    className="w-28 h-28 object-contain filter drop-shadow-md"
                  />
                </div>

                {/* Content */}
                <div className="text-center">
                  <h3 className="text-lg font-bold text-foreground mb-1.5 tracking-tight">
                    TaskKash Token
                  </h3>

                  <p className="text-muted-foreground text-sm leading-relaxed mb-5">
                    Join the TaskKash ecosystem. Earn Task Points (TP) by completing tasks and convert them to SOL. Secure, fast, and on-chain.
                  </p>

                  {/* Actions */}
                  <div className="flex flex-row sm:flex-row gap-2.5">
                    <button
                      onClick={() => handleConsent("declined")}
                      className="w-full py-2.5 rounded-full bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold text-sm tracking-wide border border-border transition-all duration-300 cursor-pointer order-2 sm:order-1"
                    >
                      Maybe Later
                    </button>
                    <button
                      onClick={() => handleConsent("accepted")}
                      className="w-full py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm tracking-wide transition-all duration-300 cursor-pointer order-1 sm:order-2 hover:scale-[1.02] active:scale-95 shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2"
                    >
                      {/* <TrendingUp className="w-4 h-4" /> */}
                      Buy Token
                    </button>
                  </div>

                  <p
                    className={`${plexMono.className} mt-4 text-[9px] uppercase tracking-widest text-muted-foreground/50`}
                  >
                    Solana Powered • Instant TP Conversion
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}