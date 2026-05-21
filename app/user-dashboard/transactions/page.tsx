"use client";

import React, { useState, useEffect } from "react";
import {
  ArrowUpRight,
  RefreshCcw,
  Filter,
  Download,
  Search,
  ChevronRight,
  ChevronLeft,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  Gift,
  TrendingUp,
  ArrowDownCircle,
  Building2,
  Wallet,
  ShoppingCart,
  ArrowUp,
  Loader2,
} from "lucide-react";
import { toast } from 'react-toastify';

// Navigation Imports
import UserSidebar from "@/components/user-dashboard/UserSidebar";
import UserHeader from "@/components/user-dashboard/UserHeader";
import TransactionCard, { Transaction, TransactionType } from "@/components/transactions/TransactionCard";
import WithdrawalCard, { Withdrawal } from "@/components/withdrawal/WithdrawalCard";
import { ContentOnlySkeleton } from "@/components/ui/LoadingSkeleton";
import WithdrawalModal from "@/components/withdrawal/WithdrawalModal";
import UserNav from "@/components/user-dashboard/UserNav";

// ─── Types ─────────────────────────────────────────────────────────────

type UnifiedTransactionType = "transaction" | "withdrawal";
type TransactionFilterType = "all" | "withdrawal" | "daily_login";

interface UnifiedTransaction {
  id: string;
  type: UnifiedTransactionType;
  transactionType?: TransactionType;
  amount: number;
  method: string;
  status: string;
  date: string;
  timestamp: string;
  rawData?: any;
}

const ITEMS_PER_PAGE = 50;

export default function TransactionsPage() {
  const [filterType, setFilterType] = useState<TransactionFilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [taskPoints, setTaskPoints] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [transactionsLoading, setTransactionsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [unifiedTransactions, setUnifiedTransactions] = useState<UnifiedTransaction[]>([]);

  // Fetch user data and transactions
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user balance
        const balanceResponse = await fetch('/api/user/balance');
        if (balanceResponse.ok) {
          const balanceData = await balanceResponse.json();
          setTaskPoints(balanceData.taskPoints || 0);
        }

        // Fetch transactions and withdrawals
        await fetchTransactions();
        await fetchWithdrawals();
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentPage]);

  // Unify transactions and withdrawals
  useEffect(() => {
    const allTransactions: UnifiedTransaction[] = [];

    // Add regular transactions
    transactions.forEach((txn) => {
      const dateObj = new Date(txn.createdAt);
      allTransactions.push({
        id: txn._id,
        type: "transaction",
        transactionType: txn.type,
        amount: txn.amount,
        method: txn.description,
        status: "completed",
        date: dateObj.toLocaleDateString(),
        timestamp: dateObj.toLocaleTimeString(),
        rawData: txn,
      });
    });

    // Add withdrawals
    withdrawals.forEach((wd) => {
      const dateObj = new Date(wd.createdAt);
      allTransactions.push({
        id: wd._id,
        type: "withdrawal",
        amount: wd.amount,
        method: wd.withdrawalType === "bank" ? "Bank Transfer" : "USDT Crypto",
        status: wd.status,
        date: dateObj.toLocaleDateString(),
        timestamp: dateObj.toLocaleTimeString(),
        rawData: wd,
      });
    });

    // Sort by date (newest first)
    allTransactions.sort((a, b) => {
      const dateA = new Date(a.rawData?.createdAt || Date.now());
      const dateB = new Date(b.rawData?.createdAt || Date.now());
      return dateB.getTime() - dateA.getTime();
    });

    setUnifiedTransactions(allTransactions);
  }, [transactions, withdrawals]);

  const fetchTransactions = async (page = currentPage) => {
    try {
      setTransactionsLoading(true);
      const response = await fetch(`/api/transactions?page=${page}&limit=10&sort=desc`);

      if (response.ok) {
        const data = await response.json();
        setTransactions(data.transactions || []);
        setTotalPages(data.pagination?.pages || 1);
      } else {
        console.error('Failed to fetch transactions');
        toast.error('Failed to load transactions');
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast.error('Failed to load transactions');
    } finally {
      setTransactionsLoading(false);
    }
  };

  const fetchWithdrawals = async () => {
    try {
      const response = await fetch('/api/withdrawal');

      if (response.ok) {
        const data = await response.json();
        setWithdrawals(data.withdrawals || []);
      } else {
        console.error('Failed to fetch withdrawals');
        toast.error('Failed to load withdrawals');
      }
    } catch (error) {
      console.error('Error fetching withdrawals:', error);
      toast.error('Failed to load withdrawals');
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // ─── Filtering ──────────────────────────────────────────────────────────────
  const filteredTransactions = unifiedTransactions.filter((txn) => {
    const matchType = filterType === "all" || 
      (filterType === "withdrawal" ? txn.type === "withdrawal" : txn.transactionType === filterType);
    const q = searchQuery.toLowerCase();
    const matchSearch =
      !q ||
      txn.id.toLowerCase().includes(q) ||
      txn.method.toLowerCase().includes(q);
    return matchType && matchSearch;
  });

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filterType, searchQuery]);

  // ─── Pagination ─────────────────────────────────────────────────────────────
  const totalPagesUnified = Math.max(
    1,
    Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE)
  );
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleWithdrawalSuccess = () => {
    // Refresh user balance, transactions and withdrawals
    const fetchData = async () => {
      try {
        // Fetch updated balance
        const balanceResponse = await fetch('/api/user/balance');
        if (balanceResponse.ok) {
          const balanceData = await balanceResponse.json();
          setTaskPoints(balanceData.taskPoints || 0);
        }

        // Refresh transactions and withdrawals
        await fetchTransactions();
        await fetchWithdrawals();
      } catch (error) {
        console.error('Error refreshing data:', error);
      }
    };

    fetchData();
    toast.success('Withdrawal request submitted successfully!');
  };

  const handleWithdrawalError = (error: string) => {
    if (error === "Withdrawal coming soon!") {
      toast.info(error);
    } else {
      toast.error(error || 'Failed to process withdrawal');
    }
  };

  // ─── Helpers ────────────────────────────────────────────────────────────────
  const truncateId = (id: string) => {
    if (!id) return "Unknown";
    return id.length > 10 ? id.substring(0, 10) + "…………" : id;
  };

  const getTypeIcon = (txn: UnifiedTransaction) => {
    if (txn.type === "withdrawal") {
      return (
        <div className="w-8 h-8 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
          <ArrowUpRight className="w-4 h-4 text-red-500" />
        </div>
      );
    }

    // Transaction types
    switch (txn.transactionType) {
      case "welcome_bonus":
      case "daily_login":
        return (
          <div className="w-8 h-8 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
            <Gift className="w-4 h-4 text-purple-500" />
          </div>
        );
      case "task_completed":
      case "task_approved":
        return (
          <div className="w-8 h-8 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
          </div>
        );
      case "reward_redeemed":
        return (
          <div className="w-8 h-8 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
            <ShoppingCart className="w-4 h-4 text-orange-500" />
          </div>
        );
      case "admin_adjustment":
        return (
          <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <ArrowUp className="w-4 h-4 text-blue-500" />
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-gray-500/10 border border-gray-500/20 flex items-center justify-center">
            <ArrowUp className="w-4 h-4 text-gray-500" />
          </div>
        );
    }
  };

  const getStatusBadge = (status: string) => {
    const map: Record<string, { icon: React.ReactNode; cls: string; label: string }> = {
      completed: {
        icon: <CheckCircle2 className="w-3 h-3" />,
        cls: "text-green-400 bg-green-500/10 border border-green-500/20",
        label: "Completed",
      },
      approved: {
        icon: <CheckCircle2 className="w-3 h-3" />,
        cls: "text-green-400 bg-green-500/10 border border-green-500/20",
        label: "Approved",
      },
      pending: {
        icon: <Clock className="w-3 h-3" />,
        cls: "text-amber-400 bg-amber-500/10 border border-amber-500/20",
        label: "Pending",
      },
      failed: {
        icon: <XCircle className="w-3 h-3" />,
        cls: "text-red-400 bg-red-500/10 border border-red-500/20",
        label: "Failed",
      },
      rejected: {
        icon: <XCircle className="w-3 h-3" />,
        cls: "text-red-400 bg-red-500/10 border border-red-500/20",
        label: "Rejected",
      },
    };

    const s = map[status] ?? {
      icon: <Clock className="w-3 h-3" />,
      cls: "text-muted-foreground bg-muted border border-border",
      label: status,
    };

    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${s.cls}`}
      >
        {s.icon}
        {s.label}
      </span>
    );
  };

  const getActionBadge = (txn: UnifiedTransaction) => {
    if (txn.type === "withdrawal") {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-red-400 bg-red-500/10 border border-red-500/20">
          Withdrawal
        </span>
      );
    }

    const map: Record<TransactionType, { label: string; cls: string }> = {
      welcome_bonus: {
        label: "Welcome Bonus",
        cls: "text-purple-400 bg-purple-500/10 border border-purple-500/20",
      },
      daily_login: {
        label: "Daily Login",
        cls: "text-blue-400 bg-blue-500/10 border border-blue-500/20",
      },
      task_completed: {
        label: "Task Completed",
        cls: "text-green-400 bg-green-500/10 border border-green-500/20",
      },
      task_approved: {
        label: "Task Approved",
        cls: "text-green-400 bg-green-500/10 border border-green-500/20",
      },
      reward_redeemed: {
        label: "Reward Redeemed",
        cls: "text-orange-400 bg-orange-500/10 border border-orange-500/20",
      },
      admin_adjustment: {
        label: "Admin Adjustment",
        cls: "text-gray-400 bg-gray-500/10 border border-gray-500/20",
      },
    };

    const a = map[txn.transactionType || "admin_adjustment"];
    return (
      <span
        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${a.cls}`}
      >
        {a.label}
      </span>
    );
  };

  const getAmountColor = (txn: UnifiedTransaction) => {
    if (txn.type === "withdrawal") return "text-red-400";
    return "text-green-400";
  };

  const getAmountPrefix = (txn: UnifiedTransaction) => {
    if (txn.type === "withdrawal") return "-";
    return "+";
  };

  // ─── Skeleton rows ───────────────────────────────────────────────────────────
  const SkeletonRow = () => (
    <tr className="border-b border-border/40 animate-pulse">
      {[...Array(6)].map((_, i) => (
        <td key={i} className="px-4 py-4">
          <div className="h-4 bg-muted rounded w-3/4"></div>
        </td>
      ))}
    </tr>
  );

  if (isLoading) {
    return (
      <div className="flex h-screen overflow-hidden bg-background font-sans">
        <UserSidebar />

        <div className="flex-1 flex flex-col overflow-hidden text-foreground">
          <UserHeader />

          <ContentOnlySkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background font-sans">
      <UserSidebar />

      <div className="flex-1 flex flex-col overflow-hidden text-foreground">
        <UserHeader />

        <main className="flex-1 overflow-y-auto pb-32 p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-6">

            {/* ── Page Title & Balance ── */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-1">
                <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter leading-none">
                  Transaction History
                </h1>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                  {transactionsLoading
                    ? "Loading transactions…"
                    : `${filteredTransactions.length} transaction${filteredTransactions.length !== 1 ? "s" : ""}`}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {/* <div className="text-right">
                  <div className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                    Balance
                  </div>
                  <div className="text-lg font-black text-foreground">
                    {taskPoints.toLocaleString()} TP
                  </div>
                </div> */}
                <button 
                  onClick={() => setShowModal(true)} 
                  className="hidden md:flex items-center gap-2 bg-foreground text-background px-4 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all"
                >
                  <Download className="w-4 h-4" /> Export Data
                </button>
              </div>
            </div>

            {/* ── Filter Bar ── */}
            <div className="bg-card border border-border rounded-xl p-4 lg:p-4 flex flex-wrap items-center gap-3">
              {/* Search */}
              <div className="flex-1 min-w-[180px] relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search ID or method…"
                  className="w-full bg-muted/30 border border-border rounded-lg py-2.5 pl-10 pr-4 text-xs font-bold focus:outline-none focus:border-foreground transition-all"
                />
              </div>

              {/* Type filters */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar flex-wrap">
                {["all", "withdrawal", "daily_login"].map(
                  (type) => (
                    <button
                      key={type}
                      onClick={() => setFilterType(type as TransactionFilterType)}
                      className={`px-4 py-2.5 rounded-lg cursor-pointer text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap border-2 ${
                        filterType === type
                          ? "bg-foreground text-background border-foreground shadow-lg"
                          : "bg-background text-muted-foreground border-border hover:border-muted-foreground/50"
                      }`}
                    >
                      {type.replace(/_/g, ' ')}
                    </button>
                  )
                )}
                <button className="hidden md:flex p-2.5 border border-border rounded-xl hover:bg-muted transition-all">
                  <Calendar className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* ── Table Card ── */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              {/* Table with horizontal scrolling */}
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-border/60 bg-muted/20">
                      <th className="px-5 py-4 text-[12px] font-black uppercase tracking-[0.2em] text-muted-foreground whitespace-nowrap">
                        Icon
                      </th>
                      <th className="px-5 py-4 text-[12px] font-black uppercase tracking-[0.2em] text-muted-foreground whitespace-nowrap">
                        Symbol / Method
                      </th>
                      <th className="px-5 py-4 text-[12px] font-black uppercase tracking-[0.2em] text-muted-foreground whitespace-nowrap">
                        Transaction ID
                      </th>
                      <th className="px-5 py-4 text-[12px] font-black uppercase tracking-[0.2em] text-muted-foreground whitespace-nowrap">
                        Date
                      </th>
                      <th className="px-5 py-4 text-[12px] font-black uppercase tracking-[0.2em] text-muted-foreground whitespace-nowrap">
                        Status
                      </th>
                      <th className="px-5 py-4 text-[12px] font-black uppercase tracking-[0.2em] text-muted-foreground text-right whitespace-nowrap">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactionsLoading ? (
                      [...Array(10)].map((_, i) => <SkeletonRow key={i} />)
                    ) : paginatedTransactions.length === 0 ? (
                      <tr>
                        <td colSpan={6}>
                          <div className="py-20 text-center space-y-3 opacity-30">
                            <Filter className="w-10 h-10 mx-auto" />
                            <p className="text-[10px] font-black uppercase tracking-[0.3em]">
                              No transactions found
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      paginatedTransactions.map((txn) => (
                        <tr
                          key={txn.id || Math.random()}
                          className="border-b border-border/30 hover:bg-muted/10 transition-colors group"
                        >
                          {/* Icon */}
                          <td className="px-5 py-4 whitespace-nowrap">
                            {getTypeIcon(txn)}
                          </td>

                          {/* Symbol / Method */}
                          <td className="px-5 py-4 whitespace-nowrap">
                            <p className="text-sm font-black uppercase tracking-tight">
                              {txn.method}
                            </p>
                            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">
                              {txn.type === "withdrawal" ? "withdrawal" : txn.transactionType?.replace(/_/g, ' ')}
                            </p>
                          </td>

                          {/* ID */}
                          <td className="px-5 py-4 whitespace-nowrap">
                            <span className="text-[12px] font-mono font-bold text-muted-foreground">
                              {truncateId(txn.id)}
                            </span>
                          </td>

                          {/* Date */}
                          <td className="px-5 py-4 whitespace-nowrap">
                            <p className="text-xs font-bold">{txn.date}</p>
                            <p className="text-[11px] text-muted-foreground mt-0.5">
                              {txn.timestamp}
                            </p>
                          </td>

                          {/* Status */}
                          <td className="px-5 py-4 whitespace-nowrap">
                            {getStatusBadge(txn.status)}
                          </td>

                          {/* Amount */}
                          <td className="px-5 py-4 text-right whitespace-nowrap">
                            <span
                              className={`text-sm font-black ${getAmountColor(txn)}`}
                            >
                              {getAmountPrefix(txn)}{txn.amount.toLocaleString(undefined, {
                                minimumFractionDigits: 0,
                              })} TP
                            </span>
                          </td>

                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>


              {/* ── Pagination ── */}
              {!transactionsLoading && filteredTransactions.length > 0 && (
                <div className="border-t border-border/40 px-5 py-4 flex items-center justify-between gap-4">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                    Page {currentPage} of {totalPagesUnified} &nbsp;·&nbsp;{" "}
                    {filteredTransactions.length} results
                  </p>

                  <div className="flex justify-end items-center gap-2">
                    <button
                      onClick={() =>
                        setCurrentPage((p) => Math.max(1, p - 1))
                      }
                      disabled={currentPage === 1}
                      className="w-9 h-9 rounded-xl cursor-pointer border border-border flex items-center justify-center hover:bg-foreground hover:text-background hover:border-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    {/* Page number pills */}
                    {Array.from({ length: totalPagesUnified }, (_, i) => i + 1)
                      .filter(
                        (p) =>
                          p === 1 ||
                          p === totalPagesUnified ||
                          Math.abs(p - currentPage) <= 1
                      )
                      .reduce<(number | "…")[]>((acc, p, idx, arr) => {
                        if (idx > 0 && p - (arr[idx - 1] as number) > 1)
                          acc.push("…");
                        acc.push(p);
                        return acc;
                      }, [])
                      .map((p, i) =>
                        p === "…" ? (
                          <span
                            key={`ellipsis-${i}`}
                            className="text-[10px] text-muted-foreground px-1"
                          >
                            …
                          </span>
                        ) : (
                          <button
                            key={p}
                            onClick={() => setCurrentPage(p as number)}
                            className={`w-9 h-9 rounded-xl cursor-pointer border text-[10px] font-black transition-all ${
                              currentPage === p
                                ? "bg-foreground text-background border-foreground"
                                : "border-border hover:bg-muted"
                            }`}
                          >
                            {p}
                          </button>
                        )
                      )}

                    <button
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPagesUnified, p + 1))
                      }
                      disabled={currentPage === totalPagesUnified}
                      className="w-9 h-9 rounded-xl cursor-pointer border border-border flex items-center justify-center hover:bg-foreground hover:text-background hover:border-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </main>
      </div>
      <UserNav />

      {/* Withdrawal Modal */}
      <WithdrawalModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        taskPoints={taskPoints}
        onSuccess={handleWithdrawalSuccess}
        onError={handleWithdrawalError}
      />
    </div>
  );
}