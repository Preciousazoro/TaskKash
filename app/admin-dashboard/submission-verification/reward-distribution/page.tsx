'use client';

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/admin-dashboard/AdminHeader";
import AdminSidebar from "@/components/admin-dashboard/AdminSidebar";
import { Coins, Send, CheckCircle2, XCircle, RotateCcw, Search, Hash } from "lucide-react";
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
    status: "approved",
    submittedAt: "2024-01-15 10:30"
  },
  {
    id: "SUB-002",
    user: { name: "Jane Smith", avatar: "JS" },
    campaignName: "Product Launch Boost",
    brandLogo: "🍎",
    reward: 10000,
    status: "auto_approved",
    submittedAt: "2024-01-14 15:45"
  },
  {
    id: "SUB-003",
    user: { name: "Bob Johnson", avatar: "BJ" },
    campaignName: "Community Growth",
    brandLogo: "🎮",
    reward: 2500,
    status: "ready",
    submittedAt: "2024-01-13 09:15"
  },
  {
    id: "SUB-004",
    user: { name: "Alice Williams", avatar: "AW" },
    campaignName: "Brand Awareness",
    brandLogo: "🥤",
    reward: 7500,
    status: "pending",
    submittedAt: "2024-01-12 14:20"
  },
  {
    id: "SUB-005",
    user: { name: "Charlie Brown", avatar: "CB" },
    campaignName: "Holiday Special",
    brandLogo: "📦",
    reward: 15000,
    status: "approved",
    submittedAt: "2024-01-11 11:00"
  },
  {
    id: "SUB-006",
    user: { name: "Diana Prince", avatar: "DP" },
    campaignName: "Tech Review",
    brandLogo: "📱",
    reward: 8000,
    status: "waiting",
    submittedAt: "2024-01-10 16:30"
  },
  {
    id: "SUB-007",
    user: { name: "Eve Davis", avatar: "ED" },
    campaignName: "Social Media Boost",
    brandLogo: "📱",
    reward: 12000,
    status: "rejected",
    submittedAt: "2024-01-09 08:00"
  },
  {
    id: "SUB-008",
    user: { name: "Frank Miller", avatar: "FM" },
    campaignName: "Brand Loyalty",
    brandLogo: "🎯",
    reward: 6000,
    status: "approved",
    submittedAt: "2024-01-08 12:30"
  }
];

const DISTRIBUTION_STATUS = {
  pending: { label: "Pending", color: "secondary" },
  approved: { label: "Approved", color: "default" },
  distributed: { label: "Distributed", color: "default" },
  failed: { label: "Failed", color: "destructive" },
};

interface DistributionRecord {
  id: string;
  user: { name: string; avatar: string };
  campaignName: string;
  brandLogo: string;
  reward: number;
  status: "pending" | "approved" | "distributed" | "failed";
  txId: string | null;
  date: string;
}

// Derive distribution records from submissions
function deriveDistributions(): DistributionRecord[] {
  return SUBMISSIONS.map((s) => {
    let distStatus: "pending" | "approved" | "distributed" | "failed" = "pending";
    if (s.status === "approved" || s.status === "auto_approved") distStatus = "distributed";
    else if (s.status === "ready") distStatus = "approved";
    else if (s.status === "rejected" || s.status === "cancelled" || s.status === "expired") return null as any;
    else if (s.status === "pending" || s.status === "waiting") distStatus = "pending";

    // simulate a rare failed distribution for realism
    const failed = s.id === "SUB-003";

    return {
      id: s.id,
      user: s.user,
      campaignName: s.campaignName,
      brandLogo: s.brandLogo,
      reward: s.reward,
      status: failed ? "failed" : distStatus,
      txId: distStatus === "distributed" && !failed ? `TP-${s.id.slice(4)}-${Math.random().toString(36).slice(2, 8)}` : null,
      date: s.submittedAt,
    };
  }).filter(Boolean) as DistributionRecord[];
}

export default function RewardDistributionPage() {
  const router = useRouter();
  const [records, setRecords] = useState<DistributionRecord[]>(deriveDistributions);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const pending = records.filter((r) => r.status === "pending").reduce((s, r) => s + r.reward, 0);
  const approved = records.filter((r) => r.status === "approved").reduce((s, r) => s + r.reward, 0);
  const distributed = records.filter((r) => r.status === "distributed").reduce((s, r) => s + r.reward, 0);
  const failed = records.filter((r) => r.status === "failed").length;

  const filtered = useMemo(() => {
    return records.filter((r) => {
      const matchesStatus = statusFilter === "all" || r.status === statusFilter;
      const matchesSearch = !search || r.user.name.toLowerCase().includes(search.toLowerCase()) || r.campaignName.toLowerCase().includes(search.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [records, statusFilter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const retryDistribution = (record: DistributionRecord) => {
    setRecords((prev) => prev.map((r) => r.id === record.id ? { ...r, status: "distributed", txId: `TP-${r.id.slice(4)}-${Math.random().toString(36).slice(2, 8)}` } : r));
    toast.success(`Retried distribution for ${record.id}. Now distributed.`);
  };

  const getStatusBadge = (status: string) => {
    const meta = DISTRIBUTION_STATUS[status as keyof typeof DISTRIBUTION_STATUS];
    const variant = status === "distributed" ? "default" :
                    status === "failed" ? "destructive" :
                    status === "approved" ? "default" : "secondary";
    return <Badge variant={variant}>{meta?.label || status}</Badge>;
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
                Reward Distribution
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Track Task Point payouts across all campaigns.
              </p>
            </div>

            {/* STATS CARDS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-card border border-border">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 rounded-xl bg-amber-500/10">
                      <Coins className="w-5 h-5 text-amber-500" />
                    </div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      Live
                    </span>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-foreground mb-1">{pending.toLocaleString()} TP</p>
                    <h4 className="text-muted-foreground text-xs font-medium">Pending Rewards</h4>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border border-border">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 rounded-xl bg-blue-500/10">
                      <CheckCircle2 className="w-5 h-5 text-blue-500" />
                    </div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      Live
                    </span>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-foreground mb-1">{approved.toLocaleString()} TP</p>
                    <h4 className="text-muted-foreground text-xs font-medium">Approved Rewards</h4>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border border-border">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 rounded-xl bg-green-500/10">
                      <Send className="w-5 h-5 text-green-500" />
                    </div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      Live
                    </span>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-foreground mb-1">{distributed.toLocaleString()} TP</p>
                    <h4 className="text-muted-foreground text-xs font-medium">Distributed Rewards</h4>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border border-border">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 rounded-xl bg-red-500/10">
                      <XCircle className="w-5 h-5 text-red-500" />
                    </div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      Live
                    </span>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-foreground mb-1">{failed}</p>
                    <h4 className="text-muted-foreground text-xs font-medium">Failed Distributions</h4>
                  </div>
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
                      placeholder="Search by user or campaign..."
                      className="w-full bg-muted/30 border border-border rounded-xl pl-9 pr-4 py-2.5 text-sm placeholder:text-muted-foreground focus:border-green-500/40 focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="flex items-center gap-2 overflow-x-auto">
                    {["all", ...Object.keys(DISTRIBUTION_STATUS)].map((s) => (
                      <button
                        key={s}
                        onClick={() => { setStatusFilter(s); setPage(1); }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors border ${
                          statusFilter === s
                            ? "bg-green-500 text-white border-green-500"
                            : "text-muted-foreground border-border hover:text-foreground hover:bg-muted/50"
                        }`}
                      >
                        {s === "all" ? "All" : DISTRIBUTION_STATUS[s as keyof typeof DISTRIBUTION_STATUS].label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-[11px] uppercase tracking-wide text-muted-foreground border-b border-border">
                        <th className="px-4 py-3 font-semibold">Submission</th>
                        <th className="px-4 py-3 font-semibold">User</th>
                        <th className="px-4 py-3 font-semibold">Campaign</th>
                        <th className="px-4 py-3 font-semibold">Amount</th>
                        <th className="px-4 py-3 font-semibold">Transaction ID</th>
                        <th className="px-4 py-3 font-semibold">Status</th>
                        <th className="px-4 py-3 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pageItems.map((r) => {
                        return (
                          <tr
                            key={r.id}
                            className="border-b border-border/60 hover:bg-muted/20 transition-colors cursor-pointer"
                            onClick={() => router.push(`/admin-dashboard/submission-verification/reward-distribution/${r.id}`)}
                          >
                            <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{r.id}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-full bg-purple-500/10 text-purple-500 flex items-center justify-center text-[10px] font-bold shrink-0">
                                  {r.user.avatar}
                                </div>
                                <span className="font-medium text-foreground">{r.user.name}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <span className="text-base">{r.brandLogo}</span>
                                <span className="text-muted-foreground line-clamp-1 max-w-[160px]">{r.campaignName}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className="inline-flex items-center gap-1 font-semibold text-green-500">
                                <Coins size={12} /> {r.reward.toLocaleString()}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              {r.txId ? (
                                <span className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground">
                                  <Hash size={11} /> {r.txId}
                                </span>
                              ) : (
                                <span className="text-muted-foreground text-xs">—</span>
                              )}
                            </td>
                            <td className="px-4 py-3">{getStatusBadge(r.status)}</td>
                            <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                              {r.status === "failed" ? (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => retryDistribution(r)}
                                  className="text-xs"
                                >
                                  <RotateCcw className="w-3 h-3 mr-1" />
                                  Retry
                                </Button>
                              ) : (
                                <span className="text-muted-foreground text-xs">—</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {pageItems.length === 0 && (
                    <div className="text-center py-16 text-sm text-muted-foreground">
                      No distribution records match your filters.
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