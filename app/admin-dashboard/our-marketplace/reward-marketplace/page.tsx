'use client';

import { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/admin-dashboard/AdminHeader";
import AdminSidebar from "@/components/admin-dashboard/AdminSidebar";
import { Search, ArrowUpDown, Plus, Coins, MoreVertical, Edit, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/Pagination";
import { toast } from "react-toastify";

const PAGE_SIZE = 8;

const CAMPAIGN_STATUS: Record<string, { label: string; color: string }> = {
  published: { label: "Published", color: "default" },
  draft: { label: "Draft", color: "secondary" }
};

export default function RewardMarketplacePage() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortKey, setSortKey] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc");
  const [page, setPage] = useState(1);
  const [confirmDelete, setConfirmDelete] = useState<any>(null);
  
  // State for dropdown floating menu
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClose = () => {
      setOpenDropdown(null);
      setDropdownPos(null);
    };

    if (openDropdown) {
      document.addEventListener('click', handleClose);
      window.addEventListener('scroll', handleClose, true);
      return () => {
        document.removeEventListener('click', handleClose);
        window.removeEventListener('scroll', handleClose, true);
      };
    }
  }, [openDropdown]);

  const handleToggleDropdown = (e: React.MouseEvent<HTMLButtonElement>, campaignId: string) => {
    e.stopPropagation();
    if (openDropdown === campaignId) {
      setOpenDropdown(null);
      setDropdownPos(null);
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + 4,
        left: rect.right - 128, // 128px width (w-32)
      });
      setOpenDropdown(campaignId);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/marketplace-campaigns');
      const data = await response.json();
      if (data.success) {
        setCampaigns(data.campaigns);
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      toast('Failed to load campaigns', { type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    let list = campaigns.filter((c) => {
      const matchesSearch =
        !search ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.brandName.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || c.visibility === statusFilter;
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

  const handleDelete = (campaign: any) => setConfirmDelete(campaign);

  const confirmDeleteAction = async () => {
    if (!confirmDelete) return;
    try {
      const response = await fetch(`/api/admin/marketplace-campaigns/${confirmDelete._id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        setCampaigns((prev) => prev.filter((c) => c._id !== confirmDelete._id));
        toast(`"${confirmDelete.name}" deleted.`, { type: "success" });
      } else {
        toast(data.error || 'Failed to delete campaign', { type: 'error' });
      }
    } catch (error) {
      console.error('Error deleting campaign:', error);
      toast('Failed to delete campaign', { type: 'error' });
    } finally {
      setConfirmDelete(null);
    }
  };

  const getStatusBadge = (visibility: string) => {
    const variant = visibility === "published" ? "default" : "secondary";
    return <Badge variant={variant}>{CAMPAIGN_STATUS[visibility]?.label || visibility}</Badge>;
  };

  const activeCampaign = campaigns.find((c) => c._id === openDropdown);

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
                    {["all", "published", "draft"].map((s) => (
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
                        <th className="px-4 py-3 font-semibold cursor-pointer" onClick={() => toggleSort("rewardAmount")}>
                          <span className="inline-flex items-center gap-1">Reward <ArrowUpDown size={10} /></span>
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
                        return (
                          <tr
                            key={c._id}
                            className="border-b border-border/60 hover:bg-muted/20 transition-colors"
                          >
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-base shrink-0">
                                  {c.brandLogo || '📢'}
                                </div>
                                <span className="font-medium text-foreground line-clamp-1 max-w-[220px]">{c.name}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-muted-foreground">{c.brandName}</td>
                            <td className="px-4 py-3">
                              <span className="inline-flex items-center gap-1 font-semibold text-green-500">
                                <Coins size={12} /> {c.rewardAmount?.toLocaleString() || 0}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-muted-foreground text-xs capitalize">{c.type}</td>
                            <td className="px-4 py-3">{getStatusBadge(c.visibility)}</td>
                            <td className="px-4 py-3 text-muted-foreground text-xs">
                              {new Date(c.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3 text-muted-foreground text-xs">
                              {c.endsAt ? new Date(c.endsAt).toLocaleDateString() : '—'}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={(e) => handleToggleDropdown(e, c._id)}
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {pageItems.length === 0 && !loading && (
                    <div className="text-center py-16 text-sm text-muted-foreground">
                      No campaigns match your filters.
                    </div>
                  )}
                  {loading && (
                    <div className="text-center py-16 text-sm text-muted-foreground">
                      Loading campaigns...
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

      {/* PORTAL DROPDOWN MENU */}
      {mounted && openDropdown && dropdownPos && activeCampaign && createPortal(
        <div 
          className="fixed w-32 bg-card border border-border rounded-md shadow-xl z-[9999] overflow-hidden"
          style={{ top: `${dropdownPos.top}px`, left: `${dropdownPos.left}px` }}
          onClick={(e) => e.stopPropagation()}
        >
          <div 
            className="px-3 py-2 text-sm hover:bg-muted cursor-pointer flex items-center gap-2 transition-colors"
            onClick={() => {
              router.push(`/admin-dashboard/our-marketplace/create-campaign/${activeCampaign._id}`);
              setOpenDropdown(null);
            }}
          >
            <Edit className="h-4 w-4" />
            Edit
          </div>
          <div className="border-t border-border" />
          <div 
            className="px-3 py-2 text-sm text-destructive hover:bg-muted cursor-pointer flex items-center gap-2 transition-colors"
            onClick={() => {
              handleDelete(activeCampaign);
              setOpenDropdown(null);
            }}
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </div>
        </div>,
        document.body
      )}

      {/* CONFIRM DELETE DIALOG */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setConfirmDelete(null)} />
          <div className="relative bg-card border border-border rounded-xl shadow-xl p-6 max-w-md w-full mx-4 z-50">
            <h2 className="text-lg font-semibold mb-2">
              Delete Campaign
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              This will permanently delete "{confirmDelete.name}". This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setConfirmDelete(null)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDeleteAction}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}