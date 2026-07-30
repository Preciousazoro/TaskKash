'use client';

import { useState, useMemo } from "react";
import AdminHeader from "@/components/admin-dashboard/AdminHeader";
import AdminSidebar from "@/components/admin-dashboard/AdminSidebar";
import { Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/ui/Pagination";

const ACTION_COLORS: Record<string, string> = {
  "Reward Distributed": "#00FFB2",
  "Approved": "#00FFB2",
  "Hold Started": "#8B5CF6",
  "Hold Extended": "#8B5CF6",
  "Rejected": "#F87171",
  "Campaign Published": "#3B82F6",
  "Campaign Paused": "#F59E0B",
  "Admin Notes Added": "#9CA3AF",
  "Viewed": "#6B7280",
  "Submission Created": "#3B82F6",
  "Expired": "#6B7280",
};

const PAGE_SIZE = 10;

// Mock data - replace with actual API calls
const AUDIT_LOGS = [
  {
    id: 1,
    at: "2024-01-15 14:30:25",
    admin: "Admin User",
    action: "Reward Distributed",
    target: "SUB-001",
    reason: "Automatic distribution after approval"
  },
  {
    id: 2,
    at: "2024-01-15 13:45:12",
    admin: "Admin User",
    action: "Approved",
    target: "SUB-002",
    reason: "Manual approval after review"
  },
  {
    id: 3,
    at: "2024-01-15 12:20:08",
    admin: "Admin User",
    action: "Hold Started",
    target: "SUB-003",
    reason: "7-day verification hold period"
  },
  {
    id: 4,
    at: "2024-01-15 11:15:44",
    admin: "Admin User",
    action: "Campaign Published",
    target: "CMP-001",
    reason: "Summer Brand Campaign published"
  },
  {
    id: 5,
    at: "2024-01-15 10:30:15",
    admin: "Admin User",
    action: "Rejected",
    target: "SUB-004",
    reason: "Invalid proof provided"
  },
  {
    id: 6,
    at: "2024-01-15 09:45:33",
    admin: "Admin User",
    action: "Campaign Paused",
    target: "CMP-002",
    reason: "Budget limit reached"
  },
  {
    id: 7,
    at: "2024-01-15 08:20:50",
    admin: "Admin User",
    action: "Admin Notes Added",
    target: "SUB-005",
    reason: "Flagged for manual review"
  },
  {
    id: 8,
    at: "2024-01-15 07:10:22",
    admin: "Admin User",
    action: "Viewed",
    target: "SUB-006",
    reason: "Submission reviewed"
  },
  {
    id: 9,
    at: "2024-01-15 06:05:18",
    admin: "Admin User",
    action: "Submission Created",
    target: "SUB-007",
    reason: "New submission received"
  },
  {
    id: 10,
    at: "2024-01-15 05:00:45",
    admin: "Admin User",
    action: "Expired",
    target: "SUB-008",
    reason: "Hold period expired without action"
  },
  {
    id: 11,
    at: "2024-01-14 23:45:30",
    admin: "Admin User",
    action: "Hold Extended",
    target: "SUB-009",
    reason: "Additional verification needed"
  },
  {
    id: 12,
    at: "2024-01-14 22:30:15",
    admin: "Admin User",
    action: "Reward Distributed",
    target: "SUB-010",
    reason: "Batch distribution completed"
  }
];

export default function AuditLogsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return AUDIT_LOGS.filter(
      (l) =>
        !search ||
        l.action.toLowerCase().includes(search.toLowerCase()) ||
        l.admin.toLowerCase().includes(search.toLowerCase()) ||
        l.target.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const getActionBadge = (action: string) => {
    const color = ACTION_COLORS[action] || "#9CA3AF";
    return (
      <Badge
        variant="outline"
        className="border-transparent"
        style={{
          backgroundColor: `${color}20`,
          color: color,
          borderColor: `${color}40`
        }}
      >
        {action}
      </Badge>
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
            <div>
              <h1 className="text-xl md:text-2xl font-black uppercase tracking-tighter leading-none">
                Audit Logs
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Complete history of every admin action across TaskKash.
              </p>
            </div>

            {/* MAIN TABLE */}
            <Card className="bg-card border border-border overflow-hidden">
              <CardContent className="p-0">
                <div className="p-4 border-b border-border">
                  <div className="relative max-w-sm">
                    <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      value={search}
                      onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                      placeholder="Search by action, admin, or target..."
                      className="w-full bg-muted/30 border border-border rounded-xl pl-9 pr-4 py-2.5 text-sm placeholder:text-muted-foreground focus:border-green-500/40 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-[11px] uppercase tracking-wide text-muted-foreground border-b border-border">
                        <th className="px-4 py-3 font-semibold">Timestamp</th>
                        <th className="px-4 py-3 font-semibold">Admin</th>
                        <th className="px-4 py-3 font-semibold">Action</th>
                        <th className="px-4 py-3 font-semibold">Target</th>
                        <th className="px-4 py-3 font-semibold">Reason</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pageItems.map((log) => (
                        <tr key={log.id} className="border-b border-border/60 hover:bg-muted/20 transition-colors">
                          <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">{log.at}</td>
                          <td className="px-4 py-3">
                            <span className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded-full bg-purple-500/10 text-purple-500 flex items-center justify-center text-[9px] font-bold">
                                {log.admin.charAt(0)}
                              </span>
                              <span className="text-foreground">{log.admin}</span>
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {getActionBadge(log.action)}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{log.target}</td>
                          <td className="px-4 py-3 text-muted-foreground text-xs max-w-xs">{log.reason}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {pageItems.length === 0 && (
                    <div className="text-center py-16 text-sm text-muted-foreground">
                      No log entries match your search.
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