"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const FALLBACK_AVATAR = "https://github.com/shadcn.png";

const AVATARS = Array(13).fill(FALLBACK_AVATAR);

const BOTTOM_STATS = [
  { label: "Stat Overview", value: "Scale Rise", sub: "New Opportunities" },
  { label: "#1 Platform", value: "Top Rated", sub: "Web3 Engagement" },
  { label: "Active Campaigns", value: "250+", sub: "Verified Tasks" },
  { label: "Instant Payouts", value: "100%", sub: "SOL Conversions" },
];

/* Tile blueprint, measured from the reference image (661 x 215 canvas) */
const W = 661;
const H = 215;
const TILE_W = 60;
const TILE_H = 72;

const TILES: { x: number; y: number }[] = [
  { x: 23, y: 52 },
  { x: 23, y: 132 },
  { x: 88, y: 24 },
  { x: 88, y: 104 },
  { x: 153, y: 58 },
  { x: 219, y: 28 },
  { x: 284, y: 45 },
  { x: 350, y: 26 },
  { x: 415, y: 57 },
  { x: 480, y: 24 },
  { x: 481, y: 105 },
  { x: 545, y: 52 },
  { x: 545, y: 131 },
];

/* Faded empty tiles that bleed in from the top */
const GHOSTS = [
  { x: 23, y: -26 },
  { x: 88, y: -54 },
  { x: 153, y: -20 },
  { x: 219, y: -50 },
  { x: 284, y: -33 },
  { x: 350, y: -52 },
  { x: 415, y: -21 },
  { x: 480, y: -54 },
  { x: 545, y: -26 },
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
  const [ready, setReady] = useState(false);
  const [userAvatars, setUserAvatars] = useState<string[]>(AVATARS);
  const [allUsers, setAllUsers] = useState<string[]>([]);
  const [userSetIndex, setUserSetIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    fetchRandomUsers();
    const t = setTimeout(() => setReady(true), 80);
    return () => clearTimeout(t);
  }, []);

  const fetchRandomUsers = async () => {
    try {
      // Fetch 5 batches of users (5 * 13 = 65 users total)
      const response = await fetch(`/api/users/random?count=${TILES.length * 5}`);
      const data = await response.json();

      if (data.success && data.users?.length) {
        const urls = data.users.map(
          (user: any) => user.avatarUrl || FALLBACK_AVATAR
        );
        setAllUsers(urls);
        // Set initial batch
        setUserAvatars(urls.slice(0, TILES.length));
      }
    } catch (error) {
      console.error("Failed to fetch random users:", error);
    }
  };

  // Rotate through user sets every 10 seconds with smooth transition
  useEffect(() => {
    if (allUsers.length === 0) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      
      // Wait for fade out, then change avatars, then fade in
      setTimeout(() => {
        setUserSetIndex((prev) => {
          const nextIndex = (prev + 1) % Math.floor(allUsers.length / TILES.length);
          const startIndex = nextIndex * TILES.length;
          const endIndex = startIndex + TILES.length;
          setUserAvatars(allUsers.slice(startIndex, endIndex));
          
          // Fade in after changing
          setTimeout(() => setIsTransitioning(false), 100);
          return nextIndex;
        });
      }, 500);
    }, 10000);

    return () => clearInterval(interval);
  }, [allUsers]);

  if (!isMounted) return <div className="min-h-screen bg-background" />;

  return (
    <section className="relative flex min-h-screen w-full flex-col overflow-hidden bg-background to-muted/30">
      <style>{`
        @keyframes rise-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @media (prefers-reduced-motion: reduce) {
          .rise-float { animation: none !important; }
        }
      `}</style>

      {/* Ambient emerald glow behind the text */}
      {/* <div className="pointer-events-none absolute left-1/2 top-[64%] z-0 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-[130px] md:h-[600px] md:w-[900px]" /> */}

      {/* ───────── MAIN CONTAINER (max 1500px) ───────── */}
      <div className="relative z-10 mx-auto flex w-full max-w-[1500px] flex-1 flex-col px-4 pt-20 md:px-5 md:pt-24">
        {/* ───────── CONTRIBUTOR TILE WALL ───────── */}
        <div className="relative left-1/2 w-[680px] -translate-x-1/2 sm:w-[900px] md:left-0 md:w-full md:translate-x-0">
          <div className="relative w-full" style={{ aspectRatio: `${W} / ${H}` }}>
            {/* Ghost tiles (fade out toward the top) */}
            <div
              className="absolute inset-0"
              style={{
                maskImage:
                  "linear-gradient(to bottom, transparent 0%, black 45%, black 100%)",
                WebkitMaskImage:
                  "linear-gradient(to bottom, transparent 0%, black 45%, black 100%)",
              }}
            >
              {GHOSTS.map((g, i) => (
                <div
                  key={i}
                  className="absolute rounded-lg border border-border/60 bg-muted/50 xl:rounded-xl"
                  style={{
                    left: `${(g.x / W) * 100}%`,
                    top: `${(g.y / H) * 100}%`,
                    width: `${(TILE_W / W) * 100}%`,
                    aspectRatio: `${TILE_W} / ${TILE_H}`,
                  }}
                />
              ))}
            </div>

            {/* Vertical guide lines */}
            {TILES.map((t, i) => {
              return (
                <div
                  key={`line-${i}`}
                  className="pointer-events-none absolute z-0 w-px bg-gradient-to-b from-emerald-500/30 via-border/50 to-transparent"
                  style={{
                    left: `${((t.x + TILE_W / 2) / W) * 100}%`,
                    top: `${(t.y / H) * 100}%`,
                    height: `${((H - t.y) / H) * 100 + 30}%`,
                  }}
                />
              );
            })}

            {/* Contributor tiles */}
            {TILES.map((t, i) => {
              const src = userAvatars[i % userAvatars.length] || FALLBACK_AVATAR;

              return (
                <div
                  key={i}
                  className="absolute z-10"
                  style={{
                    left: `${(t.x / W) * 100}%`,
                    top: `${(t.y / H) * 100}%`,
                    width: `${(TILE_W / W) * 100}%`,
                    aspectRatio: `${TILE_W} / ${TILE_H}`,
                    opacity: ready && !isTransitioning ? 1 : 0,
                    transform: ready && !isTransitioning ? "translateY(0)" : "translateY(24px)",
                    transition: `opacity 0.8s ease ${i * 0.08}s, transform 0.8s ease ${i * 0.08}s`,
                  }}
                >
                  <div
                    className="rise-float relative h-full w-full overflow-hidden rounded-xl border border-border bg-card shadow-md transition-transform duration-300 hover:scale-105 xl:rounded-2xl"
                    style={{
                      animation: `rise-float ${5 + (i % 4)}s ease-in-out ${i * 0.35}s infinite`,
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt="Active contributor"
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          FALLBACK_AVATAR;
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ───────── CENTERED CONTENT ───────── */}
        <div
          className="relative z-20 mx-auto -mt-4 flex w-full max-w-3xl flex-col items-center px-2 pb-16 text-center md:-mt-14 lg:-mt-24 xl:-mt-36 2xl:-mt-40 xl:pb-10"
          style={{
            opacity: ready ? 1 : 0,
            transform: ready ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.8s ease 0.4s, transform 0.8s ease 0.4s",
          }}
        >
          {/* TAGLINE */}
<div className="mb-6 hidden items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-600 backdrop-blur-sm dark:text-emerald-400 lg:inline-flex">
  <span className="relative flex h-2 w-2">
    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
  </span>

  <span>Turn Actions Into Rewards</span>
</div>

          {/* HEADLINE: two-tone like the reference */}
          <h1 className="text-4xl font-black uppercase leading-[1.08] tracking-tight text-foreground md:text-4xl">
            Turn Everyday Actions
            <span className="mt-1 block bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
              Into On-Chain Rewards.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base font-medium leading-relaxed text-muted-foreground md:text-lg xl:max-w-2xl xl:text-lg">
            Complete structured tasks, earn Task Points (TP), and convert them
            to SOL. Experience seamless, verified growth on the blockchain.
          </p>

          {/* CTA BUTTONS */}
          <div className="mt-8 flex w-full flex-row items-center justify-center gap-3 sm:w-auto sm:gap-4">
            <Button
              asChild
              size="lg"
              className="flex-1 cursor-pointer rounded-full bg-emerald-500 px-4 py-7 lg:py-7 text-sm font-extrabold tracking-wider text-white shadow-[0_10px_30px_-8px_rgba(16,185,129,0.6)] transition-all hover:scale-105 hover:bg-emerald-600 sm:flex-none sm:px-8 sm:text-sm"
            >
              <Link href="/auth/login" className="flex items-center gap-2">
                Sign in
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="flex-1 cursor-pointer rounded-full border-border bg-background/60 px-4 py-6 lg:py-7 text-sm font-bold tracking-wider backdrop-blur-md transition-all hover:bg-muted sm:flex-none sm:px-8 sm:text-sm"
            >
              <Link
                href="/landing-page/contact"
                className="flex items-center gap-2"
              >
                TaskKash Token
              </Link>
            </Button>
          </div>

          {/* TRUST ROW */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-5 gap-y-4">
            <div className="flex flex-col items-center">
              <span className="mb-1 text-xl font-bold leading-none text-foreground">
                100%
              </span>
              <span className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground">
                Verified Proof
              </span>
            </div>
            <div className="h-7 w-px bg-border" />
            <div className="flex flex-col items-center">
              <span className="mb-1 text-xl font-bold leading-none text-foreground">
                Instant
              </span>
              <span className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground">
                Crypto Payouts
              </span>
            </div>
            <div className="h-7 w-px bg-border" />
            <div className="flex flex-col items-center">
              <span className="mb-1 text-xl font-bold leading-none text-emerald-500">
                <Counter target={1100} />+
              </span>
              <span className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground">
                Completed Tasks
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ───────── BOTTOM STATS BAR ───────── */}
      <div className="relative z-30 w-full border-t border-border bg-background/80 backdrop-blur-sm mb-5 lg:mb-20">
        <div className="mx-auto max-w-[1500px] px-0 md:px-8 xl:px-12">
          <div className="grid grid-cols-2 gap-0 divide-x divide-border md:grid-cols-4">
            {BOTTOM_STATS.map((item, i) => (
              <div
                key={i}
                className="group flex flex-col space-y-1 border-b border-border p-6 transition-colors hover:bg-emerald-500/5 md:border-b-0"
              >
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">
                  {item.label}
                </span>
                <span className="text-sm font-extrabold uppercase tracking-tight text-foreground">
                  {item.value}
                </span>
                <span className="text-sm leading-none text-muted-foreground">
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