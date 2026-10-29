"use client";

import { useState, useEffect, useRef, useId } from "react";
import {
  Trophy, CheckCircle2, Flame, Wallet, Upload, Folder, Share2,
  FileText, Users, Music, ArrowRight, ArrowUpRight, ChevronRight, Copy, Gift,
  Sparkles, Inbox, TrendingUp, Activity, Coins, DollarSign,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TaskDocument } from "@/types/shared-task";
import { TaskPreviewModal } from "@/components/tasks/TaskPreviewModal";
import { RecentActivity } from "@/components/user-dashboard/RecentActivity";
import DashboardSkeleton from "@/components/LoadingSkeleton/DashboardSkeleton";
import { getGreeting } from "@/lib/utils";
import { toast } from "react-toastify";

// Directly import the Sidebar and Header here
import UserSidebar from "@/components/user-dashboard/UserSidebar";
import UserHeader from "@/components/user-dashboard/UserHeader";
import ProfileCompletionTracker from "@/components/user-dashboard/ProfileCompletionTracker";

/* ============================================================
   CONFIG
   ============================================================ */
const TOKEN_SYMBOL = "TKASH"; // TODO: change to your real ticker
const TP_TO_USD_RATE = 0.00066; // 1 TP = $0.00066

// Set to true ONLY to preview the design with sample data.
// Keep false in production so users never see fake numbers.
const USE_DEMO_DATA = false;

/* ============================================================
   TYPES + HELPERS
   ============================================================ */
type TrendPoint = { date: string; value: number };

type AnalyticsData = {
  trends?: { totalEarned?: number[]; tasksDone?: number[]; withdrawals?: number[]; activeTasks?: number[] };
  changes?: { totalEarned?: number; tasksDone?: number; withdrawals?: number; activeTasks?: number };
  earnings?: {
    points: TrendPoint[];
    total?: number;
    changePct?: number;
    breakdown?: { label: string; value: number }[];
  };
  topEarners?: { id: string; name: string; email?: string | null; avatar?: string; points: number }[];
};

type HoldersData = {
  totalHolders: number;
  holders: { address: string; balance: number; percent?: number }[];
  updatedAt?: string;
};

const compact = (num: number) => {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1).replace(".0", "")}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1).replace(".0", "")}K`;
  return num.toString();
};

const stripHtmlTags = (html: string) => {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

const shortAddress = (addr: string) =>
  addr.length > 12 ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : addr;

const maskEmail = (email: string | null | undefined) => {
  if (!email) return null;
  const [local, domain] = email.split('@');
  if (!local || !domain) return email;
  const maskedLocal = local.slice(0, 3) + '*****';
  return `${maskedLocal}@${domain}`;
};

const shortDate = (value: string) => {
  const d = new Date(value);
  return isNaN(d.getTime())
    ? value
    : d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

/* ============================================================
   STATIC MAPS
   ============================================================ */
const categoryStyles: Record<string, { pill: string; icon: string; text: string; btnHover: string }> = {
  social: { pill: "bg-blue-500/10 text-blue-500", icon: "bg-blue-500/10 text-blue-500", text: "text-blue-500", btnHover: "group-hover:bg-blue-500" },
  content: { pill: "bg-purple-500/10 text-purple-500", icon: "bg-purple-500/10 text-purple-500", text: "text-purple-500", btnHover: "group-hover:bg-purple-500" },
  community: { pill: "bg-green-500/10 text-green-500", icon: "bg-green-500/10 text-green-500", text: "text-green-500", btnHover: "group-hover:bg-green-500" },
  music: { pill: "bg-pink-500/10 text-pink-500", icon: "bg-pink-500/10 text-pink-500", text: "text-pink-500", btnHover: "group-hover:bg-pink-500" },
};

const categoryIcons: Record<string, React.ElementType> = {
  social: Share2,
  content: FileText,
  community: Users,
  music: Music,
};

const categoryList = [
  { name: "Social Tasks", desc: "Follow, repost & interact on social platforms", href: "/user-dashboard/task-category/social", icon: Share2, color: "bg-blue-500/10 text-blue-500" },
  { name: "Content Tasks", desc: "Create threads, videos and original content", href: "/user-dashboard/task-category/content", icon: FileText, color: "bg-purple-500/10 text-purple-500" },
  { name: "Community", desc: "Join Discord, Telegram and invite users", href: "/user-dashboard/task-category/community", icon: Users, color: "bg-green-500/10 text-green-500" },
  { name: "Music Tasks", desc: "Stream and earn via partner protocols", href: "/user-dashboard/campaign-center", icon: Music, color: "bg-pink-500/10 text-pink-500" },
];

const rankStyle = [
  "bg-yellow-500/15 text-yellow-500",
  "bg-slate-400/15 text-slate-400",
  "bg-orange-500/15 text-orange-500",
];

/* ============================================================
   DEMO DATA (only used when USE_DEMO_DATA = true)
   ============================================================ */
const buildDemoAnalytics = (): AnalyticsData => {
  const values = [320, 480, 610, 890, 1050, 1320, 1900];
  const points = values.map((value, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (values.length - 1 - i));
    return { date: d.toISOString(), value };
  });
  return {
    trends: {
      totalEarned: [3, 5, 4, 7, 8, 11, 14],
      tasksDone: [2, 3, 3, 5, 6, 6, 9],
      withdrawals: [1, 1, 2, 2, 3, 3, 4],
      activeTasks: [4, 3, 5, 4, 6, 6, 7],
    },
    changes: { totalEarned: 24.5, tasksDone: 12, withdrawals: 2.1, activeTasks: 5 },
    earnings: {
      points,
      total: 1900,
      changePct: 12.5,
      breakdown: [
        { label: "Task Rewards", value: 1500 },
        { label: "Referral Bonus", value: 250 },
        { label: "Campaigns", value: 150 },
      ],
    },
    topEarners: [
      { id: "1", name: "CryptoKing", email: "crypto***@gmail.com", points: 12500 },
      { id: "2", name: "TaskQueen", email: "task***@gmail.com", points: 10320 },
      { id: "3", name: "Web3Hunter", email: "web3***@gmail.com", points: 8760 },
      { id: "4", name: "ShillMaster", email: "shill***@gmail.com", points: 7140 },
    ],
  };
};

const demoHolders: HoldersData = {
  totalHolders: 1280,
  holders: [
    { address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F", balance: 250000, percent: 4.2 },
    { address: "0x2546BcD3c84621e976D8185a91A922aE77ECEc30", balance: 198000, percent: 3.3 },
    { address: "0xbDA5747bFD65F08deb54cb465eB87D40e51B197E", balance: 145000, percent: 2.4 },
    { address: "0xdD2FD4581271e230360230F9337D5c0430Bf44C0", balance: 120000, percent: 2.0 },
    { address: "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199", balance: 98000, percent: 1.6 },
  ],
};

/* ============================================================
   ANALYTICS HOOK (separate fetches, never touches your existing calls)
   Missing/failed endpoints simply fall back to empty states.
   ============================================================ */
async function loadJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`Failed to fetch ${url}:`, res.status, res.statusText);
      return null;
    }
    const data = await res.json();
    console.log(`Fetched ${url}:`, data);
    // Handle API response format: { success: true, data: ... }
    return (data as any).data || data;
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    return null;
  }
}

function useDashboardAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [holders, setHolders] = useState<HoldersData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (USE_DEMO_DATA) {
      setAnalytics(buildDemoAnalytics());
      setHolders(demoHolders);
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      const [analyticsData, h] = await Promise.all([
        loadJson<AnalyticsData>("/api/user/analytics"),
        loadJson<HoldersData>("/api/token/holders"),
      ]);

      if (cancelled) return;

      console.log('Analytics data:', analyticsData);
      console.log('Top earners from analytics:', analyticsData?.topEarners);

      setAnalytics(analyticsData);
      setHolders(h);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { analytics, holders, loading };
}

/* ============================================================
   CHARTS (pure SVG, no dependencies)
   ============================================================ */
function Sparkline({ data, className = "text-primary" }: { data?: number[]; className?: string }) {
  const id = useId().replace(/:/g, "");
  if (!data || data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => [(i / (data.length - 1)) * 100, 29 - ((v - min) / range) * 26]);
  const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(2)},${y.toFixed(2)}`).join(" ");
  const area = `${line} L100,32 L0,32 Z`;

  return (
    <svg viewBox="0 0 100 32" preserveAspectRatio="none" className={`h-10 w-24 shrink-0 ${className}`} aria-hidden>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.25" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${id})`} />
      <path
        d={line}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

function AreaChartSvg({ data, height = 220, unit = "TP" }: { data: TrendPoint[]; height?: number; unit?: string }) {
  const id = useId().replace(/:/g, "");
  const [hover, setHover] = useState<number | null>(null);
  if (data.length < 2) return null;

  const n = data.length;
  const niceMax = Math.max(...data.map((d) => d.value), 1) * 1.1;
  const x = (i: number) => (i / (n - 1)) * 100;
  const y = (v: number) => 100 - (v / niceMax) * 100;

  const line = data.map((d, i) => `${i ? "L" : "M"}${x(i).toFixed(2)},${y(d.value).toFixed(2)}`).join(" ");
  const area = `${line} L100,100 L0,100 Z`;
  const ticks = [0, 25, 50, 75, 100];
  const labelStep = Math.ceil(n / 7);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    setHover(Math.min(n - 1, Math.max(0, Math.round(ratio * (n - 1)))));
  };

  return (
    <div className="flex gap-3">
      {/* Y axis */}
      <div className="relative w-10 shrink-0" style={{ height }}>
        {ticks.map((p) => (
          <span
            key={p}
            className="absolute right-0 -translate-y-1/2 text-[10px] font-medium text-muted-foreground"
            style={{ top: `${p}%` }}
          >
            {compact(Math.round(niceMax * (1 - p / 100)))}
          </span>
        ))}
      </div>

      <div className="min-w-0 flex-1">
        <div className="relative" style={{ height }} onMouseMove={onMove} onMouseLeave={() => setHover(null)}>
          {ticks.map((p) => (
            <div key={p} className="absolute inset-x-0 border-t border-dashed border-border/70" style={{ top: `${p}%` }} />
          ))}

          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full text-primary">
            <defs>
              <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.22" />
                <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={area} fill={`url(#${id})`} />
            <path
              d={line}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          {hover !== null && (
            <>
              <div className="absolute inset-y-0 w-px bg-border" style={{ left: `${x(hover)}%` }} />
              <div
                className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-background bg-primary shadow"
                style={{ left: `${x(hover)}%`, top: `${y(data[hover].value)}%` }}
              />
              <div
                className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-lg border border-border bg-card px-2.5 py-1.5 text-center shadow-lg"
                style={{
                  left: `${Math.min(88, Math.max(12, x(hover)))}%`,
                  top: `calc(${y(data[hover].value)}% - 12px)`,
                }}
              >
                <p className="text-[10px] font-medium text-muted-foreground">{shortDate(data[hover].date)}</p>
                <p className="text-xs font-black">
                  {compact(data[hover].value)} {unit}
                </p>
              </div>
            </>
          )}
        </div>

        {/* X axis */}
        <div className="relative mt-3 h-4">
          {data.map((d, i) =>
            i % labelStep === 0 || i === n - 1 ? (
              <span
                key={i}
                className="absolute -translate-x-1/2 whitespace-nowrap text-[10px] font-medium text-muted-foreground"
                style={{ left: `${x(i)}%` }}
              >
                {shortDate(d.date)}
              </span>
            ) : null
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   SECTIONS
   ============================================================ */
function EarningsOverview({
  earnings,
  loading,
  className = "",
}: {
  earnings?: AnalyticsData["earnings"];
  loading?: boolean;
  className?: string;
}) {
  const hasData = !!earnings && earnings.points.length >= 2;
  const total = earnings?.total ?? earnings?.points.reduce((s, p) => s + p.value, 0) ?? 0;

  return (
    <section className={`bg-card border border-border rounded-2xl p-5 md:p-6 ${className}`}>
      <div className="flex items-center gap-2 mb-5">
        <TrendingUp className="w-5 h-5 text-primary" />
        <div>
          <h2 className="text-xs font-black uppercase tracking-[0.2em]">Earnings Overview</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Your TP earnings over time</p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-6 animate-pulse">
          <div className="h-[240px] rounded-xl bg-muted" />
          <div className="h-[240px] rounded-xl bg-muted" />
        </div>
      ) : hasData ? (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-6">
          <AreaChartSvg data={earnings!.points} />

          <aside className="self-start rounded-xl border border-border bg-background/50 p-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Earnings</p>
            <div className="mt-1 flex items-center justify-between gap-2">
              <p className="text-2xl font-black tracking-tighter">{compact(total)} TP</p>
              {typeof earnings?.changePct === "number" && (
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
                    earnings.changePct >= 0 ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                  }`}
                >
                  {earnings.changePct >= 0 ? "+" : ""}
                  {earnings.changePct}%
                </span>
              )}
            </div>

            {earnings?.breakdown && earnings.breakdown.length > 0 && (
              <div className="mt-4 divide-y divide-border">
                {earnings.breakdown.map((row) => (
                  <div key={row.label} className="flex items-center justify-between py-2.5 text-xs">
                    <span className="text-muted-foreground">{row.label}</span>
                    <span className="font-black">{compact(row.value)} TP</span>
                  </div>
                ))}
              </div>
            )}
          </aside>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-background/40 px-6 py-12 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
            <Activity className="h-7 w-7 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-sm font-black tracking-tight">Your earnings chart starts here</h3>
          <p className="mt-1 max-w-xs text-xs text-muted-foreground">
            Complete a few tasks and your daily earnings trend will show up on this chart.
          </p>
          <Link
            href="/user-dashboard/tasks"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-xs font-black uppercase tracking-widest text-primary-foreground hover:opacity-90 transition-opacity"
          >
            Start Earning <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}
    </section>
  );
}

function TopEarners({
  earners,
  loading,
  className = "",
}: {
  earners?: AnalyticsData["topEarners"];
  loading?: boolean;
  className?: string;
}) {
  const list = (earners ?? []).slice(0, 4);

  return (
    <section className={`bg-card border border-border rounded-2xl p-5 md:p-6 ${className}`}>
      <div className="flex items-center gap-2 mb-5">
        <Trophy className="w-5 h-5 text-yellow-500" />
        <div>
          <h2 className="text-xs font-black uppercase tracking-[0.2em]">Top Earners</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Leading the board today</p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-14 rounded-xl bg-muted" />
          ))}
        </div>
      ) : list.length > 0 ? (
        <ul className="space-y-2">
          {list.map((e, i) => (
            <li
              key={e.id}
              className="flex items-center gap-3 rounded-xl border border-border bg-background/50 p-3 transition-colors hover:border-primary/40"
            >
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-black ${
                  rankStyle[i] ?? "bg-muted text-muted-foreground"
                }`}
              >
                {i + 1}
              </span>
              {e.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={e.avatar} alt={e.name} className="h-9 w-9 shrink-0 rounded-full object-cover" />
              ) : (
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-black text-primary">
                  {e.name.charAt(0).toUpperCase()}
                </span>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold truncate">{e.name}</p>
                {e.email && (
                  <p className="text-[10px] text-muted-foreground truncate">{maskEmail(e.email)}</p>
                )}
              </div>
              <span className="text-xs font-black">{compact(e.points)} TP</span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-background/40 px-6 py-10 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Trophy className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="mt-3 text-sm font-black tracking-tight">Leaderboard is warming up</h3>
          <p className="mt-1 max-w-[220px] text-xs text-muted-foreground">
            Top earners appear here as members complete tasks today.
          </p>
        </div>
      )}
    </section>
  );
}

function TokenHolders({ data, loading }: { data?: HoldersData | null; loading?: boolean }) {
  const holders = data?.holders ?? [];
  const isLive = !!data && data.totalHolders > 0 && holders.length > 0;
  const top = holders.slice(0, 10);
  const topShare = top.length > 0 && top.every((h) => typeof h.percent === "number")
    ? top.reduce((s, h) => s + (h.percent as number), 0)
    : null;

  const copy = (addr: string) =>
    navigator.clipboard
      .writeText(addr)
      .then(() => toast.success("Address copied"))
      .catch(() => toast.error("Failed to copy address"));

  return (
    <section className="bg-card border border-border rounded-2xl p-5 md:p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Coins className="w-5 h-5 text-primary" />
          <div>
            <h2 className="text-xs font-black uppercase tracking-[0.2em]">Token Holders</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Who holds ${TOKEN_SYMBOL}</p>
          </div>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-widest ${
            isLive ? "bg-green-500/10 text-green-500" : "bg-primary/10 text-primary"
          }`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${isLive ? "bg-green-500 animate-pulse" : "bg-primary"}`} />
          {isLive ? "Live" : "Pre-TGE"}
        </span>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6 animate-pulse">
          <div className="h-40 rounded-xl bg-muted" />
          <div className="h-40 rounded-xl bg-muted" />
        </div>
      ) : isLive ? (
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
          {/* Summary */}
          <div className="space-y-3">
            <div className="rounded-xl border border-border bg-background/50 p-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="w-4 h-4" />
                <p className="text-[10px] font-black uppercase tracking-widest">Total Holders</p>
              </div>
              <p className="mt-2 text-3xl font-black tracking-tighter">{data!.totalHolders.toLocaleString()}</p>
            </div>
            {topShare !== null && (
              <div className="rounded-xl border border-border bg-background/50 p-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Wallet className="w-4 h-4" />
                  <p className="text-[10px] font-black uppercase tracking-widest">Top {top.length} Hold</p>
                </div>
                <p className="mt-2 text-3xl font-black tracking-tighter">{topShare.toFixed(1)}%</p>
              </div>
            )}
          </div>

          {/* Top holders */}
          <div className="overflow-x-auto">
            <div className="min-w-[420px]">
              <div className="grid grid-cols-[32px_1fr_100px_120px] gap-3 px-3 pb-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                <span>#</span>
                <span>Wallet</span>
                <span className="text-right">Balance</span>
                <span className="text-right">Share</span>
              </div>
              <div className="space-y-1.5">
                {top.map((h, i) => (
                  <div
                    key={h.address}
                    className="grid grid-cols-[32px_1fr_100px_120px] items-center gap-3 rounded-xl border border-border bg-background/50 px-3 py-2.5"
                  >
                    <span className="text-xs font-black text-muted-foreground">{i + 1}</span>
                    <button
                      onClick={() => copy(h.address)}
                      className="group flex items-center gap-2 text-left font-mono text-xs font-bold"
                      title="Copy address"
                    >
                      {shortAddress(h.address)}
                      <Copy className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                    <span className="text-right text-xs font-black">{compact(h.balance)}</span>
                    <div className="flex items-center justify-end gap-2">
                      {typeof h.percent === "number" && (
                        <>
                          <div className="h-1.5 w-12 overflow-hidden rounded-full bg-muted">
                            <div
                              className="h-full rounded-full bg-primary"
                              style={{ width: `${Math.min(100, h.percent)}%` }}
                            />
                          </div>
                          <span className="w-10 text-right text-[11px] font-bold text-muted-foreground">
                            {h.percent.toFixed(1)}%
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-background/40 px-6 py-12 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <Coins className="h-7 w-7 text-primary" />
          </div>
          <h3 className="mt-4 text-sm font-black tracking-tight">Holder analytics go live at TGE</h3>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground">
            Once ${TOKEN_SYMBOL} launches, you&apos;ll see total holders, the top wallets and how supply is distributed right here.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {["Total holders", "Top wallets", "Supply distribution"].map((t) => (
              <span
                key={t}
                className="rounded-full border border-border bg-card px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

/* ============================================================
   PAGE
   ============================================================ */
export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [taskPoints, setTaskPoints] = useState<number>(0);
  const [tasksCompleted, setTasksCompleted] = useState<number>(0);
  const [totalWithdrawn, setTotalWithdrawn] = useState<number>(0);
  const [activeTasksCount, setActiveTasksCount] = useState<number>(0);
  const [tasks, setTasks] = useState<TaskDocument[]>([]);
  const [selectedTask, setSelectedTask] = useState<TaskDocument | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"All" | "Pending" | "Approved" | "Rejected">("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [userName, setUserName] = useState<string>("");
  const [featuredTasks, setFeaturedTasks] = useState<TaskDocument[]>([]);
  const [featuredLoading, setFeaturedLoading] = useState(true);
  const pageSize = 6;
  const router = useRouter();
  const isNavigating = useRef(false);

  // Analytics (must stay above the early return below)
  const { analytics, holders, loading: analyticsLoading } = useDashboardAnalytics();

  const formatPoints = (num: number) => {
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1).replace(".0", "")}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(1).replace(".0", "")}K`;
    return num.toString();
  };

  // ---------- All your original data fetching (unchanged) ----------
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const profileResponse = await fetch("/api/user/profile");
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          setUserName(profileData.name || "");
        }

        let response = await fetch("/api/user/balance");
        let data;

        if (!response.ok) {
          console.log("Falling back to original API");
          response = await fetch("/api/tasks/approve");
        }

        if (response.ok) {
          data = await response.json();
          setTaskPoints(data.taskPoints || 0);
          setTasksCompleted(data.tasksCompleted || 0);
        } else {
          console.warn("API calls failed, using default values");
          setTaskPoints(0);
          setTasksCompleted(0);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setTaskPoints(0);
        setTasksCompleted(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
    const interval = setInterval(fetchUserData, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("/api/tasks/user-dashboard");
        if (!response.ok) throw new Error("Failed to fetch tasks");
        const data = await response.json();
        setTasks(data.tasks || []);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setTasks([]);
      } finally {
        setTasksLoading(false);
      }
    };
    fetchTasks();
  }, []);

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const response = await fetch("/api/user/stats");
        if (response.ok) {
          const data = await response.json();
          setTotalWithdrawn(data.totalWithdrawn || 0);
          setActiveTasksCount(data.activeTasksCount || 0);
        }
      } catch (error) {
        console.error("Error fetching user stats:", error);
        setTotalWithdrawn(0);
        setActiveTasksCount(0);
      }
    };
    fetchUserStats();
  }, []);

  useEffect(() => {
    const fetchFeaturedTasks = async () => {
      try {
        const response = await fetch("/api/tasks/featured");
        if (response.ok) {
          const data = await response.json();
          setFeaturedTasks(data.tasks || []);
        }
      } catch (error) {
        console.error("Error fetching featured tasks:", error);
        setFeaturedTasks([]);
      } finally {
        setFeaturedLoading(false);
      }
    };
    fetchFeaturedTasks();
  }, []);

  // ---------- Handlers (unchanged) ----------
  const handleTaskClick = (task: TaskDocument) => {
    if (isNavigating.current) return;
    isNavigating.current = true;
    setSelectedTask(task);
    setIsModalOpen(true);
    setTimeout(() => { isNavigating.current = false; }, 300);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const handleCopyTaskUrl = (e: React.MouseEvent, task: TaskDocument) => {
    e.stopPropagation();
    const taskUrl = `https://taskkash.xyz/${task._id}`;
    navigator.clipboard
      .writeText(taskUrl)
      .then(() => toast.success("Task URL copied to clipboard!"))
      .catch(() => toast.error("Failed to copy URL"));
  };

  // ---------- Filter logic (unchanged) ----------
  const getFilteredAndSortedTasks = () => {
    let filtered = tasks;
    if (activeTab !== "All") {
      filtered = tasks.filter((task) => task.userTaskStatus === activeTab.toLowerCase());
    }
    const sorted = [...filtered].sort((a, b) => {
      if (activeTab === "All") {
        const getSortPriority = (status: string | undefined) => {
          if (!status) return 3;
          if (status === "available" || status === "rejected") return 0;
          if (status === "pending") return 1;
          if (status === "approved") return 2;
          return 3;
        };
        const priorityA = getSortPriority(a.userTaskStatus);
        const priorityB = getSortPriority(b.userTaskStatus);
        if (priorityA !== priorityB) return priorityA - priorityB;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else {
        const dateA = a.latestSubmission?.submittedAt
          ? new Date(a.latestSubmission.submittedAt).getTime()
          : new Date(a.createdAt).getTime();
        const dateB = b.latestSubmission?.submittedAt
          ? new Date(b.latestSubmission.submittedAt).getTime()
          : new Date(b.createdAt).getTime();
        return dateB - dateA;
      }
    });
    return sorted;
  };

  const filteredAndSortedTasks = getFilteredAndSortedTasks().slice(0, 18);
  const totalPages = Math.ceil(filteredAndSortedTasks.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedTasks = filteredAndSortedTasks.slice(startIndex, startIndex + pageSize);

  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  if (isLoading || tasksLoading) {
    return <DashboardSkeleton />;
  }

  // ---------- Stats config ----------
  const t = analytics?.trends;
  const c = analytics?.changes;

  const stats = [
    { label: "Total Earned", value: `${formatPoints(taskPoints)} TP`, href: "#", icon: Trophy, tone: "bg-yellow-500/10 text-yellow-500", spark: "text-yellow-500", trend: t?.totalEarned, change: c?.totalEarned },
    { label: "USD Value", value: `$${(taskPoints * TP_TO_USD_RATE).toFixed(2)}`, href: "#", icon: DollarSign, tone: "bg-emerald-500/10 text-emerald-500", spark: "text-emerald-500", trend: t?.totalEarned, change: c?.totalEarned },
    { label: "Tasks Done", value: formatPoints(tasksCompleted), href: "#", icon: CheckCircle2, tone: "bg-green-500/10 text-green-500", spark: "text-green-500", trend: t?.tasksDone, change: c?.tasksDone },
    { label: "Withdrawals", value: `${formatPoints(totalWithdrawn)} TP`, href: "/user-dashboard/withdrawals", icon: Wallet, tone: "bg-blue-500/10 text-blue-500", spark: "text-blue-500", trend: t?.withdrawals, change: c?.withdrawals },
    { label: "Active Tasks", value: formatPoints(activeTasksCount), href: "/user-dashboard/tasks", icon: Upload, tone: "bg-purple-500/10 text-purple-500", spark: "text-purple-500", trend: t?.activeTasks, change: c?.activeTasks },
    { label: "TK Tokens", value: "0.00 TK", href: "#", icon: Coins, tone: "bg-orange-500/10 text-orange-500", spark: "text-orange-500", trend: undefined, change: undefined },
  ];

  return (
    <div className="flex min-h-screen bg-background text-foreground transition-colors duration-300">
      <UserSidebar />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <UserHeader />

        <main className="flex-1 overflow-y-auto pb-32 p-4 md:p-8">
          <div className="w-full max-w-[1400px] xl:max-w-[1600px] 2xl:max-w-[1800px] mx-auto space-y-6 md:space-y-8 animate-in fade-in duration-500">

            {/* Welcome */}
            <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl font-black tracking-tighter leading-none">
                  {getGreeting(userName || "User")}
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Here’s what’s happening with your account today.
                </p>
              </div>
              <Link
                href="/user-dashboard/gift-user"
                className="hidden md:inline-flex items-center gap-2 bg-green-500 text-white px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-green-600 transition-all shadow-lg shadow-green-500/20"
              >
                <Gift className="w-4 h-4" />
                Gift a Member
              </Link>
            </section>

            {/* Quick Stats with sparklines */}
            <section className="grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 gap-3 md:gap-4">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <Link
                    key={stat.label}
                    href={stat.href}
                    className="group bg-card border border-border rounded-2xl p-4 md:p-5 hover:border-primary/50 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-full ${stat.tone}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                          {stat.label}
                        </p>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    <div className="mt-4 flex items-end justify-between gap-3">
                      <div>
                        <p className="text-xl md:text-2xl font-black tracking-tighter">{stat.value}</p>
                        {typeof stat.change === "number" && (
                          <p className={`mt-1 text-xs font-bold ${stat.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                            {stat.change >= 0 ? "+" : ""}{stat.change}%{" "}
                            <span className="font-medium text-muted-foreground">this week</span>
                          </p>
                        )}
                      </div>
                      <div className="hidden sm:block">
                        <Sparkline data={stat.trend} className={stat.spark} />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </section>

             {/* Token launch banner */}
<section className="relative overflow-hidden rounded-xl border border-primary/20 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent px-4 py-3 sm:px-5 sm:py-3.5">
  <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/10 blur-2xl pointer-events-none" />
  
  <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-3">
    <div className="flex items-center gap-3">
      {/* Smaller icon container */}
      <div className="hidden sm:flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/15">
        <Sparkles className="h-4 w-4 text-primary" />
      </div>

      <div>
        <div className="flex items-center gap-2">
          <p className="text-[9px] font-black uppercase tracking-[0.18em] text-primary">
            TaskKash Token
          </p>
        </div>
        <h2 className="text-sm font-bold tracking-tight">
          Your Task Points are your stake in what’s coming.
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5 hidden sm:block">
          Keep completing tasks to grow your balance before the token launch.
        </p>
      </div>
    </div>

    {/* Slimmer button */}
    <Link
      href="/user-dashboard/overall-tasks"
      className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary px-3.5 py-1.5 text-[11px] font-black uppercase tracking-wider text-primary-foreground hover:opacity-90 transition-opacity shrink-0 self-start sm:self-auto"
    >
      Earn More TP <ArrowRight className="w-3.5 h-3.5" />
    </Link>
  </div>
</section>

            {/* Profile Completion Tracker (mobile) */}
            <div className="block lg:hidden w-full">
              <ProfileCompletionTracker />
            </div>

            {/* Featured Tasks + Categories */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">

              {/* Featured Tasks */}
              <section className="xl:col-span-2 bg-card border border-border rounded-2xl p-5 md:p-6">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <Flame className="w-5 h-5 text-orange-500" />
                    <div>
                      <h2 className="text-xs font-black uppercase tracking-[0.2em]">Featured Tasks</h2>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Complete tasks and earn rewards
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/user-dashboard/overall-tasks"
                    className="flex items-center gap-1 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
                  >
                    View All <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {featuredLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="rounded-xl border border-border p-4 animate-pulse">
                        <div className="h-5 w-24 bg-muted rounded-full mb-4" />
                        <div className="h-5 w-3/4 bg-muted rounded mb-6" />
                        <div className="h-10 w-full bg-muted rounded-lg" />
                      </div>
                    ))}
                  </div>
                ) : featuredTasks.length > 0 ? (
                  (() => {
                    const availableTasks = featuredTasks.filter(
                      task => task.userTaskStatus !== 'pending' && task.userTaskStatus !== 'approved'
                    );
                    
                    if (availableTasks.length === 0) {
                      return (
                        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-background/40 px-6 py-12 text-center">
                          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                            <CheckCircle2 className="h-7 w-7 text-green-500" />
                          </div>
                          <h3 className="mt-4 text-sm font-black tracking-tight">All featured tasks completed!</h3>
                          <p className="mt-1 max-w-xs text-xs text-muted-foreground">
                            You've submitted all featured tasks. Check back later for new ones.
                          </p>
                          <Link
                            href="/user-dashboard/overall-tasks"
                            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-xs font-black uppercase tracking-widest text-primary-foreground hover:opacity-90 transition-opacity"
                          >
                            Browse All Tasks <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      );
                    }
                    
                    return (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {availableTasks.slice(0, 6).map((task, index) => {
                          const styles = categoryStyles[task.category] || categoryStyles.social;
                          const CatIcon = categoryIcons[task.category] || Share2;
                          const isHot = index < 2;
                          const title = task.title.length > 40 ? `${task.title.slice(0, 40)}…` : task.title;

                          return (
                            <div
                              key={task._id}
                              onClick={() => handleTaskClick(task)}
                              className="group flex flex-col rounded-xl border border-border bg-background/50 p-4 hover:border-primary/40 hover:shadow-md transition-all cursor-pointer"
                            >
                              <div className="flex items-center justify-between">
                                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-widest ${styles.pill}`}>
                                  <CatIcon className="w-3 h-3" />
                                  {task.category}
                                </span>
                                <div className="flex items-center gap-1">
                                  {isHot && (
                                    <span className="rounded-full bg-orange-500/10 px-2 py-0.5 text-[10px] font-black text-orange-500">
                                      HOT
                                    </span>
                                  )}
                                  <button
                                    onClick={(e) => handleCopyTaskUrl(e, task)}
                                    className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                                    title="Copy task URL"
                                  >
                                    <Copy className="w-4 h-4 text-muted-foreground" />
                                  </button>
                                </div>
                              </div>

                              <h3 className="mt-3 text-sm font-bold leading-snug">{title}</h3>

                              <div className="mt-2 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                                {stripHtmlTags(task.instructions)}
                              </div>

                              <div className="mt-4 flex items-center justify-between">
                                <span className={`text-base font-black ${styles.text}`}>
                                  +{task.rewardPoints} TP
                                </span>
                              </div>

                              <button
                                className={`mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-foreground py-2.5 text-xs font-black uppercase tracking-widest text-background transition-all ${styles.btnHover} group-hover:text-white`}
                              >
                                Start Task <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-background/40 px-6 py-12 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                      <Inbox className="h-7 w-7 text-muted-foreground" />
                    </div>
                    <h3 className="mt-4 text-sm font-black tracking-tight">No featured tasks right now</h3>
                    <p className="mt-1 max-w-xs text-xs text-muted-foreground">
                      New tasks drop regularly. Check the full task list or explore a category to keep earning TP.
                    </p>
                    <Link
                      href="/user-dashboard/overall-tasks"
                      className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-xs font-black uppercase tracking-widest text-primary-foreground hover:opacity-90 transition-opacity"
                    >
                      Browse All Tasks <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}
              </section>

              {/* Task Categories */}
              <section className="bg-card border border-border rounded-2xl p-5 md:p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Folder className="w-5 h-5 text-primary" />
                  <h2 className="text-xs font-black uppercase tracking-[0.2em]">Task Categories</h2>
                </div>

                <div className="space-y-1">
                  {categoryList.map((cat) => {
                    const Icon = cat.icon;
                    return (
                      <Link
                        key={cat.name}
                        href={cat.href}
                        className="group flex items-center gap-3 rounded-xl border border-transparent p-3 hover:border-border hover:bg-background/60 transition-all"
                      >
                        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-105 ${cat.color}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-sm font-bold">{cat.name}</h3>
                          <p className="text-xs text-muted-foreground truncate">{cat.desc}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
                      </Link>
                    );
                  })}
                </div>
              </section>
            </div>

            {/* Analytics */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
              <EarningsOverview className="xl:col-span-2" earnings={analytics?.earnings} loading={analyticsLoading} />
              <TopEarners earners={analytics?.topEarners} loading={analyticsLoading} />
            </div>

            {/* Token Holders */}
            <TokenHolders data={holders} loading={analyticsLoading} />

            {/* Recent Activity */}
            <RecentActivity />
          </div>
        </main>
      </div>

      <TaskPreviewModal
        task={selectedTask}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
} 