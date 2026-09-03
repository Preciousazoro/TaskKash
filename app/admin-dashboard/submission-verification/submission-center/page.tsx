'use client';

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/admin-dashboard/AdminHeader";
import AdminSidebar from "@/components/admin-dashboard/AdminSidebar";
import {
  Clock, TimerReset, CheckCircle2, XCircle, Zap, AlertOctagon, Ban, Send,
  Search, Coins, ArrowUpDown, CheckCircle, Eye, Loader2, Layers,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/Pagination";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

const PAGE_SIZE = 8;

const SUBMISSION_STATUS = {
  pending: { label: "Pending Review", color: "secondary" },
  approved: { label: "Approved", color: "default" },
  rejected: { label: "Rejected", color: "destructive" },
};

const STAT_CONFIG = [
  { key: "pending", label: "Pending Review", icon: Clock, color: "#F59E0B" },
  { key: "approved", label: "Approved", icon: CheckCircle2, color: "#22c55e" },
  { key: "rejected", label: "Rejected", icon: XCircle, color: "ef4444" },
];

export default function SubmissionCenterPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [sortDir, setSortDir] = useState("desc");
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [selectedSubmission, setSelectedSubmission] = useState<any | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [reviewNotes, setReviewNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch submissions from API
  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setIsLoading(true);
        const statusParam = statusFilter === 'all' ? '' : `&status=${statusFilter}`;
        const response = await fetch(`/api/admin/marketplace-submissions?page=${page}&limit=${PAGE_SIZE}${statusParam}`);
        const data = await response.json();
        
        if (data.submissions) {
          setSubmissions(data.submissions);
          setTotal(data.pagination?.total || 0);
        }
      } catch (error) {
        console.error('Error fetching submissions:', error);
        toast.error('Failed to load submissions');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubmissions();
  }, [page, statusFilter]);

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    submissions.forEach((s) => { c[s.status] = (c[s.status] || 0) + 1; });
    return c;
  }, [submissions]);

  const distributedTotal = submissions.filter((s) => ["approved"].includes(s.status)).reduce((sum, s) => sum + (s.rewardAmount || 0), 0);

  const filtered = useMemo(() => {
    let list = submissions.filter((s) => {
      const matchesSearch =
        !search ||
        s.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
        s.campaign?.name?.toLowerCase().includes(search.toLowerCase()) ||
        s._id?.toString().toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || s.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
    list = [...list].sort((a, b) => {
      const av = new Date(a.createdAt), bv = new Date(b.createdAt);
      return sortDir === "asc" ? av.getTime() - bv.getTime() : bv.getTime() - av.getTime();
    });
    return list;
  }, [submissions, search, statusFilter, sortDir]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const pageItems = filtered;

  const getStatusBadge = (status: string) => {
    const meta = SUBMISSION_STATUS[status as keyof typeof SUBMISSION_STATUS];
    const variant = status === "approved" || status === "auto_approved" ? "default" :
                    status === "rejected" ? "destructive" :
                    status === "waiting" ? "outline" : "secondary";
    return <Badge variant={variant}>{meta?.label || status}</Badge>;
  };

  const handleView = (submission: any) => {
    setSelectedSubmission(submission);
    setShowViewModal(true);
  };

  const handleApprove = (submission: any) => {
    setSelectedSubmission(submission);
    setShowApproveModal(true);
  };

  const handleReject = (submission: any) => {
    setSelectedSubmission(submission);
    setShowRejectModal(true);
    setReviewNotes('');
  };

  const confirmApprove = async () => {
    if (!selectedSubmission) return;
    
    setIsProcessing(true);
    try {
      const response = await fetch('/api/admin/marketplace-submissions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissionId: selectedSubmission._id,
          status: 'approved',
          reviewNotes: ''
        })
      });
      
      const data = await response.json();
      if (data.success) {
        toast.success(`Submission approved! ${data.awardedPoints} TP credited to user`);
        setShowApproveModal(false);
        // Refresh submissions
        const statusParam = statusFilter === 'all' ? '' : `&status=${statusFilter}`;
        const refreshResponse = await fetch(`/api/admin/marketplace-submissions?page=${page}&limit=${PAGE_SIZE}${statusParam}`);
        const refreshData = await refreshResponse.json();
        if (refreshData.submissions) {
          setSubmissions(refreshData.submissions);
          setTotal(refreshData.pagination?.total || 0);
        }
      } else {
        toast.error(data.error || 'Failed to approve submission');
      }
    } catch (error) {
      console.error('Error approving submission:', error);
      toast.error('Failed to approve submission');
    } finally {
      setIsProcessing(false);
    }
  };

  const confirmReject = async () => {
    if (!selectedSubmission) return;
    
    setIsProcessing(true);
    try {
      const response = await fetch('/api/admin/marketplace-submissions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissionId: selectedSubmission._id,
          status: 'rejected',
          reviewNotes
        })
      });
      
      const data = await response.json();
      if (data.success) {
        toast.success('Submission rejected successfully');
        setShowRejectModal(false);
        setReviewNotes('');
        // Refresh submissions
        const statusParam = statusFilter === 'all' ? '' : `&status=${statusFilter}`;
        const refreshResponse = await fetch(`/api/admin/marketplace-submissions?page=${page}&limit=${PAGE_SIZE}${statusParam}`);
        const refreshData = await refreshResponse.json();
        if (refreshData.submissions) {
          setSubmissions(refreshData.submissions);
          setTotal(refreshData.pagination?.total || 0);
        }
      } else {
        toast.error(data.error || 'Failed to reject submission');
      }
    } catch (error) {
      console.error('Error rejecting submission:', error);
      toast.error('Failed to reject submission');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
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

            {/* STATS CARDS - Matching Admin Dashboard Style */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {STAT_CONFIG.map((s, i) => (
                <Card key={s.key} className="bg-card border border-border shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="px-5 py-3">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-2 rounded-xl`} style={{ backgroundColor: `${s.color}20`, color: s.color }}>
                        <s.icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Live</span>
                    </div>
                    <div>
                      <p className="text-xl font-bold text-foreground mb-1">{counts[s.key] || 0}</p>
                      <h4 className="text-muted-foreground text-xs font-medium">{s.label}</h4>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* METRICS CARDS - Matching Admin Dashboard Style */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-card border border-border shadow-sm">
                <CardContent className="p-4">
                  <div className="text-[11px] text-muted-foreground mb-1">Rewards Distributed</div>
                  <div className="text-xl font-bold text-green-500">{distributedTotal.toLocaleString()} TP</div>
                </CardContent>
              </Card>
              <Card className="bg-card border border-border shadow-sm">
                <CardContent className="p-4">
                  <div className="text-[11px] text-muted-foreground mb-1">Total Submissions</div>
                  <div className="text-xl font-bold text-foreground">{total}</div>
                </CardContent>
              </Card>
              <Card className="bg-card border border-border shadow-sm">
                <CardContent className="p-4">
                  <div className="text-[11px] text-muted-foreground mb-1">Approval Rate</div>
                  <div className="text-xl font-bold text-green-500">
                    {total > 0 ? Math.round((counts.approved || 0) / total * 100) : 0}%
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-card border border-border shadow-sm">
                <CardContent className="p-4">
                  <div className="text-[11px] text-muted-foreground mb-1">Pending Review</div>
                  <div className="text-xl font-bold text-amber-500">{counts.pending || 0}</div>
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
                  {isLoading ? (
                    <div className="flex items-center justify-center py-16">
                      <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-[11px] uppercase tracking-wide text-muted-foreground border-b border-border">
                          <th className="px-4 py-3 font-semibold">Submission ID</th>
                          <th className="px-4 py-3 font-semibold">User</th>
                          <th className="px-4 py-3 font-semibold">Campaign</th>
                          <th className="px-4 py-3 font-semibold">Reward</th>
                          <th className="px-4 py-3 font-semibold cursor-pointer" onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}>
                            <span className="inline-flex items-center gap-1">Submitted <ArrowUpDown size={10} /></span>
                          </th>
                          <th className="px-4 py-3 font-semibold">Status</th>
                          <th className="px-4 py-3 font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pageItems.map((s) => {
                          return (
                            <tr
                              key={s._id}
                              className="border-b border-border/60 hover:bg-muted/20 transition-colors"
                            >
                              <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{s._id?.toString().slice(-8)}</td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2.5">
                                  {s.user?.avatarUrl ? (
                                    <img 
                                      src={s.user.avatarUrl} 
                                      alt={s.user.name} 
                                      className="w-7 h-7 rounded-full object-cover border-2 border-background"
                                      onError={(e) => {
                                        e.currentTarget.src = "https://github.com/shadcn.png";
                                      }}
                                    />
                                  ) : (
                                    <div className="w-7 h-7 rounded-full bg-purple-500/10 text-purple-500 flex items-center justify-center text-[10px] font-bold shrink-0">
                                      {s.user?.name?.charAt(0) || 'U'}
                                    </div>
                                  )}
                                  <span className="font-medium text-foreground">{s.user?.name || 'Unknown'}</span>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  <span className="text-base">{s.campaign?.brandLogo || '🏆'}</span>
                                  <span className="text-muted-foreground line-clamp-1 max-w-[180px]">{s.campaign?.name || 'Unknown Campaign'}</span>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <span className="inline-flex items-center gap-1 font-semibold text-green-500">
                                  <Coins size={12} /> {s.rewardAmount?.toLocaleString() || 0}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-muted-foreground text-xs">
                                {new Date(s.createdAt).toLocaleDateString()}
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  {getStatusBadge(s.status)}
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleView(s); }}
                                    className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-colors"
                                    title="View Details"
                                  >
                                    <Eye size={14} />
                                  </button>
                                  {s.status === 'pending' && (
                                    <>
                                      <button
                                        onClick={(e) => { e.stopPropagation(); handleApprove(s); }}
                                        className="p-1.5 rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500/20 transition-colors"
                                        title="Approve"
                                      >
                                        <CheckCircle size={14} />
                                      </button>
                                      <button
                                        onClick={(e) => { e.stopPropagation(); handleReject(s); }}
                                        className="p-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                                        title="Reject"
                                      >
                                        <XCircle size={14} />
                                      </button>
                                    </>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                  {!isLoading && pageItems.length === 0 && (
                    <div className="text-center py-16 text-sm text-muted-foreground">
                      No submissions match your filters.
                    </div>
                  )}
                </div>

                <div className="p-4 border-t border-border">
                  <Pagination
                    currentPage={page}
                    totalItems={total}
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

    {/* View Modal */}
    <AnimatePresence>
      {showViewModal && selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowViewModal(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-card border border-border rounded-2xl overflow-hidden shadow-2xl z-10 max-h-[90vh] flex flex-col"
          >
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h3 className="text-lg font-bold">Submission Details</h3>
              <button
                onClick={() => setShowViewModal(false)}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <XCircle size={20} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-muted-foreground block mb-1">User</span>
                  <span className="font-medium">{selectedSubmission.user?.name}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block mb-1">Email</span>
                  <span className="font-medium">{selectedSubmission.user?.email}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block mb-1">Campaign</span>
                  <span className="font-medium">{selectedSubmission.campaign?.name}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block mb-1">Brand</span>
                  <span className="font-medium">{selectedSubmission.campaign?.brandName}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block mb-1">Reward Amount</span>
                  <span className="font-medium text-green-500">{selectedSubmission.rewardAmount?.toLocaleString()} TP</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block mb-1">Status</span>
                  <span>{getStatusBadge(selectedSubmission.status)}</span>
                </div>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block mb-2">Submission Data</span>
                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  {Object.entries(selectedSubmission.submissionData || {}).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-start">
                      <span className="text-sm font-medium">{key}:</span>
                      <span className="text-sm text-muted-foreground break-all max-w-[200px]">{value as string}</span>
                    </div>
                  ))}
                </div>
              </div>
              {selectedSubmission.reviewNotes && (
                <div>
                  <span className="text-xs text-muted-foreground block mb-1">Review Notes</span>
                  <p className="text-sm">{selectedSubmission.reviewNotes}</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>

    {/* Approve Confirmation Modal */}
    <AnimatePresence>
      {showApproveModal && selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowApproveModal(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-card border border-border rounded-2xl overflow-hidden shadow-2xl z-10"
          >
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-full bg-green-500/20 text-green-500">
                  <CheckCircle size={24} />
                </div>
                <h3 className="text-lg font-bold">Approve Submission</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                Are you sure you want to approve this submission? This will credit <span className="font-bold text-green-500">{selectedSubmission.rewardAmount?.toLocaleString()} TP</span> to {selectedSubmission.user?.name}.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowApproveModal(false)}
                  disabled={isProcessing}
                  className="flex-1 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmApprove}
                  disabled={isProcessing}
                  className="flex-1 px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isProcessing ? <Loader2 size={16} className="animate-spin" /> : 'Approve'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>

    {/* Reject Confirmation Modal */}
    <AnimatePresence>
      {showRejectModal && selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowRejectModal(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-card border border-border rounded-2xl overflow-hidden shadow-2xl z-10"
          >
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-full bg-red-500/20 text-red-500">
                  <XCircle size={24} />
                </div>
                <h3 className="text-lg font-bold">Reject Submission</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Are you sure you want to reject this submission? No points will be credited to {selectedSubmission.user?.name}.
              </p>
              <div className="mb-4">
                <label className="text-xs font-medium block mb-2">Review Notes (Optional)</label>
                <textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Add a reason for rejection..."
                  className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500/40 resize-none"
                  rows={3}
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowRejectModal(false)}
                  disabled={isProcessing}
                  className="flex-1 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmReject}
                  disabled={isProcessing}
                  className="flex-1 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isProcessing ? <Loader2 size={16} className="animate-spin" /> : 'Reject'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
    </>
  );
}