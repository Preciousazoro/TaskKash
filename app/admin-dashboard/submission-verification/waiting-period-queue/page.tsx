'use client';

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/admin-dashboard/AdminHeader";
import AdminSidebar from "@/components/admin-dashboard/AdminSidebar";
import { TimerReset, Coins, AlertTriangle, CheckCircle2, Clock, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Mock data - replace with actual API calls
const SUBMISSIONS = [
  {
    id: "SUB-001",
    user: { name: "John Doe", avatar: "JD" },
    campaignName: "Summer Brand Campaign",
    brandLogo: "👟",
    reward: 5000,
    holdStart: "2024-01-10",
    holdEnd: "2024-01-13",
    status: "waiting"
  },
  {
    id: "SUB-002",
    user: { name: "Jane Smith", avatar: "JS" },
    campaignName: "Product Launch Boost",
    brandLogo: "🍎",
    reward: 10000,
    holdStart: "2024-01-15",
    holdEnd: "2024-01-17",
    status: "waiting"
  },
  {
    id: "SUB-003",
    user: { name: "Bob Johnson", avatar: "BJ" },
    campaignName: "Community Growth",
    brandLogo: "🎮",
    reward: 2500,
    holdStart: "2024-01-12",
    holdEnd: "2024-01-16",
    status: "ready"
  },
  {
    id: "SUB-004",
    user: { name: "Alice Williams", avatar: "AW" },
    campaignName: "Brand Awareness",
    brandLogo: "🥤",
    reward: 7500,
    holdStart: "2024-01-08",
    holdEnd: "2024-01-10",
    status: "ready"
  },
  {
    id: "SUB-005",
    user: { name: "Charlie Brown", avatar: "CB" },
    campaignName: "Holiday Special",
    brandLogo: "📦",
    reward: 15000,
    holdStart: "2024-01-05",
    holdEnd: "2024-01-07",
    status: "ready"
  },
  {
    id: "SUB-006",
    user: { name: "Diana Prince", avatar: "DP" },
    campaignName: "Tech Review",
    brandLogo: "📱",
    reward: 8000,
    holdStart: "2024-01-01",
    holdEnd: "2024-01-04",
    status: "ready"
  }
];

const FILTERS = [
  { id: "all", label: "All" },
  { id: "ending_today", label: "Ending Today" },
  { id: "ending_week", label: "Ending This Week" },
  { id: "expired", label: "Ready / Expired Hold" },
  { id: "overdue", label: "Overdue" },
];

// Helper function to calculate days remaining
const daysRemaining = (holdEnd: string) => {
  const endDate = new Date(holdEnd);
  const today = new Date();
  const diffTime = endDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export default function WaitingPeriodQueuePage() {
  const router = useRouter();
  const [filter, setFilter] = useState("all");

  const waitingSubmissions = useMemo(
    () => SUBMISSIONS.filter((s) => s.status === "waiting" || s.status === "ready"),
    []
  );

  const filtered = useMemo(() => {
    return waitingSubmissions.filter((s) => {
      const days = daysRemaining(s.holdEnd);
      switch (filter) {
        case "ending_today": return days === 0;
        case "ending_week": return days >= 0 && days <= 7;
        case "expired": return days < 0;
        case "overdue": return days < -3;
        default: return true;
      }
    });
  }, [waitingSubmissions, filter]);

  const endingToday = waitingSubmissions.filter((s) => daysRemaining(s.holdEnd) === 0).length;
  const endingWeek = waitingSubmissions.filter((s) => { const d = daysRemaining(s.holdEnd); return d >= 0 && d <= 7; }).length;
  const ready = waitingSubmissions.filter((s) => daysRemaining(s.holdEnd) < 0).length;

  const getCountdownText = (holdEnd: string) => {
    const endDate = new Date(holdEnd);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffTime < 0) return "Hold complete";
    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground overflow-hidden">
      <AdminSidebar />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <AdminHeader />

        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-30">
          <div className="space-y-6">
            {/* HEADER */}
            <div>
              <h1 className="text-xl md:text-2xl font-black uppercase tracking-tighter leading-none">
                Waiting Period Queue
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Track delayed verification hold periods and countdowns.
              </p>
            </div>

            {/* STATS CARDS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-card border border-border">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 rounded-xl bg-purple-500/10">
                      <TimerReset className="w-5 h-5 text-purple-500" />
                    </div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      Live
                    </span>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-foreground mb-1">{waitingSubmissions.length}</p>
                    <h4 className="text-muted-foreground text-xs font-medium">In Hold Period</h4>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border border-border">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 rounded-xl bg-amber-500/10">
                      <AlertTriangle className="w-5 h-5 text-amber-500" />
                    </div>
                    <span className="text-[10px font-bold text-muted-foreground uppercase tracking-wider">
                      Live
                    </span>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-foreground mb-1">{endingToday}</p>
                    <h4 className="text-muted-foreground text-xs font-medium">Ending Today</h4>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border border-border">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 rounded-xl bg-blue-500/10">
                      <Clock className="w-5 h-5 text-blue-500" />
                    </div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      Live
                    </span>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-foreground mb-1">{endingWeek}</p>
                    <h4 className="text-muted-foreground text-xs font-medium">Ending This Week</h4>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border border-border">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 rounded-xl bg-green-500/10">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    </div>
                    <span className="text-[10px font-bold text-muted-foreground uppercase tracking-wider">
                      Live
                    </span>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-foreground mb-1">{ready}</p>
                    <h4 className="text-muted-foreground text-xs font-medium">Ready for Approval</h4>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* MAIN TABLE */}
            <Card className="bg-card border border-border overflow-hidden">
              <CardContent className="p-0">
                <div className="p-4 flex items-center gap-2 overflow-x-auto border-b border-border">
                  {FILTERS.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setFilter(f.id)}
                      className={`px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors border ${
                        filter === f.id
                          ? "bg-green-500 text-white border-green-500"
                          : "text-muted-foreground border-border hover:text-foreground hover:bg-muted/50"
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-[11px] uppercase tracking-wide text-muted-foreground border-b border-border">
                        <th className="px-4 py-3 font-semibold">User</th>
                        <th className="px-4 py-3 font-semibold">Campaign</th>
                        <th className="px-4 py-3 font-semibold">Reward</th>
                        <th className="px-4 py-3 font-semibold">Hold Started</th>
                        <th className="px-4 py-3 font-semibold">Hold Ends</th>
                        <th className="px-4 py-3 font-semibold">Days Remaining</th>
                        <th className="px-4 py-3 font-semibold">Countdown</th>
                        <th className="px-4 py-3 font-semibold">Status</th>
                        <th className="px-4 py-3 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((s) => {
                        const days = daysRemaining(s.holdEnd);
                        return (
                          <tr
                            key={s.id}
                            className="border-b border-border/60 hover:bg-muted/20 transition-colors cursor-pointer"
                            onClick={() => router.push(`/admin-dashboard/submission-verification/waiting-period-queue/${s.id}`)}
                          >
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-full bg-purple-500/10 text-purple-500 flex items-center justify-center text-[10px] font-bold shrink-0">
                                  {s.user.avatar}
                                </div>
                                <span className="font-medium text-foreground">{s.user.name}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <span className="text-base">{s.brandLogo}</span>
                                <span className="text-muted-foreground line-clamp-1 max-w-[180px]">{s.campaignName}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className="inline-flex items-center gap-1 font-semibold text-green-500">
                                <Coins size={12} /> {s.reward.toLocaleString()}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-muted-foreground text-xs">{s.holdStart}</td>
                            <td className="px-4 py-3 text-muted-foreground text-xs">{s.holdEnd}</td>
                            <td className="px-4 py-3">
                              <span className={`font-semibold ${
                                days < 0 
                                  ? "text-green-500" 
                                  : days <= 2 
                                    ? "text-amber-500" 
                                    : "text-muted-foreground"
                              }`}>
                                {days < 0 ? "Hold complete" : `${days} days`}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-xs text-muted-foreground font-mono">
                                {getCountdownText(s.holdEnd)}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <Badge
                                variant={s.status === "ready" ? "default" : "secondary"}
                              >
                                {s.status === "ready" ? "Ready For Final Approval" : "Waiting Period"}
                              </Badge>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <Button
                                variant="link"
                                size="sm"
                                onClick={(e) => { 
                                  e.stopPropagation(); 
                                  router.push(`/admin-dashboard/submission-verification/waiting-period-queue/${s.id}`);
                                }}
                                className="text-purple-500 hover:text-purple-600"
                              >
                                Review
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {filtered.length === 0 && (
                    <div className="text-center py-16 text-sm text-muted-foreground">
                      No submissions match this filter.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}