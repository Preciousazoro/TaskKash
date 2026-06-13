'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin-dashboard/AdminSidebar";
import AdminHeader from "@/components/admin-dashboard/AdminHeader";
import {
  Edit,
  Trash2,
  MoreVertical,
  Search,
  Filter,
  Music,
  Video,
  CheckCircle,
  Clock,
  Pause,
  Play,
  Zap,
} from "lucide-react";

interface Campaign {
  _id: string;
  title: string;
  description: string;
  creatorName: string;
  platform: string;
  campaignType: string;
  reward: number;
  status: string;
  createdAt: string;
  thumbnailUrl?: string;
}

const EditCampaignsPage = () => {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await fetch('/api/admin/campaigns');
        if (response.ok) {
          const data = await response.json();
          setCampaigns(data.campaigns);
        }
      } catch (error) {
        console.error('Error fetching campaigns:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  const filtered = campaigns.filter((c) => {
    if (search && !c.title.toLowerCase().includes(search.toLowerCase()) && !c.creatorName.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterStatus !== "all" && c.status !== filterStatus) return false;
    return true;
  });

  const handleEdit = (id: string) => {
    router.push(`/admin-dashboard/edit-campaigns/${id}`);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this campaign?')) return;

    try {
      const response = await fetch(`/api/admin/campaigns/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setCampaigns(campaigns.filter(c => c._id !== id));
      } else {
        alert('Failed to delete campaign');
      }
    } catch (error) {
      console.error('Error deleting campaign:', error);
      alert('Failed to delete campaign');
    }
  };

  const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
    draft: { label: "Draft", color: "bg-gray-500/10 text-gray-400 border-gray-500/20", icon: Clock },
    active: { label: "Active", color: "bg-teal-500/10 text-teal-400 border-teal-500/20", icon: Zap },
    paused: { label: "Paused", color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20", icon: Pause },
    completed: { label: "Completed", color: "bg-purple-500/10 text-purple-400 border-purple-500/20", icon: CheckCircle },
  };

  const typeIcon: Record<string, any> = {
    music: Music,
    video: Video,
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground overflow-hidden">
      <AdminSidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <AdminHeader />

        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-30">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
            <div>
              <h1 className="text-xl md:text-2xl font-black uppercase tracking-tighter leading-none flex items-center gap-3">
                <Edit className="w-5 h-5 text-primary" />
                Edit Campaigns
              </h1>
              <p className="text-sm text-muted-foreground mt-2">
                Manage and edit your existing campaigns
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-card border border-border rounded-2xl p-4 mb-6 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search campaigns..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-background border border-border focus:border-primary focus:outline-none text-sm"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2.5 rounded-xl bg-background border border-border focus:border-primary focus:outline-none text-sm"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Campaigns List */}
          {loading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">Loading campaigns...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm text-muted-foreground">No campaigns found</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filtered.map((campaign) => {
                const status = statusConfig[campaign.status] || statusConfig.draft;
                const StatusIcon = status.icon;
                const TypeIcon = typeIcon[campaign.campaignType] || Music;

                return (
                  <div key={campaign._id} className="bg-card border border-border rounded-2xl p-4 hover:shadow-lg hover:border-primary/30 transition-all">
                    <div className="flex flex-col md:flex-row gap-4">
                      {/* Thumbnail */}
                      <div className="w-full md:w-48 aspect-video bg-gradient-to-br from-purple-900/60 to-blue-900/60 rounded-xl overflow-hidden flex items-center justify-center shrink-0">
                        {campaign.thumbnailUrl ? (
                          <img src={campaign.thumbnailUrl} alt={campaign.title} className="w-full h-full object-cover" />
                        ) : (
                          <TypeIcon className="w-10 h-10 text-white/20" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 flex flex-col">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex-1">
                            <h3 className="text-sm font-bold text-foreground mb-1">{campaign.title}</h3>
                            <p className="text-xs text-muted-foreground mb-2">{campaign.creatorName} · {campaign.platform}</p>
                            <p className="text-xs text-muted-foreground line-clamp-2">{campaign.description}</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => handleEdit(campaign._id)}
                              className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(campaign._id)}
                              className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 mt-auto">
                          <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${status.color}`}>
                            <StatusIcon className="w-3 h-3" />
                            {status.label}
                          </span>
                          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-[10px] font-bold uppercase tracking-wider">
                            +{campaign.reward} pts
                          </span>
                          <span className="text-[10px] text-muted-foreground ml-auto">
                            {new Date(campaign.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default EditCampaignsPage;
