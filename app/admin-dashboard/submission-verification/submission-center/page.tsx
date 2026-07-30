'use client';

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/admin-dashboard/AdminHeader";
import AdminSidebar from "@/components/admin-dashboard/AdminSidebar";
import {
  Clock, TimerReset, CheckCircle2, XCircle, Zap, AlertOctagon, Ban, Send,
  Search, Coins, ArrowUpDown,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/Pagination";
import { toast } from "react-toastify";

const PAGE_SIZE = 8;

// Mock data - replace with actual API calls
const SUBMISSIONS = [
  {
    id: "SUB-001",
    user: { name: "John Doe", avatar: "JD" },
    campaignName: "Summer Brand Campaign",
    brandLogo: "👟",
    reward: 5000,
    verificationMode: "manual",
    submittedAt: "2024-01-15 10:30",
    status: "pending",
    reviewer: null,
    holdEnd: null
  },
  {
    id: "SUB-002",
    user: { name: "Jane Smith", avatar: "JS" },
    campaignName: "Product Launch Boost",
    brandLogo: "🍎",
    reward: 10000,
    verificationMode: "instant",
    submittedAt: "2024-01-14 15:45",
    status: "approved",
    reviewer: "Admin",
    holdEnd: null
  },
  {
    id: "SUB-003",
    user: { name: "Bob Johnson", avatar: "BJ" },
    campaignName: "Community Growth",
    brandLogo: "🎮",
    reward: 2500,
    verificationMode: "manual",
    submittedAt: "2024-01-13 09:15",
    status: "waiting",
    reviewer: null,
    holdEnd: "2024-01-16 09:15"
  },
  {
    id: "SUB-004",
    user: { name: "Alice Williams", avatar: "AW" },
    campaignName: "Brand Awareness",
    brandLogo: "🥤",
    reward: 7500,
    verificationMode: "hybrid",
    submittedAt: "2024-01-12 14:20",
    status: "rejected",
    reviewer: "Admin",
    holdEnd: null
  },
  {
    id: "SUB-005",
    user: { name: "Charlie Brown", avatar: "CB" },
    campaignName: "Holiday Special",
    brandLogo: "📦",
    reward: 15000,
    verificationMode: "instant",
    submittedAt: "2024-01-11 11:00",
    status: "auto_approved",
    reviewer: "System",
    holdEnd: null
  },
  {
    id: "SUB-006",
    user: { name: "Diana Prince", avatar: "DP" },
    campaignName: "Tech Review",
    brandLogo: "📱",
    reward: 8000,
    verificationMode: "manual",
    submittedAt: "2024-01-10 16:30",
    status: "expired",
    reviewer: null,
    holdEnd: null
  }
];

const SUBMISSION_STATUS = {
  pending: { label: "Pending Review", color: "secondary" },
  waiting: { label: "Waiting Period", color: "outline" },
  ready: { label: "Ready For Final Approval", color: "default" },
  approved: { label: "Approved", color: "default" },
  rejected: { label: "Rejected", color: "destructive" },
  auto_approved: { label: "Auto Approved", color: "default" },
  expired: { label: "Expired", color: "secondary" },
  cancelled: { label: "Cancelled", color: "secondary" },
};

const STAT_CONFIG = [
  { key: "pending", label: "Pending Review", icon: Clock, color: "#F59E0B" },
  { key: "waiting", label: "Waiting Period", icon: TimerReset, color: "#8B5CF6" },
  { key: "ready", label: "Ready For Final Approval", icon: CheckCircle2, color: "#3B82F6" },
  { key: "approved", label: "Approved", icon: CheckCircle2, color: "#00FFB2" },
  { key: "rejected", label: "Rejected", icon: XCircle, color: "#F87171" },
  { key: "auto_approved", label: "Auto Approved", icon: Zap, color: "#00FFB2" },
  { key: "expired", label: "Expired", icon: AlertOctagon, color: "#6B7280" },
  { key: "cancelled", label: "Cancelled", icon: Ban, color: "#6B7280" },
];

export default function SubmissionCenterPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [sortDir, setSortDir] = useState("desc");

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    SUBMISSIONS.forEach((s) => { c[s.status] = (c[s.status] || 0) + 1; });
    return c;
  }, []);

  const distributedTotal = SUBMISSIONS.filter((s) => ["approved", "auto_approved"].includes(s.status)).reduce((sum, s) => sum + s.reward, 0);

  const filtered = useMemo(() => {
    let list = SUBMISSIONS.filter((s) => {
      const matchesSearch =
        !search ||
        s.user.name.toLowerCase().includes(search.toLowerCase()) ||
        s.campaignName.toLowerCase().includes(search.toLowerCase()) ||
        s.id.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || s.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
    list = [...list].sort((a, b) => {
      const av = new Date(a.submittedAt), bv = new Date(b.submittedAt);
      return sortDir === "asc" ? av.getTime() - bv.getTime() : bv.getTime() - av.getTime();
    });
    return list;
  }, [search, statusFilter, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const getStatusBadge = (status: string) => {
    const meta = SUBMISSION_STATUS[status as keyof typeof SUBMISSION_STATUS];
    const variant = status === "approved" || status === "auto_approved" ? "default" :
                    status === "rejected" ? "destructive" :
                    status === "waiting" ? "outline" : "secondary";
    return <Badge variant={variant}>{meta?.label || status}</Badge>;
  };

  const getVerificationModeBadge = (mode: string) => {
    const colors: Record<string, string> = {
      manual: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      instant: "bg-green-500/10 text-green-500 border-green-500/20",
      hybrid: "bg-purple-500/10 text-purple-500 border-purple-500/20"
    };
    return (
      <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${colors[mode] || colors.manual}`}>
        {mode.charAt(0).toUpperCase() + mode.slice(1)}
      </span>
    );
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground overflow-hidden">
      <AdminSidebar />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <AdminHeader />

        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-30">
          <div className="space-y-6">
            {/* HEADER */}
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-xl md:text-2xl font-black uppercase tracking-tighter leading-none">
                  Submission Center
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Review, verify, and manage user submissions.
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm bg-card border border-border rounded-xl px-4 py-2.5">
                <Send size={14} className="text-green-500" />
                <span className="text-muted-foreground">Rewards Distributed:</span>
                <span className="font-bold text-green-500">{distributedTotal.toLocaleString()} TP</span>
              </div>
            </div>

            {/* STATS CARDS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {STAT_CONFIG.map((s, i) => (
                <Card key={s.key} className="bg-card border border-border">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 rounded-xl" style={{ backgroundColor: `${s.color}20`, color: s.color }}>
                        <s.icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                        Live
                      </span>
                    </div>
                    <div>
                      <p className="text-xl font-bold text-foreground mb-1">{counts[s.key] || 0}</p>
                      <h4 className="text-muted-foreground text-xs font-medium">{s.label}</h4>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* METRICS CARDS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-card border border-border">
                <CardContent className="p-4">
                  <div className="text-[11px] text-muted-foreground mb-1">Rewards Distributed</div>
                  <div className="text-xl font-bold text-green-500">{distributedTotal.toLocaleString()} TP</div>
                </CardContent>
              </Card>
              <Card className="bg-card border border-border">
                <CardContent className="p-4">
                  <div className="text-[11px] text-muted-foreground mb-1">Average Review Time</div>
                  <div className="text-xl font-bold text-foreground">6.2 hrs</div>
                </CardContent>
              </Card>
              <Card className="bg-card border border-border">
                <CardContent className="p-4">
                  <div className="text-[11px] text-muted-foreground mb-1">Approval Rate</div>
                  <div className="text-xl font-bold text-green-500">87%</div>
                </CardContent>
              </Card>
              <Card className="bg-card border border-border">
                <CardContent className="p-4">
                  <div className="text-[11px] text-muted-foreground mb-1">Total Submissions</div>
                  <div className="text-xl font-bold text-foreground">{SUBMISSIONS.length}</div>
                </CardContent>
              </Card>
            </div>

            {/* MAIN TABLE */}
            <Card className="bg-card border border-border overflow-hidden">
              <CardContent className="p-0">
                <div className="p-4 flex flex-col md:flex-row md:items-center gap-3 border-b border-border">
                  <div className="relative flex-1 max-w-sm">
                    <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      value={search}
                      onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                      placeholder="Search by user, campaign, or ID..."
                      className="w-full bg-muted/30 border border-border rounded-xl pl-9 pr-4 py-2.5 text-sm placeholder:text-muted-foreground focus:border-green-500/40 focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="flex items-center gap-2 overflow-x-auto">
                    {["all", ...Object.keys(SUBMISSION_STATUS)].map((s) => (
                      <button
                        key={s}
                        onClick={() => { setStatusFilter(s); setPage(1); }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors border ${
                          statusFilter === s
                            ? "bg-green-500 text-white border-green-500"
                            : "text-muted-foreground border-border hover:text-foreground hover:bg-muted/50"
                        }`}
                      >
                        {s === "all" ? "All" : SUBMISSION_STATUS[s as keyof typeof SUBMISSION_STATUS].label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-[11px] uppercase tracking-wide text-muted-foreground border-b border-border">
                        <th className="px-4 py-3 font-semibold">Submission ID</th>
                        <th className="px-4 py-3 font-semibold">User</th>
                        <th className="px-4 py-3 font-semibold">Campaign</th>
                        <th className="px-4 py-3 font-semibold">Reward</th>
                        <th className="px-4 py-3 font-semibold">Mode</th>
                        <th className="px-4 py-3 font-semibold cursor-pointer" onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}>
                          <span className="inline-flex items-center gap-1">Submitted <ArrowUpDown size={10} /></span>
                        </th>
                        <th className="px-4 py-3 font-semibold">Status</th>
                        <th className="px-4 py-3 font-semibold">Reviewer</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pageItems.map((s) => {
                        return (
                          <tr
                            key={s.id}
                            className="border-b border-border/60 hover:bg-muted/20 transition-colors cursor-pointer"
                            onClick={() => router.push(`/admin-dashboard/submission-verification/submission-center/${s.id}`)}
                          >
                            <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{s.id}</td>
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
                            <td className="px-4 py-3">{getVerificationModeBadge(s.verificationMode)}</td>
                            <td className="px-4 py-3 text-muted-foreground text-xs">{s.submittedAt}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                {getStatusBadge(s.status)}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-muted-foreground text-xs">{s.reviewer || "—"}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {pageItems.length === 0 && (
                    <div className="text-center py-16 text-sm text-muted-foreground">
                      No submissions match your filters.
                    </div>
                  )}
                </div>

                <div className="p-4 border-t border-border">
                  <Pagination
                    currentPage={page}
                    totalItems={filtered.length}
                    itemsPerPage={PAGE_SIZE}
                    onPageChange={setPage}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}