"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import {
  LayoutDashboard,
  Users,
  Clock,
  Coins,
  Trophy,
  ShieldAlert,
  Sliders,
  FileText,
  Search,
  Menu,
  Settings,
  Download,
  TrendingUp,
  UserPlus,
  CheckCircle,
  Activity,
  Unlock,
  Hourglass,
  AlertTriangle,
  X,
  Twitter,
  Facebook,
  Linkedin,
  Mail,
  Filter,
  ChevronDown,
  Calendar,
  MoreHorizontal,
  Eye,
  Ban,
  ShieldCheck,
} from "lucide-react";

// Admin Components
import AdminHeader from "@/components/admin-dashboard/AdminHeader";
import AdminSidebar from "@/components/admin-dashboard/AdminSidebar";
import { AdminContentOnlySkeleton } from "@/components/ui/LoadingSkeleton";

// Types
interface ReferralStats {
  totalReferrals: number;
  newReferrals: number;
  qualified: number;
  pending: number;
  activeReferredUsers: number;
  unlockedRewards: number;
  pendingRewards: number;
  flagged: number; // Kept for future implementation
}

interface Referral {
  id: string;
  referrerId: string;
  referrerName: string;
  referredUserId: string;
  referredUserName: string;
  referredUserEmail: string;
  status: "qualified" | "pending";
  joinedDate: string;
  activeDays: number;
  tasksCompleted: number;
  rewardEarned: number;
  pendingReward: number;
}

export default function AdminReferralsPage() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [programActive, setProgramActive] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showToggleConfirm, setShowToggleConfirm] = useState(false);
  
  const [stats, setStats] = useState<ReferralStats>({
    totalReferrals: 0,
    newReferrals: 0,
    qualified: 0,
    pending: 0,
    activeReferredUsers: 0,
    unlockedRewards: 0,
    pendingRewards: 0,
    flagged: 0,
  });

  const [referrals, setReferrals] = useState<Referral[]>([]);

  useEffect(() => {
    const fetchReferralData = async () => {
      try {
        const response = await fetch('/api/admin/referrals');
        if (!response.ok) throw new Error('Failed to fetch referral data');
        
        const data = await response.json();
        setStats(data.stats);
        setReferrals(data.referrals);
      } catch (error) {
        console.error('Error fetching referral data:', error);
        toast.error('Failed to load referral data');
      } finally {
        setLoading(false);
      }
    };

    fetchReferralData();
  }, []);

  const toggleProgramState = () => {
    setProgramActive(!programActive);
    setShowToggleConfirm(false);
    toast.success(programActive ? "Referral program paused" : "Referral program activated");
  };

  const exportData = (format: "csv" | "json") => {
    try {
      if (format === "json") {
        const data = { stats, referrals };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `referral-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success('JSON data exported successfully');
      } else if (format === "csv") {
        const headers = ['Referrer ID', 'Referrer Name', 'Referred User ID', 'Referred User Name', 'Referred User Email', 'Status', 'Joined Date', 'Active Days', 'Tasks Completed', 'Reward Earned', 'Pending Reward'];
        const rows = referrals.map(r => [
          r.referrerId,
          r.referrerName,
          r.referredUserId,
          r.referredUserName,
          r.referredUserEmail,
          r.status,
          r.joinedDate,
          r.activeDays,
          r.tasksCompleted,
          r.rewardEarned,
          r.pendingReward
        ]);
        
        const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `referral-data-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success('CSV data exported successfully');
      }
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export data');
    }
  };

  const filteredReferrals = referrals.filter(referral =>
    referral.referrerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    referral.referredUserName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    referral.referredUserEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex bg-background text-foreground overflow-hidden">
        <AdminSidebar />
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <AdminHeader title="Referral Command Center" />
          <AdminContentOnlySkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-background text-foreground overflow-hidden">
      <AdminSidebar />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <AdminHeader title="Referral Command Center" />

        <main className="flex-1 overflow-y-auto p-4 pb-32 md:p-8 space-y-8">
          
          {/* Header Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
                Referral Overview
                <span className="text-xs font-normal text-muted-foreground bg-card px-2.5 py-1 rounded-lg border border-border">
                  Live Monitoring
                </span>
              </h1>
              <p className="text-xs text-muted-foreground mt-1">
                Monitor referral growth, qualification, rewards, and suspicious activity across TaskKash.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => exportData("csv")}
                className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 text-green-500 hover:bg-green-500/20 px-3 py-2 rounded-lg text-xs font-semibold transition"
              >
                <Download className="w-4 h-4" />
                Export Report
              </button>
            </div>
          </div>

        

          {/* Toggle Confirmation Modal */}
          <AnimatePresence>
            {showToggleConfirm && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/60 backdrop-blur-sm z-500"
                  onClick={() => setShowToggleConfirm(false)}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="fixed inset-0 z-500 flex items-center justify-center p-4"
                >
                  <div
                    className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md p-6"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h3 className="text-lg font-bold text-foreground mb-2">
                      {programActive ? "Pause Referral Program" : "Activate Referral Program"}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      {programActive
                        ? "Are you sure you want to pause the referral program? New referrals will not be processed until reactivated."
                        : "Are you sure you want to activate the referral program?"}
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowToggleConfirm(false)}
                        className="flex-1 px-4 py-2 rounded-xl bg-card border border-border text-foreground font-semibold hover:bg-secondary transition"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={toggleProgramState}
                        className={`flex-1 px-4 py-2 rounded-xl font-semibold transition ${
                          programActive
                            ? "bg-red-500 text-background hover:bg-red-600"
                            : "bg-green-500 text-background hover:bg-green-600"
                        }`}
                      >
                        {programActive ? "Pause Program" : "Activate Program"}
                      </button>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* TOP-LEVEL METRICS CARDS (Grid of 8) */}
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Referrals */}
            <div className="bg-card border border-border p-4 rounded-2xl hover:border-border/80 transition">
              <div className="flex items-center justify-between text-muted-foreground mb-2">
                <span className="text-xs font-semibold">Total Referrals</span>
                <Users className="w-4 h-4 text-purple-500" />
              </div>
              <div className="text-2xl font-black text-foreground">{stats.totalReferrals.toLocaleString()}</div>
              <div className="flex items-center gap-1.5 text-[11px] text-green-500 mt-2 font-medium">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+18.4%</span>
                <span className="text-muted-foreground font-normal">vs prev 30d</span>
              </div>
            </div>

            {/* New Referrals */}
            <div className="bg-card border border-border p-4 rounded-2xl hover:border-border/80 transition">
              <div className="flex items-center justify-between text-muted-foreground mb-2">
                <span className="text-xs font-semibold">New (30D)</span>
                <UserPlus className="w-4 h-4 text-sky-400" />
              </div>
              <div className="text-2xl font-black text-foreground">{stats.newReferrals.toLocaleString()}</div>
              <div className="flex items-center gap-1.5 text-[11px] text-green-500 mt-2 font-medium">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+12.1%</span>
                <span className="text-muted-foreground font-normal">vs prev 30d</span>
              </div>
            </div>

            {/* Qualified Referrals */}
            <div className="bg-card border border-border p-4 rounded-2xl hover:border-border/80 transition">
              <div className="flex items-center justify-between text-muted-foreground mb-2">
                <span className="text-xs font-semibold">Qualified</span>
                <CheckCircle className="w-4 h-4 text-green-500" />
              </div>
              <div className="text-2xl font-black text-green-500">{stats.qualified.toLocaleString()}</div>
              <div className="flex items-center gap-1.5 text-[11px] text-green-500 mt-2 font-medium">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+8.6%</span>
                <span className="text-muted-foreground font-normal">qualification rate</span>
              </div>
            </div>

            {/* Pending Referrals */}
            <div className="bg-card border border-border p-4 rounded-2xl hover:border-border/80 transition">
              <div className="flex items-center justify-between text-muted-foreground mb-2">
                <span className="text-xs font-semibold">Pending Qualification</span>
                <Clock className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-black text-amber-400">{stats.pending.toLocaleString()}</div>
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mt-2">
                <span>Avg. 4.2 days to qualify</span>
              </div>
            </div>

            {/* Active Referrals */}
            <div className="bg-card border border-border p-4 rounded-2xl hover:border-border/80 transition">
              <div className="flex items-center justify-between text-muted-foreground mb-2">
                <span className="text-xs font-semibold">Active Referred Users</span>
                <Activity className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-2xl font-black text-foreground">{stats.activeReferredUsers.toLocaleString()}</div>
              <div className="flex items-center gap-1.5 text-[11px] text-green-500 mt-2 font-medium">
                <span>78.6% Retained</span>
              </div>
            </div>

            {/* Unlocked Rewards */}
            <div className="bg-card border border-border p-4 rounded-2xl hover:border-border/80 transition">
              <div className="flex items-center justify-between text-muted-foreground mb-2">
                <span className="text-xs font-semibold">Unlocked Rewards</span>
                <Unlock className="w-4 h-4 text-green-500" />
              </div>
              <div className="text-2xl font-black text-green-500">
                {stats.unlockedRewards >= 1000000 
                  ? `${(stats.unlockedRewards / 1000000).toFixed(2)}M` 
                  : stats.unlockedRewards.toLocaleString()} <span className="text-xs">TP</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mt-2">
                <span>~${(stats.unlockedRewards / 100000).toFixed(0)} distributed</span>
              </div>
            </div>

            {/* Pending Rewards */}
            <div className="bg-card border border-border p-4 rounded-2xl hover:border-border/80 transition">
              <div className="flex items-center justify-between text-muted-foreground mb-2">
                <span className="text-xs font-semibold">Pending Rewards</span>
                <Hourglass className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-black text-amber-400">
                {stats.pendingRewards >= 1000000 
                  ? `${(stats.pendingRewards / 1000000).toFixed(2)}M` 
                  : stats.pendingRewards.toLocaleString()} <span className="text-xs">TP</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mt-2">
                <span>Held in qualification reserve</span>
              </div>
            </div>

            {/* Flagged Referrals */}
            <div className="bg-card border border-border p-4 rounded-2xl hover:border-red-500/50 transition">
              <div className="flex items-center justify-between text-muted-foreground mb-2">
                <span className="text-xs font-semibold text-red-500">Flagged / Suspicious</span>
                <AlertTriangle className="w-4 h-4 text-red-500" />
              </div>
              <div className="text-2xl font-black text-red-500">{stats.flagged}</div>
              <div className="flex items-center gap-1.5 text-[11px] text-red-500 mt-2 font-medium">
                <span>Requires review</span>
              </div>
            </div>
          </section>

          {/* Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Search user ID, username, referral ID, IP, device..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-background border border-border rounded-xl pl-9 pr-4 py-2 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:border-purple-500 transition"
              />
            </div>

            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 bg-card border border-border hover:bg-secondary px-3 py-2 rounded-xl text-xs font-semibold transition">
                <Filter className="w-4 h-4" />
                Filter
              </button>
              <button className="flex items-center gap-2 bg-card border border-border hover:bg-secondary px-3 py-2 rounded-xl text-xs font-semibold transition">
                <Calendar className="w-4 h-4" />
                Date Range
              </button>
            </div>
          </div>

          {/* Referrals Table */}
          <section className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground">Recent Referrals</h3>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{filteredReferrals.length} results</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-secondary/50 border-b border-border">
                    <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Referrer</th>
                    <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Referred User</th>
                    <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Status</th>
                    <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Joined</th>
                    <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Progress</th>
                    <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Rewards</th>
                    <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReferrals.map((referral) => (
                    <tr
                      key={referral.id}
                      className="border-b border-border hover:bg-secondary/30 transition"
                    >
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-foreground">{referral.referrerName}</div>
                        <div className="text-xs text-muted-foreground">{referral.referrerId}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-foreground">{referral.referredUserName}</div>
                        <div className="text-xs text-muted-foreground">{referral.referredUserEmail}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold ${
                            referral.status === "qualified"
                              ? "bg-green-500/10 text-green-500"
                              : "bg-amber-500/10 text-amber-500"
                          }`}
                        >
                          {referral.status === "qualified" && <CheckCircle className="w-3 h-3" />}
                          {referral.status === "pending" && <Clock className="w-3 h-3" />}
                          {referral.status.charAt(0).toUpperCase() + referral.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{referral.joinedDate}</td>
                      <td className="px-4 py-3">
                        <div className="text-xs text-muted-foreground">
                          {referral.activeDays} days • {referral.tasksCompleted} tasks
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-foreground">
                          {referral.rewardEarned > 0 ? `${referral.rewardEarned} TP` : "-"}
                        </div>
                        {referral.pendingReward > 0 && (
                          <div className="text-xs text-amber-400">{referral.pendingReward} TP pending</div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button className="p-1.5 rounded-lg hover:bg-secondary transition" title="View Details">
                            <Eye className="w-4 h-4 text-muted-foreground" />
                          </button>
                          <button className="p-1.5 rounded-lg hover:bg-red-500/10 transition" title="Flag/Ban">
                            <Ban className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredReferrals.length === 0 && (
              <div className="p-8 text-center text-sm text-muted-foreground">
                No referrals found matching your search criteria.
              </div>
            )}
          </section>

        </main>
      </div>
    </div>
  );
}