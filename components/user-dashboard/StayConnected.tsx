"use client";

import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Gift, Users, ShieldCheck } from "lucide-react";

const IMAGES = [
  "https://i.postimg.cc/ZnDX5Ff3/5.jpg",
  "https://i.postimg.cc/VvF1MffN/Bull-and-Bear.jpg",
  "https://i.postimg.cc/9Q9sc9yF/6.jpg",
];

export default function GiftMember({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Automatic Image Slider - Fixed to prevent memory leaks
  useEffect(() => {
    if (isOpen) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % IMAGES.length);
      }, 4000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isOpen]); // Only run interval when open

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-500 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -8 }}
        className="relative w-full max-w-[400px] bg-card rounded-[1.5rem] overflow-hidden shadow-2xl border border-border/50 transition-shadow"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Image Slider Section */}
        <div className="relative h-[200px] overflow-hidden group">
          <AnimatePresence initial={false} mode="wait">
            <motion.img
              key={currentIndex}
              src={IMAGES[currentIndex]}
              // Change: initial opacity to 0, but since they animate
              // at the same time, crossfade will be seamless.
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 1, // Slightly longer duration makes the crossfade smoother
                ease: "easeInOut",
              }}
              className="absolute inset-0 w-full h-full object-cover"
              alt="Trading Empowerment"
            />
          </AnimatePresence>

          {/* Overlays & Badges - Ensure these stay ABOVE images */}
          <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-black/20 z-[1]" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute cursor-pointer top-5 right-5 w-8 h-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors z-20"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <div className="absolute top-5 left-5 flex gap-2 z-20">
            <span className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-[10px] font-bold text-white uppercase tracking-widest">
              Community
            </span>
            <span className="px-3 py-1 bg-green-500/80 backdrop-blur-md rounded-full text-[10px] font-bold text-white uppercase tracking-widest flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Secure
            </span>
          </div>

          {/* Pagination Dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
            {IMAGES.map((_, i) => (
              <div
                key={i}
                onClick={() => setCurrentIndex(i)} // Added clickability for convenience
                className={`h-1.5 cursor-pointer rounded-full transition-all duration-300 ${
                  i === currentIndex ? "w-6 bg-white" : "w-1.5 bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-5 lg:8 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-green-500 font-bold text-xs uppercase tracking-tighter">
              <Gift className="w-4 h-4" />
              <span>Stay Connected</span>
            </div>
            <h2 className="text-xl font-black text-foreground leading-tight tracking-tight">
              Join Our Growing Community
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed font-medium">
              Follow us on X (Twitter) to discover new tasks, stay informed
              about platform updates, earn rewards, and access exclusive
              opportunities. Join our growing community and never miss important
              announcements that help you get more from the platform.
            </p>
          </div>

          {/* Stats/Info Row */}
          <div className="flex items-center justify-between py-4 border-y border-border/50">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-green-500/10">
                <Users className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                  Community
                </p>
                <p className="text-sm font-bold">Growing Daily</p>
              </div>
            </div>
            <div className="text-right font-mono text-sm font-black text-green-500">
              REAL-TIME UPDATES
            </div>
          </div>

          {/* Action Button */}
          <a
            href="https://x.com/Taskkash"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="group relative w-full cursor-pointer bg-green-500 text-white font-bold py-3 px-6 rounded-2xl flex items-center justify-between overflow-hidden transition-all hover:pr-8 active:scale-[0.98] hover:bg-green-500/90">
              <span className="relative z-10">Follow on X</span>
              <div className="h-8 w-8 bg-white/20 rounded-full flex items-center justify-center transition-transform group-hover:rotate-45">
                <ArrowUpRight className="w-5 h-5" />
              </div>
            </button>
          </a>
        </div>
      </motion.div>
    </div>
  );
}
