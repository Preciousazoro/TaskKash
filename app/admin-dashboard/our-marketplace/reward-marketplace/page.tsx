'use client';

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/admin-dashboard/AdminHeader";
import AdminSidebar from "@/components/admin-dashboard/AdminSidebar";
import { Search, ArrowUpDown, Plus, Coins, Users, MoreVertical, Eye, Edit, Copy, Archive, Trash2, Play, Pause } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/Pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "react-toastify";

const PAGE_SIZE = 8;

// Mock data - replace with actual API calls
const INITIAL_CAMPAIGNS = [
  {
    id: "1",
    name: "Summer Brand Campaign",
    brand: "Nike",
    brandLogo: "👟",
    reward: 5000,
    participants: 1250,
    type: "social",
    status: "active",
    createdAt: "2024-01-15",
    endsAt: "2024-12-31"
  },
  {
    id: "2", 
    name: "Product Launch Boost",
    brand: "Apple",
    brandLogo: "🍎",
    reward: 10000,
    participants: 3420,
    type: "content",
    status: "active",
    createdAt: "2024-02-01",
    endsAt: "2024-11-30"
  },
  {
    id: "3",
    name: "Community Growth",
    brand: "Discord",
    brandLogo: "🎮",
    reward: 2500,
    participants: 890,
    type: "community",
    status: "paused",
    createdAt: "2024-03-10",
    endsAt: "2024-10-15"
  },
  {
    id: "4",
    name: "Brand Awareness",
    brand: "Coca-Cola",
    brandLogo: "🥤",
    reward: 7500,
    participants: 2100,
    type: "social",
    status: "draft",
    createdAt: "2024-04-05",
    endsAt: "2024-12-01"
  },
  {
    id: "5",
    name: "Holiday Special",
    brand: "Amazon",
    brandLogo: "📦",
    reward: 15000,
    participants: 5600,
    type: "commerce",
    status: "completed",
    createdAt: "2023-12-01",
    endsAt: "2024-01-15"
  },
  {
    id: "6",
    name: "Tech Review",
    brand: "Samsung",
    brandLogo: "📱",
    reward: 8000,
    participants: 1800,
    type: "content",
    status: "archived",
    createdAt: "2023-11-20",
    endsAt: "2024-02-28"
  }
];

const CAMPAIGN_STATUS: Record<string, { label: string; color: string }> = {
  active: { label: "Active", color: "default" },
  draft: { label: "Draft", color: "secondary" },
  paused: { label: "Paused", color: "outline" },
  completed: { label: "Completed", color: "default" },
  archived: { label: "Archived", color: "destructive" }
};

const CAMPAIGN_TYPES = [
  { id: "social", label: "Social Media", icon: Users },
  { id: "content", label: "Content Creation", icon: Edit },
  { id: "commerce", label: "E-commerce", icon: Coins },
  { id: "community", label: "Community", icon: Users }
];

export default function RewardMarketplacePage() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState(INITIAL_CAMPAIGNS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortKey, setSortKey] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc");
  const [page, setPage] = useState(1);
  const [confirmAction, setConfirmAction] = useState<{ type: 'delete' | 'archive'; campaign: typeof INITIAL_CAMPAIGNS[0] } | null>(null);

  const filtered = useMemo(() => {
    let list = campaigns.filter((c) => {
      const matchesSearch =
        !search ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.brand.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || c.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
    list = [...list].sort((a, b) => {
      let av = a[sortKey as keyof typeof a], bv = b[sortKey as keyof typeof b];
      if (sortKey === "createdAt" || sortKey === "endsAt") {
        const adv = new Date(av as string), bdv = new Date(bv as string);
        if (adv < bdv) return sortDir === "asc" ? -1 : 1;
        if (adv > bdv) return sortDir === "asc" ? 1 : -1;
        return 0;
      }
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return list;
  }, [campaigns, search, statusFilter, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const toggleSort = (key: string) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("desc"); }
  };

  const handlePauseToggle = (c: typeof INITIAL_CAMPAIGNS[0]) => {
    setCampaigns((prev) => prev.map((x) => 
      x.id === c.id ? { ...x, status: x.status === "paused" ? "active" : "paused" } : x
    ));
    toast(`${c.name} ${c.status === "paused" ? "resumed" : "paused"}.`, { type: "success" });
  };

  const handleDuplicate = (c: typeof INITIAL_CAMPAIGNS[0]) => {
    const copy = { 
      ...c, 
      id: `${c.id}_copy${Date.now()}`, 
      name: `${c.name} (Copy)`, 
      status: "draft" as const, 
      participants: 0 
    };
    setCampaigns((prev) => [copy, ...prev]);
    toast(`Duplicated "${c.name}".`, { type: "success" });
  };

  const handleArchive = (c: typeof INITIAL_CAMPAIGNS[0]) => setConfirmAction({ type: "archive", campaign: c });
  const handleDelete = (c: typeof INITIAL_CAMPAIGNS[0]) => setConfirmAction({ type: "delete", campaign: c });

  const confirmActionRun = () => {
    if (!confirmAction) return;
    const { type, campaign } = confirmAction;
    if (type === "delete") {
      setCampaigns((prev) => prev.filter((x) => x.id !== campaign.id));
      toast(`"${campaign.name}" deleted.`, { type: "error" });
    } else if (type === "archive") {
      setCampaigns((prev) => prev.map((x) => 
        x.id === campaign.id ? { ...x, status: "archived" as const } : x
      ));
      toast(`"${campaign.name}" archived.`, { type: "success" });
    }
    setConfirmAction(null);
  };

  const getStatusBadge = (status: string) => {
    const statusMeta = CAMPAIGN_STATUS[status];
    const variant = status === "active" ? "default" : 
                    status === "draft" ? "secondary" :
                    status === "paused" ? "outline" :
                    status === "completed" ? "default" : "destructive";
    return <Badge variant={variant}>{statusMeta?.label || status}</Badge>;
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground overflow-hidden">
      <AdminSidebar />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <AdminHeader />

        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-30">
          <div className="space-y-6">
            {/* HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl md:text-2xl font-black uppercase tracking-tighter leading-none">
                  Reward Marketplace
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Manage all campaigns across TaskKash.
                </p>
              </div>
              <Button 
                onClick={() => router.push('/admin-dashboard/our-marketplace/create-campaign')}
                className="bg-green-500 hover:bg-green-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Campaign
              </Button>
            </div>

            {/* MAIN CARD */}
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                {/* FILTERS */}
                <div className="p-4 flex flex-col md:flex-row md:items-center gap-3 border-b border-border">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <input
                      value={search}
                      onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                      placeholder="Search campaigns or brands..."
                      className="w-full bg-muted/30 border border-border rounded-xl pl-9 pr-4 py-2.5 text-sm placeholder:text-muted-foreground focus:border-green-500/40 focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="flex items-center gap-2 overflow-x-auto">
                    {["all", "active", "draft", "paused", "completed", "archived"].map((s) => (
                      <button
                        key={s}
                        onClick={() => { setStatusFilter(s); setPage(1); }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors border ${
                          statusFilter === s
                            ? "bg-green-500 text-white border-green-500"
                            : "text-muted-foreground border-border hover:text-foreground hover:bg-muted/50"
                        }`}
                      >
                        {s === "all" ? "All" : CAMPAIGN_STATUS[s]?.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* TABLE */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-[11px] uppercase tracking-wide text-muted-foreground border-b border-border">
                        <th className="px-4 py-3 font-semibold">Campaign</th>
                        <th className="px-4 py-3 font-semibold">Brand</th>
                        <th className="px-4 py-3 font-semibold cursor-pointer" onClick={() => toggleSort("reward")}>
                          <span className="inline-flex items-center gap-1">Reward <ArrowUpDown size={10} /></span>
                        </th>
                        <th className="px-4 py-3 font-semibold cursor-pointer" onClick={() => toggleSort("participants")}>
                          <span className="inline-flex items-center gap-1">Participants <ArrowUpDown size={10} /></span>
                        </th>
                        <th className="px-4 py-3 font-semibold">Type</th>
                        <th className="px-4 py-3 font-semibold">Status</th>
                        <th className="px-4 py-3 font-semibold cursor-pointer" onClick={() => toggleSort("createdAt")}>
                          <span className="inline-flex items-center gap-1">Created <ArrowUpDown size={10} /></span>
                        </th>
                        <th className="px-4 py-3 font-semibold">Ends</th>
                        <th className="px-4 py-3 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pageItems.map((c) => {
                        const typeMeta = CAMPAIGN_TYPES.find((t) => t.id === c.type);
                        return (
                          <tr
                            key={c.id}
                            className="border-b border-border/60 hover:bg-muted/20 transition-colors cursor-pointer"
                            onClick={() => router.push(`/admin-dashboard/our-marketplace/reward-marketplace/${c.id}`)}
                          >
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-base shrink-0">
                                  {c.brandLogo}
                                </div>
                                <span className="font-medium text-foreground line-clamp-1 max-w-[220px]">{c.name}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-muted-foreground">{c.brand}</td>
                            <td className="px-4 py-3">
                              <span className="inline-flex items-center gap-1 font-semibold text-green-500">
                                <Coins size={12} /> {c.reward.toLocaleString()}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="inline-flex items-center gap-1 text-muted-foreground">
                                <Users size={12} /> {c.participants.toLocaleString()}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              {typeMeta && (
                                <span className="inline-flex items-center gap-1.5 text-muted-foreground text-xs">
                                  <typeMeta.icon size={12} /> {typeMeta.label}
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3">{getStatusBadge(c.status)}</td>
                            <td className="px-4 py-3 text-muted-foreground text-xs">{c.createdAt}</td>
                            <td className="px-4 py-3 text-muted-foreground text-xs">{c.endsAt}</td>
                            <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                              <div className="flex justify-end">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon-sm" className="h-8 w-8">
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => router.push(`/admin-dashboard/our-marketplace/reward-marketplace/${c.id}`)}>
                                      <Eye className="h-4 w-4 mr-2" />
                                      View
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => router.push(`/admin-dashboard/our-marketplace/create-campaign/${c.id}`)}>
                                      <Edit className="h-4 w-4 mr-2" />
                                      Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleDuplicate(c)}>
                                      <Copy className="h-4 w-4 mr-2" />
                                      Duplicate
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => handlePauseToggle(c)}>
                                      {c.status === "paused" ? (
                                        <>
                                          <Play className="h-4 w-4 mr-2" />
                                          Resume
                                        </>
                                      ) : (
                                        <>
                                          <Pause className="h-4 w-4 mr-2" />
                                          Pause
                                        </>
                                      )}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleArchive(c)}>
                                      <Archive className="h-4 w-4 mr-2" />
                                      Archive
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => handleDelete(c)} className="text-destructive">
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {pageItems.length === 0 && (
                    <div className="text-center py-16 text-sm text-muted-foreground">
                      No campaigns match your filters.
                    </div>
                  )}
                </div>

                {/* PAGINATION */}
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

      {/* CONFIRM DIALOG */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setConfirmAction(null)} />
          <div className="relative bg-card border border-border rounded-xl shadow-xl p-6 max-w-md w-full mx-4">
            <h2 className="text-lg font-semibold mb-2">
              {confirmAction.type === "delete" ? "Delete Campaign" : "Archive Campaign"}
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              {confirmAction.type === "delete"
                ? `This will permanently delete "${confirmAction.campaign.name}". This action cannot be undone.`
                : `"${confirmAction.campaign.name}" will be moved to archived and hidden from the public marketplace.`
              }
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setConfirmAction(null)}>
                Cancel
              </Button>
              <Button
                variant={confirmAction.type === "delete" ? "destructive" : "default"}
                onClick={confirmActionRun}
              >
                {confirmAction.type === "delete" ? "Delete" : "Archive"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}